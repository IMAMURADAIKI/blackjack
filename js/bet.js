// DOM要素の取得
let betAmount = document.getElementById('bet-amount');
let maxButton = document.getElementById('max');
let halfButton = document.getElementById('half');
let minButton = document.getElementById('min');
let addButton = document.getElementById('add');
let subtractButton = document.getElementById('subtract');
let customBetButton = document.getElementById('set-custom-bet');

// 初期表示設定
document.getElementById('syozi').textContent = maxBet;

// イベントリスナーの設定
setupEventListeners();

// イベントリスナーをセットアップするメソッド
function setupEventListeners() {
    const actions = {
        'max': setMaxBet,
        'half': setHalfBet,
        'min': setMinBet,
        'add': incrementBet,
        'subtract': decrementBet,
        'set-custom-bet': setCustomBet
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

// ベットステップを取得する関数
function getBetStep(currentMaxBet) {
    return betSteps.find(step => currentMaxBet <= step.max).step;
}

// 最大ベットに設定
function setMaxBet() {
    currentBet = maxBet;
    updateBetDisplay();
}

// Half Betを設定する関数
function setHalfBet() {
    currentBet = Math.floor(maxBet / 2);
    updateBetDisplay();
}

// 最小ベットに設定
function setMinBet() {
    currentBet = minBet;
    updateBetDisplay();
}

// カスタムベットを設定する関数
function setCustomBet() {
    const customBetInput = document.getElementById('custom-bet');
    const customBetValue = parseInt(customBetInput.value);

    if (!isNaN(customBetValue) && customBetValue >= minBet && customBetValue <= maxBet) {
        currentBet = customBetValue;
        updateBetDisplay();
    } else {
        zunda8.play();
        showErrorMessage('無効なベット額なのだ');
    }
}

// ベットを1増やす（ステップに応じて）
function incrementBet() {
    const step = getBetStep(maxBet);
    if (currentBet + step <= maxBet) {
        currentBet += step;
        updateBetDisplay();
    }
}

// ベットを1減らす（ステップに応じて）
function decrementBet() {
    const step = getBetStep(maxBet);
    if (currentBet - step >= minBet) {
        currentBet -= step;
        updateBetDisplay();
    }
}

// ベット額を増やす
function addBet(amount) {
    const step = getBetStep(maxBet);
    const adjustedAmount = Math.floor(amount / step) * step;

    if (currentBet + adjustedAmount <= maxBet) {
        currentBet += adjustedAmount;
        updateBetDisplay();
    } else {
        if(maxBet === 0){
            zunda6.play();
            showErrorMessage('お金がないから、かけることができないのだ');
        } else {
            zunda7.play();
            showErrorMessage('これ以上かけることができないのだ');
        }
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

// エラーメッセージ表示関数
function showErrorMessage(message) {
    // アラートオーバーレイ
    const alertOverlay = document.getElementById('alert-overlay');
    const alertMessage = document.getElementById('alert-message');
    
    alertMessage.textContent = message;
    alertOverlay.style.display = 'block';
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

    if(totalWinnings > 0){
        sound3.play();
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
