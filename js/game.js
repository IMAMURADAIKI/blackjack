// game.js
import { chipValues, sound0, sound1, sound2, sound3, sound4, zunda1, zunda2, zunda3, zunda4, zunda5, zunda6, zunda7, zunda8, syoziElement, playerHandTitle, dealerCardsElement, playerCardsElement, messageElement, splitHandsContainer, splitHand1ScoreElement, splitHand2ScoreElement, playerScoreElement, dealerScoreElement, score1Element, score2Element, scoreElement, handOfCardsElement, splitHand1Element, splitHand2Element, score2ParentElement, dealButton, hitButton, doubleButton, surrenderButton, splitButton, insuranceButton, standButton, betsDisplay } from './index.js';
// グローバル変数
let currentBet = 0;
let maxBet = 10000; // 初期所持金
let minBet = 0;
let drawBet = 0;

// ゲーム用の変数 (一部グローバル変数を減らしています)
let playerHand = [];
let dealerHand = [];
let deck = [];
let gameOver = false;
let flag = false;
let surrenderflg = false;
let dealerHiddenCardElement = null;
let bust1 = false;
let bust2 = false;
let Bet1 = 0;
let Bet2 = 0;
let fight1 = false;
let blackjack1 = false;
let double1 = false;
let draw1 = false;
let fight2 = false;
let blackjack2 = false;
let double2 = false;
let draw2 = false;
let splitHand1 = [];
let splitHand2 = [];
let splitnum = 2;
let currentSplitHand = 1;
let isSplitMode = false;
let insuranceAvailable = false;

sound0.pause();
sound0.currentTime = 0;
sound0.loop = true;
sound0.volume = 0.05;
sound0.play();

// スタートボタンのイベントリスナー
dealButton.addEventListener('click', () => {
    if (flag) return; // ゲーム中であれば処理しない

    if (currentBet === 0) {
        zunda1.play();
        displayAlert('さっさと、かけ金をかけるのだ！！');
        return;
    }

    if (maxBet === 0) {
        zunda2.play();
        displayAlert('一文無しはさっさと帰るのだ！！');
        return;
    }

    maxBet -= currentBet;
    Bet1 = currentBet;
    syoziElement.textContent = maxBet;
    playerHandTitle.style.display = 'block';
    resetUI();
    resetGameVariables();

    sound4.play();
    createDeck();
    dealInitialCards();

    if (isPair(playerHand) && maxBet >= currentBet) {
        splitButton.style.display = 'block';
    }
});

function displayAlert(message) {
    alertMessageElement.textContent = message;
    alertOverlayElement.style.display = 'block';
}

function resetUI() {
    dealerCardsElement.innerHTML = '';
    playerCardsElement.innerHTML = '';
    messageElement.textContent = '';
    hitButton.style.display = 'block';
    if (maxBet >= currentBet) { doubleButton.style.display = 'block'; }
    surrenderButton.style.display = 'block';
    splitButton.style.display = 'none';
    insuranceButton.style.display = 'none';
    dealButton.style.display = 'none';
    standButton.style.display = 'block';
    betsDisplay.style.display = 'none';
    splitHandsContainer.style.display = 'none';
    playerCardsElement.style.display = 'block';
    score2ParentElement.classList.add('hidden');
}

