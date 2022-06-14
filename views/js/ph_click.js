var clear_lock = false;
var scroll_lock = true;
$(function () {
    var f = {};
    if ($.cookie("RCViewSetting_m")) {
        var g = $.cookie("RCViewSetting_m");
        f = eval("(" + g + ")");
        if (f.size) {
            var h = f.size;
            $("#font_layer span").removeClass("selected");
            $("#font_layer span.f-" + h).addClass("selected");
            $("#article_content_setting").attr("size", h)
        }
        if (f.scheme) {
            var i = f.scheme;
            $("#back_scheme span").removeClass("selected");
            $("#back_scheme span.cs-" + i).addClass("selected");
            $("#article_content_setting").attr("color-scheme", i)
        }
    }
    $("#view_setting").click(function () {
        $("#offline_cache").addClass("hidden");
        $(".km-xz").addClass("hidden");
        $(".km-xz-v2").addClass("hidden");
        $(".km-xz-v3").addClass("hidden");
        if ($("#article_setting").hasClass("hidden")) {
            $("#article_setting").removeClass("hidden")
        } else {
            $(".km-xz").removeClass("hidden");
            $(".km-xz-v2").removeClass("hidden");
            $("#article_setting").addClass("hidden")
        }
    });
    $("#offline_content").click(function () {
        if (null != $.cookie("b_ydsc")) {
            return false
        } else {
            $("#article_setting").addClass("hidden");
            $(".km-xz").addClass("hidden");
            $(".km-xz-v2").addClass("hidden");
            $(".km-xz-v3").addClass("hidden");
            if ($("#offline_cache").hasClass("hidden")) {
                $("#offline_cache").removeClass("hidden")
            } else {
                $(".km-xz").removeClass("hidden");
                $(".km-xz-v2").removeClass("hidden");
                $("#offline_cache").addClass("hidden")
            }
        }
    });
    $("#font_layer").on("click", "span", function () {
        var a = $(this).attr("data-val");
        $("#font_layer span").removeClass("selected");
        $(this).addClass("selected");
        var art = document.querySelector(".article"), artP = document.querySelectorAll("p"), noteTop = 0, noteEl = null;
        for (var i = 0; i < artP.length; i++) {
            if (artP[i].getBoundingClientRect().top > 0) {
                noteEl = artP[i];
                noteTop = noteEl.getBoundingClientRect().top;
                break
            }
        }
        $("#article_content_setting").attr("size", a);
        f.size = a;
        viewSettingJSON = createJSON(f);
        $.cookie("RCViewSetting_m", viewSettingJSON, {expires: 15});
        setTimeout(function () {
            window.scrollTo(0, noteEl.offsetTop + noteTop)
        }.bind(this), 0);
        return false
    });
    $("#back_scheme span").click(function () {
        $.cookie('reader_setting', '', { expires: -1 });
        var a = $(this).attr("data-val");
        if(a=="white"){s_ys="#fff";}
        if(a=="brown"){s_ys="#dccbb1";}
        if(a=="green"){s_ys="#dce5c2";}
        if(a=="blue"){s_ys="#b1cedc";}
        if(a=="night"){s_ys="#1f1f1f";}
        $("#back_scheme span").removeClass("selected");
        $(this).addClass("selected");
        $(".paper-box").removeClass("paper-box");
        $(".paper-footer").attr("style","background-color:"+s_ys);
        $(".paper-article").attr("style", "padding:20px; margin-top:0; color:#666");
        $("#article_content_setting").attr("color-scheme", a);
        f.scheme = a;
        viewSettingJSON = createJSON(f);
        $dvb=$.cookie("RCViewSetting_m", viewSettingJSON, {expires: 15});
        return false
    });
    $(this).bind("mousedown", function (a) {
        if (window.event) {
            a = window.event
        }
        if ((a.button == 0 || a.button == 2)) {
            if (a.button == 0 && a.target.tagName.toUpperCase() == "HTML") {
                return true
            }
            if ($("#pop-show").css("display") != "none") {
                return true
            }
            return false
        }
    });
    $("body").bind("contextmenu", function () {
        return false
    }).bind("selectstart", function () {
        return false
    }).bind("copy", function () {
        return false
    });
    $(document).bind("touchmove", function () {
        tool_set("hide");
        $("#article_wrapper").removeClass("wrapper")
    });
    $("body > *").on("click", function () {
    });
    $(document).on("click", function (e) {
        if (e.target.id == "down_img") {
            return true
        }
        var set_lock = true;
        $(".popover").each(function () {
            if (!$(this).hasClass("hidden")) {
                set_lock = false
            }
        });
        if (set_lock && $(e.target).parents("#bottom_tool_bar").length == 0 && $(e.target).parents("#inner-header").length == 0 && $(e.target).parents(".popover").length == 0 && (!$(e.target).hasClass("inner-header") && $(e.target).parents(".loadbox").length == 0)) {
            tool_set("toggle");
            $("#article_setting").addClass("hidden");
            $("#offline_cache").addClass("hidden");
            $(".km-xz").removeClass("hidden");
            $(".km-xz-v2").removeClass("hidden");
            $("#article_wrapper").toggleClass("wrapper")
        }
    });
    $(window).scroll(function () {
        if (!clear_lock) {
            $("#article_content_setting").removeAttr("style")
        }
        $(".popover").each(function () {
            if (!$(this).hasClass("hidden")) {
                scroll_lock = false
            }
        });
        if (null != $.cookie("b_ydsc")) {
            return false
        }
        scrolling_handle();
        setting.scroll_top = $(window).scrollTop();
        if (setting.unlock && !setting.fill_lock && scroll_lock) {
            var b = $("#prev_cid").val(), next_cid = $("#next_cid").val();
            setting.unlock = false;
            $("#prefetching_show").hide();
            var current_time = (new Date()).valueOf();
            if (canTpload() && setting.direction != 1) {
                if ($(".loadbox").length <= 2) {
                    $(".J_content:first").before(create_loading());
                    $(".loadbox:first").addClass("first-load")
                }
                if ($("#prev_cid").val() == "" || $("#prev_cid").val() == 0) {
                    var _tip = "��ǰ�Ѿ��ǵ�һ�£�";
                    showLoading(_tip, "UP");
                    setting.unlock = true;
                    return false
                } else {
                    getContent(setting.bid, b, "UP");
                    return false
                }
            } else {
                if (canBtload() && setting.direction != -1) {
                    if (($("#next_cid").val() == "") || ($("#next_cid").val() == 0)) {
                        var _tip = "��ǰ�Ѿ������һ�£�";
                        showLoading(_tip, "DOWN");
                        setting.unlock = true;
                        return false
                    } else {
                        getContent(setting.bid, next_cid, "DOWN");
                        return false
                    }
                } else {
                    setting.unlock = true
                }
            }
            clearTimeout(setting.t)
        }
    });
    var startX, startY, diffX, diffY;
    $(document).on("touchstart", function (e) {
        startX = e.originalEvent.changedTouches[0].pageX, startY = e.originalEvent.changedTouches[0].pageY
    });
    $(document).on("touchmove", function (e) {
        moveEndX = e.originalEvent.changedTouches[0].pageX, moveEndY = e.originalEvent.changedTouches[0].pageY, diffX = moveEndX - startX;
        diffY = moveEndY - startY;
        if (diffY > 0 && Math.abs(diffY) > Math.abs(diffX)) {
            if (canTpload() && setting.unlock && !setting.fill_lock && scroll_lock) {
                if ($(".loadbox").length <= 2) {
                    $(".J_content:first").before(create_loading());
                    $(".loadbox:first").addClass("first-load")
                }
                if ($("#prev_cid").val() == "" || $("#prev_cid").val() == 0) {
                    var _tip = "��ǰ�Ѿ��ǵ�һ�£�";
                    showLoading(_tip, "UP");
                    setting.unlock = true;
                    return false
                } else {
                    getContent(setting.bid, $("#prev_cid").val(), "UP");
                    return false
                }
            }
        }
    });
    $("#pre_fetch_content").click(function () {
        $("#offline_cache").addClass("hidden");
        tool_set("hide");
        $("#article_wrapper").removeClass("wrapper");
        var a = $("#chapter_id").val();
        if (!a) {
            return false
        }
        if (null != $.cookie("b_ydsc")) {
            return false
        }
        var b = isLocalStorageSupported();
        if ((!window.localStorage) || (!b)) {
            prefetchFailHandle("��֧��Ԥȡ���볢�Թر��޺������");
            return false
        }
        $("#prefetching_show").show();
        prefetchingContent(a, 1);
        $("#prefetch_finish_pop").on("click", ".popover-close", function () {
            $(".km-xz-v2").removeClass("hidden")
        })
    });
    $(".pop-fixed").on("click", ".popover-close", function () {
        setting.unlock = true;
        scroll_lock = true;
        $(".pop-fixed").find(".popover").addClass("hidden")
    });
    $("#prefetch_buy_confirm").click(function () {
        var a = $("#chapter_id").val();
        if (!a) {
            return false
        }
        if (null != $.cookie("b_ydsc")) {
            return false
        }
        $("#prefetching_show").show();
        $("#offline_cache").addClass("hidden");
        prefetchingContent(a, 2)
    });
    $("#article_content_setting").on("click", ".loadbox", function (event) {
        var e = $("#click_load_cid").val(), _dir = "DOWN";
        if (0 == e) {
            return false
        }
        if ($(".J_content").length >= 2) {
            if ($(event.target).parents().hasClass("first-load")) {
                $(".i-loadCircle").first().show();
                $(".loadbox span").first().html("���ڼ�����һ��");
                $(".loadbox").first().show();
                _dir = "UP"
            } else {
                $(".i-loadCircle").last().show();
                $(".loadbox span").last().html("���ڼ�����һ��");
                $(".loadbox").last().show()
            }
        } else {
            $(".i-loadCircle").last().show();
            $(".loadbox span").last().html("���ڼ�����");
            $(".loadbox").last().show()
        }
        $("#click_load_cid").val(0);
        $.ajax({
            type: "get", url: "/index.php?c=bookChapter&a=ajaxGetContent&bid=" + setting.bid + "&cid=" + e, timeout: 8000, success: function (a) {
                var b = eval("(" + a + ")"), status = b.status;
                if (status == 1) {
                    getcontendHandle("SUCCESS", b, "DOWN")
                } else {
                    if (status == 2 || status == 3 || status == 4 || status == 8) {
                        var c = "���ݼ���ʧ�ܣ���������";
                        showLoadingError(c, setting.bid, e, "DOWN")
                    } else {
                        if (status == 5) {
                            var d = "/index.php?c=user&a=login&forward=" + ("/chapter/" + b.bookId + "_" + b.cid + ".html"), reg_url = "/index.php?c=user&a=register&forward=" + ("/chapter/" + b.bookId + "_" + b.cid + ".html");
                            $("#login_forward_url").attr("href", d);
                            $("#reg_forward").attr("href", reg_url);
                            $("#need_login_pop").bookPopup("show")
                        } else {
                            if (status == 6) {
                                if ($(".first-load").length > 0) {
                                    $("#sub_direction").val(2)
                                }
                                setPopWindow(b, "subscribe");
                                $("#subscribe_show").bookPopup("show")
                            } else {
                                if (status == 7) {
                                    $("#need_recharge_pop").bookPopup("show")
                                }
                            }
                        }
                    }
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                var error_str = "�����쳣����������";
                showLoadingError(error_str, setting.bid, e, _dir)
            }
        })
    });
    $("#article_content_setting").on("click", ".g-fullscreen-center", function (event) {
        var e = $("#click_load_cid").val();
        if (0 == e) {
            return false
        }
        $(".icon-refresh").removeClass("refresh-error");
        $(".g-fullscreen-center .txt").html("���ڼ�����");
        $("#click_load_cid").val(0);
        $.ajax({
            type: "get", url: "/index.php?c=bookChapter&a=ajaxGetContent&bid=" + setting.bid + "&cid=" + e, timeout: 8000, success: function (a) {
                var b = eval("(" + a + ")"), status = b.status;
                if (status == 1) {
                    getcontendHandle("SUCCESS", b, "DOWN")
                } else {
                    if (status == 2 || status == 3 || status == 4 || status == 8) {
                        var c = "���ݼ���ʧ�ܣ���������";
                        showFirstError(c, e)
                    } else {
                        if (status == 5) {
                            var d = "/index.php?c=user&a=login&forward=" + ("/chapter/" + b.bookId + "_" + b.cid + ".html"), reg_url = "/index.php?c=user&a=register&forward=" + ("/chapter/" + b.bookId + "_" + b.cid + ".html");
                            $("#login_forward_url").attr("href", d);
                            $("#reg_forward").attr("href", reg_url);
                            $("#need_login_pop").bookPopup("show")
                        } else {
                            if (status == 6) {
                                if ($(".first-load").length > 0) {
                                    $("#sub_direction").val(2)
                                }
                                setPopWindow(b, "subscribe");
                                $("#subscribe_show").bookPopup("show")
                            } else {
                                if (status == 7) {
                                    $("#need_recharge_pop").bookPopup("show")
                                }
                            }
                        }
                    }
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                var error_str = "�����쳣����������";
                showFirstError(error_str, e)
            }
        })
    });
    $("#subscribe_show").on("click", ".rc-label", function () {
        if (1 == parseInt($("#auto").val())) {
            document.getElementById("auto").checked = true;
            $("#auto").val(0)
        } else {
            document.getElementById("auto").checked = false;
            $("#auto").val(1)
        }
    });
    $("#confirm_subscribe").click(function () {
        var d = parseInt($("#sub_book_id").val()), sub_cid = $("#sub_chapter_id").val(), autoRss = parseInt($("#auto").val());
        if (!sub_cid || !d) {
            return false
        }
        $.ajax({
            type: "get", url: "/index.php?c=bookChapter&a=ajaxGetContent&bid=" + d + "&cid=" + sub_cid + "&buy=1&autoRss=" + autoRss, timeout: 8000, success: function (a) {
                var b = eval("(" + a + ")"), status = b.status;
                if (status == 1) {
                    var _dir = "DOWN";
                    if (parseInt($("#sub_direction").val()) > 0) {
                        _dir = "UP"
                    }
                    getcontendHandle("SUCCESS", b, _dir);
                    $("#subscribe_show").bookPopup("hide")
                } else {
                    if (status == 7) {
                        $("#need_recharge_pop").bookPopup("show")
                    } else {
                        var c = "���ݼ���ʧ�ܣ���������";
                        showLoadingError(c, d, sub_cid, "DOWN");
                        $("#subscribe_show").bookPopup("hide")
                    }
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                var error_str = "�����쳣����������";
                showLoadingError(error_str, d, sub_cid, "DOWN")
            }
        })
    });
    $("#prev_chapter_a").click(function () {
        tool_set("hide");
        $("#article_wrapper").removeClass("wrapper");
        var b = $("#prev_cid").val();
        if ($("#prev_cid").val() == "" || $("#prev_cid").val() == 0) {
            var c = "��ǰ�Ѿ��ǵ�һ�£�";
            showLoading(c, "UP");
            return false
        } else {
            if (setting.current_page == 2) {
                $(window).scrollTop($(".J_content > h1:first").offset().top);
                return false
            } else {
                var d = getPrefetchContent(setting.bid, b);
                if (d) {
                    fillin_content(d, "UP");
                    return false
                } else {
                    window.location.href = "/chapter/" + setting.bid + "_" + $("#prev_cid").val() + ".html";
                    return false
                }
            }
        }
    });
    $("#next_chapter_a").click(function () {
        tool_set("hide");
        $("#article_wrapper").removeClass("wrapper");
        var b = $("#next_cid").val();
        if (($("#next_cid").val() == "") || ($("#next_cid").val() == 0)) {
            var c = "��ǰ�Ѿ������һ�£�";
            showLoading(c, "DOWN");
            return false
        } else {
            if (setting.content_pages >= 2 && setting.current_page == 1) {
                $(window).scrollTop($(".J_content > h1:last").offset().top);
                return false
            } else {
                var d = getPrefetchContent(setting.bid, b);
                if (d) {
                    fillin_content(d, "DOWN");
                    return false
                } else {
                    window.location.href = "/chapter/" + setting.bid + "_" + $("#next_cid").val() + ".html";
                    return false
                }
            }
        }
    })
});
setting = {unlock: true, bid: parseInt($("#book_id").val()), t: null, last_down_req_time: (new Date()).valueOf(), last_up_req_time: (new Date()).valueOf(), fill_lock: false, load_tigger: 40, direction: 0, scroll_top: 0, content_pages: 0, current_page: 1};

function show_font() {
    if ($("#font_layer").css("display") == "none") {
        $("#font_layer").show();
        $(".toolbar li:eq(3)").addClass("cur")
    } else {
        $("#font_layer").hide();
        $(".toolbar li:eq(3)").removeClass("cur")
    }
}

function createJSON(a) {
    if (a === "undefined") {
        return false
    }
    var b = "{";
    var c = new Array();
    for (x in a) {
        c.push(x + ":" + '"' + a[x] + '"')
    }
    b += c.join(",");
    b += "}";
    delete c;
    return b
}

function windowJump(_type, _flag, _loc, _cid, _cid2) {
    var dir = "DOWN";
    if (typeof _type != "undefined" && _type.toUpperCase() == "UP") {
        dir = _type
    }
    if (_flag) {
        setting.fill_lock = false;
        if (dir.toUpperCase() == "DOWN") {
            $(".loadbox").last().hide();
            $(window).scrollTop(_loc);
            setting.last_down_req_time = (new Date()).valueOf();
            $("#prev_cid").val(_cid2)
        } else {
            $(".loadbox").first().hide();
            setting.last_up_req_time = (new Date()).valueOf();
            $("#next_cid").val(_cid2)
        }
    }
    if (dir.toUpperCase() == "UP") {
        $(window).scrollTop($(".J_content > h1:last").offset().top - setting.load_tigger);
        $("#prev_cid").val(_cid)
    } else {
        $("#next_cid").val(_cid)
    }
    shot_content();
    if ($(".loadbox").length >= 3) {
        $(".loadbox").first().remove()
    }
}

function getcontendHandle(_status, _content, _direction) {
    if (typeof _status == "undefined" || null == _content || typeof _content != "object") {
        return false
    }
    if (_status == "SUCCESS" && _content.status == 1) {
        setting.unlock = true;
        scroll_lock = true;
        fillin_content(_content, _direction)
    } else {
        return false
    }
}

function showLoading(a, b) {
    if (!a) {
        return false
    }
    var c = "DOWN";
    if (b.toUpperCase() == "UP") {
        c = b
    }
    if (c.toUpperCase() == "UP") {
        $(".i-loadCircle").first().show();
        $(".loadbox").first().show();
        $(".i-loadCircle").first().hide();
        $(".loadbox span").first().html(a);
        if ($(".loadbox").length > 2) {
            setTimeout("remove_tip()", 2000)
        } else {
            setTimeout("$('.loadbox').hide();", 2000)
        }
        return false
    } else {
        $(".i-loadCircle").last().show();
        $(".loadbox").last().show();
        $(".i-loadCircle").last().hide();
        $(".loadbox span").last().html(a);
        setTimeout("$('.loadbox').hide();", 2000);
        return false
    }
}

function showLoadingError(a, b, c, d) {
    if (!a || !b || !c || b != setting.bid) {
        return false
    }
    var e = "DOWN";
    if (d.toUpperCase() == "UP") {
        e = d
    }
    if (e.toUpperCase() == "UP") {
        $(".i-loadCircle").first().show();
        $(".loadbox").first().show();
        setTimeout("$('.i-loadCircle').hide();$('.loadbox > span').first().html('" + a + "');", 2000)
    } else {
        $(".i-loadCircle").last().show();
        $(".loadbox").last().show();
        setTimeout("$('.i-loadCircle').hide();$('.loadbox > span').last().html('" + a + "');", 2000)
    }
    $("#click_load_cid").val(c)
}

function showFirstError(_str, _cid) {
    if (typeof _cid == "undefined" || _cid == "" || typeof _str == "undefined" || _str == "") {
        return false
    }
    $("#click_load_cid").val(_cid);
    setTimeout("$('.icon-refresh').addClass('refresh-error');$('.g-fullscreen-center .txt').html('" + _str + "');", 2000)
}

function getPrefetchContent(a, b) {
    if (typeof a == "undefined" || typeof b == "undefined") {
        return false
    }
    var c = window.localStorage, book_id = c.getItem("prefecth_book_id");
    if (null == book_id || a != parseInt(book_id)) {
        return false
    }
    var d = (JSON.parse(c.getItem(b + "_prefetch"))) || JSON.parse(c.getItem("0" + b + "_prefetch"));
    return d
}

function getContent(_book_id, _chapter_id, _dir) {
    if (typeof _book_id == "undefined" || typeof _chapter_id == "undefined") {
        setting.unlock = true;
        return false
    }
    var cur_cid = $("#chapter_id").val(), direction = "DOWN";
    if (_dir.toUpperCase() == "UP") {
        direction = _dir
    }
    if (_chapter_id == cur_cid) {
        setting.unlock = true;
        return false
    }
    if (direction.toUpperCase() == "UP") {
        $(".loadbox span").first().html("���ڼ�����һ��");
        $(".loadbox").first().show();
        $(".i-loadCircle").first().show()
    } else {
        $(".loadbox span").last().html("���ڼ�����һ��");
        $(".loadbox").last().show();
        $(".i-loadCircle").last().show()
    }
    var pref_content = getPrefetchContent(_book_id, _chapter_id);
    if (null != pref_content && "object" == typeof pref_content) {
        fillin_content(pref_content, direction);
        setting.unlock = true;
        return false
    }
    $.ajax({
        type: "get", url: "/index.php?c=bookChapter&a=ajaxGetContent&bid=" + _book_id + "&cid=" + _chapter_id, timeout: 8000, success: function (a) {
            var b = eval("(" + a + ")"), status = b.status;
            if (status == 1) {
                setReadFlag(_book_id, _chapter_id);
                getcontendHandle("SUCCESS", b, direction)
            } else {
                if (status == 2 || status == 3 || status == 4 || status == 8) {
                    var error_str = "���ݼ���ʧ�ܣ���������";
                    showLoadingError(error_str, _book_id, _chapter_id, direction);
                    setting.unlock = true
                } else {
                    if (status == 5) {
                        var d = "/index.php?c=user&a=login&forward=" + ("/chapter/" + b.bookId + "_" + b.cid + ".html"), reg_url = "/index.php?c=user&a=register&forward=" + ("/chapter/" + b.bookId + "_" + b.cid + ".html");
                        $("#reg_forward").attr("href", reg_url);
                        $("#login_forward_url").attr("href", d);
                        $("#need_login_pop").bookPopup("show");
                        setting.unlock = true
                    } else {
                        if (status == 6) {
                            setPopWindow(b, "subscribe");
                            if (_dir.toUpperCase() == "UP") {
                                $("#sub_direction").val(2)
                            }
                            $("#subscribe_show").bookPopup("show");
                            setting.unlock = true
                        } else {
                            if (status == 7) {
                                $("#need_recharge_pop").bookPopup("show");
                                setting.unlock = true
                            }
                        }
                    }
                }
            }
        }, error: function (jqXHR, textStatus, errorThrown) {
            var error_str = "�����쳣����������";
            showLoadingError(error_str, _book_id, _chapter_id, direction);
            setting.unlock = true
        }
    });
    return false
}

function prefetchHandle(a, b, c) {
    if (typeof a == "undefined" || typeof b == "undefined" || typeof c == "undefined") {
        return false
    }
    window.localStorage.clear();
    window.localStorage.setItem("prefecth_book_id", a);
    window.localStorage.setItem("prefecth_cid", c);
    for (var x in b.downloadContent) {
        var d = b.downloadContent[x];
        var e = {"cid": d.id, "prev_cid": d.prevCid, "next_cid": d.nextCid, "content": d.content, "title": d.title, "page_title": d.pageTitle};
        window.localStorage.setItem(d.id + "_prefetch", JSON.stringify(e))
    }
}

function canBtload() {
    var a = $(window).scrollTop() + window.innerHeight >= $(document).height() - setting.load_tigger, cur_time = (new Date()).valueOf();
    return a && (cur_time - setting.last_down_req_time) >= 1000
}

function canTpload() {
    var a = $(window).scrollTop() <= setting.load_tigger, cur_time = (new Date()).valueOf();
    return a && (cur_time - setting.last_up_req_time) >= 1000
}

function prefetchBuyHandle(a) {
    if (typeof a == "undefined" || null == a) {
        return false
    }
    $("#pre_chapter_count").html("�����½���: " + a.total + " ��");
    $("#pre_chapter_range").html("�ӵ�" + a.fromCid + "�� ~ ��" + a.toCid + "��");
    $("#pre_chapter_currency").html(a.currency);
    $("#pre_user_current_currency").html(a.userCurrency);
    $("#pre_bottom_tip").html("��������½�" + a.freeCount + "�£��ѹ����½�" + a.hasBuy + "�£�����½ڼ��ѹ����½ڲ���۷�")
}

function prefetchFailHandle(a) {
    if (typeof a == "undefined" || null == a) {
        return false
    }
    $("#prefetch_finish_pop").bookPopup("show");
    $("#prefetch_finish_pop h4").html("Ԥȡʧ��");
    $("#prefetch_finish_pop p").html(a);
    $("#prefetching_show").hide()
}

function prefetchingContent(c, d) {
    if (typeof c == "undefined" || null == c || null == d) {
        return false
    }
    var e = window.localStorage.getItem("prefecth_cid");
    if (c == e) {
        $("#prefetch_finish_pop").bookPopup("show");
        $("#prefetch_finish_pop h4").html("Ԥȡ�ɹ�");
        $("#prefetch_finish_pop p").html("����Ԥȡ�ɹ���");
        $("#prefetching_show").hide();
        return false
    }
    var f = "";
    if (d == 1) {
        f = "/index.php?c=bookChapter&a=ajaxPrefetchContent&bid=" + setting.bid + "&cid=" + c
    } else {
        f = "/index.php?c=bookChapter&a=ajaxPrefetchContent&bid=" + setting.bid + "&cid=" + c + "&buy=1"
    }
    $.ajax({
        type: "get", url: f, timeout: 8000, success: function (a) {
            var b = eval("(" + a + ")"), status = b.status;
            if (status == 1) {
                prefetchHandle(setting.bid, b, c);
                $("#prefetch_finish_pop").bookPopup("show");
                $("#prefetch_finish_pop h4").html("Ԥȡ�ɹ�");
                $("#prefetch_finish_pop p").html("�ѳɹ�Ԥȡ����" + b.toCid + "��");
                $("#prefetching_show").hide()
            } else {
                if (status == 5) {
                    $("#need_recharge_pop").bookPopup("show");
                    $("#prefetching_show").hide()
                } else {
                    if (status == 4) {
                        prefetchBuyHandle(b);
                        $("#prefetch_need_pay").bookPopup("show");
                        $("#prefetching_show").hide()
                    } else {
                        if (status == 8) {
                            prefetchFailHandle("VIP�û�����Ԥȡ������")
                        } else {
                            if (status == 7) {
                                prefetchFailHandle("Ԥȡʧ�ܣ���ǰ������½ڣ�")
                            } else {
                                if (status == 9) {
                                    prefetchHandle(setting.bid, b, c);
                                    prefetchFailHandle("����ʧ�ܣ��ѻ�����Ѻ��ѹ��½ڣ�")
                                } else {
                                    prefetchFailHandle("Ԥȡʧ�ܣ����Ժ�����")
                                }
                            }
                        }
                    }
                }
            }
        }, error: function (jqXHR, textStatus, errorThrown) {
            var error_str = "�����쳣����������";
            prefetchFailHandle("Ԥȡʧ�ܣ����Ժ�����")
        }
    })
}

function showReadPop(a, b) {
    if (null == a || typeof a == "undefined" || null == b || typeof b == "undefined") {
        return false
    }
    var c = true, view_list = "", show = false;
    if (!$.cookie("RCViewpop_show_m")) {
        if ($.cookie("RCViewBackup_m")) {
            view_list = $.cookie("RCViewBackup_m");
            if (view_list.split("_").length >= 3) {
                $("#download_app_pop").bookPopup("show");
                $.cookie("RCViewpop_show_m", 1, {expires: 1, path: "/"});
                $.cookie("RCViewBackup_m", null);
                show = true
            }
            if (-1 != view_list.indexOf(b + "-" + a)) {
                c = false
            }
        }
        if (c && !show) {
            $.cookie("RCViewBackup_m", view_list + b + "-" + a + "_", {expires: 1, path: "/"})
        }
    }
}

function isLocalStorageSupported() {
    try {
        window.localStorage.setItem("test", "testValue");
        window.localStorage.removeItem("test");
        return true
    } catch (error) {
        return false
    }
}

function showChapter(a) {
    if (typeof a == "undefined" || null == a) {
        return false
    }
    if (typeof CryptoJS == "undefined" || !CryptoJS) {
        return false
    }
    data = $.trim(a);
    var b = CryptoJS.enc.Latin1.parse("1234567812345678");
    var c = CryptoJS.enc.Latin1.parse("1234567812345676");
    var d = CryptoJS.AES.decrypt(data, b, {iv: c, padding: CryptoJS.pad.ZeroPadding});
    return d.toString(CryptoJS.enc.Utf8)
}

function shot_content() {
    if ($(window).height() >= $(document).height()) {
        $("#article_content_setting").height($(document).height());
        clear_lock = true
    } else {
        $("#article_content_setting").removeAttr("style");
        clear_lock = false
    }
}

function fillin_content(_content, _direction) {
    if (null == _content || typeof _content != "object") {
        return false
    }
    var new_chapter = create_chapter(_content), jump_flag = $(".J_content").length >= 2, set_id = 0, scr_loc = 0, set_cid = 0, set_cid2 = 0;
    if (jump_flag) {
        setting.fill_lock = true;
        if ("DOWN" == _direction.toUpperCase()) {
            scr_loc = $(window).scrollTop() - $(".J_content > h1:last").offset().top + setting.load_tigger
        }
    } else {
        setting.fill_lock = false
    }
    if ("UP" == _direction.toUpperCase()) {
        $(".loadbox").first().fadeOut(function () {
            $(this).hide();
            if (typeof _content.prev_cid != "undefined" && _content.prev_cid) {
                set_cid = _content.prev_cid
            }
            if ($(".J_content").length >= 2) {
                set_cid2 = $(".J_content:last").attr("data-id");
                $(".J_content").last().remove();
                $(".loadbox").last().remove()
            }
            if ($(".J_content p").length == 0) {
                $(".J_content").replaceWith(new_chapter);
                $(".loadbox").last().remove()
            } else {
                $(".J_content").first().before(new_chapter)
            }
            $("#chapter_id").val(_content.cid);
            windowJump(_direction, jump_flag, scr_loc, set_cid, set_cid2);
            cookie_handle(_content);
            setting.unlock = true
        })
    } else {
        $(".loadbox").last().fadeOut(function () {
            $(this).hide();
            if (typeof _content.next_cid != "undefined" && _content.next_cid) {
                set_cid = _content.next_cid
            }
            if ($(".J_content").length >= 2) {
                set_cid2 = $(".J_content:first").attr("data-id");
                $(".J_content").first().remove();
                $(".loadbox").first().remove()
            }
            if ($(".J_content p").length == 0) {
                $(".J_content").replaceWith(new_chapter);
                $(".loadbox").last().remove()
            } else {
                $(".loadbox").last().after(new_chapter)
            }
            $("#chapter_id").val(_content.cid);
            windowJump(_direction, jump_flag, scr_loc, set_cid, set_cid2);
            cookie_handle(_content);
            setting.unlock = true
        })
    }
}

function create_chapter(_content) {
    if (null == _content || typeof _content != "object" || typeof _content.content == "undefined" || typeof _content.title == "undefined") {
        return false
    }
    var content_show = showChapter(_content.content);
    if (!content_show) {
        var html_show = "<h1>" + _content.title + "</h1>" + "<p>���ݼ���ʧ�ܣ��볢��ˢ��ҳ�档</p>"
    } else {
        var html_show = "<h1>" + _content.title + "</h1>" + content_show
    }
    var html_str = '<div class="content J_content" data-id="' + _content.cid + '">' + html_show;
    var downloadStr = "</div>";
    if (downloadStatus == 1) {
        downloadStr = '<a href="http://mbook.km.com/index.php?c=tuiguang&a=downloadPackage&bookid=' + book_id + '&channel=wapdownload" onclick="cc(\'ck_m_yuedu_banner\')" class="article-content-ivy"><span class="s-tit">���ڿ�ʼ����Ķ�</span><span class="s-name">��' + book_title + "��</span></a></div>";
        if (navigator.userAgent.toLocaleLowerCase().indexOf("iphone") >= 0) {
            downloadStr = '<a href="javascript:void(0);" onclick="ios_download_pop()" class="article-content-ivy"><span class="s-tit">���ڿ�ʼ����Ķ�</span><span class="s-name">��' + book_title + "��</span> </a></div>"
        }
    }
    html_str += downloadStr;
    html_str += create_loading();
    return html_str
}

function create_loading() {
    var loading_box = '<div class="g-loading loadbox" style="display:none"><em class="i-loadCircle click_get_content"></em><span>��������Ϊ�������У����Ժ�</span></div>';
    return loading_box
}

function cookie_handle(_content) {
    if (null == _content || typeof _content != "object" || typeof _content.cid == "undefined" || typeof _content.title == "undefined") {
        return false
    }
    $.cookie("RCViewHistory_m_" + j_front_book.url_id, "http://book.km.com/chapter/" + setting.bid + "_" + _content.cid + ".html" + "," + "<h1>" + _content.title + "</h1>", {path: "/", expires: 365});
    showReadPop(_content.cid, setting.bid);
    $("#click_load_cid").val(0)
}

function set_scroll_direction() {
    if (setting.scroll_top - $(window).scrollTop() > 0) {
        setting.direction = -1
    } else {
        if (setting.scroll_top - $(window).scrollTop() < 0) {
            setting.direction = 1
        } else {
            setting.direction = 0
        }
    }
}

function set_content_page() {
    if ($(".J_content").length <= 2 && $(".J_content").length > 0) {
        setting.content_pages = $(".J_content").length;
        if ($(".J_content").length >= 2 && $(window).scrollTop() > $(".J_content > h1:last").offset().top) {
            setting.current_page = 2;
            $("#content_title").html($(".J_content h1:last").html() + "_" + book_title + "")
        } else {
            setting.current_page = 1;
            $("#content_title").html($(".J_content h1:first").html() + "_" + book_title + "")
        }
    } else {
        setting.content_pages = 0;
        setting.current_page = 1
    }
}

function scrolling_handle() {
    set_scroll_direction();
    set_content_page()
}

function tool_set(_event) {
    if (typeof _event == "undefined" || _event == "" || _event == "hide") {
        $("#bottom_tool_bar").hide();
        $("#inner-header").hide();
        return false
    } else {
        if (_event == "toggle") {
            if ($(window).width() < 767 || $(document).width() < 767) {
                $("#bottom_tool_bar").toggle();
            }
            $("#inner-header").toggle();
            return false
        } else {
            return false
        }
    }
}

function remove_tip() {
    if ($(".loadbox").length > 2) {
        $(".loadbox").hide();
        $(".loadbox").first().remove()
    }
}

function setReadFlag(bid, cid) {
    var readFlagArr = [], hasFlag = false;
    if (localStorage.getItem("readFlag")) {
        readFlagArr = JSON.parse(localStorage.getItem("readFlag"));
        hasFlag = readFlagArr.some(function (it) {
            if (it.book_id == bid) {
                it.chapter_id = cid;
                return true
            }
        })
    }
    if (!hasFlag) {
        readFlagArr.push({book_id: bid, chapter_id: cid})
    }
    localStorage.setItem("readFlag", JSON.stringify(readFlagArr))
}

function apkInfo() {
    $.ajax({
        url: "/index.php?c=bookDetail&a=apkBookInfo&url_id=" + j_front_book.url_id, type: "get", success: function (_data) {
            $(".data-clipboard").attr("data-clipboard-text", _data);
            $(".secret_book").text(_data)
        }
    }).always(function () {
        _ajax_lock = false
    })
}

function getBroswer() {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/edge\/([\d.]+)/)) ? Sys.edge = s[1] : (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] : (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] : (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] : (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
    if (Sys.edge) {
        return {broswer: "Edge", version: Sys.edge}
    }
    if (Sys.ie) {
        return {broswer: "IE", version: Sys.ie}
    }
    if (Sys.firefox) {
        return {broswer: "Firefox", version: Sys.firefox}
    }
    if (Sys.chrome) {
        return {broswer: "Chrome", version: Sys.chrome}
    }
    if (Sys.opera) {
        return {broswer: "Opera", version: Sys.opera}
    }
    if (Sys.safari) {
        return {broswer: "Safari", version: Sys.safari}
    }
    return {broswer: "", version: "0"}
}

$(function () {
    apkInfo();
    $(".km-xz-v3 .i-close-btn").on("click", function () {
        $(".km-xz-v3").css("display", "none");
        $(".km-xz-v2").css("display", "");
        return false
    })
});
if (!j_front_book.error) {
    $.ajax({
        type: "post", url: "/index.php?c=bookChapter&a=ajaxGetContent&bid=" + j_front_book.book_id + "&cid=" + j_front_book.current_chapter_id, async: true, success: function (a) {
            var b = eval("(" + a + ")"), status = b.status;
            if (status == 1) {
                if (!j_front_book.is_wechat && !j_front_book.is_ios) {
                    var content_show = showChapter(b.content) + '<a href="http://mbook.km.com/index.php?c=tuiguang&a=downloadPackage&bookid=' + book_id + '&channel=wapdownload" onclick="cc(\'ck_m_yuedu_banner\')" class="article-content-ivy"><span class="s-tit">���ڿ�ʼ����Ķ�</span><span class="s-name">��' + book_title + "��</span></a>"
                } else {
                    var content_show = showChapter(b.content)
                }
                if (!content_show) {
                    $("#click_load_cid").val(j_front_book.current_chapter_id);
                    setTimeout(function () {
                        $(".icon-refresh").addClass("refresh-error");
                        $(".g-fullscreen-center .txt").html("���ݼ���ʧ�ܣ��볢��ˢ��ҳ�档")
                    }, 2000)
                } else {
                    $(".g-fullscreen-center").remove();
                    $(".J_content").append(content_show);
                    if ($(window).height() >= $("#article_content_setting").height()) {
                        var blan_height = $(document).height() - $(window).height();
                        $("#article_content_setting").height(blan_height + $("#article_content_setting").height() + 200);
                        clear_lock = true
                    }
                    showReadPop(j_front_book.current_chapter_id, j_front_book.book_id);
                    if (typeof restoreViewHistory != "undefined") {
                        restoreViewHistory(url_id, window.location.href + "," + j_front_book.current_chapter_title + " . ',' . " + j_front_book.book.title + " . ',' . " + j_front_book.book_id)
                    }
                }
            } else {
                if (status == 2 || status == 3 || status == 4 || status == 8) {
                    $("#click_load_cid").val(j_front_book.current_chapter_id);
                    setTimeout(function () {
                        $(".icon-refresh").addClass("refresh-error");
                        $(".g-fullscreen-center .txt").html("���ݼ���ʧ�ܣ��볢��ˢ��ҳ�档")
                    }, 2000)
                } else {
                    if (status == 5) {
                        $(".g-fullscreen-center").remove();
                        var d = "/index.php?c=user&a=login&forward=/chapter/" + j_front_book.book_id + "_" + j_front_book.current_chapter_id + ".html", reg_url = "/index.php?c=user&a=register&forward=/chapter/" + j_front_book.book_id + "_" + j_front_book.current_chapter_id + ".html";
                        $("#login_forward_url").attr("href", d);
                        $("#reg_forward").attr("href", reg_url);
                        $("#need_login_pop").bookPopup("show", j_front_book.return_url)
                    } else {
                        if (status == 6) {
                            $(".g-fullscreen-center").remove();
                            setPopWindow(b, "subscribe");
                            $("#subscribe_show").bookPopup("show", j_front_book.return_url)
                        } else {
                            if (status == 7) {
                                $(".g-fullscreen-center").remove();
                                $("#need_recharge_pop").bookPopup("show", j_front_book.return_url)
                            }
                        }
                    }
                }
            }
        }, error: function (jqXHR, textStatus, errorThrown) {
            $("#click_load_cid").val(j_front_book.current_chapter_id);
            setTimeout(function () {
                $(".icon-refresh").addClass("refresh-error");
                $(".g-fullscreen-center .txt").html("���ݼ���ʧ�ܣ��볢��ˢ��ҳ�档")
            }, 2000)
        }
    })
} else {
    $("#click_load_cid").val(j_front_book.current_chapter_id);
    setTimeout(function () {
        $(".icon-refresh").addClass("refresh-error");
        $(".g-fullscreen-center .txt").html("���ݼ���ʧ�ܣ��볢��ˢ��ҳ�档")
    }, 2000)
}
var href = "http://mbook.km.com/index.php?c=tuiguang&a=downloadPackage&bookid=1350086&channel=wapdownload";
var browser = getBroswer();

function ios_download_pop() {
    $("html").addClass("html_user_select");
    $("body").unbind();
    var clipboard = new Clipboard(".data-clipboard");
    if (browser.broswer == "Safari" && browser.version < 10) {
        $("#download_hint").removeClass("hidden");
        $("#ios_download").css("display", "block")
    } else {
        if (Clipboard.isSupported()) {
            clipboard.on("success", function (e) {
                cc("ck_m_download_app");
                window.location.href = href;
                $("body").bind("contextmenu", function () {
                    return false
                }).bind("selectstart", function () {
                    return false
                }).bind("copy", function () {
                    return false
                })
            });
            clipboard.on("error", function (e) {
                if (e.text != $(".km-xz-v2 .data-clipboard").attr("data-clipboard-text")) {
                    $("#download_hint").removeClass("hidden");
                    $("#ios_download").css("display", "block")
                }
            })
        } else {
            $("#download_hint").removeClass("hidden");
            $("#ios_download").css("display", "block");
            $("body").bind("contextmenu", function () {
                return false
            }).bind("selectstart", function () {
                return false
            }).bind("copy", function () {
                return false
            })
        }
    }
}

if (navigator.userAgent.toLocaleLowerCase().indexOf("iphone") != -1) {
    var url = "https://at.umeng.com/HzCOHb";
    $("#offline_cache_down").attr("href", url);
    $(".km-xz-v2").attr("href", url);
    $(".content-download").attr("href", url);
    $(".deal-href").attr("href", url);
    $(".popover a").each(function (i) {
        if ($(this).hasClass("app-down")) {
            $(this).attr("href", url)
        }
    });
    $("#offline_cache_down").removeAttr("href");
    $(".km-xz-v2").removeAttr("href ");
    $(".app-down").removeAttr("href ");
    $(".km-xz-v2").removeAttr("onclick");
    $(".app-down").removeAttr("onclick");
    $(".content-download").removeAttr("href ");
    $(".deal-href").removeAttr("href ");
    $("#offline_cache_down").on("click", function () {
        $(".offline-cache").addClass("hidden");
        ios_download_pop()
    });
    $(".km-xz-v2").on("click", function () {
        ios_download_pop()
    });
    $(".deal-href").on("click", function () {
        ios_download_pop()
    });
    $(".content-download").on("click", function () {
        ios_download_pop()
    });
    $(".span-ios").on("click", function () {
        ios_download_pop()
    });
    $(".app-down").on("click", function () {
        $("#need_login_pop").bookPopup("hide");
        ios_download_pop()
    });
    $(".popover a").each(function (i) {
        if ($(this).hasClass("app-down")) {
            $(this).removeAttr("href ");
            $(this).on("click", function () {
                ios_download_pop()
            })
        }
    });
    $(".popover-close").on("click", function () {
        $("#download_hint").addClass("hidden");
        $("#ios_download").css("display", "none");
        $("body").bind("contextmenu", function () {
            return false
        }).bind("selectstart", function () {
            return false
        }).bind("copy", function () {
            return false
        })
    })
} else {
    href = $(".km-xz-v2").attr("href");
    $(".km-xz-v2").attr("href", "javascript:void(0);").css("cursor", "pointer");
    $(".km-xz-v2").on("click", function () {
        $("body").unbind();
        var clipboard = new Clipboard(".data-clipboard");
        if (Clipboard.isSupported()) {
            clipboard.on("error", function (e) {
                if (e.text != $(".km-xz-v2 .data-clipboard").attr("data-clipboard-text")) {
                    $("#download_hint").removeClass("hidden");
                    $("#ios_download").css("display", "block")
                }
                window.location.href = href
            });
            clipboard.on("success", function (e) {
                cc("ck_m_download_app");
                window.location.href = href;
                $("body").bind("contextmenu", function () {
                    return false
                }).bind("selectstart", function () {
                    return false
                }).bind("copy", function () {
                    return false
                })
            })
        } else {
            $("#download_hint").removeClass("hidden");
            $("#ios_download").css("display", "block")
        }
    })
}
;