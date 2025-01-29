// 定数
const CHIP_VALUES = {
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
const HALF_BET_RATIO = 2;
const BLACKJACK_MAGNIFICATION = 2.5;
const WIN_MAGNIFICATION = 2;
const ERROR_MESSAGE_MAX_BET = 'これ以上かけることができないのだ';
const ERROR_MESSAGE_NO_MONEY = 'お金がないからかけることができないのだ';
const ALERT_OVERLAY = document.getElementById('alert-overlay');
const ALERT_MESSAGE = document.getElementById('alert-message');

// グローバル変数（このファイル内でのみ使用）
let currentBet = 0;
let maxBet = 10000; // 初期所持金
let minBet = 0;

// DOM要素の取得
const betAmountInput = document.getElementById('bet-amount');
const maxButton = document.getElementById('max');
const halfButton = document.getElementById('half');
const minButton = document.getElementById('min');
const addButton = document.getElementById('add');
const subtractButton = document.getElementById('subtract');
const syoziElement = document.getElementById('syozi');

// 初期表示設定
syoziElement.textContent = maxBet;

// チップのイベントリスナー
document.addEventListener('DOMContentLoaded', () => {
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
            const color = chip.classList[1];
            addBet(CHIP_VALUES[color]);
        });
    });
});

// 入力欄のイベントリスナー
betAmountInput.addEventListener('focus', function() {
    if (this.value === '0') {
        this.value = '';
    }
});

betAmountInput.addEventListener('input', () => {
    currentBet = parseBetAmount(betAmountInput.value);
    updateBetDisplay();
});
// 最大ベット
maxButton.addEventListener('click', () => {
  currentBet = maxBet;
  updateBetDisplay();
});
// 半分ベット
halfButton.addEventListener('click', () => {
  currentBet = Math.floor(maxBet / HALF_BET_RATIO);
  updateBetDisplay();
});
// 最小ベット
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

// 数値チェック
function parseBetAmount(value) {
    const num = Number(value);
    return isNaN(num) || num < 0 ? 0 : num;
}
// ベット額を追加
function addBet(amount) {
  if (currentBet + amount <= maxBet) {
        currentBet += amount;
        updateBetDisplay();
  } else if (maxBet === 0) {
        zunda6.play();
      showErrorMessage(ERROR_MESSAGE_NO_MONEY);
  } else {
        zunda7.play();
        showErrorMessage(ERROR_MESSAGE_MAX_BET);
    }
}
// ベット額を画面に表示
function updateBetDisplay() {
  if (maxBet <= 0) {
        betAmountInput.value = 0;
  } else {
        betAmountInput.value = currentBet;
        const remainingBalance = maxBet - currentBet;
        if(remainingBalance >= 0){
            syoziElement.textContent = remainingBalance;
        } else {
            currentBet = 0;
            betAmountInput.value = 0;
            syoziElement.textContent = maxBet;
        }
  }
}
// エラーメッセージ
function showErrorMessage(message) {
    ALERT_MESSAGE.textContent = message;
    ALERT_OVERLAY.style.display = 'block';
}

// 勝敗によるベット処理
// ハンドごとの勝利金額を計算
function calculateHandWinnings(fight, blackjack, bet) {
  if (!fight) return 0;
  const magnification = blackjack ? BLACKJACK_MAGNIFICATION : WIN_MAGNIFICATION;
  return Math.floor(bet * magnification);
}

// 引き分け時のベット額
function calculateDrawWinnings(draw, bet, bust) {
  if (draw && !bust) {
    return bet;
  }
  return 0;
}
// 全体の勝利金額を計算
function calculateWinnings(fight1, blackjack1, draw1, fight2, blackjack2, draw2, insurance, bet1, bet2, bust1, bust2) {
  let totalWinnings =
    calculateHandWinnings(fight1, blackjack1, bet1) +
    calculateHandWinnings(fight2, blackjack2, bet2) +
    calculateDrawWinnings(draw1, bet1, bust1) +
    calculateDrawWinnings(draw2, bet2, bust2);

    if(!insurance){
        maxBet += totalWinnings;
    } else {
        maxBet += bet1;
        totalWinnings = bet1;
    }

    if(totalWinnings > 0){
        sound3.play();
    }
  document.getElementById('sum').textContent = totalWinnings;
}

// インシュランス時のベット額
function calculateInsuranceBet() {
    return (dealerHand[0].value === '1' && dealerHand[1].value === '10') ? currentBet : -Math.floor(currentBet / 2);
}
// サレンダー時のベット額
function surrenderBet() {
    maxBet += Math.floor(currentBet / 2);
}
