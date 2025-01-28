// index.js
// DOM要素の取得 (キャッシュ)
const betAmountElement = document.getElementById('bet-amount');
const maxButton = document.getElementById('max');
const halfButton = document.getElementById('half');
const minButton = document.getElementById('min');
const addButton = document.getElementById('add');
const subtractButton = document.getElementById('subtract');
export const syoziElement = document.getElementById('syozi');
export const sumElement = document.getElementById('sum');
export const alertOverlayElement = document.getElementById('alert-overlay');
export const alertMessageElement = document.getElementById('alert-message');
const gameMenuBtn = document.getElementById('game-menu-btn');
const menuOverlay = document.getElementById('menu-overlay');
const resumeBtn = document.getElementById('resume-btn');
const rulesBtn = document.getElementById('rules-btn');
const titleBtn = document.getElementById('title-btn');
const rulesOverlay = document.getElementById('rules-overlay');
const closeRulesBtn = document.getElementById('close-rules-btn');
const resultOverlay = document.getElementById('result-overlay');
const resultContent = document.getElementById('result-content');
export const playerHandTitle = document.querySelector('#player-hand h2');
export const dealerCardsElement = document.getElementById('dealer-cards');
export const playerCardsElement = document.getElementById('player-cards');
export const messageElement = document.getElementById('message');
export const splitHandsContainer = document.getElementById('split-hands-container');
export const splitHand1ScoreElement = document.getElementById('split-hand-1-score');
export const splitHand2ScoreElement = document.getElementById('split-hand-2-score');
export const playerScoreElement = document.getElementById('player-score');
export const dealerScoreElement = document.getElementById('dealer-score');
export const score1Element = document.getElementById("score1");
export const score2Element = document.getElementById("score2");
export const scoreElement = document.getElementById("score");
export const handOfCardsElement = document.getElementById('hand-of-cards');
export const splitHand1Element = document.getElementById('split-hand-1');
export const splitHand2Element = document.getElementById('split-hand-2');
export const score2ParentElement = document.getElementById('score2').parentElement;
export const dealButton = document.getElementById('deal_b');
export const hitButton = document.getElementById('hit_b');
export const doubleButton = document.getElementById('double_b');
export const surrenderButton = document.getElementById('surrender_b');
export const splitButton = document.getElementById('split_b');
export const insuranceButton = document.getElementById('insurance_b');
export const standButton = document.getElementById('stand_b');
export const betsDisplay = document.getElementById('bets');

// 音源の定義
export const sound0 = new Audio('../sounds/maou_bgm_acoustic11.mp3');
export const sound1 = new Audio('../sounds/card.mp3');
export const sound2 = new Audio('../sounds/put.mp3');
export const sound3 = new Audio('../sounds/result.mp3');
export const sound4 = new Audio('../sounds/shuffle.mp3');
export const zunda1 = new Audio('../sounds/zunda1.wav');
export const zunda2 = new Audio('../sounds/zunda2.wav');
export const zunda3 = new Audio('../sounds/zunda3.wav');
export const zunda4 = new Audio('../sounds/zunda4.wav');
export const zunda5 = new Audio('../sounds/zunda5.wav');
export const sound6 = new Audio('../sounds/zunda6.wav'); // sound6 を export
export const sound7 = new Audio('../sounds/zunda7.wav'); // sound7 を export
export const zunda8 = new Audio('../sounds/zunda8.wav');
// チップの値を定義
export const chipValues = {
    'red': 1,
    'yellow': 10,
    'blue': 50,
    'pink': 100,
    'orange': 500,
    'purple': 1000,
    'mediumturquoise': 5000,
    'yellowgreen': 10000,
    'black': 100000
};

// メニュー関連の追加スクリプト
document.addEventListener('DOMContentLoaded', () => {
    // メニューを開く
    gameMenuBtn.addEventListener('click', () => {
        menuOverlay.style.display = 'flex';
        pauseGame();
    });
    // メニューを閉じてゲームに戻る
    resumeBtn.addEventListener('click', () => {
        menuOverlay.style.display = 'none';
        resumeGame();
    });
    // ルール説明を表示
    rulesBtn.addEventListener('click', () => {
        rulesOverlay.style.display = 'flex';
    });
    // ルール説明を閉じる
    closeRulesBtn.addEventListener('click', () => {
        rulesOverlay.style.display = 'none';
    });
    // タイトル画面に戻る
    titleBtn.addEventListener('click', () => {
        // タイトル画面に遷移
        window.location.href = '../html/home.html';
    });
    // ゲーム一時停止関数
    function pauseGame() {
        // ゲームの進行を止める処理
        const gameButtons = document.querySelectorAll('.game_buttons button');
        gameButtons.forEach(button => {
            button.disabled = true;
        });
    }
    // ゲーム再開関数
    function resumeGame() {
        // ゲームボタンを再度有効化
        const gameButtons = document.querySelectorAll('.game_buttons button');
        gameButtons.forEach(button => {
            button.disabled = false;
        });
    }
    // リザルトを閉じる
    resultOverlay.addEventListener('click', function (event) {
        // モーダルのコンテンツ部分以外をクリックした場合閉じる
        if (event.target === resultOverlay) {
            resultOverlay.style.display = 'none';
        }
    });
    resultContent.addEventListener('click', function (event) {
        // モーダルのコンテンツ部分をクリックした場合閉じる
        if (event.target === resultContent) {
            resultOverlay.style.display = 'none';
        }
    });
    // アラートを閉じる
    alertOverlayElement.addEventListener('click', function (event) {
        // モーダルのコンテンツ部分以外をクリックした場合閉じる
        if (event.target === alertOverlayElement) {
           alertOverlayElement.style.display = 'none';
        }
    });
});
