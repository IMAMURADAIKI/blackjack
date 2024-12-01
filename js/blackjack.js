'use strict';

class BlackjackGame {
    constructor() {
        this.playerHand = [];
        this.dealerHand = [];
        this.deck = [];
        this.card = [];
        this.gameOver = false;
        this.flag = false;
        this.dealerHiddenCardElement = null;
        // 勝ち負け・ブラックジャックの結果用のフラグ
        this.fight1 = false;
        this.fight2 = false;
        this.blackjack1 = false;
        this.blackjack2 = false;
        // スプリット用のフラグ
        this.canSplit = false;
        this.splitHand1 = [];
        this.splitHand2 = [];
        this.splitnum = 2;
        this.currentSplitHand = 1; // 現在プレイ中のハンド
        this.isSplitMode = false;
        // インシュランス用のフラグ
        this.insuranceAvailable = false;
        // bet用のフラグ
        this.bet_hit1 = false; // 基本的にこちらを使用する
        this.bet_hit2 = false; // スプリット用に二つ用意
        this.bet_double1 = false; // 基本的にこちらを使用する
        this.bet_double2 = false; // スプリット用に二つ用意
        this.bet_insurance = false;
        this.bet_split = false;
        this.bet_surrender = false;
    }

    createDeck() {
        const suits = ['heart', 'diamond', 'club', 'spade'];
        const values = ['1','2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
                
        this.deck = suits.flatMap(suit => 
            values.map(value => ({ suit, value }))
        );
                
        // デッキをシャッフル
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    drawCard() {
        return this.deck.pop();
    }

    getCardValue(card) {
        return card.value === '1' ? 11 : ['11', '12', '13'].includes(card.value) ? 10 : parseInt(card.value);
    }

    calculateHandValue(hand) {
        let total = 0;
        let aces = hand.filter(card => card.value === '1').length;

        total = hand.reduce((sum, card) => sum + this.getCardValue(card), 0);

        // エースを1として数えるかの調整
        while (total > 21 && aces > 0) {
            total -= 10;
            aces -= 1;
        }

        return total;
    }

    addCardToHand(card, hand, index = 0) {
        const cardImage = document.createElement('img');
        cardImage.src = `../../cards/${card.value}_${card.suit}.png`;
        cardImage.classList.add('card-image');
        cardImage.style.animationDelay = `${index * 0.2}s`;
        cardImage.classList.add('deal-animation');
                
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

    updateScores() {
        // スプリットモード時のスコア更新
        if (this.isSplitMode) {
            document.getElementById('split-hand-1-score').textContent = 
                `Hand 1: ${this.calculateHandValue(this.splitHand1)}`;
            document.getElementById('split-hand-2-score').textContent = 
                `Hand 2: ${this.calculateHandValue(this.splitHand2)}`;
        } else {
            document.getElementById('player-score').textContent = this.calculateHandValue(this.playerHand);
            
            // ゲーム開始時は空白のまま
            if (!this.gameOver) {
                document.getElementById('dealer-score').textContent = '';
            }
        }
    }

    dealInitialCards() {
        this.playerHand = [this.drawCard(), this.drawCard()];
        this.dealerHand = [this.drawCard(), this.drawCard()];
               
        this.playerHand.forEach((card, index) => {
            this.addCardToHand(card, 'player', index);
        });
                
        this.addCardToHand(this.dealerHand[0], 'dealer', 0);
                
        this.dealerHiddenCardElement = document.createElement('img');
        this.dealerHiddenCardElement.src = '../../cards/back.png';
        this.dealerHiddenCardElement.classList.add('card-image', 'hidden-card');
        document.getElementById('dealer-cards').appendChild(this.dealerHiddenCardElement);
                
        this.updateScores();
        if(this.dealerHand[0].value === '1') {
            document.getElementById('insurance_b').style.display = 'block';
        }

        if (this.calculateHandValue(this.playerHand) === 21) {
            document.getElementById('message').textContent = 'Blackjack! Checking Dealer...';
            this.stand();
        }
    }

    startGame() {
        if (this.flag) return;

            if(bet.currentBet >= 1) {
                document.querySelector('#player-hand h2').style.display = 'block';

                document.getElementById('dealer-cards').innerHTML = '';
                document.getElementById('player-cards').innerHTML = '';
                document.getElementById('message').textContent = '';
                document.getElementById('hit_b').style.display = 'block';
                document.getElementById('double_b').style.display = 'block';
                document.getElementById('surrender_b').style.display = 'block';
                document.getElementById('split_b').style.display = 'none';
                document.getElementById('insurance_b').style.display = 'none';
                document.getElementById('deal_b').style.display = 'none';
                document.getElementById('stand_b').style.display = 'block';
                document.getElementById('bets').style.display = 'none';
                // UIをリセット
                document.getElementById('split-hands-container').style.display = 'none';
                document.getElementById('player-cards').style.display = 'block';
                
                this.gameOver = false;
                this.flag = true;
                this.bet_hit1 = false;
                this.bet_hit2 = false;
                this.bet_double1 = false;
                this.bet_double2 = false;
                this.bet_insurance = false;
                this.bet_split = false;
                this.bet_surrender = false;        
                this.splitnum = 2;
                this.createDeck();
                this.dealInitialCards();
                if((this.playerHand[0].value === this.playerHand[1].value) || (['10', '11', '12', '13'].includes(this.playerHand[0].value) && 
                ['10', '11', '12', '13'].includes(this.playerHand[1].value))){
                    document.getElementById('split_b').style.display = 'block';
                }

            } else {
                alert("ベットされていないため、ゲームをスタートできません。");
            }    
        
    }

    reset() {
        // ボタンの表示・非表示
        document.getElementById('stand_b').style.display = 'none';
        document.getElementById('hit_b').style.display = 'none';
        document.getElementById('double_b').style.display = 'none';
        document.getElementById('surrender_b').style.display = 'none';
        document.getElementById('split_b').style.display = 'none';
        document.getElementById('insurance_b').style.display = 'none';
        document.getElementById('deal_b').style.display = 'block';
        document.getElementById('syozi').style.innerHTML = bet.maxBet;
    }

    timeset() {
        setTimeout(() => {
            this.flag = false;
            document.getElementById('stand_b').style.display = 'none';
            document.getElementById('hit_b').style.display = 'none';
            document.getElementById('double_b').style.display = 'none';
            document.getElementById('surrender_b').style.display = 'none';
            document.getElementById('split_b').style.display = 'none';
            document.getElementById('insurance_b').style.display = 'none';
            document.getElementById('deal_b').style.display = 'block';
            document.getElementById('bets').style.display = 'block';
            document.getElementById('syozi').style.innerHTML = bet.maxBet;
        }, 1500);
    }

    hit() {
        if (this.gameOver) return;

        document.getElementById('double_b').style.display = 'none';
        document.getElementById('split_b').style.display = 'none';
        document.getElementById('insurance_b').style.display = 'none';
        document.getElementById('surrender_b').style.display = 'none';

        if (this.isSplitMode) {
            // スプリットモード時のヒット処理
            const currentHand = this.currentSplitHand === 1 ? this.splitHand1 : this.splitHand2;
            const targetCardsElement = this.currentSplitHand === 1 ? 
                document.getElementById('split-hand-1-cards') : 
                document.getElementById('split-hand-2-cards');

            const targetCardsElement2 = this.currentSplitHand === 1 ? 
                this.bet_hit1 = true: 
                this.bet_hit2 = true;

            this.bet_split = true;

            if(this.splitnum < 5) {
                // カードを追加
                this.card = this.drawCard();
                currentHand.push(this.card);
                this.splitnum += 1;
            }
    
            // カードを表示
            const cardImage = document.createElement('img');
            cardImage.src = `../../cards/${this.card.value}_${this.card.suit}.png`;
            cardImage.classList.add('card-image');
            targetCardsElement.appendChild(cardImage);
    
            // スコアを更新
            document.getElementById(`split-hand-${this.currentSplitHand}-score`).textContent = 
                `Hand ${this.currentSplitHand}: ${this.calculateHandValue(currentHand)}`;
    
            // スコア計算と変数への代入
            const handValue = this.calculateHandValue(currentHand);
    
            // バスト判定またはブラックジャック判定
            if (handValue > 21 || handValue === 21 || this.splitnum === 5) {
                this.switchToNextHand();
            } else if((this.currentSplitHand === 1 && this.bet_double1 === true) || (this.currentSplitHand === 2 && this.bet_double2 === true)) {
                this.switchToNextHand();
            }

        } else {
            // 通常のヒット処理
            if(this.playerHand.length < 5) {
                const card = this.drawCard();
                this.playerHand.push(card);
                this.addCardToHand(card, 'player', this.playerHand.length - 1);
                
                const playerValue = this.calculateHandValue(this.playerHand);
                this.updateScores();
                
                if (playerValue > 21) {
                    document.getElementById('message').textContent = 'Bust! You lose!';
                    this.stand();
                    this.gameOver = true;
                }
    
                if (this.calculateHandValue(this.playerHand) === 21) {
                    document.getElementById('message').textContent = 'Blackjack! Checking Dealer...';
                    this.blackjack1 = 'true';
                    this.stand();
                }    
            }
            if(this.playerHand.length === 5) {
                this.stand();
            }
        }
    }
    
    stand() {
        if (this.gameOver) return;
    
        if (this.isSplitMode) {
            // スプリットモード時の処理
            this.switchToNextHand();
        } else {
            // 通常のスタンド処理
            setTimeout(() => {    
                // 最初の2枚目のカードをめくる
                document.getElementById('dealer-cards').removeChild(this.dealerHiddenCardElement);
                this.addCardToHand(this.dealerHand[1], 'dealer', 1);
                
                // この時点でディーラーの点数を更新
                document.getElementById('dealer-score').textContent = this.calculateHandValue(this.dealerHand);
                        
                let dealerValue = this.calculateHandValue(this.dealerHand);
                        
                // ディーラーのカードを最大5枚まで制限
                while (dealerValue < 17 && this.dealerHand.length < 5) {
                    const card = this.drawCard();
                    this.dealerHand.push(card);
                    this.addCardToHand(card, 'dealer', this.dealerHand.length - 1);
                    dealerValue = this.calculateHandValue(this.dealerHand);
    
                    // 追加のカードを引くたびにスコアを更新
                    document.getElementById('dealer-score').textContent = dealerValue;
                }
    
                const playerValue = this.calculateHandValue(this.playerHand);
                        
                if(dealerValue > 21) {
                    playerValue <= 21 ? 
                        document.getElementById('message').textContent = 'You win!': 
                        document.getElementById('message').textContent = 'Dealer wins!';
                    playerValue <= 21 ? 
                        this.fight1 = 'true':
                        this.fight1 = 'false';
                } else if (playerValue > 21) {
                    document.getElementById('message').textContent = 'Dealer wins!';
                    this.fight1 = 'false';
                } else if (playerValue === dealerValue) {
                    document.getElementById('message').textContent = 'Draw game';
                } else {
                    playerValue > dealerValue ? 
                        document.getElementById('message').textContent = 'You win!' : 
                        document.getElementById('message').textContent = 'Dealer wins!';
                    playerValue > dealerValue ? 
                    this.fight1 = 'true':
                    this.fight1 = 'false';
                }
    
                this.gameOver = true;
                this.blackjack1 = 'false';

            }, 1000);
    
            this.reset();
            this.timeset();
        }
    }


    doubledraw(){
        if (this.gameOver) return;

        document.getElementById('insurance_b').style.display = 'none';
        if (this.isSplitMode) {
            if (this.currentSplitHand === 1) {
                this.bet_double1 = true;
            } else if (this.currentSplitHand === 2) {
                this.bet_double2 = true;
            }    
        }

        this.hit();
        if (!this.isSplitMode) {
            this.stand();
        }
    }
    // スプリット機能
    split() {
        if (this.gameOver) return;

        // スプリット可能かどうかの条件
        const isSpilitPossible = 
            this.playerHand.length === 2 && 
            (
                (this.playerHand[0].value === this.playerHand[1].value) || 
                (['10', '11', '12', '13'].includes(this.playerHand[0].value) && 
                 ['10', '11', '12', '13'].includes(this.playerHand[1].value))
            );
    
        if (isSpilitPossible) {
            // スプリットモードを有効化
            this.isSplitMode = true;
            this.currentSplitHand = 1;

            document.getElementById('split_b').style.display = 'none';
            document.getElementById('insurance_b').style.display = 'none';
            document.getElementById('surrender_b').style.display = 'none';
            document.querySelector('#player-hand h2').style.display = 'none';
            document.getElementById('hand-of-cards').textContent = 'hand1の行動選択';

    
            // プレイヤーの最初のハンドを二つに分割
            this.splitHand1 = [this.playerHand[0]];
            this.splitHand2 = [this.playerHand[1]];
    
            // 各ハンドに新しいカードを追加
            this.splitHand1.push(this.drawCard());
            this.splitHand2.push(this.drawCard());

            // プレイヤーカードの表示を完全にリセット
            const playerCardsElement = document.getElementById('player-cards');
            playerCardsElement.innerHTML = '';
    
            // スプリットハンズコンテナを表示
            const splitHandsContainer = document.getElementById('split-hands-container');
            splitHandsContainer.style.display = 'flex';
    
            // 最初のハンドを表示
            const splitHand1Cards = document.getElementById('split-hand-1-cards');
            splitHand1Cards.innerHTML = '';
            this.splitHand1.forEach((card, index) => {
                const cardImage = document.createElement('img');
                cardImage.src = `../../cards/${card.value}_${card.suit}.png`;
                cardImage.classList.add('card-image');
                splitHand1Cards.appendChild(cardImage);
            });
    
            // 2番目のハンドを表示
            const splitHand2Cards = document.getElementById('split-hand-2-cards');
            splitHand2Cards.innerHTML = '';
            this.splitHand2.forEach((card, index) => {
                const cardImage = document.createElement('img');
                cardImage.src = `../../cards/${card.value}_${card.suit}.png`;
                cardImage.classList.add('card-image');
                splitHand2Cards.appendChild(cardImage);
            });
    
            // スコアの更新
            document.getElementById('split-hand-1-score').textContent = 
                `Hand 1: ${this.calculateHandValue(this.splitHand1)}`;
            document.getElementById('split-hand-2-score').textContent = 
                `Hand 2: ${this.calculateHandValue(this.splitHand2)}`;
            
            const hand1Value = this.calculateHandValue(this.splitHand1);
            const hand2Value = this.calculateHandValue(this.splitHand2);

            console.log(hand1Value);
            console.log(hand2Value);
             // ブラックジャック判定
             if(hand1Value === 21) {
                this.switchToNextHand();
                if(hand2Value === 21) {
                    this.switchToNextHand();
                }
            } else {
                // 最初のハンドをアクティブに
                document.getElementById('split-hand-1').classList.add('active-hand');
                document.getElementById('split-hand-2').classList.remove('active-hand');
            }
        
            // ベット処理

        } else {
            document.getElementById('message').textContent = 'Split is not possible';
        }
    }
    
    switchToNextHand() {
        document.getElementById('double_b').style.display = 'block';
        this.splitnum = 2;
        if (this.currentSplitHand === 1) {
            // 最初のハンドが終了したら2番目のハンドへ
            this.currentSplitHand = 2;
            document.getElementById('hand-of-cards').textContent = 'hand2の行動選択';
            
            // ハンドの表示を切り替え
            document.getElementById('split-hand-1').classList.remove('active-hand');
            document.getElementById('split-hand-2').classList.add('active-hand');
            const hand2Value = this.calculateHandValue(this.splitHand2);
            if(hand2Value === 21) {
                this.switchToNextHand();
            }
        } else {
            // 2番目のハンドが終了したら通常モードに戻る
            this.isSplitMode = false;
            this.currentSplitHand = 1;
            document.getElementById('double_b').style.display = 'none';
            document.getElementById('hand-of-cards').textContent = '';
    
            // 最終的な判定処理
            this.resolveSplitHands();
        }
    }
    
    resolveSplitHands() {
        let result1 = '';
        let result2 = '';
    
        // 両方のハンドの結果を比較・判定
        const hand1Value = this.calculateHandValue(this.splitHand1);
        const hand2Value = this.calculateHandValue(this.splitHand2);
    
        // 勝敗判定のロジック
        
        // 最初の2枚目のカードをめくる
        document.getElementById('dealer-cards').removeChild(this.dealerHiddenCardElement);
        this.addCardToHand(this.dealerHand[1], 'dealer', 1);
            
        // この時点でディーラーの点数を更新
        document.getElementById('dealer-score').textContent = this.calculateHandValue(this.dealerHand);
                    
        let dealerValue = this.calculateHandValue(this.dealerHand);
                    
        // ディーラーのカードを最大5枚まで制限
        while (dealerValue < 17 && this.dealerHand.length < 5) {
            const card = this.drawCard();
            this.dealerHand.push(card);
            this.addCardToHand(card, 'dealer', this.dealerHand.length - 1);
            dealerValue = this.calculateHandValue(this.dealerHand);

            // 追加のカードを引くたびにスコアを更新
            document.getElementById('dealer-score').textContent = dealerValue;
        }

        const playerValue = this.calculateHandValue(this.playerHand);
                    
        if(dealerValue > 21) {
            hand1Value <= 21 ? 
                result1 = 'You win!':
                result1 = 'Dealer wins!';
            hand1Value <= 21 ? 
                //勝ち負けのデータ管理　現在強制敗北設定
                this.fight1 = 'true':
                this.fight1 = 'false';
            hand2Value <= 21 ? 
                result2 = 'You win!':
                result2 = 'Dealer wins!';
            hand2Value <= 21 ? 
                //勝ち負けのデータ管理　現在強制敗北設定
                this.fight2 = 'true':
                this.fight2 = 'false';
        } else {
            hand1Value > dealerValue ? 
                result1 = 'You win!':
                result1 = 'Dealer wins!';
            hand1Value > dealerValue ? 
                this.fight1 = 'true':
                this.fight1 = 'false';
            hand2Value > dealerValue ? 
                result2 = 'You win!':
                result2 = 'Dealer wins!';
            hand2Value > dealerValue ? 
                this.fight2 = 'true':
                this.fight2 = 'false';
            if (hand1Value === dealerValue) {
                result1 = 'Draw game';
            }
            if (hand2Value === dealerValue) {
                result2 = 'Draw game';
            }        
        }
        if (hand1Value > 21) {
            result1 = 'Dealer wins!'
            this.fight1 = 'false';
        }
        if (hand2Value > 21) {
            result2 = 'Dealer wins!'
            this.fight2 = 'false';
        }

    
        // メッセージ表示
        document.getElementById('message').textContent = `Hand 1: ${hand1Value} (${result1}), Hand 2: ${hand2Value} (${result2})`;
    
        // ゲーム終了処理
        this.gameOver = true;

        this.reset();
        this.timeset();
    
        // 勝敗に応じたベット処理（実際の実装は要件に応じて変更）
        if (result1 === 'You win!') {
            // hit?
        }

        if (result2 === 'You win!') {
            // hit?
        }

    }
        
    // インシュランス機能
    insurance() {
        if (this.dealerHand[0].value === '1' && !this.gameOver) {
            this.insuranceAvailable = true;
            document.getElementById('insurance_b').style.display = 'none';
            //  ここにベット処理を追加
        }
    }

    // サレンダー機能
    surrender() {
        if (!this.gameOver) {
            document.getElementById('message').textContent = 'Surrendered!';
            this.gameOver = true;

            this.reset();
        }
        this.flag = false;
    }
}

class Betprogram {
    constructor(maxBet = 10000, minBet = 0) {
        // DOM要素の取得
        this.betAmount = document.getElementById('bet-amount');
        this.maxButton = document.getElementById('max');
        this.minButton = document.getElementById('min');
        this.addButton = document.getElementById('add');
        this.subtractButton = document.getElementById('subtract');

        // チップの値を定義
        this.chipValues = {
            green: 1,
            yellow: 10,
            blue: 50,
            black: 100,
            red: 500,
            purple: 1000,
            orange: 5000,
            pink: 10000
        };

        // ベット関連の初期設定
        this.currentBet = 0;
        this.maxBet = maxBet;
        this.minBet = minBet;

        // 初期表示設定
        document.getElementById('syozi').textContent = this.maxBet;

        // イベントリスナーの設定
        this.setupEventListeners();
    }

    // イベントリスナーをセットアップするメソッド
    setupEventListeners() {
        // 最大ボタン
        this.maxButton.addEventListener('click', () => {
            this.setMaxBet();
        });

        // 最小ボタン
        this.minButton.addEventListener('click', () => {
            this.setMinBet();
        });

        // 追加ボタン
        this.addButton.addEventListener('click', () => {
            this.incrementBet();
        });

        // 減算ボタン
        this.subtractButton.addEventListener('click', () => {
            this.decrementBet();
        });

        // チップのイベントリスナー
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const color = chip.classList[1];
                const value = this.chipValues[color];
                this.addBet(value);
            });
        });
    }

    // 最大ベットに設定
    setMaxBet() {
        this.currentBet = this.maxBet;
        this.updateBetDisplay();
    }

    // 最小ベットに設定
    setMinBet() {
        this.currentBet = this.minBet;
        this.updateBetDisplay();
    }

    // ベットを1増やす
    incrementBet() {
        if (this.currentBet < this.maxBet) {
            this.currentBet += 1;
            this.updateBetDisplay();
        }
    }

    // ベットを1減らす
    decrementBet() {
        if (this.currentBet > this.minBet) {
            this.currentBet -= 1;
            this.updateBetDisplay();
        }
    }

    // ベット額を増やす
    addBet(amount) {
        if (this.currentBet + amount <= this.maxBet) {
            this.currentBet += amount;
            this.updateBetDisplay();
        } else {
            alert('これ以上ベットできません！');
        }
    }

    // ベット額を画面に表示
    updateBetDisplay() {
        this.betAmount.value = this.currentBet;
        document.getElementById('syozi').textContent = this.maxBet - this.currentBet;
    }

    // 現在のベット額を取得
    getCurrentBet() {
        return this.currentBet;
    }
}

// インスタンスを作成
const blackjackGame = new BlackjackGame();
const bet = new Betprogram();
