// ゲーム用の変数
let playerHand = [];
let dealerHand = [];
let deck = [];
let card = [];
let gameOver = false;
let flag = false;
let dealerHiddenCardElement = null;
let Bet1 = 0;
let Bet2 = 0;
// 勝敗とブラックジャックの結果用フラグ
let fight1 = false;
let blackjack1 = false;
let double1 = false;
let draw1 = false;
let fight2 = false;
let blackjack2 = false;
let double2 = false;
let draw2 = false;
// スプリット用フラグ
let splitHand1 = [];
let splitHand2 = [];
let splitnum = 2;
let currentSplitHand = 1; // 現在のプレイハンド
let isSplitMode = false; // スプリット状態か？
// インシュランス用フラグ
let insuranceAvailable = false;

// スタート
document.getElementById('deal_b').addEventListener('click', () => {
    if(flag) return;
    if(currentBet != 0 && maxBet != 0) {
        maxBet -= currentBet;
        Bet1 = currentBet;
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
        // UIをリセット
        document.getElementById('split-hands-container').style.display = 'none';
        document.getElementById('player-cards').style.display = 'block';
        document.getElementById('score2').parentElement.classList.add('hidden');
    
        gameOver = false;
        fight1 = false;
        fight2 = false;
        blackjack1 = false;
        blackjack2 = false;
        double1 = false;
        double2 = false;
        draw1 = false;
        draw2 = false;
        BetSum = 0;
        flag = true;
        isSplitMode = false;
        splitnum = 2;
        insuranceAvailable = false;
        Sum = 0;
        winBet = 0;

        createDeck();
        dealInitialCards();
        if((playerHand[0].value === playerHand[1].value) || (['10', '11', '12', '13'].includes(playerHand[0].value) && ['10', '11', '12', '13'].includes(playerHand[1].value))){
            if(maxBet >= currentBet){document.getElementById('split_b').style.display = 'block';}
        }    
    } else if(maxBet === 0){
        alert("掛け金がないため、プレイできません…")
    } else {
        alert("掛け金を設定してください！！")
    }
});
// デッキ作成＆カード配布etc.
function createDeck() {
    const suits = ['heart', 'diamond', 'club', 'spade'];
    const values = ['1','2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
            
    deck = suits.flatMap(suit => 
        values.map(value => ({ suit, value }))
    );
            
    // デッキをシャッフル
    for(let i = deck.length - 1; i > 0; i--) {
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
    // エースを1として数えるかの調整
    while (total > 21 && aces > 0) {
        total -= 10;
        aces -= 1;
    }
    return total;
}

function addCardToHand(card, hand, index = 0) {
    const cardImage = document.createElement('img');
    cardImage.src = `../../cards/${card.value}_${card.suit}.png`;
    cardImage.classList.add('card-image');
    cardImage.style.animationDelay = `${index * 0.2}s`;
    cardImage.classList.add('deal-animation');
    cardImage.addEventListener('animationend', () => {
        cardImage.classList.remove('deal-animation');
    });

    const targetHand = document.getElementById(`${hand}-cards`);
    if(targetHand) {
        targetHand.appendChild(cardImage);
    } else {
        console.error(`Invalid hand specified: ${hand}. Expected 'player' or 'dealer'.`);
    }

}

function updateScores() {
    // スプリットモード時のスコア更新
    if(isSplitMode) {
        document.getElementById('split-hand-1-score').textContent = 
            `Hand 1: ${calculateHandValue(splitHand1)}`;
        document.getElementById('split-hand-2-score').textContent = 
            `Hand 2: ${calculateHandValue(splitHand2)}`;
    } else {
        document.getElementById('player-score').textContent = calculateHandValue(playerHand);
        // ゲーム開始時は空白のまま
        if (!gameOver) {
            document.getElementById('dealer-score').textContent = '';
        }
    }
}

function dealInitialCards() {
    playerHand = [drawCard(),drawCard()];// drawCard(),drawCard()
    dealerHand = [drawCard(),drawCard()];// { suit: 'heart', value: '10' },{ suit: 'heart', value: '10' }
    playerHand.forEach((card, index) => {
        addCardToHand(card, 'player', index);
    });
    addCardToHand(dealerHand[0], 'dealer', 0);
    dealerHiddenCardElement = document.createElement('img');
    dealerHiddenCardElement.src = '../../cards/back.png';
    dealerHiddenCardElement.classList.add('card-image', 'hidden-card');
    document.getElementById('dealer-cards').appendChild(dealerHiddenCardElement);
    updateScores();
    if(dealerHand[0].value === '1' && Math.floor(currentBet/2) <= maxBet) {
        document.getElementById('insurance_b').style.display = 'block';
    }
    if (calculateHandValue(playerHand) === 21) {
        document.getElementById('message').textContent = 'Blackjack! Checking Dealer...';
        blackjack1 = true;
        stand();
    }
}
// ボタンが押された時の処理
// ヒット
function hit() {
    if(gameOver) return;
    document.getElementById('double_b').style.display = 'none';
    document.getElementById('split_b').style.display = 'none';
    document.getElementById('insurance_b').style.display = 'none';
    document.getElementById('surrender_b').style.display = 'none';
    // スプリットモード時のヒット処理
    if(isSplitMode) {
        const currentHand = currentSplitHand === 1 ? splitHand1 : splitHand2;
        const targetCardsElement = currentSplitHand === 1 ? document.getElementById('split-hand-1-cards') : document.getElementById('split-hand-2-cards');
        if(splitnum < 5) {
            card = drawCard(); // カードをドロー
            currentHand.push(card);
            splitnum++;
        }
        // カードを表示
        const cardImage = document.createElement('img');
        cardImage.src = `../../cards/${card.value}_${card.suit}.png`;
        cardImage.classList.add('card-image');
        targetCardsElement.appendChild(cardImage);
        // スコアを更新
        document.getElementById(`split-hand-${currentSplitHand}-score`).textContent = `Hand ${currentSplitHand}: ${calculateHandValue(currentHand)}`;
        // スコア計算と変数への代入
        const handValue = calculateHandValue(currentHand);
        if(currentSplitHand === 1){
            document.getElementById("score1").textContent = handValue;
        } else if(currentSplitHand === 2){
            document.getElementById("score2").style.display = 'block';
            document.getElementById("score2").textContent = handValue;
        }
        // バスト判定またはブラックジャック判定
        if(handValue > 21 || handValue === 21 || splitnum === 5) {
            switchToNextHand();
        } else if((currentSplitHand === 1 && double1 === true) || (currentSplitHand === 2 && double2 === true)) {
            switchToNextHand();
        }
    } else {
        // 通常のヒット処理
        if(playerHand.length < 5) {
            const card = drawCard();
            playerHand.push(card);
            addCardToHand(card, 'player', playerHand.length - 1);
            const playerValue = calculateHandValue(playerHand);
            updateScores();
            if (playerValue > 21) {
                document.getElementById('message').textContent = 'Bust!';
                stand();
                gameOver = true;
            }
            if (calculateHandValue(playerHand) === 21) {
                document.getElementById('message').textContent = 'Blackjack! Checking Dealer...';
                blackjack1 = true;
                stand();
            }    
        }
        if(playerHand.length === 5) {
            stand();
        }
    }
}
// スタンド
function stand() {
    if(gameOver) return;
    if(isSplitMode) { // スプリットモード時の処理
        switchToNextHand();

    } else {
        // 通常のスタンド処理
        setTimeout(() => {    
            // 最初の2枚目のカードをめくる
            document.getElementById('dealer-cards').removeChild(dealerHiddenCardElement);
            addCardToHand(dealerHand[1], 'dealer', 1);
            // この時点でディーラーの点数を更新
            document.getElementById('dealer-score').textContent = calculateHandValue(dealerHand);
            let dealerValue = calculateHandValue(dealerHand); 
            document.getElementById("score").textContent = dealerValue; 
            // ディーラーのカードを最大5枚まで制限
            while (dealerValue < 17 && dealerHand.length < 5 && !insuranceAvailable) {
                const card = drawCard();
                dealerHand.push(card);
                addCardToHand(card, 'dealer', dealerHand.length - 1);
                dealerValue = calculateHandValue(dealerHand);
                document.getElementById("score").textContent = dealerValue;

                // 追加のカードを引くたびにスコアを更新
                document.getElementById('dealer-score').textContent = dealerValue;
            }

            if(dealerValue != 21){
                insuranceAvailable = false;
            }

            const handValue = calculateHandValue(playerHand);
            fight1 = determineFight(dealerValue, handValue);
            
            // ハンドが21を超えた場合は敗北
            if (handValue > 21) {
                fight1 = false;
            }
            
            // 勝者の判定
            let win = handValue === dealerValue ? 'draw' : handValue > 21 ? 'Dealer win' : fight1 ? 'Player win' : 'Dealer win';
            resultdisplay(win);

            draw1 = (handValue === dealerValue && handValue <= 21) ? true : false;

            calculateWinnings(fight1, blackjack1, draw1, fight2, blackjack2, draw2, insuranceAvailable, Bet1, Bet2);
            
            gameOver = true;

            document.getElementById('result-overlay').style.display = 'block';
            document.getElementById("score1").textContent = handValue;
            reset();
            timeset();        
        }, 1000);
    }
}
// ダブル
const double = document.getElementById('double_b').addEventListener('click', () => {
    if (gameOver) return;
    if(currentBet <= maxBet && maxBet != 0){
        document.getElementById('insurance_b').style.display = 'none';
        maxBet -= currentBet;
        document.getElementById('syozi').textContent = maxBet;    
        if(currentSplitHand === 1){
            double1 = true;
            Bet1 += currentBet;
        } else if(currentSplitHand === 2){
            double2 = true;
            Bet2 += currentBet;
        }
        hit();
        if (!isSplitMode) {
            stand();
        }
    }
});
// スプリット
const split = document.getElementById('split_b').addEventListener('click', () => {
    if(gameOver) return;
    // スプリット可能かどうかの条件
    const isSpilitPossible = 
        playerHand.length === 2 && ((playerHand[0].value === playerHand[1].value) || (['10', '11', '12', '13'].includes(playerHand[0].value) && ['10', '11', '12', '13'].includes(playerHand[1].value)));
    if(isSpilitPossible) {
        // スプリットモードを有効化
        isSplitMode = true;
        maxBet -= currentBet;
        Bet2 += currentBet;
        document.getElementById('syozi').textContent = maxBet;    
        currentSplitHand = 1;
        document.getElementById('split_b').style.display = 'none';
        document.getElementById('insurance_b').style.display = 'none';
        document.getElementById('surrender_b').style.display = 'none';
        document.querySelector('#player-hand h2').style.display = 'none';
        document.getElementById('hand-of-cards').textContent = 'hand1の行動選択';
        // プレイヤーの最初のハンドを二つに分割
        splitHand1 = [playerHand[0]];
        splitHand2 = [playerHand[1]];
        // 各ハンドに新しいカードを追加
        splitHand1.push(drawCard());
        splitHand2.push(drawCard());
        // プレイヤーカードの表示を完全にリセット
        const playerCardsElement = document.getElementById('player-cards');
        playerCardsElement.innerHTML = '';
        // スプリットハンズコンテナを表示
        const splitHandsContainer = document.getElementById('split-hands-container');
        splitHandsContainer.style.display = 'flex';
        // 最初のハンドを表示
        const splitHand1Cards = document.getElementById('split-hand-1-cards');
        splitHand1Cards.innerHTML = '';
        splitHand1.forEach((card, index) => {
            const cardImage = document.createElement('img');
            cardImage.src = `../../cards/${card.value}_${card.suit}.png`;
            cardImage.classList.add('card-image');
            splitHand1Cards.appendChild(cardImage);
        });
        // 2番目のハンドを表示
        const splitHand2Cards = document.getElementById('split-hand-2-cards');
        splitHand2Cards.innerHTML = '';
        splitHand2.forEach((card, index) => {
            const cardImage = document.createElement('img');
            cardImage.src = `../../cards/${card.value}_${card.suit}.png`;
            cardImage.classList.add('card-image');
            splitHand2Cards.appendChild(cardImage);
        });
        // スコアの更新
        document.getElementById('split-hand-1-score').textContent = `Hand 1: ${calculateHandValue(splitHand1)}`;
        document.getElementById('split-hand-2-score').textContent = `Hand 2: ${calculateHandValue(splitHand2)}`;
        const hand1Value = calculateHandValue(splitHand1);
        const hand2Value = calculateHandValue(splitHand2);
        console.log(hand1Value);
        console.log(hand2Value);
         // ブラックジャック判定
         if(hand1Value === 21) {
            blackjack1 = true;
            switchToNextHand();
            if(hand2Value === 21) {
                blackjack2 = true;
                switchToNextHand();
            }
        } else {
            // 最初のハンドをアクティブに
            document.getElementById('split-hand-1').classList.add('active-hand');
            document.getElementById('split-hand-2').classList.remove('active-hand');
        }
    } else {
        document.getElementById('message').textContent = 'Split is not possible';
    }
});

function switchToNextHand() {
    if(maxBet >= currentBet){ document.getElementById('double_b').style.display = 'block';}
    splitnum = 2;
    if(currentSplitHand === 1) {
        // 最初のハンドが終了したら2番目のハンドへ
        currentSplitHand = 2;
        document.getElementById('hand-of-cards').textContent = 'hand2の行動選択';
        
        // ハンドの表示を切り替え
        document.getElementById('split-hand-1').classList.remove('active-hand');
        document.getElementById('split-hand-2').classList.add('active-hand');
        const hand2Value = calculateHandValue(splitHand2);
        if(hand2Value === 21) {
            switchToNextHand();
        }
    } else {
        // 2番目のハンドが終了したら通常モードに戻る
        isSplitMode = false;
        currentSplitHand = 1;
        document.getElementById('double_b').style.display = 'none';
        document.getElementById('hand-of-cards').textContent = '';
        // 最終的な判定処理
        resolveSplitHands();
    }
}

function resultdisplay(winner){
    document.getElementById('winner').textContent = winner;
}
function resolveSplitHands() {
    let result1 = '';
    let result2 = '';

    // 両方のハンドの結果を比較・判定
    const hand1Value = calculateHandValue(splitHand1);
    const hand2Value = calculateHandValue(splitHand2);
        
    // 最初の2枚目のカードをめくる
    document.getElementById('dealer-cards').removeChild(dealerHiddenCardElement);
    addCardToHand(dealerHand[1], 'dealer', 1);
        
    // この時点でディーラーの点数を更新
    document.getElementById('dealer-score').textContent = calculateHandValue(dealerHand);
                
    let dealerValue = calculateHandValue(dealerHand);
                
    // ディーラーのカードを最大5枚まで制限
    while(dealerValue < 17 && dealerHand.length < 5) {
        const card = drawCard();
        dealerHand.push(card);
        addCardToHand(card, 'dealer', dealerHand.length - 1);
        dealerValue = calculateHandValue(dealerHand);

        // 追加のカードを引くたびにスコアを更新
        document.getElementById('dealer-score').textContent = dealerValue;
    }

    const playerValue = calculateHandValue(playerHand);
    // メッセージ表示
    //document.getElementById('message').textContent = `Hand 1: ${hand1Value} (${result1}), Hand 2: ${hand2Value} (${result2})`;
    // bet処理
    determineGameOutcome(dealerValue, hand1Value, hand2Value, blackjack1, double1, blackjack2, double2)    // ゲーム終了処理

    gameOver = true;
    document.getElementById('score').textContent = dealerValue;
    document.getElementById('score1').textContent = hand1Value;
    document.getElementById('score2').parentElement.classList.remove('hidden');
    document.getElementById('score2').textContent = hand2Value;
    document.getElementById('result-overlay').style.display = 'block';
    reset();
    timeset();
}

// インシュランス
const insurance = document.getElementById('insurance_b').addEventListener('click', () => {
    if(dealerHand[0].value === '1' && !gameOver) {
        maxBet -= Math.floor(currentBet/2);
        document.getElementById('syozi').textContent = maxBet;
        insuranceAvailable = true;
        document.getElementById('insurance_b').style.display = 'none';
        document.getElementById('split_b').style.display = 'none';
        stand();
    } 
});
// サレンダー
const surrender = document.getElementById('surrender_b').addEventListener('click', () => {
    if(!gameOver) {
        gameOver = true;
        reset();
        surrender_bet();
        updateBetDisplay();
        document.getElementById('bets').style.display = 'block'
    }
    flag = false;
});

function determineGameOutcome(dealerValue, hand1Value, hand2Value, blackjack1, double1, blackjack2, double2) {
    fight1 = determineFight(dealerValue, hand1Value);
    draw1 = (hand1Value === dealerValue && hand1Value <= 21) ? true: false;
    fight2 = determineFight(dealerValue, hand2Value);
    draw2 = (hand2Value === dealerValue && hand2Value <= 21) ? true : false;

    // ハンドが21を超えた場合は敗北
    if (hand1Value > 21) {
        fight1 = false;
    }
    if (hand2Value > 21) {
        fight2 = false;
    }

    // 勝者の判定
    let winner = determineWinner(fight1, fight2);
    resultdisplay(winner);

    calculateWinnings(fight1, blackjack1, draw1, fight2, blackjack2, draw2, insuranceAvailable, Bet1, Bet2);
}

function determineWinner(fight1, fight2) {
    if (fight1 && !fight2) return 'Player Hand 1 win';
    if (!fight1 && fight2) return 'Player Hand 2 win';
    if (fight1 && fight2) return 'Both Hands win';
    return 'Dealer win';
}

function determineFight(dealer, player) {
    // バストした場合は負け
    /*if (handValue > 21){
        return false;
    } else {
        // 通常の比較
        let judge = handValue > dealerValue ? true : false;
        return judge;
    }*/

    let judge = (player > 21) ? false : (dealer > 21) ? true: (player > dealer) ? true : false;;
    return judge;
}
// セット処理
function reset() {
    // ボタンの表示・非表示
    document.getElementById('stand_b').style.display = 'none';
    document.getElementById('hit_b').style.display = 'none';
    document.getElementById('double_b').style.display = 'none';
    document.getElementById('surrender_b').style.display = 'none';
    document.getElementById('split_b').style.display = 'none';
    document.getElementById('insurance_b').style.display = 'none';
    document.getElementById('deal_b').style.display = 'block';
    document.getElementById('syozi').style.innerHTML = maxBet;
    gameOver = false;
    flag = true;
    splitnum = 2;
    isSplitMode = false;
    drawBet = 0;
}

function timeset() {
    setTimeout(() => {
        flag = false;
        /*document.getElementById('stand_b').style.display = 'none';
        document.getElementById('hit_b').style.display = 'none';
        document.getElementById('double_b').style.display = 'none';
        document.getElementById('surrender_b').style.display = 'none';
        document.getElementById('split_b').style.display = 'none';
        document.getElementById('insurance_b').style.display = 'none';
        document.getElementById('deal_b').style.display = 'block';*/
        document.getElementById('bets').style.display = 'block';
        updateBetDisplay();
    }, 1500);
}
