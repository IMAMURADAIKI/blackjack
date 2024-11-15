'use strict';

class BlackjackGame {
    constructor() {
        this.playerHand = [];
        this.dealerHand = [];
        this.deck = [];
        this.gameOver = false;
        this.dealerHiddenCardElement = null;
        this.fight1 = false;
        this.fight2 = false;
        this.blackjack1 = false;
        this.blackjack2 = false;
        this.canSplit = false;
        this.splitHand1 = [];
        this.splitHand2 = [];
        this.insuranceAvailable = false;
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
        cardImage.src = `github.io/cards/${card.value}_${card.suit}.png`;
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
        document.getElementById('player-score').textContent = this.calculateHandValue(this.playerHand);
        if (this.gameOver) {
            document.getElementById('dealer-score').textContent = this.calculateHandValue(this.dealerHand);
        } else {
            document.getElementById('dealer-score').textContent = '';
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
        this.dealerHiddenCardElement.src = '../cards/back.png';
        this.dealerHiddenCardElement.classList.add('card-image', 'hidden-card');
        document.getElementById('dealer-cards').appendChild(this.dealerHiddenCardElement);
                
        this.updateScores();

        if (this.calculateHandValue(this.playerHand) === 21) {
            document.getElementById('message').textContent = 'Blackjack! Checking Dealer...';
            this.stand();
        }
    }

    startGame() {
        document.getElementById('game-area').style.display = 'block';
        document.getElementById('bet-area').style.display = 'none';
        document.getElementById('dealer-cards').innerHTML = '';
        document.getElementById('player-cards').innerHTML = '';
        document.getElementById('message').textContent = '';
        document.getElementById('double_b').style.display = 'block';
                
        this.gameOver = false;
        this.createDeck();
        this.dealInitialCards();
    }

    hit() {
        if (this.gameOver) return;
        document.getElementById('double_b').style.display = 'none';
                
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

    stand() {
        if (this.gameOver) return;

        setTimeout(() => {
            document.getElementById('dealer-cards').removeChild(this.dealerHiddenCardElement);
            this.addCardToHand(this.dealerHand[1], 'dealer', 1);
                    
            let dealerValue = this.calculateHandValue(this.dealerHand);
                    
            while (dealerValue < 17) {
                const card = this.drawCard();
                this.dealerHand.push(card);
                this.addCardToHand(card, 'dealer', this.dealerHand.length - 1);
                dealerValue = this.calculateHandValue(this.dealerHand);
            }

            this.updateScores();
                    
            const playerValue = this.calculateHandValue(this.playerHand);
                    
            if(dealerValue > 21) {
                playerValue <= 21 ? 
                    document.getElementById('message').textContent = 'You win!': 
                    document.getElementById('message').textContent = 'Dealer wins!';
                playerValue <= 21 ? 
                    this.fight1 = 'true':
                    this.fight1 = 'false';
                hit_bet(this.fight1, this.blackjack1);
            } else if (playerValue > 21) {
                document.getElementById('message').textContent = 'Dealer wins!';
                this.fight1 = 'false';
                hit_bet(this.fight1, this.blackjack1);
            } else if (playerValue === dealerValue) {
                document.getElementById('message').textContent = 'Draw game';
                draw_bet();
            } else {
                playerValue > dealerValue ? 
                    document.getElementById('message').textContent = 'You win!' : 
                    document.getElementById('message').textContent = 'Dealer wins!';
                playerValue > dealerValue ? 
                this.fight1 = 'true':
                this.fight1 = 'false';
                hit_bet(this.fight1, this.blackjack1);
            }

            this.gameOver = true;
            this.blackjack1 = 'false';
            this.updateScores();
        }, 1000);
    }

    doubledraw(){
        this.hit();
        if(!this.gameOver) {
            this.stand();
        }
    }
    // スプリット機能
    split() {
        if (this.playerHand.length === 2 && 
            this.playerHand[0].value === this.playerHand[1].value && 
            !this.gameOver) {
            
            this.canSplit = true;
            this.splitHand1 = [this.playerHand[0]];
            this.splitHand2 = [this.playerHand[1]];

            // 各ハンドに新しいカードを追加
            this.splitHand1.push(this.drawCard());
            this.splitHand2.push(this.drawCard());

            // 表示を更新
            document.getElementById('player-cards').innerHTML = '';
            this.splitHand1.forEach((card, index) => {
                this.addCardToHand(card, 'player', index);
            });
            this.splitHand2.forEach((card, index) => {
                this.addCardToHand(card, 'player', index + this.splitHand1.length);
            });

            // ベット処理
            split_bet();
        }
    }

    // インシュランス機能
    insurance() {
        if (this.dealerHand[0].value === '1' && !this.gameOver) {
            this.insuranceAvailable = true;
            insurance_bet(this.calculateHandValue(this.dealerHand) === 21);
        }
    }

    // サレンダー機能
    surrender() {
        if (!this.gameOver) {
            document.getElementById('message').textContent = 'Surrendered!';
            surrender();
            this.gameOver = true;
        }
    }
}

// ゲームのインスタンスを作成
const blackjackGame = new BlackjackGame();

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('hit_b').addEventListener('click', () => blackjackGame.hit());
    document.getElementById('stand_b').addEventListener('click', () => blackjackGame.stand());
    document.getElementById('double_b').addEventListener('click', () => blackjackGame.doubledraw());
    document.getElementById('newgame_b').addEventListener('click', () => blackjackGame.startGame());
});
