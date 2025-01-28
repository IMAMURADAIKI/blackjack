// bet.js
import { chipValues, syoziElement, sumElement, alertOverlayElement, alertMessageElement, sound6, sound7, sound3 } from './index.js';
import { maxBet, currentBet } from './game.js'; // game.js から maxBet, currentBet を import

// DOM要素の取得 (キャッシュ)
const betAmountElement = document.getElementById('bet-amount');
const maxButton = document.getElementById('max');
const halfButton = document.getElementById('half');
const minButton = document.getElementById('min');
const addButton = document.getElementById('add');
const subtractButton = document.getElementById('subtract');

// 初期表示設定
syoziElement.textContent = maxBet;

// チップクリック時の処理
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const color = chip.classList[1];
        addBet(chipValues[color]);
    });
});

// ベット額入力時の処理
betAmountElement.addEventListener('click', () => {
    if (betAmountElement.value === '0') {
      betAmountElement.value = '';
    }
});

betAmountElement.addEventListener('input', () => {
    currentBet = Number(betAmountElement.value);
    updateBetDisplay();
});

// 最大ベット設定
maxButton.addEventListener('click', () => {
    currentBet = maxBet;
    updateBetDisplay();
});

// 半分ベット設定
halfButton.addEventListener('click', () => {
    currentBet = Math.floor(maxBet / 2);
    updateBetDisplay();
});

// 最小ベット設定
minButton.addEventListener('click', () => {
    currentBet = minBet;
    updateBetDisplay();
});

// ベットを1増やす
addButton.addEventListener('click', () => {
    if (currentBet < maxBet) {
        currentBet += 1;
        updateBetDisplay();
    }
});

// ベットを1減らす
subtractButton.addEventListener('click', () => {
    if (currentBet > minBet) {
        currentBet -= 1;
        updateBetDisplay();
    }
});

// ベット額を加算する関数
function addBet(amount) {
    if (currentBet + amount <= maxBet) {
        currentBet += amount; // const を削除
        updateBetDisplay();
    } else if (maxBet === 0) {
      sound6.play();
        showErrorMessage('お金がないからかけることができないのだ');
    } else {
      sound7.play();
        showErrorMessage('これ以上かけることができないのだ');
    }
}
// ベット額を画面に表示する関数
function updateBetDisplay() {
    if (maxBet <= 0) {
        betAmountElement.value = 0;
    } else {
        betAmountElement.value = currentBet;
      const syozibet = maxBet - currentBet;
        if (syozibet >= 0) {
            syoziElement.textContent = syozibet;
        } else {
            currentBet = 0;
            betAmountElement.value = 0;
          syoziElement.textContent = maxBet;
        }
    }
}

// エラーメッセージ表示関数
function showErrorMessage(message) {
    alertMessageElement.textContent = message;
    alertOverlayElement.style.display = 'block';
}

// ハンドごとの勝利金を計算する関数
function calculateHandWinnings(fight, blackjack, bet) {
    if (!fight) return 0;
    const magnification = blackjack ? 2.5 : 2;
    return Math.floor(bet * magnification);
}

// 勝敗によるベット処理を行う関数
function calculateWinnings(fight1, blackjack1, draw1, fight2, blackjack2, draw2, insurance, bet1, bet2, bust1, bust2) {
    let totalWinnings =
        calculateHandWinnings(fight1, blackjack1, bet1) +
        calculateHandWinnings(fight2, blackjack2, bet2) +
        calculateDrawWinnings(draw1, bet1, bust1) +
        calculateDrawWinnings(draw2, bet2, bust2);

    if (!insurance) {
        maxBet += totalWinnings;
    } else {
      maxBet += bet1;
      totalWinnings = bet1;
    }
    displayWinningSound(totalWinnings);
    sumElement.textContent = totalWinnings;
}

// 引き分け時の勝利金を計算する関数
function calculateDrawWinnings(draw, bet, bust) {
    return draw && !bust ? bet : 0;
}
function displayWinningSound(totalWinnings){
  if (totalWinnings > 0) {
    sound3.play();
  }
}
// インシュランス時のベット額を計算する関数
function insurance_bet() {
    // ディーラーがブラックジャックの場合のみ返還
    return dealerHand[0].value === '1' && dealerHand[1].value === '10' ? currentBet : -Math.floor(currentBet / 2);
}

// サレンダー時のベット額を計算する関数
function surrender_bet() {
    maxBet += Math.floor(currentBet / 2);
}
