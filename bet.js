'use strict'

let total_coin = 5000;
let bet = 0;
let todo_bet = 'true';

// ベット出来るか判定処理
function judgement(num) {
    switch(num) {
        case 1:
            if(total_coin >= 100) {
                todo_bet = 'true';
            } else {
                todo_bet = 'false';
            }
        break;
        case 2:
            if(total_coin >= 200) {
                todo_bet = 'true';
            } else {
                todo_bet = 'false';
            }
        break;
        case 3:
            if(total_coin >= 300) {
                todo_bet = 'true';
            } else {
                todo_bet = 'false';
            }
        break;
        case 4:
            if(total_coin >= 400) {
                todo_bet = 'true';
            } else {
                todo_bet = 'false';
            }
        break;
        case 5:
            if(total_coin >= 500) {
                todo_bet = 'true';
            } else {
                todo_bet = 'false';
            }
        break;
    }
}

// ここからベットボタンの処理
function bet_100() {
    judgement(1);
    if(todo_bet) {
        bet = 100;
        total_coin -= bet;    
    }
}
function bet_200() {
    judgement(2);
    if(todo_bet) {
        bet = 200;
        total_coin -= bet;    
    }
}
function bet_300() {
    judgement(3);
    if(todo_bet) {
        bet = 300;
        total_coin -= bet;    
    }
}
function bet_400() {
    judgement(4);
    if(todo_bet) {
        bet = 400;
        total_coin -= bet;
    }
}
function bet_500() {
    judgement(5);
    if(todo_bet) {
        bet = 500;
        total_coin -= bet;    
    }
}
function reset() {
    total_coin += bet;
    bet = 0;
}

// ヒットの処理
function hit_bet(fight, blackjack) {
    if(fight) {
        if(blackjack) {
            total_coin += bet*2.5 // 倍率
        } else {
            total_coin += bet*2; // 倍率
        }
    }
    bet = 0;
}

// ダブルの処理
function double_bet(fight, blackjack) {
    let cost = bet;
    bet += cost;
    total_coin -= cost;

    hit_bet(fight, blackjack);
}

// スプリットの処理
function split_bet(fight1, fight2, blackjack1, blackjack2) {
    let cost = bet;
    total_coin -= cost;

    hit_bet(fight1, blackjack1);
    hit_bet(fight2, blackjack2);
}

// インシュランスの処理
function insurance_bet(blackjack) {
    let cost = Math.floor(bet/2);
    bet += cost;
    total_coin -= cost;

    // 相手がブラックジャックかどうか
    if(blackjack) {
        bet = bet*3; // 倍率
        total_coin += bet;
    }
}

// 引き分けだった時の処理
function draw_bet() {
    total_coin += bet;
    bet = 0;
}

// サレンダーの処理
function surrender() {
    let half = Math.floor(bet/2);
    bet += half;
    bet = 0;
}
