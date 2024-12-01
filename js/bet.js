'use strict';

// betprogramをexport
export default class {
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
