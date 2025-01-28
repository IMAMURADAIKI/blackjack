// DOM要素の取得 (キャッシュ)
const betAmountElement = document.getElementById('bet-amount');
const maxButton = document.getElementById('max');
const halfButton = document.getElementById('half');
const minButton = document.getElementById('min');
const addButton = document.getElementById('add');
const subtractButton = document.getElementById('subtract');
const syoziElement = document.getElementById('syozi');
const sumElement = document.getElementById('sum');
const alertOverlayElement = document.getElementById('alert-overlay');
const alertMessageElement = document.getElementById('alert-message');
const gameMenuBtn = document.getElementById('game-menu-btn');
const menuOverlay = document.getElementById('menu-overlay');
const resumeBtn = document.getElementById('resume-btn');
const rulesBtn = document.getElementById('rules-btn');
const titleBtn = document.getElementById('title-btn');
const rulesOverlay = document.getElementById('rules-overlay');
const closeRulesBtn = document.getElementById('close-rules-btn');
const resultOverlay = document.getElementById('result-overlay');
const resultContent = document.getElementById('result-content');
const playerHandTitle = document.querySelector('#player-hand h2');
const dealerCardsElement = document.getElementById('dealer-cards');
const playerCardsElement = document.getElementById('player-cards');
const messageElement = document.getElementById('message');
const splitHandsContainer = document.getElementById('split-hands-container');
const splitHand1ScoreElement = document.getElementById('split-hand-1-score');
const splitHand2ScoreElement = document.getElementById('split-hand-2-score');
const playerScoreElement = document.getElementById('player-score');
const dealerScoreElement = document.getElementById('dealer-score');
const score1Element = document.getElementById("score1");
const score2Element = document.getElementById("score2");
const scoreElement = document.getElementById("score");
const handOfCardsElement = document.getElementById('hand-of-cards');
const splitHand1Element = document.getElementById('split-hand-1');
const splitHand2Element = document.getElementById('split-hand-2');
const score2ParentElement = document.getElementById('score2').parentElement;
const dealButton = document.getElementById('deal_b');
const hitButton = document.getElementById('hit_b');
const doubleButton = document.getElementById('double_b');
const surrenderButton = document.getElementById('surrender_b');
const splitButton = document.getElementById('split_b');
const insuranceButton = document.getElementById('insurance_b');
const standButton = document.getElementById('stand_b');
const betsDisplay = document.getElementById('bets');

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
export const zunda6 = new Audio('../sounds/zunda6.wav');
export const zunda7 = new Audio('../sounds/zunda7.wav');
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
            resultOverlay.addEventListener('click', function(event) {
                // モーダルのコンテンツ部分以外をクリックした場合閉じる
                if (event.target === resultOverlay) {
                    resultOverlay.style.display = 'none';
                }
            });
            resultContent.addEventListener('click', function(event) {
                // モーダルのコンテンツ部分をクリックした場合閉じる
                if (event.target === resultContent) {
                    resultOverlay.style.display = 'none';
                }
            });
            // リザルトを閉じる
             alertOverlay.addEventListener('click', function(event) {
                // モーダルのコンテンツ部分以外をクリックした場合閉じる
                if (event.target === alertOverlay) {
                    alertOverlay.style.display = 'none';
                }
            });
        });