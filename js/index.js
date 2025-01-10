// ゲーム用の変数
let playerHand = [];
let dealerHand = [];
let deck = [];
let card = [];
let gameOver = false;
let flag = false;
let dealerHiddenCardElement = null;
// 勝敗とブラックジャックの結果用フラグ
let fight1 = false;
let blackjack1 = false;
let double1 = false;
let fight2 = false;
let blackjack2 = false;
let double2 = false;
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
    
        gameOver = false;
        flag = true;
        isSplitMode = false;
        splitnum = 2;
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
                document.getElementById('message').textContent = 'Bust! You lose!';
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
            // ディーラーのカードを最大5枚まで制限
            while (dealerValue < 17 && dealerHand.length < 5) {
                const card = drawCard();
                dealerHand.push(card);
                addCardToHand(card, 'dealer', dealerHand.length - 1);
                dealerValue = calculateHandValue(dealerHand);

                // 追加のカードを引くたびにスコアを更新
                document.getElementById('dealer-score').textContent = dealerValue;
            }
            const playerValue = calculateHandValue(playerHand);
            if(dealerValue > 21) {
                playerValue <= 21 ? document.getElementById('message').textContent = 'You win!' : document.getElementById('message').textContent = 'Dealer wins!';
                playerValue <= 21 ? fight1 = true : fight1 = false;
            } else if (playerValue > 21) {
                document.getElementById('message').textContent = 'Dealer wins!';
                fight1 = false;
            } else if (playerValue === dealerValue) {
                document.getElementById('message').textContent = 'Draw game';
            } else {
                playerValue > dealerValue ? document.getElementById('message').textContent = 'You win!' : document.getElementById('message').textContent = 'Dealer wins!';
                playerValue > dealerValue ? fight1 = true : fight1 = false;
            }
            gameOver = true;
            // bet処理
            if(double1 && fight1){
                if(blackjack1){
                    blackjack_bet();
                    blackjack_bet();   
                } else{
                    double_bet();
                }
            } else if(fight1 && !blackjack1){
                hit_bet();
            } else if(fight1 && blackjack1){
                blackjack_bet();
            }

            if(insuranceAvailable && fight1){
                insurance_bet();
            }

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
        BetSum += currentBet * 2;
        if(currentSplitHand === 1){
            double1 = true;
        } else if(currentSplitHand === 2){
            double2 = true;
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
            switchToNextHand();
            if(hand2Value === 21) {
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
                
    if(dealerValue > 21) {
        hand1Value <= 21 ? result1 = 'You win!' : result1 = 'Dealer wins!';
        hand1Value <= 21 ? fight1 = true : fight1 = false;
        hand2Value <= 21 ? result2 = 'You win!' : result2 = 'Dealer wins!';
        hand2Value <= 21 ? fight2 = true : fight2 = false;
    } else {
        hand1Value > dealerValue ? result1 = 'You win!' : result1 = 'Dealer wins!';
        hand1Value > dealerValue ? fight1 = true : fight1 = false;
        hand2Value > dealerValue ? result2 = 'You win!' : result2 = 'Dealer wins!';
        hand2Value > dealerValue ? fight2 = true : fight2 = false;
        if (hand1Value === dealerValue) {
            result1 = 'Draw game';
        }
        if (hand2Value === dealerValue) {
            result2 = 'Draw game';
        }        
    }
    if(hand1Value > 21) {
        result1 = 'Dealer wins!'
        fight1 = 'false';
    }
    if(hand2Value > 21) {
        result2 = 'Dealer wins!'
        fight2 = 'false';
    }
    // メッセージ表示
    document.getElementById('message').textContent = `Hand 1: ${hand1Value} (${result1}), Hand 2: ${hand2Value} (${result2})`;
    // bet処理
    if(double1 && fight1){
        if(blackjack1){
            blackjack_bet();
            blackjack_bet();   
        } else{
            double_bet();
        }
    } else if(fight1 && !blackjack1){
        hit_bet();
    } else if(fight1 && blackjack1){
        blackjack_bet();
    }

    if(double2 && fight2){
        if(blackjack2){
            blackjack_bet();
            blackjack_bet();   
        } else{
            double_bet();
        }
    } else if(fight2 && !blackjack2){
        hit_bet();
    } else if(fight2 && blackjack2){
        blackjack_bet();
    }

    if(insuranceAvailable && fight1){
        insurance_bet();
    }
    // ゲーム終了処理
    gameOver = true;
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
    splitdouble1 = false;
    splitdouble2 = false;
    fight1 = false;
    fight2 = false;
    blackjack1 = false;
    blackjack2 = false;
    double1 = false;
    double2 = false;
    BetSum = 0;
}

function timeset() {
    setTimeout(() => {
        flag = false;
        document.getElementById('stand_b').style.display = 'none';
        document.getElementById('hit_b').style.display = 'none';
        document.getElementById('double_b').style.display = 'none';
        document.getElementById('surrender_b').style.display = 'none';
        document.getElementById('split_b').style.display = 'none';
        document.getElementById('insurance_b').style.display = 'none';
        document.getElementById('deal_b').style.display = 'block';
        document.getElementById('bets').style.display = 'block';
        updateBetDisplay();
    }, 1500);
}
