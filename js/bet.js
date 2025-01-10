// DOM要素の取得
let betAmount = document.getElementById('bet-amount');
let maxButton = document.getElementById('max');
let minButton = document.getElementById('min');
let addButton = document.getElementById('add');
let subtractButton = document.getElementById('subtract');

// 初期表示設定
document.getElementById('syozi').textContent = maxBet;

// イベントリスナーの設定
setupEventListeners();


// イベントリスナーをセットアップするメソッド
function setupEventListeners() {
    // 最大ボタン
    maxButton.addEventListener('click', () => {
        setMaxBet();
    });

    // 最小ボタン
    minButton.addEventListener('click', () => {
        setMinBet();
    });

    // 追加ボタン
    addButton.addEventListener('click', () => {
        incrementBet();
    });

    // 減算ボタン
    subtractButton.addEventListener('click', () => {
        decrementBet();
    });

    // チップのイベントリスナー
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const color = chip.classList[1];
            const value = chipValues[color];
            addBet(value);
        });
    });
}
// 最大ベットに設定
function setMaxBet() {
    currentBet = maxBet;
    updateBetDisplay();
}

// 最小ベットに設定
function setMinBet() {
    currentBet = minBet;
    updateBetDisplay();
}

// ベットを1増やす
function incrementBet() {
    if (currentBet < maxBet) {
        currentBet += 1;
        updateBetDisplay();
    }
}

// ベットを1減らす
function decrementBet() {
    if (currentBet > minBet) {
        currentBet -= 1;
        updateBetDisplay();
    }
}

// ベット額を増やす
function addBet(amount) {
    if (currentBet + amount <= maxBet) {
        currentBet += amount;
        updateBetDisplay();
    } else if(maxBet === 0) {
        alert('ベットコインが不足しています！')
    } else {
        alert('これ以上ベットできません！');
    }
}

// ベット額を画面に表示
function updateBetDisplay() {
    if(maxBet <= 0) {
        betAmount.value = 0;
    } else {
        betAmount.value = currentBet;
        let syozibet = maxBet - currentBet;
        if(syozibet >= 0){        
            document.getElementById('syozi').textContent = syozibet;    
        } else {
            currentBet = 0
            betAmount.value = 0;
            document.getElementById('syozi').textContent = maxBet;    
        }
    }
}

// 以下、勝敗によるベット処理
function hit_bet(){
    maxBet += currentBet * 2;
}

function double_bet(){
    maxBet += BetSum * 2;
}

function blackjack_bet(){
    maxBet += Math.floor(currentBet * 2.5);
}

function insurance_bet(){
    maxBet += currentBet;
}

function surrender_bet(){
    maxBet += Math.floor(currentBet/2);
}
