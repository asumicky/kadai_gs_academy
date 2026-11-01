

    let playerCount = 0;
    let computerCount = 0;
    let carPosition = 0;
    const playerWin = "こ、このオレが……<br>道もッ！ 勝ちもッ！<br>ゆずるというのかァーーッ！";
    const playerLose = "この一本道の主役が誰か……<br>これでわかったようだなァッ！";

$("#start_box button.start-button").on("click", function () {
    $("#start_box").hide();
    $("#janken_battle_box").css("display", "flex");
});


$("#janken_battle_box button.button").on ("click",function () {

    const hands = ["rock","scissors","paper"];
    const illust = ["image/janken_gu.webp","image/janken_choki.webp","image/janken_pa.webp"];
    const randomNumber = Math.floor(Math.random() * 3);

    const computer = hands[randomNumber];
    const player = $(this).attr("id");
    const playerImage = $(this).find("img").attr("src");

    $("#janken_computer_img").attr("src",illust[randomNumber]);
    $("#janken_player_img").attr("src",playerImage);

    if (player === computer) {
        $("#janken_result").text("あいこだよ");
    } else if (
        (player === "rock" && computer === "scissors") ||
        (player === "scissors" && computer === "paper") ||
        (player === "paper" && computer === "rock")
    ) {
        $("#janken_result").text("あなたの勝ちだよ");
        playerCount += 1;// 自分の点数を1増やす
        carPosition -= 100;
        $(".player-count span").text(playerCount);
        $("#car img").css("transform", `translateY(${carPosition}px)`);
    } else {
        $("#janken_result").text("残念 負けだよ");
        computerCount += 1;// 相手の点数を1増やす
        carPosition += 100;
        $("#car img").css("transform", `translateY(${carPosition}px)`);
        $(".computer-count span").text(computerCount);
    }

    $("#janken_battle_box").hide();
    $("#result_box").css("display", "flex");

});



    $("#result_box button.gray-button").on ("click",function () {
        $("#result_box").hide();

    if (playerCount === 5) {
            $("#final_result_box").css("display", "flex");
            $("#final_result_box h2").text("あなたの勝ちだよ!");
            $(".final_image img").attr("src","image/janken_win.webp");
            $(".final_text p").html(playerWin);
        } else if (computerCount === 5) {
            $("#final_result_box").css("display", "flex");
            $("#final_result_box h2").text("相手の勝ちだよ😭");
            $(".final_image img").attr("src","image/janken_lose.webp");
            $(".final_text p").html(playerLose);
        } else {
            $("#janken_battle_box").css("display", "flex");
        }

    });

    $("#final_result_box button.gray-button").on ("click",function () {
        $("#final_result_box").hide();
        $("#janken_battle_box").css("display", "flex");

        playerCount = 0;
        computerCount = 0;
        carPosition = 0;

        $(".player-count span").text(playerCount);
$(".computer-count span").text(computerCount);
$("#car img").css("transform", `translateY(${carPosition}px)`);

    });
