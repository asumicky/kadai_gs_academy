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
  "🗡️": 15,
  "🤛": 15,
  "🔫": 15,
  "🪃": 15,
  "🪄": 17,
  "🪓": 17,
  "🏹": 17,
  "⚔️": 20,
  "💣": 20,
  "🧨": 20,
}; // 武器ごとのダメージの定義（揃えたときに敵へ与えるダメージ）

let enemyAttack = 5; // 不一致のときにプレイヤーが受けるダメージ
let enemyFullHP;
let enemyHP = 100; // 敵のHP
let playerHP = 100; // プレイヤーのHP
let stats;
let stage = 1;
const maxStage = 3;
let playerName;



// ========= ページを開いた時 ============
if(localStorage.getItem("savedName")) {
    playerName = localStorage.getItem("savedName");
    console.log(playerName);
    $(".player-name").text(playerName);
} else {
    isChecking = true;
    $(".play-first-box").css("display", "flex");
}
$(".playstart-button").on("click", function () {
      playerName = $('#player-name-input').val().trim();// ① 入力欄の値を playerName に入れる
      if ( playerName === "" ) {//名前入力されているかチェック
        console.log("名前を入力してください");
        return;
      }
      localStorage.setItem("savedName",playerName);// ② 保存する
      console.log(playerName);
      $(".player-name").text(playerName);
      $(".play-first-box").css("display", "none");
      isChecking = false;
});







// ========= 挑戦回数・勝率の統計 ============
if (localStorage.getItem("stats")) { 
    stats = JSON.parse(localStorage.getItem("stats")); 
    // localStorageから stats を取り出して、オブジェクトに戻して、stats 変数に入れる
    
    // localStorageには文字列しか保存できない。
    // でも stats はオブジェクト
    // オブジェクト → JSON文字列に変換が必要
    // オブジェクトをlocalStorageに保存する
    stats.totalGames++ //stats オブジェクトの totalGames の値を1増やす。最初のゲームも totalGames に含めるためこの処理が必要。
    const jsonData = JSON.stringify(stats); //ステップ1 オブジェクト → JSON文字列に変換
        // jsonData の中身は '{"totalGames":3,"clearGames":1}' というような文字列になる
    localStorage.setItem("stats", jsonData); //ステップ2：localStorageに上記の文字列を保存
    console.log(stats);
} else { 
    stats = { totalGames: 0, clearGames: 0 }
    stats.totalGames++ //stats オブジェクトの totalGames の値を1増やす。最初のゲームも totalGames に含めるためこの処理が必要。
    const jsonData = JSON.stringify(stats); //ステップ1 オブジェクト → JSON文字列に変換
        // jsonData の中身は '{"totalGames":3,"clearGames":1}' というような文字列になる
    localStorage.setItem("stats", jsonData); //ステップ2：localStorageに上記の文字列を保存
    console.log(stats);
}



