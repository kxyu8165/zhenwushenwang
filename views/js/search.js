$('.js-toggle-search').on('click', function () {
    $('.search-form').toggleClass('is-visible');
    $("html").addClass("overflow-hidden");
});
$('.close-search').click(function () {
    $(".search-form").removeClass("is-visible");
    $("html").removeClass("overflow-hidden");
});
//標籤切換
$(".tabs2 li").click(function () {
    $(this).addClass("active").siblings().removeClass("active")
    $(this).parent().next().children().eq($(this).index()).show().siblings().hide()
})
