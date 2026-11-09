$(".card-back").hide(); // カードの裏面を非表示にする


const Trumps_suits = ["spade", "heart", "diamond", "club"]; // トランプの記号を配列で定義
const Trumps_numbers = ["joker", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]; // トランプの数字を配列で定義
const randomNumber = Math.floor(Math.random() * 14); // 0から12までのどれかが表示される

const duplicate = 2;
const cardIds = [];

for ( let i = 1 ; i <=duplicate; i++) { // duplicateの数だけ繰り返す
    const randomNumber = Math.floor(Math.random() * 14); // 0から12までのどれかが表示される
    const card_number = Trumps_numbers[randomNumber]; // ランダムでカードの数字を決定
    const card_style = $("<div>").addClass("card").addClass("close-card").append( // カードの要素を作成しcardクラスとclose-cardクラスを追加
        $("<div>").addClass("card-front").append( // カードの表面の要素を作成しcard-frontクラスを追加
            $("<img>").attr("src", `image/${card_number}.png`).attr("alt", card_number) // カードの表面の画像を設定
        ),
        $("<div>").addClass("card-back").append( // カードの裏面の要素を作成しcard-backクラスを追加
            $("<img>").attr("src", "image/card_back.png").attr("alt", "card_back") // カードの裏面の画像を設定
        )
    );
    $(".vertical").append(card_style); // verticalクラスの要素にカードの要素を追加し、14枚表示する
}

$(".card").on("click", function () {
  if ($(this).hasClass("close-card")) { // .cardがclose-cardクラスの場合
    $(this).addClass("open-card").removeClass("close-card"); //clickされたカードにopen-cardクラスを追加し、close-cardクラスを削除する
    $(this).find(".card-front").addClass("flipped-close").removeClass("flipped-open");　//クリックされたカードの子要素である.card-frontにflipped-closeクラスを追加し、flipped-openクラスを削除する
    $(this).find(".card-back").show().addClass("flipped-open").removeClass("flipped-close"); //クリックされたカードの子要素である.card-backを表示し、flipped-openクラスを追加し、flipped-closeクラスを削除する
   } else if ($(this).hasClass("open-card")) { // .cardがopen-cardクラスの場合
    $(this).addClass("close-card").removeClass("open-card"); //clickされたカードにclose-cardクラスを追加し、open-cardクラスを削除する
     $(this).find(".card-back").addClass("flipped-close").removeClass("flipped-open"); //クリックされたカードの子要素である.card-backにflipped-closeクラスを追加し、flipped-openクラスを削除する
     $(this).find(".card-front").show().addClass("flipped-open").removeClass("flipped-close"); //クリックされたカードの子要素である.card-frontを表示し、flipped-openクラスを追加し、flipped-closeクラスを削除する
  } else {
    alert("エラーです!!");
  }
});
