// 定数
const MAX_PLAYER_CARDS = 5;
const DEALER_STAND_VALUE = 17;
const BLACKJACK_VALUE = 21;
const CARD_VALUE_ACE = 1;
const CARD_VALUE_FACE = 10;
const CARD_VALUE_ACE_ALT = 11;
const TIME_BETWEEN_ACTIONS = 1500;
const TIME_BETWEEN_DRAW_CARD = 1000;

// 音源
const sound0 = new Audio('../sounds/maou_bgm_acoustic11.mp3');
const sound1 = new Audio('../sounds/card.mp3');
const sound2 = new Audio('../sounds/put.mp3');
const sound3 = new Audio('../sounds/result.mp3');
const sound4 = new Audio('../sounds/shuffle.mp3');
const zunda1 = new Audio('../sounds/zunda1.wav');
const zunda2 = new Audio('../sounds/zunda2.wav');
const zunda3 = new Audio('../sounds/zunda3.wav');
const zunda4 = new Audio('../sounds/zunda4.wav');
const zunda5 = new Audio('../sounds/zunda5.wav');
const zunda6 = new Audio('../sounds/zunda6.wav');
const zunda7 = new Audio('../sounds/zunda7.wav');
const zunda8 = new Audio('../sounds/zunda8.wav');

// ゲームの状態変数
let playerHand = [];
let dealerHand = [];
let deck = [];
let gameOver = false;
let gameStarted = false;
let surrenderflg = false;
let dealerHiddenCardElement = null;
let fight1 = false;
let blackjack1 = false;
let double1 = false;
let draw1 = false;
let bust1 = false;
let fight2 = false;
let blackjack2 = false;
let double2 = false;
let draw2 = false;
let bust2 = false;
let splitHand1 = [];
let splitHand2 = [];
let splitNum = 2;
let currentSplitHand = 1;
let isSplitMode = false;
let insuranceAvailable = false;
let dealblackjack = false;

// 初期設定
sound0.pause();
sound0.currentTime = 0;
sound0.loop = true;
sound0.volume = 0.05;
sound0.play();

