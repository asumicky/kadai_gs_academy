// ===== カードの絵柄・状態・HPの定義 =====
const weapons = ["🗡️", "🤛", "🔫", "🪃", "🪄", "🪓", "🏹", "⚔️", "💣", "🧨"];
const specials = ["💊", "💊", "🌀", "🛡️", "⭐️", "👯‍♀️"];
const cards = [...weapons, ...weapons, ...specials, ...specials];

//const Trumps_suits = ["spade", "heart", "diamond", "club"]; // トランプの記号を配列で定義
//const Trumps_numbers = ["joker", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]; // トランプの数字を配列で定義
//const randomNumber = Math.floor(Math.random() * 14); // 0から13までのどれかが表示される

// const duplicate = 6;
const cardIds = [];
let firstCard = null; // まだ1枚もめくっていない状態
let secondCard = null; // まだ2枚目のカードをめくっていない状態
let isChecking = false; // 判定中かどうか（true / false）
let isGameOver = false; // ゲームオーバーかどうか（true / false）
let hasShield = false;
let starTurns = 0;
const damage = {
  "🗡️": 8,
  "🤛": 8,
  "🔫": 8,
  "🪃": 8,
  "🪄": 12,
  "🪓": 12,
  "🏹": 12,
  "⚔️": 15,
  "💣": 15,
  "🧨": 15,
}; // 武器ごとのダメージの定義（揃えたときに敵へ与えるダメージ）

const enemyAttack = 5; // 不一致のときにプレイヤーが受けるダメージ（固定）
let enemyHP = 100; // 敵のHP
let playerHP = 100; // プレイヤーのHP
let stats;

// ========= 挑戦回数・勝率の統計 ============
if (localStorage.getItem("stats")) { 
    stats = JSON.parse(localStorage.getItem("stats"));
} else { 
    stats = { totalGames: 0, clearGames: 0 }
}

// ===== シャッフル =====
function shuffleArray(array) {
  // 配列をシャッフルする関数
  for (let i = array.length - 1; i > 0; i--) {
    // 配列の最後の要素から最初の要素までループする
    const j = Math.floor(Math.random() * (i + 1)); // 0からiまでのランダムな整数を生成する
    [array[i], array[j]] = [array[j], array[i]]; // 要素を入れ替え
  }
  return array; // シャッフルされた配列を返す
}

shuffleArray(cards); // 配列をシャッフルする関数を呼び出す

// ===== カードの生成 =====
for (let i = 0; i < cards.length; i++) {
  // cardsの数だけ繰り返す
  const card_style = $("<div>").addClass("card").addClass("close-card").append(
    // カードの要素を作成しcardクラスとclose-cardクラスを追加
    $("<div>").addClass("card-front"), // 最初に見える側（カードの裏柄）の要素を作成しcard-frontクラスを追加
    $("<div>").addClass("card-back").text(cards[i]), // めくると現れる側（絵柄）の要素を作成しcard-backクラスを追加し、絵柄を設定する
  );
  $(".vertical").append(card_style);
}

//$(".card-front").hide(); // カードの表面を非表示にする

// for ( let i = 1 ; i <=duplicate; i++) { // duplicateの数だけ繰り返す
//     const randomNumber = Math.floor(Math.random() * 14); // 0から13までのどれかが表示される
//     const card_number = Trumps_numbers[randomNumber]; // ランダムでカードの数字を決定
//     const card_style = $("<div>").addClass("card").addClass("close-card").append( // カードの要素を作成しcardクラスとclose-cardクラスを追加
//         $("<div>").addClass("card-front").append( // カードの表面の要素を作成しcard-frontクラスを追加
//             $("<img>").attr("src", `image/${card_number}.png`).attr("alt", card_number) // カードの表面の画像を設定
//         ),
//         $("<div>").addClass("card-back").append( // カードの裏面の要素を作成しcard-backクラスを追加
//             $("<img>").attr("src", "image/card_back.png").attr("alt", "card_back") // カードの裏面の画像を設定
//         )
//     );
//     $(".vertical").append(card_style); // verticalクラスの要素にカードの要素を追加する
// }

