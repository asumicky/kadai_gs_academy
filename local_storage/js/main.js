// ===== カードの絵柄・状態・HPの定義 =====
const weapons = ["dagger", "fist", "gun", "boomerang", "wand", "axe", "bow", "sword", "bomb", "dynamite"];
const specials = ["capsule_mint", "capsule_pink", "swirl", "shield", "star", "swap"];
const cards = [...weapons, ...weapons, ...specials, ...specials];

const cardIds = [];
let firstCard = null;
let secondCard = null;
let isChecking = false;
let isGameOver = false;
let hasShield = false;
let starTurns = 0;
const damage = {
  dagger: 15,
  fist: 15,
  gun: 15,
  boomerang: 15,
  wand: 17,
  axe: 17,
  bow: 17,
  sword: 20,
  bomb: 20,
  dynamite: 20,
};

let enemyAttack = 5;
let enemyFullHP;
let enemyHP = 100;
let playerHP = 100;
let stats;
let stage = 1;
const maxStage = 3;
let playerName;

// ステージごとの敵キャラ画像
function updateEnemyImage() {
  $(".enemy-img").attr("src", "images/enemy_stage" + stage + ".png");
  $(".enemy-area").removeClass("stage-1 stage-2 stage-3").addClass("stage-" + stage);
}

function setCardFace($back, id) {
  $back.attr("data-card", id).attr("src", "images/cards/" + id + ".png");
}


// ========= ページを開いた時 ============
if (localStorage.getItem("savedName")) {
    playerName = localStorage.getItem("savedName");
    console.log(playerName);
    $(".player-name").text(playerName);
    $("#player-name-input").val(playerName);
}
isChecking = true;
$(".play-first-box").css("display", "flex");

$(".playstart-button").on("click", function () {
    playerName = $('#player-name-input').val().trim();
    if (playerName === "") {
        console.log("名前を入力してください");
        return;
    }
    localStorage.setItem("savedName", playerName);
    console.log(playerName);
    $(".player-name").text(playerName);
    $(".play-first-box").css("display", "none");
    $(".card-info-modal").css("display", "flex");
    isChecking = false;
});


// ========= 挑戦回数・勝率の統計 ============
if (localStorage.getItem("stats")) {
    stats = JSON.parse(localStorage.getItem("stats"));
    stats.totalGames++;
    localStorage.setItem("stats", JSON.stringify(stats));
    console.log(stats);
} else {
    stats = { totalGames: 0, clearGames: 0 };
    stats.totalGames++;
    localStorage.setItem("stats", JSON.stringify(stats));
    console.log(stats);
}


// ========= ステージ数の取得 ============
if (localStorage.getItem("stage")) {
    stage = Number(localStorage.getItem("stage"));
    console.log(stage);
} else {
    stage = 1;
}
enemyAttack = 5 + (stage - 1) * 2;
enemyFullHP = 100 + (stage - 1) * 20;
enemyHP = enemyFullHP;
$(".stage").text(stage);
$(".enemy-score").text(enemyHP);
updateEnemyImage();


// ===== シャッフル =====
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

shuffleArray(cards);


// ===== カードの生成 =====
// 6列グリッド、最終行2枚だけ中央揃えするためラッパーで行管理
const cols = 6;
for (let row = 0; row * cols < cards.length; row++) {
    const start = row * cols;
    const end = Math.min(start + cols, cards.length);
    const rowCards = cards.slice(start, end);
    const isLastRow = end === cards.length;
    const rowDiv = $("<div>").addClass("card-row");
    if (isLastRow && rowCards.length < cols) {
        rowDiv.addClass("card-row-center");
    }
    for (let i = 0; i < rowCards.length; i++) {
        const card_style = $("<div>").addClass("card").addClass("close-card").append(
            $("<img>").addClass("card-front").attr({ src: "images/card_back.svg", alt: "" }),
            $("<img>").addClass("card-back").attr({ src: "images/cards/" + rowCards[i] + ".png", alt: "", "data-card": rowCards[i] }),
        );
        rowDiv.append(card_style);
    }
    $(".vertical").append(rowDiv);
}