// メニュー関連
document.addEventListener('DOMContentLoaded', () => {
    const gameMenuBtn = document.getElementById('game-menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const resumeBtn = document.getElementById('resume-btn');
    const rulesBtn = document.getElementById('rules-btn');
    const titleBtn = document.getElementById('title-btn');
    const rulesOverlay = document.getElementById('rules-overlay');
    const closeRulesBtn = document.getElementById('close-rules-btn');
    const resultOverlay = document.getElementById('result-overlay');
    const resultContent = document.getElementById('result-content');
    const alertOverlay = document.getElementById('alert-overlay');
    
    // メニュー開閉
    gameMenuBtn.addEventListener('click', () => {
        menuOverlay.style.display = 'flex';
        pauseGame();
    });
    resumeBtn.addEventListener('click', () => {
        menuOverlay.style.display = 'none';
        resumeGame();
    });
    // ルール説明開閉
    rulesBtn.addEventListener('click', () => {
        rulesOverlay.style.display = 'flex';
    });
    closeRulesBtn.addEventListener('click', () => {
        rulesOverlay.style.display = 'none';
    });
    // タイトル画面へ
    titleBtn.addEventListener('click', () => {
        window.location.href = '../html/home.html';
    });
    // モーダルクリックで閉じる
    resultOverlay.addEventListener('click', (event) => {
      if (event.target === resultOverlay) {
        resultOverlay.style.display = 'none';
      }
    });
    resultContent.addEventListener('click', (event) => {
      if (event.target === resultContent) {
        resultOverlay.style.display = 'none';
      }
    });
    alertOverlay.addEventListener('click', (event) => {
      if (event.target === alertOverlay) {
        alertOverlay.style.display = 'none';
      }
    });
});

// ゲームボタンの有効/無効化
function pauseGame() {
    const gameButtons = document.querySelectorAll('.game_buttons button');
    gameButtons.forEach(button => button.disabled = true);
}
function resumeGame() {
    const gameButtons = document.querySelectorAll('.game_buttons button');
    gameButtons.forEach(button => button.disabled = false);
}

// ゲーム開始
document.getElementById('deal_b').addEventListener('click', () => {
    if (gameStarted) return;
    if (currentBet === 0 || maxBet === 0) {
        if (maxBet === 0) {
            zunda2.play();
            showAlertMessage('一文無しはさっさと帰るのだ！！');
        } else {
            zunda1.play();
            showAlertMessage('さっさと、かけ金をかけるのだ！！');
        }
        return;
    }

    startGame();
    setupGameUI();
    resetGameVariables();
    createDeckAndDealCards();
    updateBetDisplay();

    if (isBlackjack(playerHand)) {
        handlePlayerBlackjack();
    } else if(isSplittable(playerHand) && maxBet >= currentBet){
            document.getElementById('split_b').style.display = 'block';
    }
});

function startGame() {
    maxBet -= currentBet;
    Bet1 = currentBet;
    gameStarted = true;
}
function setupGameUI() {
    document.querySelector('#player-hand h2').style.display = 'block';
    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('message').textContent = '';
    document.getElementById('hit_b').style.display = 'block';
    if(maxBet >= currentBet){ document.getElementById('double_b').style.display = 'block';}
    document.getElementById('surrender_b').style.display = 'block';
    document.getElementById('split_b').style.display = 'none';
    document.getElementById('insurance_b').style.display = 'none';
    document.getElementById('deal_b').style.display = 'none';
    document.getElementById('stand_b').style.display = 'block';
    document.getElementById('bets').style.display = 'none';
    document.getElementById('split-hands-container').style.display = 'none';
    document.getElementById('player-cards').style.display = 'block';
    document.getElementById('score2').parentElement.classList.add('hidden');
}
function resetGameVariables() {
    gameOver = false;
    surrenderflg = false;
    fight1 = false;
    fight2 = false;
    blackjack1 = false;
    blackjack2 = false;
    dealblackjack = false;
    double1 = false;
    double2 = false;
    draw1 = false;
    draw2 = false;
    bust1 = false;
    bust2 = false;
    Bet1 = currentBet;
    Bet2 = 0;
    isSplitMode = false;
    splitNum = 2;
    insuranceAvailable = false;
    BetSum = 0;
}
function createDeckAndDealCards() {
    stopSounds();
    createDeck();
    sound4.play();
    dealInitialCards();
}

// デッキ作成
function createDeck() {
    const suits = ['heart', 'diamond', 'club', 'spade'];
    const values = ['1','2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
    deck = suits.flatMap(suit => values.map(value => ({ suit, value })));

    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// カードを引く
function drawCard() {
    return deck.pop();
}
// カードの値を計算
function getCardValue(card) {
    return card.value === '1' ? CARD_VALUE_ACE_ALT: (['11', '12', '13'].includes(card.value) ? CARD_VALUE_FACE : parseInt(card.value));
}

// 手札の合計値を計算
function calculateHandValue(hand) {
    let total = 0;
    let aces = hand.filter(card => card.value === '1').length;
    total = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    while (total > BLACKJACK_VALUE && aces > 0) {
        total -= 10;
        aces--;
    }
    return total;
}
// カードをUIに追加
function addCardToHand(card, hand, index = 0) {
  const cardImage = createCardImage(card, index);
  const targetHand = document.getElementById(`${hand}-cards`);

  if (targetHand) {
      targetHand.appendChild(cardImage);
  } else {
      console.error(`Invalid hand specified: ${hand}. Expected 'player' or 'dealer'.`);
  }
}
function createCardImage(card, index) {
  const cardImage = document.createElement('img');
  cardImage.src = `../cards/${card.value}_${card.suit}.png`;
  cardImage.classList.add('card-image', 'deal-animation');
  cardImage.style.animationDelay = `${index * 0.2}s`;
  cardImage.addEventListener('animationend', () => {
      cardImage.classList.remove('deal-animation');
  });
  return cardImage;
}

// スコアを更新
function updateScores() {
    if(isSplitMode) {
      document.getElementById('split-hand-1-score').textContent = `Hand 1: ${calculateHandValue(splitHand1)}`;
      document.getElementById('split-hand-2-score').textContent = `Hand 2: ${calculateHandValue(splitHand2)}`;
    } else {
      document.getElementById('player-score').textContent = calculateHandValue(playerHand);
        if (!gameOver) {
            document.getElementById('dealer-score').textContent = '';
        }
    }
}
// カードを配る
function dealInitialCards() {
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];
    playerHand.forEach((card, index) => addCardToHand(card, 'player', index));
    addDealerCard();
    updateScores();
    if (dealerHand[0].value === '1' && Math.floor(currentBet / 2) <= maxBet) {
        document.getElementById('insurance_b').style.display = 'block';
    }
}
function addDealerCard(){
    addCardToHand(dealerHand[0], 'dealer', 0);
    dealerHiddenCardElement = createHiddenCardImage();
    document.getElementById('dealer-cards').appendChild(dealerHiddenCardElement);
}

function createHiddenCardImage() {
    const cardImage = document.createElement('img');
    cardImage.src = '../cards/back.png';
    cardImage.classList.add('card-image', 'hidden-card');
    return cardImage;
}
// ブラックジャック判定
function isBlackjack(hand) {
    return calculateHandValue(hand) === BLACKJACK_VALUE;
}
// ブラックジャック時の処理
function handlePlayerBlackjack() {
    document.getElementById('message').textContent = 'Blackjack! Checking Dealer...';
    document.getElementById('hit_b').style.display = 'none';
    document.getElementById('double_b').style.display = 'none';
    document.getElementById('stand_b').style.display = 'none';
    document.getElementById('insurance_b').style.display = 'none';
    document.getElementById('surrender_b').style.display = 'none';
    blackjack1 = true;
    stand();
}
// ヒット
function hit() {
    if (gameOver) return;
    disableActionButtons();
    if (isSplitMode) {
        handleSplitHit();
    } else if (double1) {
        handleDoubleHit();
    } else {
        handleNormalHit();
    }
}

// ボタン制御
function disableActionButtons() {
    document.getElementById('double_b').style.display = 'none';
    document.getElementById('split_b').style.display = 'none';
    document.getElementById('insurance_b').style.display = 'none';
    document.getElementById('surrender_b').style.display = 'none';
}
// スプリット時のヒット処理
function handleSplitHit() {
        document.getElementById('hit_b').style.display = 'block';
        const currentHand = currentSplitHand === 1 ? splitHand1 : splitHand2;
        const targetCardsElement = currentSplitHand === 1 ? document.getElementById('split-hand-1-cards') : document.getElementById('split-hand-2-cards');
    if(splitNum < MAX_PLAYER_CARDS){
        sound1.play();
        const card = drawCard();
        currentHand.push(card);
        splitNum++;
        const cardImage = createCardImage(card);
        targetCardsElement.appendChild(cardImage);
        updateSplitScore();
        checkSplitHandStatus(currentHand);
    }
}
function updateSplitScore() {
    const handValue = calculateHandValue(currentSplitHand === 1 ? splitHand1 : splitHand2);
    document.getElementById(`split-hand-${currentSplitHand}-score`).textContent = `Hand ${currentSplitHand}: ${handValue}`;
     if(currentSplitHand === 1){
        document.getElementById("score1").textContent = handValue;
    } else if(currentSplitHand === 2){
        document.getElementById("score2").style.display = 'block';
        document.getElementById("score2").textContent = handValue;
    }
}
function checkSplitHandStatus(hand) {
    const handValue = calculateHandValue(hand);
    if (handValue > BLACKJACK_VALUE || handValue === BLACKJACK_VALUE || splitNum === MAX_PLAYER_CARDS || (currentSplitHand === 1 && double1) || (currentSplitHand === 2 && double2)){
            switchToNextHand();
    }
}

// 通常ダブル時のヒット処理
function handleDoubleHit() {
    document.getElementById('hit_b').style.display = 'none';
    sound1.play();
        const card = drawCard();
        playerHand.push(card);
        addCardToHand(card, 'player', playerHand.length - 1);
        const playerValue = calculateHandValue(playerHand);
        updateScores();
        if (playerValue > BLACKJACK_VALUE) {
            stand();
            gameOver = true;
        }
        if (playerValue === BLACKJACK_VALUE) {
            blackjack1 = true;
            stand();
        }
}

// 通常のヒット処理
function handleNormalHit() {
    if (playerHand.length < MAX_PLAYER_CARDS) {
        sound1.play();
        const card = drawCard();
        playerHand.push(card);
        addCardToHand(card, 'player', playerHand.length - 1);
        const playerValue = calculateHandValue(playerHand);
        updateScores();
        if (playerValue > BLACKJACK_VALUE) {
            document.getElementById('hit_b').style.display = 'none';
            stand();
            gameOver = true;
        }
        if (playerValue === BLACKJACK_VALUE) {
            document.getElementById('hit_b').style.display = 'none';
            blackjack1 = true;
            stand();
        }
    }
    if (playerHand.length === MAX_PLAYER_CARDS) {
        stand();
    }
}
// スタンド
function stand() {
    if (gameOver) return;
    if (isSplitMode) {
      switchToNextHand();
    } else {
      handleNormalStand();
    }
}
function handleNormalStand() {
    document.getElementById('hit_b').style.display = 'none';
    disableActionButtons();
    setTimeout(() => {
        sound2.play();
        revealDealerHiddenCard();
        updateDealerScore();
        dealersTurn();
        
        if (surrenderflg) return;
        const time = dealerHand.length >= 3 ? TIME_BETWEEN_ACTIONS : TIME_BETWEEN_DRAW_CARD;
            
        setTimeout(() => {
            const handValue = calculateHandValue(playerHand);
            const dealerValue = calculateHandValue(dealerHand);
            fight1 = determineFight(dealerValue, handValue);
            if (handValue > BLACKJACK_VALUE) fight1 = false;
            const win = determineWinner(handValue, dealerValue, fight1);

            bustHands(handValue, 1);
            draw1 = (handValue === dealerValue) ? true : false;
            resultdisplay(win);
            calculateWinnings(fight1, blackjack1, draw1, fight2, blackjack2, draw2, insuranceAvailable, dealblackjack , Bet1, Bet2, bust1, bust2);
            gameOver = true;

            showGameResult();
            reset();
            timeset();
        }, time);
    }, TIME_BETWEEN_DRAW_CARD);
}
function revealDealerHiddenCard() {
    document.getElementById('dealer-cards').removeChild(dealerHiddenCardElement);
    addCardToHand(dealerHand[1], 'dealer', 1);
}

function updateDealerScore() {
  const dealerValue = calculateHandValue(dealerHand);
    document.getElementById('dealer-score').textContent = dealerValue;
    document.getElementById("score").textContent = dealerValue;
    if (dealerValue === BLACKJACK_VALUE) {
        dealblackjack = true;
        zunda3.play();
    }
}
function dealersTurn() {
    let dealerValue = calculateHandValue(dealerHand);
    while (dealerValue < DEALER_STAND_VALUE && dealerHand.length < MAX_PLAYER_CARDS) {
        sound1.play();
        const card = drawCard();
        dealerHand.push(card);
        addCardToHand(card, 'dealer', dealerHand.length - 1);
        dealerValue = calculateHandValue(dealerHand);
        updateDealerScore();
    }
}
function showGameResult() {
    if (fight1) {
        zunda4.play();
    } else if (!draw1) {
        zunda5.play();
    }
    document.getElementById('result-overlay').style.display = 'block';
    document.getElementById("score1").textContent = calculateHandValue(playerHand);
}
// ダブル
function double() {
  if (gameOver) return;
  disableActionButtons();
  maxBet -= currentBet;
  document.getElementById('syozi').textContent = maxBet;
  if (currentSplitHand === 1) {
    double1 = true;
    Bet1 += currentBet;
  } else if (currentSplitHand === 2) {
    double2 = true;
    Bet2 += currentBet;
  }
  updateBetDisplay();
  hit();
  if (!isSplitMode) {
      stand();
  }
}
// スプリット
document.getElementById('split_b').addEventListener('click', () => {
    if (gameOver) return;
    if (!isSplittable(playerHand)) {
      showAlertMessage('Split is not possible');
        return;
    }
  
    handleSplitBet();
    
    isSplitMode = true;
    document.getElementById('syozi').textContent = maxBet;
    currentSplitHand = 1;
    disableSplitButtons();
    document.querySelector('#player-hand h2').style.display = 'none';
    document.getElementById('hand-of-cards').textContent = 'hand1の行動選択';
    
    if (currentBet > maxBet) {
    document.getElementById('double_b').style.display = 'none';
    }
  
    splitHands();
    displaySplitHands();
      const hand1Value = calculateHandValue(splitHand1);
        const hand2Value = calculateHandValue(splitHand2);
       if (hand1Value === BLACKJACK_VALUE) {
              blackjack1 = true;
              switchToNextHand();
              if (hand2Value === BLACKJACK_VALUE) {
                  blackjack2 = true;
                  switchToNextHand();
                }
          } else {
              document.getElementById('split-hand-1').classList.add('active-hand');
              document.getElementById('split-hand-2').classList.remove('active-hand');
          }
  });
  
  function handleSplitBet() {
    const splitBet = currentBet;
    maxBet -= splitBet;
    Bet2 += splitBet;
  }
function isSplittable(hand){
  return hand.length === 2 && ((hand[0].value === hand[1].value) || (['10', '11', '12', '13'].includes(hand[0].value) && ['10', '11', '12', '13'].includes(hand[1].value)));
}

function disableSplitButtons() {
    document.getElementById('split_b').style.display = 'none';
    document.getElementById('insurance_b').style.display = 'none';
    document.getElementById('surrender_b').style.display = 'none';
}
function splitHands() {
    splitHand1 = [playerHand[0]];
    splitHand2 = [playerHand[1]];
    splitHand1.push(drawCard());
    splitHand2.push(drawCard());
}
function displaySplitHands() {
    const playerCardsElement = document.getElementById('player-cards');
    playerCardsElement.innerHTML = '';
    document.getElementById('split-hands-container').style.display = 'flex';
    displaySplitHand(1, splitHand1);
    displaySplitHand(2, splitHand2);
    updateScores();
    updateBetDisplay();
}
function displaySplitHand(handNum, hand) {
    const splitHandCards = document.getElementById(`split-hand-${handNum}-cards`);
    splitHandCards.innerHTML = '';
    hand.forEach((card) => {
      const cardImage = createCardImage(card);
      splitHandCards.appendChild(cardImage);
    });
}
// ハンド切り替え
function switchToNextHand() {
    if(maxBet >= currentBet){
        document.getElementById('double_b').style.display = 'block';
    } else {
        document.getElementById('double_b').style.display = 'none';
    }
  splitNum = 2;
  if (currentSplitHand === 1) {
        currentSplitHand = 2;
        document.getElementById('hand-of-cards').textContent = 'hand2の行動選択';
        document.getElementById('split-hand-1').classList.remove('active-hand');
        document.getElementById('split-hand-2').classList.add('active-hand');
      if (isBlackjack(splitHand2)) {
          switchToNextHand();
        }
    } else {
        isSplitMode = false;
        currentSplitHand = 1;
        document.getElementById('double_b').style.display = 'none';
        document.getElementById('hand-of-cards').textContent = '';
        resolveSplitHands();
    }
}
// リザルト表示
function resultdisplay(winner) {
  document.getElementById('winner').textContent = winner;
}
// バースト処理
function bustHands(value, num){
    if(num === 1){
        bust1 = (value > 21) ? true : false;
    } else if(num === 2){
        bust2 = (value > 21) ? true : false;
    }
}
// スプリット時の結果処理
function resolveSplitHands() {
    revealDealerHiddenCard();
    updateDealerScore();
    dealersTurn();

    const hand1Value = calculateHandValue(splitHand1);
    const hand2Value = calculateHandValue(splitHand2);
    const dealerValue = calculateHandValue(dealerHand);

    bustHands(hand1Value, 1);
    bustHands(hand2Value, 2);

    determineGameOutcome(dealerValue, hand1Value, hand2Value);
    calculateWinnings(fight1, blackjack1, draw1, fight2, blackjack2, draw2, insuranceAvailable, dealblackjack, Bet1, Bet2, bust1, bust2);
    if (!fight1 && !fight2) {
        zunda5.play();
    } else {
        zunda4.play();
    }

    gameOver = true;
    document.getElementById('score').textContent = dealerValue;
    document.getElementById('score1').textContent = hand1Value;
    document.getElementById('score2').parentElement.classList.remove('hidden');
    document.getElementById('score2').textContent = hand2Value;
    document.getElementById('result-overlay').style.display = 'block';
    reset();
    timeset();
}
// 勝敗判定
function determineGameOutcome(dealerValue, hand1Value, hand2Value) {
    fight1 = determineFight(dealerValue, hand1Value);
    draw1 = (hand1Value === dealerValue && hand1Value <= BLACKJACK_VALUE) ? true : false;
     if (hand1Value > BLACKJACK_VALUE) fight1 = false;
    fight2 = determineFight(dealerValue, hand2Value);
     draw2 = (hand2Value === dealerValue && hand2Value <= BLACKJACK_VALUE) ? true : false;
    if (hand2Value > BLACKJACK_VALUE) fight2 = false;
    
    const winner = determineWinner(hand1Value, hand2Value, fight1, fight2);
    resultdisplay(winner);
}

function determineWinner(hand1Value, hand2Value, fight1, fight2) {
  if (fight1 && !fight2) return 'Player Hand 1 win';
  if (!fight1 && fight2) return 'Player Hand 2 win';
  if (fight1 && fight2) return 'Both Hands win';
  return 'Dealer win';
}
function determineFight(dealerValue, playerValue) {
    return (playerValue > BLACKJACK_VALUE) ? false : (dealerValue > BLACKJACK_VALUE) ? true : (playerValue > dealerValue) ? true : false;
}
// インシュランス
document.getElementById('insurance_b').addEventListener('click', () => {
  if(dealerHand[0].value === '1' && !gameOver) {
    maxBet -= Math.floor(currentBet / 2);
    document.getElementById('syozi').textContent = maxBet;
    insuranceAvailable = true;
    disableInsuranceButtons();
    stand();
  }
});

function disableInsuranceButtons() {
    document.getElementById('hit_b').style.display = 'none';
    document.getElementById('double_b').style.display = 'none';
    document.getElementById('insurance_b').style.display = 'none';
    document.getElementById('split_b').style.display = 'none';
    document.getElementById('surrender_b').style.display = 'none';
    document.getElementById('stand_b').style.display = 'none';
}

// サレンダー
document.getElementById('surrender_b').addEventListener('click', () => {
    if (!gameOver) {
        surrenderflg = true;
        stand();
        gameOver = true;
        reset();
        surrenderBet();
        updateBetDisplay();
        document.getElementById('bets').style.display = 'block';
    }
    setTimeout(() => {
        gameStarted = false;
    }, 1500);
});

// リセット
function reset() {
    document.getElementById('stand_b').style.display = 'none';
    document.getElementById('hit_b').style.display = 'none';
    document.getElementById('double_b').style.display = 'none';
    document.getElementById('surrender_b').style.display = 'none';
    document.getElementById('split_b').style.display = 'none';
    document.getElementById('insurance_b').style.display = 'none';
    document.getElementById('deal_b').style.display = 'block';
    document.getElementById('syozi').innerHTML = maxBet;
    gameOver = false;
    gameStarted = true;
    splitNum = 2;
    isSplitMode = false;
}
// タイムセット
function timeset() {
  setTimeout(() => {
    gameStarted = false;
    document.getElementById('bets').style.display = 'block';
        updateBetDisplay();
    }, TIME_BETWEEN_ACTIONS);
}
// アラートメッセージ
function showAlertMessage(message) {
    document.getElementById('alert-message').textContent = message;
    document.getElementById('alert-overlay').style.display = 'block';
}
// サウンドを止める
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

function toggleBetArea() {
    const betArea = document.querySelector('.bet-area');
    const arrowIcon = document.getElementById('arrow-icon');

    if (betArea.classList.contains('open')) {
        // ベットエリアが表示されている場合
        betArea.classList.remove('open'); // 非表示にする
        arrowIcon.src = '../image/left.png'; // 左矢印に変更
        arrowIcon.alt = 'Open Bet Area'; // alt属性も変更
        betArea.style.display = 'none';
    } else {
        // ベットエリアが非表示の場合
        betArea.classList.add('open'); // 表示する
        arrowIcon.src = '../image/right.png'; // 右矢印に変更
        arrowIcon.alt = 'Close Bet Area'; // alt属性も変更
        betArea.style.display = 'block';
    }
}
