'use strict';

// 画面表示を管理する関数
const DisplayManager = {
    showGame() {
        this.hideAll();
        document.getElementById('bet-area').style.display = 'block';
    },

    showRules() {
        this.hideAll();
        document.getElementById('rules').style.display = 'block';
    },

    backToTitle() {
        this.hideAll();
        document.getElementById('title').style.display = 'block';
    },

    hideAll() {
        ['title', 'rules', 'game-area'].forEach(id => {
            document.getElementById(id).style.display = 'none';
        });
    }
};

// イベントリスナーの設定（推奨）
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').addEventListener('click', () => DisplayManager.showGame());
    document.getElementById('rules-button').addEventListener('click', () => DisplayManager.showRules());
    document.getElementById('back-button').addEventListener('click', () => DisplayManager.backToTitle());
});
