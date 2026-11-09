let playerCount = 0;
let computerCount = 0;
let carPosition = 0;
const playerWin =
  "こ、このオレが……<br>道もッ！ 勝ちもッ！<br>ゆずるというのかァーーッ！";
const playerLose = "この一本道の主役が誰か……<br>これでわかったようだなァッ！";

$("#start_box button.start-button").on("click", function () {
  $("#start_box").hide();
  $("#janken_battle_box").css("display", "flex");
});

$("#janken_battle_box button.button").on("click", function () {
  const hands = ["rock", "scissors", "paper"];
  const illust = [
    "image/janken_gu.webp",
    "image/janken_choki.webp",
    "image/janken_pa.webp",
  ];
  const randomNumber = Math.floor(Math.random() * 3);

  const computer = hands[randomNumber]; // コンピューターの手をランダムで決定
  const player = $(this).attr("id"); // クリックされたボタンのidを取得してプレイヤーの手を決定
  const playerImage = $(this).find("img").attr("src"); // クリックされたボタンの子要素であるimgのsrc属性を取得してプレイヤーの手の画像を決定

  $("#janken_computer_img").attr("src", illust[randomNumber]); // コンピューターの手の画像を表示
  $("#janken_player_img").attr("src", playerImage); // プレイヤーの手の画像を表示

  if (player === computer) { // プレイヤーとコンピューターの手が同じ場合
    $("#janken_result").text("あいこだよ");
    } else if ( 
      (player === "rock" && computer === "scissors") ||
      (player === "scissors" && computer === "paper") ||
      (player === "paper" && computer === "rock")
        ) { // プレイヤーが勝つ場合
          $("#janken_result").text("あなたの勝ちだよ");
          playerCount += 1; // 自分の点数を1増やす
          carPosition -= 100; // 車の位置を100px上に移動
          $(".player-count span").text(playerCount); // プレイヤーの点数を表示
          $("#car img").css("transform", `translateY(${carPosition}px)`); // 車の位置を移動
    } else { // コンピューターが勝つ場合
          $("#janken_result").text("残念 負けだよ");
          computerCount += 1; // 相手の点数を1増やす
          carPosition += 100; // 車の位置を100px下に移動
          $("#car img").css("transform", `translateY(${carPosition}px)`); // 車の位置を移動
          $(".computer-count span").text(computerCount); // コンピューターの点数を表示
           }
      $(".computer-count span").text(computerCount); // コンピューターの点数を表示
  $("#janken_battle_box").hide(); // じゃんけんバトルボックスを非表示にする
  $("#result_box").css("display", "flex");
}); 

$("#result_box button.gray-button").on("click", function () { // 結果ボックスのグレーボタンをクリックしたときの処理
  $("#result_box").hide();

  if (playerCount === 5) {
    $("#final_result_box").css("display", "flex");
    $("#final_result_box h2").text("あなたの勝ちだよ!");
    $(".final_image img").attr("src", "image/janken_win.webp");
    $(".final_text p").html(playerWin);
  } else if (computerCount === 5) {
    $("#final_result_box").css("display", "flex");
    $("#final_result_box h2").text("相手の勝ちだよ😭");
    $(".final_image img").attr("src", "image/janken_lose.webp");
    $(".final_text p").html(playerLose);
  } else {
    $("#janken_battle_box").css("display", "flex");
  }
});

$("#final_result_box button.gray-button").on("click", function () {
  $("#final_result_box").hide();
  $("#janken_battle_box").css("display", "flex");

  playerCount = 0;
  computerCount = 0;
  carPosition = 0;

  $(".player-count span").text(playerCount);
  $(".computer-count span").text(computerCount);
  $("#car img").css("transform", `translateY(${carPosition}px)`);
});
