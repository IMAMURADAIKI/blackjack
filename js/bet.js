// DOM要素の取得
let betAmount = document.getElementById('bet-amount');
let maxButton = document.getElementById('max');
let halfButton = document.getElementById('half');
let minButton = document.getElementById('min');
let addButton = document.getElementById('add');
let subtractButton = document.getElementById('subtract');
// 初期表示設定
document.getElementById('syozi').textContent = maxBet;

document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const color = chip.classList[1];
        addBet(chipValues[color]);
    });
});

// 入力された値を設定
betAmount.addEventListener('click', () => {
    if(this.value === '0'){
        this.value = '';
    }   
});

betAmount.addEventListener('input', () => {
    currentBet = +betAmount.value;
    updateBetDisplay();
});

// 最大ベットに設定
maxButton.addEventListener('click', () => {
    currentBet = maxBet;
    updateBetDisplay();
});

// 半分ベットに設定
halfButton.addEventListener('click', () => {
    currentBet = Math.floor(maxBet / 2);
    updateBetDisplay();
});

// 最小ベットに設定
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

// ベット額を増やす
function addBet(amount) {
    if (currentBet + amount <= maxBet) {
        currentBet += amount;
        updateBetDisplay();
    } else if(maxBet === 0) {
        zunda6.play();
        showErrorMessage('お金がないからかけることができないのだ');
        document.getElementById('alert-overlay').style.display = 'block';
    } else {
        zunda7.play();
        showErrorMessage('これ以上かけることができないのだ');
        document.getElementById('alert-overlay').style.display = 'block';
    }
}


// ベット額を画面に表示
function updateBetDisplay() {
    if(maxBet <= 0) {
        betAmount.value = 0;
    } else {
        betAmount.value = currentBet;
        let syozibet = maxBet - betAmount.value;
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
        draw(draw1, bet1, fight1) + draw(draw2 , bet2, fight2);

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

function draw(draw, bet, fight){
    let ans = 0;
    if(draw && fight){
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