// ===== カードをクリックしたときの処理 =====
$(".card").on("click", function () {
    if (
        $(this).hasClass("open-card") ||
        $(this).hasClass("match-card") ||
        isChecking === true ||
        isGameOver === true
    ) {
        console.log("クリックできません");
        return;
    }

    if (firstCard === null) {
        firstCard = $(this).find(".card-back").attr("data-card");
        console.log(firstCard);
        $(this).addClass("open-card").removeClass("close-card");
        $(this).find(".card-front").addClass("flipped-close").removeClass("flipped-open");
        $(this).find(".card-back").addClass("flipped-open").removeClass("flipped-close");
    } else {
        secondCard = $(this).find(".card-back").attr("data-card");
        console.log(secondCard);
        $(this).addClass("open-card").removeClass("close-card");
        $(this).find(".card-front").addClass("flipped-close").removeClass("flipped-open");
        $(this).find(".card-back").addClass("flipped-open").removeClass("flipped-close");
    }

    if (firstCard !== null && secondCard !== null) {
        if (firstCard === secondCard) {
            console.log("一致");
            if (weapons.includes(firstCard)) {
                console.log(damage[firstCard]);
                enemyHP -= damage[firstCard];
                enemyHP = Math.max(0, enemyHP);
                $(".enemy-bar-inner").css("width", (enemyHP / enemyFullHP * 100) + "%");
                $(".enemy-score").text(enemyHP);
            } else if (firstCard === "capsule_mint" || firstCard === "capsule_pink") {
                playerHP += 10;
                playerHP = Math.min(100, playerHP);
                $(".player-bar-inner").css("width", playerHP + "%");
                $(".player-score").text(playerHP);
            } else if (firstCard === "shield") {
                hasShield = true;
            } else if (firstCard === "star") {
                starTurns = 3;
            } else if (firstCard === "swap") {
                const temp = enemyHP;
                enemyHP = playerHP;
                playerHP = temp;
                enemyHP = Math.max(0, enemyHP);
                playerHP = Math.min(100, playerHP);
                $(".enemy-bar-inner").css("width", (enemyHP / enemyFullHP * 100) + "%");
                $(".enemy-score").text(enemyHP);
                $(".player-bar-inner").css("width", playerHP + "%");
                $(".player-score").text(playerHP);
            }

            $(".open-card").addClass("match-card").removeClass("open-card");

            if (firstCard === "swirl") {
                const closeTexts = [];
                $(".close-card .card-back").each(function () {
                    closeTexts.push($(this).attr("data-card"));
                });
                shuffleArray(closeTexts);
                for (let i = 0; i < closeTexts.length; i++) {
                    setCardFace($(".close-card .card-back").eq(i), closeTexts[i]);
                }
                console.log(closeTexts);
            }

            firstCard = null;
            secondCard = null;

            if (enemyHP <= 0) {
                stats.clearGames++;
                localStorage.setItem("stats", JSON.stringify(stats));

                if (playerHP > Number(localStorage.getItem("highScore"))) {
                    localStorage.setItem("highScore", playerHP);
                }

                isGameOver = true;
                updateStatsDisplay();

                if (stage === maxStage) {
                    $(".all-clear-box").css("display", "flex");
                } else {
                    stage += 1;
                    localStorage.setItem("stage", stage);
                    $(".stage").text(stage);
                    $(".clear-stage").text(stage - 1);
                    $(".clear-box").css("display", "flex");
                }
            }

        } else {
            isChecking = true;
            console.log("不一致");
            console.log(enemyAttack);
            if (starTurns > 0) {
                starTurns -= 1;
            } else if (hasShield === true) {
                hasShield = false;
            } else {
                playerHP -= enemyAttack;
                playerHP = Math.max(0, playerHP);
            }

            if (playerHP <= 0) {
                $(".gameover-box").css("display", "flex");
                isGameOver = true;
            }

            $(".player-bar-inner").css("width", playerHP + "%");
            $(".player-score").text(playerHP);

            setTimeout(function () {
                $(".open-card").find(".card-front").addClass("flipped-open").removeClass("flipped-close");
                $(".open-card").find(".card-back").addClass("flipped-close").removeClass("flipped-open");
                $(".open-card").addClass("close-card").removeClass("open-card");
                isChecking = false;
                firstCard = null;
                secondCard = null;
            }, 1000);
        }
    }
});


function updateStatsDisplay() {
    $(".highScore").text(localStorage.getItem("highScore") || "-");
    $(".winRate").text(Math.floor(stats.clearGames / stats.totalGames * 100));
    $(".totalGames").text(stats.totalGames);
    $(".clearGames").text(stats.clearGames);
}


function resetGame() {
    firstCard = null;
    secondCard = null;
    isChecking = true;
    isGameOver = false;
    hasShield = false;
    starTurns = 0;
    enemyFullHP = 100 + (stage - 1) * 20;
    enemyHP = enemyFullHP;
    enemyAttack = 5 + (stage - 1) * 2;
    playerHP = 100;

    stats.totalGames++;
    localStorage.setItem("stats", JSON.stringify(stats));

    $(".enemy-bar-inner").css("width", "100%");
    $(".enemy-score").text(enemyHP);
    $(".player-bar-inner").css("width", playerHP + "%");
    $(".player-score").text(playerHP);
    $(".clear-box").css("display", "none");
    $(".gameover-box").css("display", "none");
    $(".all-clear-box").css("display", "none");
    $(".stage").text(stage);
    updateEnemyImage();

    $(".card").removeClass("open-card").removeClass("match-card").addClass("close-card");
    $(".card").find(".card-front").addClass("flipped-open").removeClass("flipped-close");
    $(".card").find(".card-back").addClass("flipped-close").removeClass("flipped-open");

    setTimeout(function () {
        shuffleArray(cards);
        $(".card-back").each(function(i) {
            setCardFace($(this), cards[i]);
        });
        isChecking = false;
    }, 1000);
}


// ボタンイベント
$(".restart-button").on("click", function () {
    resetGame();
});

$(".nextstage-button").on("click", function () {
    resetGame();
});

$(".newgame-button").on("click", function () {
    stage = 1;
    localStorage.setItem("stage", stage);
    $(".stage").text(stage);
    resetGame();
});

$(".remove-data-button").on("click", function () {
    if (confirm("ハイスコア・記録・ステージがすべて消えます。よろしいですか？")) {
        localStorage.removeItem("stage");
        localStorage.removeItem("highScore");
        localStorage.removeItem("stats");
        stage = 1;
        stats = { totalGames: 0, clearGames: 0 };
        $(".stage").text(stage);
        resetGame();
    }
});


// ===== カードせつめいモーダル =====
$(".card-info-button").on("click", function () {
    $(".card-info-modal").css("display", "flex");
});

$(".card-info-close").on("click", function () {
    $(".card-info-modal").css("display", "none");
});


// ===== ×閉じるボタン（クリア・全クリア・ゲームオーバーモーダル） =====
$(".clear-close").on("click", function () {
    $(".clear-box").css("display", "none");
});

$(".all-clear-close").on("click", function () {
    $(".all-clear-box").css("display", "none");
});

$(".gameover-close").on("click", function () {
    $(".gameover-box").css("display", "none");
});