function resetGameVariables() {
    gameOver = false;
    surrenderflg = false;
    bust1 = false;
    bust2 = false;
    fight1 = false;
    fight2 = false;
    blackjack1 = false;
    blackjack2 = false;
    double1 = false;
    double2 = false;
    draw1 = false;
    draw2 = false;
    BetSum = 0;
    Bet1 = currentBet;
    Bet2 = 0;
    flag = true;
    isSplitMode = false;
    splitnum = 2;
    insuranceAvailable = false;
    Sum = 0;
    winBet = 0;
    stopSounds();
}
function stopSounds() {
    sound1.pause();
    sound1.currentTime = 0;
    sound2.pause();
    sound2.currentTime = 0;
    sound3.pause();
    sound3.currentTime = 0;
    sound4.pause();
    sound4.currentTime = 0;
    zunda1.pause();
    zunda1.currentTime = 0;
    zunda2.pause();
    zunda2.currentTime = 0;
    zunda3.pause();
    zunda3.currentTime = 0;
    zunda4.pause();
    zunda4.currentTime = 0;
    zunda5.pause();
    zunda5.currentTime = 0;
    zunda6.pause();
    zunda6.currentTime = 0;
    zunda7.pause();
    zunda7.currentTime = 0;
    zunda8.pause();
    zunda8.currentTime = 0;
}
function createDeck() {
    const suits = ['heart', 'diamond', 'club', 'spade'];
    const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
    deck = suits.flatMap(suit =>
        values.map(value => ({ suit, value }))
    );
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}
function drawCard() {
    return deck.pop();
}
function getCardValue(card) {
    return card.value === '1' ? 11 : ['11', '12', '13'].includes(card.value) ? 10 : parseInt(card.value);
}
function calculateHandValue(hand) {
    let total = 0;
    let aces = hand.filter(card => card.value === '1').length;
    total = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    while (total > 21 && aces > 0) {
        total -= 10;
        aces -= 1;
    }
    return total;
}

function addCardToHand(card, hand, index = 0) {
    const cardImage = document.createElement('img');
    cardImage.src = `../cards/${card.value}_${card.suit}.png`;
    cardImage.classList.add('card-image', 'deal-animation');
    cardImage.style.animationDelay = `${index * 0.2}s`;
    cardImage.addEventListener('animationend', () => {
        cardImage.classList.remove('deal-animation');
    });

    const targetHand = document.getElementById(`${hand}-cards`);
    if (targetHand) {
        targetHand.appendChild(cardImage);
    } else {
        console.error(`Invalid hand specified: ${hand}. Expected 'player' or 'dealer'.`);
    }
}