// ===== カードをクリックしたときの処理 =====
$(".card").on("click", function () {
  // --- クリックを無視する条件 ---
  if (
    $(this).hasClass("open-card") ||
    $(this).hasClass("match-card") ||
    isChecking === true ||
    isGameOver === true
  ) {
    // .cardがopen-cardクラスまたはmatch-cardクラスの場合、または判定中・ゲームオーバーの場合
    console.log("クリックできません");
    return;
  }

  // --- 1枚目 / 2枚目をめくる ---
  if (firstCard === null) {
    // まだ1枚もめくっていない場合（これが1枚目）
    // if ($(this).hasClass("close-card")) { // .cardがclose-cardクラスの場合
    firstCard = $(this).find(".card-back").text();
    console.log(firstCard);
    $(this).addClass("open-card").removeClass("close-card"); //clickされたカードにopen-cardクラスを追加し、close-cardクラスを削除する
    $(this)
      .find(".card-front")
      .addClass("flipped-close")
      .removeClass("flipped-open"); //クリックされたカードの子要素である.card-frontにflipped-closeクラスを追加し、flipped-openクラスを削除する
    $(this)
      .find(".card-back")
      .addClass("flipped-open")
      .removeClass("flipped-close"); //クリックされたカードの子要素である.card-backにflipped-openクラスを追加してめくり、flipped-closeクラスを削除する
  } else {
    // 1枚目がすでにめくってある場合（これが2枚目）
    secondCard = $(this).find(".card-back").text();
    console.log(secondCard);
    // $(this).addClass("close-card").removeClass("open-card"); //clickされたカードにclose-cardクラスを追加し、open-cardクラスを削除する
    //  $(this).find(".card-back").addClass("flipped-close").removeClass("flipped-open"); //クリックされたカードの子要素である.card-backにflipped-closeクラスを追加し、flipped-openクラスを削除する
    //  $(this).find(".card-front").addClass("flipped-open").removeClass("flipped-close"); //クリックされたカードの子要素である.card-frontにflipped-openクラスを追加して戻し、flipped-closeクラスを削除する
    $(this).addClass("open-card").removeClass("close-card"); //clickされたカードにopen-cardクラスを追加し、close-cardクラスを削除する
    $(this)
      .find(".card-front")
      .addClass("flipped-close")
      .removeClass("flipped-open"); //クリックされたカードの子要素である.card-frontにflipped-closeクラスを追加し、flipped-openクラスを削除する
    $(this)
      .find(".card-back")
      .addClass("flipped-open")
      .removeClass("flipped-close"); //クリックされたカードの子要素である.card-backにflipped-openクラスを追加してめくり、flipped-closeクラスを削除する
  }

  // --- 2枚そろったらペア判定 ---
  if (firstCard !== null && secondCard !== null) {
    if (firstCard === secondCard) {
      console.log("一致");
      if (weapons.includes(firstCard)) {
        // firstCard が武器のとき
        console.log(damage[firstCard]);
        enemyHP -= damage[firstCard]; // 揃えた武器のダメージ分、敵のHPを減らす
        enemyHP = Math.max(0, enemyHP);
        $(".enemy-bar-inner").css("width", enemyHP + "%"); // 敵のHPバーの幅を、残りHPの割合（%）にする
      } else if (firstCard === "💊") {
        // 💊 のとき
        playerHP += 10;
        playerHP = Math.min(100, playerHP);
        $(".player-bar-inner").css("width", playerHP + "%");
      } else if (firstCard === "🛡️") {
        // 🛡️ のとき
        hasShield = true;
      } else if (firstCard === "⭐️") {
        starTurns = 3;
      } else if (firstCard === "👯‍♀️") {
        // ← 足す
        const temp = enemyHP; // 敵のHPを、一時的に預ける
        enemyHP = playerHP; // 敵のHP ← プレイヤーのHP
        playerHP = temp; // プレイヤーのHP ← 預けておいた敵のHP
        $(".enemy-bar-inner").css("width", enemyHP + "%");
        $(".player-bar-inner").css("width", playerHP + "%");
      }
      $(".open-card").addClass("match-card").removeClass("open-card"); // open-cardクラスの要素にmatch-cardクラスを追加し、open-cardクラスを削除する
      if (firstCard === "🌀") {
        const closeTexts = []; // 空の箱を、先に用意する
        $(".close-card .card-back").each(function () {
          closeTexts.push($(this).text());
        });
        shuffleArray(closeTexts);
        for (let i = 0; i < closeTexts.length; i++) {
          $(".close-card .card-back").eq(i).text(closeTexts[i]);
        }
        console.log(closeTexts);
      }
      firstCard = null; // firstCardをnullにする
      secondCard = null; // secondCardをnullにする
      if (enemyHP <= 0) {
        $(".clear-box").css("display", "flex"); // クリアの箱を表示する
        isGameOver = true;
        if (playerHP > Number(localStorage.getItem("highScore"))) {
          localStorage.setItem("highScore", playerHP);
        }
        $("#highScore").text(localStorage.getItem("highScore"));
      }
    } else {
      isChecking = true; // 判定中にする
      console.log("不一致");
      console.log(enemyAttack);
      if (starTurns > 0) {
        starTurns -= 1; // ⭐️ の残り回数を1減らす（ダメージなし）
      } else if (hasShield === true) {
        hasShield = false; // バリアを使い切る
      } else {
        playerHP -= enemyAttack;
        playerHP = Math.max(0, playerHP);
      }
      if (playerHP <= 0) {
        // HPが0以下ならゲームオーバー
        $(".gameover-box").css("display", "flex"); // ゲームオーバーの箱を表示する
        isGameOver = true; // ゲームオーバーにする
      }
      $(".player-bar-inner").css("width", playerHP + "%"); // プレイヤーのHPバーの幅を、残りHPの割合（%）にする
      setTimeout(function () {
        // 1秒後に実行する
        $(".open-card")
          .find(".card-front")
          .addClass("flipped-open")
          .removeClass("flipped-close"); // open-cardの中の.card-front（裏柄）にflipped-openクラスを追加し、flipped-closeクラスを削除する
        $(".open-card")
          .find(".card-back")
          .addClass("flipped-close")
          .removeClass("flipped-open"); // open-cardの中の.card-back（絵柄）にflipped-closeクラスを追加し、flipped-openクラスを削除する
        $(".open-card").addClass("close-card").removeClass("open-card"); // open-cardクラスの要素にclose-cardクラスを追加し、open-cardクラスを削除する
        isChecking = false; // 判定中を解除する
        firstCard = null; // firstCardをnullにする
        secondCard = null; // secondCardをnullにする
      }, 1000); // 1000ミリ秒（1秒）後に実行する
    }
  }
});

