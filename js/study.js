//キャプションフェードイン
$(function () {
    $('.lang').hover(function () {
        $('.explain', this).fadeIn("slow");
    }, function () {
        $('.explain', this).fadeOut("slow");
    });
});