function updateScores() {
    if (isSplitMode) {
        splitHand1ScoreElement.textContent = `Hand 1: ${calculateHandValue(splitHand1)}`;
        splitHand2ScoreElement.textContent = `Hand 2: ${calculateHandValue(splitHand2)}`;
    } else {
        playerScoreElement.textContent = calculateHandValue(playerHand);
        if (!gameOver) {
            dealerScoreElement.textContent = '';
        }
    }
}
function dealInitialCards() {
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];
    playerHand.forEach((card, index) => {
        addCardToHand(card, 'player', index);
    });
    addCardToHand(dealerHand[0], 'dealer', 0);
    dealerHiddenCardElement = document.createElement('img');
    dealerHiddenCardElement.src = '../cards/back.png';
    dealerHiddenCardElement.classList.add('card-image', 'hidden-card');
    dealerCardsElement.appendChild(dealerHiddenCardElement);
    updateScores();

    if (dealerHand[0].value === '1' && Math.floor(currentBet / 2) <= maxBet) {
        insuranceButton.style.display = 'block';
    }
    if (calculateHandValue(playerHand) === 21) {
        messageElement.textContent = 'Blackjack! Checking Dealer...';
        hitButton.style.display = 'none';
        doubleButton.style.display = 'none';
        standButton.style.display = 'none';
        insuranceButton.style.display = 'none';
        surrenderButton.style.display = 'none';
        blackjack1 = true;
        stand();
    }
}
function isPair(hand) {
    return hand.length === 2 && (hand[0].value === hand[1].value || (['10', '11', '12', '13'].includes(hand[0].value) && ['10', '11', '12', '13'].includes(hand[1].value)));
}
function hit() {
    if (gameOver) return;

    doubleButton.style.display = 'none';
    splitButton.style.display = 'none';
    insuranceButton.style.display = 'none';
    surrenderButton.style.display = 'none';

    if (isSplitMode) {
        handleSplitHit();
    } else if (double1) {
        handleDoubleHit();
    } else {
        handleNormalHit();
    }
}
function handleSplitHit() {
    const currentHand = currentSplitHand === 1 ? splitHand1 : splitHand2;
    const targetCardsElement = currentSplitHand === 1 ? document.getElementById('split-hand-1-cards') : document.getElementById('split-hand-2-cards');

    if (splitnum < 5) {
        sound1.play();
        const card = drawCard();
        currentHand.push(card);
        splitnum++;
        addCardToHand(card, targetCardsElement, currentHand.length - 1);
    }
    updateSplitHandScore(currentHand);
    const handValue = calculateHandValue(currentHand);
    if (currentSplitHand === 1 && handValue > 21) {
        bust1 = true;
    } else if (currentSplitHand === 2 && handValue > 21) {
        bust2 = true;
    }
    if (handValue > 21 || handValue === 21 || splitnum === 5 || ((currentSplitHand === 1 && double1) || (currentSplitHand === 2 && double2))) {
        switchToNextHand();
    }
}
function updateSplitHandScore(currentHand) {
    const handValue = calculateHandValue(currentHand);
    if (currentSplitHand === 1) {
        score1Element.textContent = handValue;
    } else if (currentSplitHand === 2) {
        score2Element.style.display = 'block';
        score2Element.textContent = handValue;
    }
}
function handleDoubleHit() {
    sound1.play();
    const card = drawCard();
    playerHand.push(card);
    addCardToHand(card, 'player', playerHand.length - 1);
    const playerValue = calculateHandValue(playerHand);
    updateScores();
    if (playerValue > 21) {
        bust1 = true;
        stand();
        gameOver = true;
    } else if (playerValue === 21) {
        hitButton.style.display = 'none';
        blackjack1 = true;
        stand();
    }
}
function handleNormalHit() {
    if (playerHand.length < 5) {
        sound1.play();
        const card = drawCard();
        playerHand.push(card);
        addCardToHand(card, 'player', playerHand.length - 1);
        const playerValue = calculateHandValue(playerHand);
        updateScores();
        if (playerValue > 21) {
            bust1 = true;
            stand();
            gameOver = true;
        } else if (playerValue === 21) {
            hitButton.style.display = 'none';
            blackjack1 = true;
            stand();
        }
    }
    if (playerHand.length === 5) {
        stand();
    }
}
function stand() {
    if (gameOver) return;

    if (isSplitMode) {
        switchToNextHand();
    } else {
        handleNormalStand();
    }
}
function handleNormalStand() {
    setTimeout(() => {
        sound2.play();
        revealDealerCard();
        let dealerValue = calculateHandValue(dealerHand);
        if (dealerValue === 21) {
            zunda3.play();
        }
        scoreElement.textContent = dealerValue;

        dealerDrawCardsUntil17(dealerValue);

        if (surrenderflg) return;
        let time = dealerHand.length >= 3 ? 1500 : 1000;

        setTimeout(() => {
            if (dealerValue != 21) {
                insuranceAvailable = false;
            }

            const handValue = calculateHandValue(playerHand);
            fight1 = determineFight(dealerValue, handValue);

            if (handValue > 21) {
                fight1 = false;
            }

            const win = (handValue === dealerValue) && (handValue <= 21) ? 'draw' : handValue > 21 ? 'Dealer win' : fight1 ? 'Player win' : 'Dealer win';
            resultdisplay(win);

            draw1 = (handValue === dealerValue) ? true : false;
            calculateWinnings(fight1, blackjack1, draw1, fight2, blackjack2, draw2, insuranceAvailable, Bet1, Bet2, bust1, bust2);
            gameOver = true;
            displayResultSound(fight1, draw1);
            resultOverlayElement.style.display = 'block';
            score1Element.textContent = handValue;
        }, time);

        reset();
        timeset();
    }, 1000);
}
function revealDealerCard() {
    dealerCardsElement.removeChild(dealerHiddenCardElement);
    addCardToHand(dealerHand[1], 'dealer', 1);
    dealerScoreElement.textContent = calculateHandValue(dealerHand);
}
function dealerDrawCardsUntil17(dealerValue) {
    while (dealerValue < 17 && dealerHand.length < 5 && !insuranceAvailable) {
        sound1.play();
        const card = drawCard();
        dealerHand.push(card);
        addCardToHand(card, 'dealer', dealerHand.length - 1);
        dealerValue = calculateHandValue(dealerHand);
        if (dealerValue === 21) {
            zunda3.play();
        }
        scoreElement.textContent = dealerValue;
        dealerScoreElement.textContent = dealerValue;
    }
}
function double() {
    if (gameOver) return;

    hitButton.style.display = 'none';
    insuranceButton.style.display = 'none';
    maxBet -= currentBet;
    syoziElement.textContent = maxBet;

    if (currentSplitHand === 1) {
        double1 = true;
        Bet1 += currentBet;
    } else if (currentSplitHand === 2) {
        double2 = true;
        Bet2 += currentBet;
    }

    hit();
    if (!isSplitMode) {
        stand();
    }
}
function displayResultSound(fight1, draw1) {
    if (fight1) {
        zunda4.play();
    } else if (!draw1) {
        zunda5.play();
    }
}
splitButton.addEventListener('click', () => {
    if (gameOver) return;

    if (!isPair(playerHand)) {
        messageElement.textContent = 'Split is not possible';
        return;
    }
    isSplitMode = true;
    maxBet -= currentBet;
    Bet2 += currentBet;
    syoziElement.textContent = maxBet;

    currentSplitHand = 1;
    splitButton.style.display = 'none';
    insuranceButton.style.display = 'none';
    surrenderButton.style.display = 'none';
    playerHandTitle.style.display = 'none';
    handOfCardsElement.textContent = 'hand1の行動選択';
    if (currentBet > maxBet) {
        doubleButton.style.display = 'none';
    }
    splitHand1 = [playerHand[0]];
    splitHand2 = [playerHand[1]];
    splitHand1.push(drawCard());
    splitHand2.push(drawCard());

    playerCardsElement.innerHTML = '';
    splitHandsContainer.style.display = 'flex';

    displaySplitHand(splitHand1, document.getElementById('split-hand-1-cards'));
    displaySplitHand(splitHand2, document.getElementById('split-hand-2-cards'));

    splitHand1ScoreElement.textContent = `Hand 1: ${calculateHandValue(splitHand1)}`;
    splitHand2ScoreElement.textContent = `Hand 2: ${calculateHandValue(splitHand2)}`;

    const hand1Value = calculateHandValue(splitHand1);
    const hand2Value = calculateHandValue(splitHand2);

    if (hand1Value === 21) {
        blackjack1 = true;
        switchToNextHand();
        if (hand2Value === 21) {
            blackjack2 = true;
            switchToNextHand();
        }
    } else {
        splitHand1Element.classList.add('active-hand');
        splitHand2Element.classList.remove('active-hand');
    }
});
function displaySplitHand(hand, targetElement) {
    targetElement.innerHTML = '';
    hand.forEach((card) => {
        addCardToHand(card, targetElement.id.replace('-cards', ''));
    });
}
function switchToNextHand() {
    if (maxBet >= currentBet) {
        doubleButton.style.display = 'block';
    } else {
        doubleButton.style.display = 'none';
    }
    splitnum = 2;
    if (currentSplitHand === 1) {
        currentSplitHand = 2;
        handOfCardsElement.textContent = 'hand2の行動選択';
        splitHand1Element.classList.remove('active-hand');
        splitHand2Element.classList.add('active-hand');
        const hand2Value = calculateHandValue(splitHand2);
        if (hand2Value === 21) {
            switchToNextHand();
        }
    } else {
        isSplitMode = false;
        currentSplitHand = 1;
        doubleButton.style.display = 'none';
        handOfCardsElement.textContent = '';
        resolveSplitHands();
    }
}
function resultdisplay(winner) {
    document.getElementById('winner').textContent = winner;
}
function resolveSplitHands() {

    revealDealerCard();
    let dealerValue = calculateHandValue(dealerHand);
    dealerDrawCardsUntil17(dealerValue);
    const hand1Value = calculateHandValue(splitHand1);
    const hand2Value = calculateHandValue(splitHand2);

    determineGameOutcome(dealerValue, hand1Value, hand2Value, blackjack1, double1, blackjack2, double2);
    displaySplitResultSound(fight1, fight2);

    gameOver = true;
    scoreElement.textContent = dealerValue;
    score1Element.textContent = hand1Value;
    score2ParentElement.classList.remove('hidden');
    score2Element.textContent = hand2Value;
    resultOverlayElement.style.display = 'block';
    reset();
    timeset();
}
function displaySplitResultSound(fight1, fight2) {
    if (!fight1 && !fight2) {
        zunda5.play();
    } else {
        zunda4.play();
    }
}
insuranceButton.addEventListener('click', () => {
    if (dealerHand[0].value === '1' && !gameOver) {
        maxBet -= Math.floor(currentBet / 2);
        syoziElement.textContent = maxBet;
        insuranceAvailable = true;
        disableActionButtons();
        stand();
    }
});
function disableActionButtons() {
    hitButton.style.display = 'none';
    doubleButton.style.display = 'none';
    insuranceButton.style.display = 'none';
    splitButton.style.display = 'none';
    surrenderButton.style.display = 'none';
    standButton.style.display = 'none';
}
surrenderButton.addEventListener('click', () => {
    if (!gameOver) {
        surrenderflg = true;
        stand();
        gameOver = true;
        reset();
        surrender_bet();
        updateBetDisplay();
        betsDisplay.style.display = 'block';
    }
    flag = false;
});
function determineGameOutcome(dealerValue, hand1Value, hand2Value, blackjack1, double1, blackjack2, double2) {
    fight1 = determineFight(dealerValue, hand1Value);
    draw1 = (hand1Value === dealerValue && hand1Value <= 21) ? true : false;
    fight2 = determineFight(dealerValue, hand2Value);
    draw2 = (hand2Value === dealerValue && hand2Value <= 21) ? true : false;

    if (hand1Value > 21) {
        fight1 = false;
    }
    if (hand2Value > 21) {
        fight2 = false;
    }

    let winner = determineWinner(fight1, fight2);
    resultdisplay(winner);

    calculateWinnings(fight1, blackjack1, draw1, fight2, blackjack2, draw2, insuranceAvailable, Bet1, Bet2, bust1, bust2);
}
function determineWinner(fight1, fight2) {
    if (fight1 && !fight2) return 'Player Hand 1 win';
    if (!fight1 && fight2) return 'Player Hand 2 win';
    if (fight1 && fight2) return 'Both Hands win';
    return 'Dealer win';
}
function determineFight(dealer, player) {
    return (player > 21) ? false : (dealer > 21) ? true : (player > dealer) ? true : false;
}
function reset() {
    standButton.style.display = 'none';
    hitButton.style.display = 'none';
    doubleButton.style.display = 'none';
    surrenderButton.style.display = 'none';
    splitButton.style.display = 'none';
    insuranceButton.style.display = 'none';
    dealButton.style.display = 'block';
    syoziElement.innerHTML = maxBet;
    gameOver = false;
    flag = true;
    splitnum = 2;
    isSplitMode = false;
}
function timeset() {
    setTimeout(() => {
        flag = false;
        betsDisplay.style.display = 'block';
        updateBetDisplay();
    }, 1500);
}