// ========= ステージ数の取得 ============
if (localStorage.getItem("stage")) {
    stage = Number(localStorage.getItem("stage"));
    console.log(stage);
} else {
    stage = 1;
}
enemyAttack = 5 + (stage-1) * 2
enemyFullHP = 100 + (stage-1) * 20
enemyHP = enemyFullHP;
$(".stage").text(stage);






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
    // まだ1枚もめくっていない場合
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
        enemyHP = Math.max(0, enemyHP); // HPがマイナスにならないように、0より小さくなったら0にする
        $(".enemy-bar-inner").css("width", (enemyHP / enemyFullHP * 100) + "%"); 
        // 敵のHPバーの幅を、残りHPの割合（%）にする
        // 敵のHPバーはステージによって変化するのでenemyFullHPを使用する
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
        const temp = enemyHP; // 敵のHPを、一時的に預ける
        enemyHP = playerHP; // 敵のHP ← プレイヤーのHP
        playerHP = temp; // プレイヤーのHP ← 預けておいた敵のHP
        $(".enemy-bar-inner").css("width", (enemyHP / enemyFullHP * 100) + "%");
        // 敵のHPバーの幅を、残りHPの割合（%）にする
        // 敵のHPバーはステージによって変化するのでenemyFullHPを使用する
        playerHP = Math.min(100, playerHP);
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
      
      if (enemyHP <= 0) { // もし敵のHPが0以下になったら（クリアしたら）

        if (stage === maxStage) {
          // 最後のステージをクリアしたとき
          $(".all-clear-box").css("display", "flex"); // オールクリアの箱を表示する

        } else {
          // まだ次のステージがあるとき
          
          stage += 1 ; //ステージ+1
          localStorage.setItem("stage", stage); //ローカルストレージにステージ数を保存する
          $(".stage").text(stage); //.stageにtextでローカルストレージのstage箱に保存してる値を入れる
          
          $(".clear-box").css("display", "flex"); // クリアの箱を表示する

        }

        stats.clearGames++; //クリアゲーム数＋1
        const jsonData = JSON.stringify(stats); //ステップ1 オブジェクト → JSON文字列に変換
        localStorage.setItem("stats", jsonData); //ステップ2 ローカルストレージにstatsを保存

        if (playerHP > Number(localStorage.getItem("highScore"))) {
          localStorage.setItem("highScore", playerHP);
        }

        isGameOver = true;

        $(".highScore").text(localStorage.getItem("highScore")); 
        // localStorageからhighScoreを取得し、.highScoreにテキストで表示
        // highScoreはlocalStorageに数値をそのまま保存しているのでlocalStorage.getItem()で取り出す
        
        $(".winRate").text(Math.floor(stats.clearGames / stats.totalGames * 100)); 
        // localStorageからstats.clearGames（クリア回数）とstats.totalGames（ゲーム回数） を取得し100で割る
        // 例えば10回プレイして、3回クリアした場合：3 ÷ 10 × 100 = 30（%）
        // totalGames / clearGamesは stats というオブジェクトの中に保存している
        // ので、JS上の stats 変数がすでに最新の値を持っている
        // それをstats.キー名で取り出すだけで良い

        $(".totalGames").text(stats.totalGames);
        // 合計ゲーム回数を取得
        $(".clearGames").text(stats.clearGames);
        // 合計クリア回数を取得

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



function resetGame() { 
  
    firstCard = null; // まだ1枚もめくっていない状態
    secondCard = null; // まだ2枚目のカードをめくっていない状態
    isChecking = true; // 判定中かどうか（true / false）
    isGameOver = false; // ゲームオーバーかどうか（true / false）
    hasShield = false; // シールドカードを揃えているかどうか（true / false）
    starTurns = 0; // スターカードを揃えているかどうか（true / false）
    enemyFullHP = 100 + (stage-1) * 20 ;   // ステージごとの敵のHPの計算式
    enemyHP = enemyFullHP; // 敵のHP
    enemyAttack = 5 + (stage-1) * 2 ; //ステージごとの攻撃力
    playerHP = 100; // プレイヤーのHP

    stats.totalGames++; //ゲーム回数を1回追加
    const jsonData = JSON.stringify(stats); //オブジェクト→JSON
    localStorage.setItem("stats", jsonData);//文字を取得してstatsに保存

    $(".enemy-bar-inner").css("width", (enemyHP / enemyFullHP * 100) + "%"); 
  // 敵のHPバーの幅を、残りHPの割合（%）にする
  // 敵のHPバーはステージによって変化するのでenemyFullHPを使用する
  $(".player-bar-inner").css("width", playerHP + "%"); // プレイヤーのHPバーの幅を、残りHPの割合（%）にする
  $(".clear-box").css("display", "none");
  $(".gameover-box").css("display", "none");
  $(".all-clear-box").css("display", "none"); // オールクリアの箱を非表示にする
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

};


//*---------------「もう一回遊ぶ」ボタンを押した時--------------------*
$(".restart-button").on("click", function () {
  resetGame();
});



//*---------------「次のステージへ」ボタンを押した時--------------------*
$(".nextstage-button").on("click", function () {
    resetGame();
});


// * -------------------- newgame-buttonを押した時 ----------------------- * //
$(".newgame-button").on("click", function () {
  stage = 1;
  localStorage.setItem("stage", stage); //ローカルストレージにステージ数を保存する
  $(".stage").text(stage); //.stageにtextでローカルストレージのstage箱に保存してる値を入れる
  resetGame();
});


// * ---------------------- remove-data-buttonを押した時 --------------------- * //
$(".remove-data-button").on("click", function () {
  
  if (confirm("ハイスコア・記録・ステージがすべて消えます。よろしいですか？")) {

    localStorage.removeItem("stage"); //ステージをローカルストレージから削除
    localStorage.removeItem("highScore"); //ハイスコアをローカルストレージから削除
    localStorage.removeItem("stats"); //回数・勝率をローカルストレージから削除
    
    stage = 1;
    stats = { totalGames: 0, clearGames: 0 }

    resetGame();

    $(".stage").text(stage); //.stageにtextでローカルストレージのstage箱に保存してる値を入れる
  
  }
  
});