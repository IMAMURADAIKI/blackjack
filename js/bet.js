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
    const actions = {
        'max': setMaxBet,
        'min': setMinBet,
        'add': incrementBet,
        'subtract': decrementBet
    };

    Object.keys(actions).forEach(id => {
        document.getElementById(id).addEventListener('click', actions[id]);
    });

    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const color = chip.classList[1];
            addBet(chipValues[color]);
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
        document.getElementById('alert-message').textContent = 'ベットコインが不足しています！';
        document.getElementById('alert-overlay').style.display = 'block';
    } else {
        document.getElementById('alert-message').textContent = 'これ以上ベットできません！';
        document.getElementById('alert-overlay').style.display = 'block';
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
// 関数の簡略化
function calculateHandWinnings(fight, blackjack, bet) {
    if (!fight) return 0;
    const magnification = blackjack ? 2.5 : 2;
    return Math.floor(bet * magnification);
}

// calculateWinningsの簡略化
function calculateWinnings(fight1, blackjack1, draw1, fight2, blackjack2, draw2, insurance, bet1, bet2) {
    console.log(draw1, draw2);
    let totalWinnings = 
        calculateHandWinnings(fight1, blackjack1, bet1) + 
        calculateHandWinnings(fight2, blackjack2, bet2) +
        draw(draw1, bet1) + draw(draw2 , bet2);

    if(!insurance){
        maxBet += totalWinnings;
    } else {
        maxBet += bet1;
        totalWinnings = bet1;
    }

    document.getElementById('sum').textContent = totalWinnings;
}

function draw(draw, bet){
    let ans = 0;
    //let ch = draw;
    //console.log(ch, bet);
    if(draw === true){
        ans = bet;
    }
    return ans;
}

function insurance_bet() {
    // ディーラーがブラックジャックの場合のみ返還
    return dealerHand[0].value === '1' && dealerHand[1].value === '10' ? currentBet : -Math.floor(currentBet/2);
}
function surrender_bet(){
    maxBet += Math.floor(currentBet/2);
}
