$(document).ready(function () {

    $(".menubtn").click(function () {
        showmenu()
    })

    function showmenu() {
        $('.modbg').fadeIn()
        $('.leftmenu').animate({left: '0px'}, 200)
        $('body').css({overflow: 'hidden'})
    }

    $(".modbg,.menu_close_btn").click(function () {
        hidemenu()
    })

    function hidemenu() {
        $('.modbg').fadeOut()
        $('.leftmenu').animate({left: '-300px'}, 200)
        $('body').css({overflow: 'auto'})
    }

    $(".shaix").click(function () {
        showlist()
    })

    function showlist() {
        $('.sklist').fadeIn()
        $('.book_fl').animate({right: '0px'}, 200)
        $('body').css({overflow: 'hidden'})
    }

    $(".sklist").click(function () {
        hidelist()
    })

    function hidelist() {
        $('.sklist').fadeOut()
        $('.book_fl').animate({right: '-300px'}, 200)
        $('body').css({overflow: 'auto'})
    }

    $("#read_ml").click(function () {
        mulus()
    })

    function mulus() {
        $('.modbg').fadeIn()
        $('.mulu').animate({left: '0px'}, 200)
        $('body').css({overflow: 'hidden'})
    }

    $(".modbg,.menu_close_btn").click(function () {
        hidemulu()
    })

    function hidemulu() {
        $('.modbg').fadeOut()
        $('.mulu').animate({left: '-300px'}, 200)
        $('body').css({overflow: 'auto'})
    }

    var p = 0,
        t = 0;
    $(window).scroll(function () {
        p = $(window).scrollTop()
        if (t < p) {
            //向下滚动
            if (p > 50) {
                $("header").css({top: '-75px'})
            }
        } else {
            //向上滚动
            if (t > p + 10 || p < 50) {
                $("header").css({top: 0})
            }
        }
        setTimeout(function () {
            t = p;
        }, 0)


    })
    //信息页
    $(".tabs li").click(function () {
        $(this).addClass("active").siblings().removeClass("active")
        $(this).parent().next().children().eq($(this).index()).show().siblings().hide()
    })


})