//*---------------「もう一回遊ぶ」ボタンを押した時--------------------*
$(".restart-button").on("click", function () {
  firstCard = null; // まだ1枚もめくっていない状態
  secondCard = null; // まだ2枚目のカードをめくっていない状態
  isChecking = true; // 判定中かどうか（true / false）
  isGameOver = false; // ゲームオーバーかどうか（true / false）
  hasShield = false;
  starTurns = 0;
  enemyHP = 100; // 敵のHP
  playerHP = 100; // プレイヤーのHP
  $(".enemy-bar-inner").css("width", enemyHP + "%"); // 敵のHPバーの幅を、残りHPの割合（%）にする
  $(".player-bar-inner").css("width", playerHP + "%"); // プレイヤーのHPバーの幅を、残りHPの割合（%）にする
  $(".clear-box").css("display", "none");
  $(".gameover-box").css("display", "none");
  $(".card")
    .removeClass("open-card")
    .removeClass("match-card")
    .addClass("close-card");
  $(".card")
    .find(".card-front")
    .addClass("flipped-open")
    .removeClass("flipped-close");
  $(".card")
    .find(".card-back")
    .addClass("flipped-close")
    .removeClass("flipped-open");
  setTimeout(function () {
    shuffleArray(cards); // 配列をシャッフルする関数を呼び出す
    for (let i = 0; i < cards.length; i++) {
      $(".card-back").eq(i).text(cards[i]);
    }
    isChecking = false;
  }, 1000);
});
