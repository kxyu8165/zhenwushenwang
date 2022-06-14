(function(e) {
    e.fn.zclip = function(t) {
        if (typeof t == "object" && !t.length) {
            var n = e.extend({},
                ZeroClipboard.defaults, t);
            return this.each(function() {
                var t = e(this);
                if (t.is(":visible") && (typeof n.copy == "string" || e.isFunction(n.copy))) {
                    ZeroClipboard.setMoviePath(n.path);
                    var r = new ZeroClipboard.Client;
                    e.isFunction(n.copy) && t.bind("zClip_copy", n.copy),
                    e.isFunction(n.beforeCopy) && t.bind("zClip_beforeCopy", n.beforeCopy),
                    e.isFunction(n.afterCopy) && t.bind("zClip_afterCopy", n.afterCopy),
                        r.setHandCursor(n.setHandCursor),
                        r.setCSSEffects(n.setCSSEffects),
                        r.addEventListener("mouseOver",
                            function(e) {
                                t.trigger("mouseenter")
                            }),
                        r.addEventListener("mouseOut",
                            function(e) {
                                t.trigger("mouseleave")
                            }),
                        r.addEventListener("mouseDown",
                            function(i) {
                                t.trigger("mousedown"),
                                e.isFunction(n.beforeCopy) && t.trigger("zClip_beforeCopy"),
                                    e.isFunction(n.copy) ? r.setText(t.triggerHandler("zClip_copy")) : r.setText(n.copy)
                            }),
                        r.addEventListener("complete",
                            function(r, i) {
                                e.isFunction(n.afterCopy) ? t.trigger("zClip_afterCopy") : (i.length > 500 && (i = i.substr(0, 500) + "...\n\n(" + (i.length - 500) + " characters not shown)"), t.removeClass("hover")),
                                n.clickAfter && t.trigger("click")
                            }),
                        r.glue(t[0], t.parent()[0]),
                        e(window).bind("load resize",
                            function() {
                                r.reposition()
                            })
                }
            })
        }
        if (typeof t == "string") return this.each(function() {
            var n = e(this);
            t = t.toLowerCase();
            var r = n.data("zclipId"),
                i = e("#" + r + ".zclip"),
                s = i.attr("id").replace(/^.*_/g, "") || null;
            t == "remove" ? (i.remove(), n.removeClass("active hover"), n.unbind("zClip_copy"), n.unbind("zClip_beforeCopy"), n.unbind("zClip_afterCopy"), ZeroClipboard.unregister(s)) : t == "hide" ? (i.hide(), n.removeClass("active hover")) : t == "show" && i.show()
        })
    }
})(jQuery);
var ZeroClipboard = {
    version: "1.0.7",
    clients: {},
    moviePath: "ZeroClipboard.swf",
    nextId: 1,
    defaults: {
        path: "ZeroClipboard.swf",
        clickAfter: !0,
        setHandCursor: !0,
        setCSSEffects: !0,
        copy: null,
        beforeCopy: null,
        afterCopy: null
    },
    jQuery: function(e) {
        return typeof e == "string" && (e = document.getElementById(e)),
        e.addClass || (e.hide = function() {
            this.style.display = "none"
        },
            e.show = function() {
                this.style.display = ""
            },
            e.addClass = function(e) {
                this.removeClass(e),
                    this.className += " " + e
            },
            e.removeClass = function(e) {
                var t = this.className.split(/\s+/),
                    n = -1;
                for (var r = 0; r < t.length; r++) t[r] == e && (n = r, r = t.length);
                return n > -1 && (t.splice(n, 1), this.className = t.join(" ")),
                    this
            },
            e.hasClass = function(e) {
                return !! this.className.match(new RegExp("\\s*" + e + "\\s*"))
            }),
            e
    },
    setMoviePath: function(e) {
        this.moviePath = e
    },
    dispatch: function(e, t, n) {
        var r = this.clients[e];
        r && r.receiveEvent(t, n)
    },
    register: function(e, t) {
        this.clients[e] = t
    },
    unregister: function(e) {
        typeof e == "number" && this.clients.hasOwnProperty(e) && delete this.clients[e]
    },
    getDOMObjectPosition: function(e, t) {
        var n = {
            left: 0,
            top: 0,
            width: e.width ? e.width: e.offsetWidth,
            height: e.height ? e.height: e.offsetHeight
        };
        return e && e != t && (n.left += e.offsetLeft, n.top += e.offsetTop),
            n
    },
    Client: function(e) {
        this.handlers = {},
            this.id = ZeroClipboard.nextId++,
            this.movieId = "ZeroClipboardMovie_" + this.id,
            ZeroClipboard.register(this.id, this),
        e && this.glue(e)
    }
};
ZeroClipboard.Client.prototype = {
    id: 0,
    ready: !1,
    movie: null,
    clipText: "",
    handCursorEnabled: !0,
    cssEffects: !0,
    handlers: null,
    glue: function(e, t, n) {
        this.domElement = ZeroClipboard.jQuery(e);
        var r = 99;
        this.domElement.style.zIndex && (r = parseInt(this.domElement.style.zIndex, 10) + 1),
            typeof t == "string" ? t = ZeroClipboard.jQuery(t) : typeof t == "undefined" && (t = document.getElementsByTagName("body")[0]);
        var i = ZeroClipboard.getDOMObjectPosition(this.domElement, t);
        this.div = document.createElement("div"),
            this.div.className = "zclip",
            this.div.id = "zclip-" + this.movieId,
            jQuery(this.domElement).data("zclipId", "zclip-" + this.movieId);
        var s = this.div.style;
        s.position = "absolute",
            s.left = "" + i.left + "px",
            s.top = "" + i.top + "px",
            s.width = "" + i.width + "px",
            s.height = "" + i.height + "px",
            s.zIndex = r;
        if (typeof n == "object") for (var o in n) s[o] = n[o];
        t.appendChild(this.div),
            this.div.innerHTML = this.getHTML(i.width, i.height)
    },
    getHTML: function(e, t) {
        var n = "",
            r = "id=" + this.id + "&width=" + e + "&height=" + t;
        if (navigator.userAgent.match(/MSIE/)) {
            var i = location.href.match(/^https/i) ? "https://": "http://";
            n += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + i + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + e + '" height="' + t + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + ZeroClipboard.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor"  /><param name="flashvars" value="' + r + '"/><param name="wmode" value="transparent"/></object>'
        } else n += '<embed id="' + this.movieId + '" src="' + ZeroClipboard.moviePath + '" loop="false" menu="false" quality="best"  width="' + e + '" height="' + t + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="https://www.adobe.com/go/getflashplayer" flashvars="' + r + '" wmode="transparent" />';
        return n
    },
    hide: function() {
        this.div && (this.div.style.left = "-2000px")
    },
    show: function() {
        this.reposition()
    },
    destroy: function() {
        if (this.domElement && this.div) {
            this.hide(),
                this.div.innerHTML = "";
            var e = document.getElementsByTagName("body")[0];
            try {
                e.removeChild(this.div)
            } catch(t) {}
            this.domElement = null,
                this.div = null
        }
    },
    reposition: function(e) {
        e && (this.domElement = ZeroClipboard.jQuery(e), this.domElement || this.hide());
        if (this.domElement && this.div) {
            var t = ZeroClipboard.getDOMObjectPosition(this.domElement),
                n = this.div.style;
            n.left = "" + t.left + "px",
                n.top = "" + t.top + "px"
        }
    },
    setText: function(e) {
        this.clipText = e,
        this.ready && this.movie.setText(e)
    },
    addEventListener: function(e, t) {
        e = e.toString().toLowerCase().replace(/^on/, ""),
        this.handlers[e] || (this.handlers[e] = []),
            this.handlers[e].push(t)
    },
    setHandCursor: function(e) {
        this.handCursorEnabled = e,
        this.ready && this.movie.setHandCursor(e)
    },
    setCSSEffects: function(e) {
        this.cssEffects = !!e
    },
    receiveEvent: function(e, t) {
        e = e.toString().toLowerCase().replace(/^on/, "");
        switch (e) {
            case "load":
                this.movie = document.getElementById(this.movieId);
                var n = this;
                if (!this.movie) {
                    setTimeout(function() {
                            n.receiveEvent("load", null)
                        },
                        1);
                    return
                }
                if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                    setTimeout(function() {
                            n.receiveEvent("load", null)
                        },
                        100),
                        this.ready = !0;
                    return
                }
                this.ready = !0;
                try {
                    this.movie.setText(this.clipText)
                } catch(r) {}
                try {
                    this.movie.setHandCursor(this.handCursorEnabled)
                } catch(r) {}
                break;
            case "mouseover":
                this.domElement && this.cssEffects && (this.domElement.addClass("hover"), this.recoverActive && this.domElement.addClass("active"));
                break;
            case "mouseout":
                this.domElement && this.cssEffects && (this.recoverActive = !1, this.domElement.hasClass("active") && (this.domElement.removeClass("active"), this.recoverActive = !0), this.domElement.removeClass("hover"));
                break;
            case "mousedown":
                this.domElement && this.cssEffects && this.domElement.addClass("active");
                break;
            case "mouseup":
                this.domElement && this.cssEffects && (this.domElement.removeClass("active"), this.recoverActive = !1)
        }
        if (this.handlers[e]) for (var i = 0,
                                       s = this.handlers[e].length; i < s; i++) {
            var o = this.handlers[e][i];
            jQuery.isFunction(o) ? o(this, t) : typeof o == "object" && o.length == 2 ? o[0][o[1]](this, t) : typeof o == "string" && window[o](this, t)
        }
    }
},
    define("lib/jquery.zclip",
        function() {}),
    function(e, t, n) {
        typeof module != "undefined" && module.exports ? module.exports = n() : typeof define == "function" && define.amd ? define("lib/fingerprint", n) : t[e] = n()
    } ("Fingerprint", this,
        function() {
            "use strict";
            var e = function(e) {
                var t, n;
                t = Array.prototype.forEach,
                    n = Array.prototype.map,
                    this.each = function(e, n, r) {
                        if (e === null) return;
                        if (t && e.forEach === t) e.forEach(n, r);
                        else if (e.length === +e.length) {
                            for (var i = 0,
                                     s = e.length; i < s; i++) if (n.call(r, e[i], i, e) === {}) return
                        } else for (var o in e) if (e.hasOwnProperty(o) && n.call(r, e[o], o, e) === {}) return
                    },
                    this.map = function(e, t, r) {
                        var i = [];
                        return e == null ? i: n && e.map === n ? e.map(t, r) : (this.each(e,
                            function(e, n, s) {
                                i[i.length] = t.call(r, e, n, s)
                            }), i)
                    },
                    typeof e == "object" ? (this.hasher = e.hasher, this.screen_resolution = e.screen_resolution, this.screen_orientation = e.screen_orientation, this.canvas = e.canvas, this.ie_activex = e.ie_activex) : typeof e == "function" && (this.hasher = e)
            };
            return e.prototype = {
                get: function() {
                    var e = [];
                    e.push(navigator.userAgent),
                        e.push(navigator.language),
                        e.push(screen.colorDepth);
                    if (this.screen_resolution) {
                        var t = this.getScreenResolution();
                        typeof t != "undefined" && e.push(t.join("x"))
                    }
                    return e.push((new Date).getTimezoneOffset()),
                        e.push( + (new Date)),
                        e.push(this.hasSessionStorage()),
                        e.push(this.hasLocalStorage()),
                        e.push(this.hasIndexDb()),
                        document.body ? e.push(typeof document.body.addBehavior) : e.push(typeof undefined),
                        e.push(typeof window.openDatabase),
                        e.push(navigator.cpuClass),
                        e.push(navigator.platform),
                        e.push(navigator.doNotTrack),
                        e.push(this.getPluginsString()),
                    this.canvas && this.isCanvasSupported() && e.push(this.getCanvasFingerprint()),
                        this.hasher ? this.hasher(e.join("###"), 31) : this.murmurhash3_32_gc(e.join("###"), 31)
                },
                murmurhash3_32_gc: function(e, t) {
                    var n, r, i, s, o, u, a, f;
                    n = e.length & 3,
                        r = e.length - n,
                        i = t,
                        o = 3432918353,
                        u = 461845907,
                        f = 0;
                    while (f < r) a = e.charCodeAt(f) & 255 | (e.charCodeAt(++f) & 255) << 8 | (e.charCodeAt(++f) & 255) << 16 | (e.charCodeAt(++f) & 255) << 24,
                        ++f,
                        a = (a & 65535) * o + (((a >>> 16) * o & 65535) << 16) & 4294967295,
                        a = a << 15 | a >>> 17,
                        a = (a & 65535) * u + (((a >>> 16) * u & 65535) << 16) & 4294967295,
                        i ^= a,
                        i = i << 13 | i >>> 19,
                        s = (i & 65535) * 5 + (((i >>> 16) * 5 & 65535) << 16) & 4294967295,
                        i = (s & 65535) + 27492 + (((s >>> 16) + 58964 & 65535) << 16);
                    a = 0;
                    switch (n) {
                        case 3:
                            a ^= (e.charCodeAt(f + 2) & 255) << 16;
                        case 2:
                            a ^= (e.charCodeAt(f + 1) & 255) << 8;
                        case 1:
                            a ^= e.charCodeAt(f) & 255,
                                a = (a & 65535) * o + (((a >>> 16) * o & 65535) << 16) & 4294967295,
                                a = a << 15 | a >>> 17,
                                a = (a & 65535) * u + (((a >>> 16) * u & 65535) << 16) & 4294967295,
                                i ^= a
                    }
                    return i ^= e.length,
                        i ^= i >>> 16,
                        i = (i & 65535) * 2246822507 + (((i >>> 16) * 2246822507 & 65535) << 16) & 4294967295,
                        i ^= i >>> 13,
                        i = (i & 65535) * 3266489909 + (((i >>> 16) * 3266489909 & 65535) << 16) & 4294967295,
                        i ^= i >>> 16,
                    i >>> 0
                },
                hasLocalStorage: function() {
                    try {
                        return !! window.localStorage
                    } catch(e) {
                        return ! 0
                    }
                },
                hasSessionStorage: function() {
                    try {
                        return !! window.sessionStorage
                    } catch(e) {
                        return ! 0
                    }
                },
                hasIndexDb: function() {
                    try {
                        return !! window.indexedDB
                    } catch(e) {
                        return ! 0
                    }
                },
                isCanvasSupported: function() {
                    var e = document.createElement("canvas");
                    return !! e.getContext && !!e.getContext("2d")
                },
                isIE: function() {
                    return navigator.appName === "Microsoft Internet Explorer" ? !0 : navigator.appName === "Netscape" && /Trident/.test(navigator.userAgent) ? !0 : !1
                },
                getPluginsString: function() {
                    return this.isIE() && this.ie_activex ? this.getIEPluginsString() : this.getRegularPluginsString()
                },
                getRegularPluginsString: function() {
                    return this.map(navigator.plugins,
                        function(e) {
                            var t = this.map(e,
                                function(e) {
                                    return [e.type, e.suffixes].join("~")
                                }).join(",");
                            return [e.name, e.description, t].join("::")
                        },
                        this).join(";")
                },
                getIEPluginsString: function() {
                    if (window.ActiveXObject) {
                        var e = ["ShockwaveFlash.ShockwaveFlash", "AcroPDF.PDF", "PDF.PdfCtrl", "QuickTime.QuickTime", "rmocx.RealPlayer G2 Control", "rmocx.RealPlayer G2 Control.1", "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)", "RealPlayer", "SWCtl.SWCtl", "WMPlayer.OCX", "AgControl.AgControl", "Skype.Detection"];
                        return this.map(e,
                            function(e) {
                                try {
                                    return new ActiveXObject(e),
                                        e
                                } catch(t) {
                                    return null
                                }
                            }).join(";")
                    }
                    return ""
                },
                getScreenResolution: function() {
                    var e;
                    return this.screen_orientation ? e = screen.height > screen.width ? [screen.height, screen.width] : [screen.width, screen.height] : e = [screen.height, screen.width],
                        e
                },
                getCanvasFingerprint: function() {
                    var e = document.createElement("canvas"),
                        t = e.getContext("2d"),
                        n = "";
                    return t.textBaseline = "top",
                        t.font = "14px 'Arial'",
                        t.textBaseline = "alphabetic",
                        t.fillStyle = "#f60",
                        t.fillRect(125, 1, 62, 20),
                        t.fillStyle = "#069",
                        t.fillText(n, 2, 15),
                        t.fillStyle = "rgba(102, 204, 0, 0.7)",
                        t.fillText(n, 4, 17),
                        e.toDataURL()
                }
            },
                e
        }),
    function(e) {
        e(jQuery)
    } (function(e) {
        function n(e) {
            return u.raw ? e: encodeURIComponent(e)
        }
        function r(e) {
            return u.raw ? e: decodeURIComponent(e)
        }
        function i(e) {
            return n(u.json ? JSON.stringify(e) : String(e))
        }
        function s(e) {
            e.indexOf('"') === 0 && (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
            try {
                return e = decodeURIComponent(e.replace(t, " ")),
                    u.json ? JSON.parse(e) : e
            } catch(n) {}
        }
        function o(t, n) {
            var r = u.raw ? t: s(t);
            return e.isFunction(n) ? n(r) : r
        }
        var t = /\+/g,
            u = e.cookie = function(t, s, a) {
                if (s !== undefined && !e.isFunction(s)) {
                    a = e.extend({},
                        u.defaults, a);
                    if (typeof a.expires == "number") {
                        var f = a.expires,
                            l = a.expires = new Date;
                        l.setTime( + l + f * 864e5)
                    }
                    return document.cookie = [n(t), "=", i(s), a.expires ? "; expires=" + a.expires.toUTCString() : "", a.path ? "; path=" + a.path: "", a.domain ? "; domain=" + a.domain: "", a.secure ? "; secure": ""].join("")
                }
                var c = t ? undefined: {},
                    h = document.cookie ? document.cookie.split("; ") : [];
                for (var p = 0,
                         d = h.length; p < d; p++) {
                    var v = h[p].split("="),
                        m = r(v.shift()),
                        g = v.join("=");
                    if (t && t === m) {
                        c = o(g, s);
                        break
                    } ! t && (g = o(g)) !== undefined && (c[m] = g)
                }
                return c
            };
        u.defaults = {},
            e.removeCookie = function(t, n) {
                return e.cookie(t) === undefined ? !1 : (e.cookie(t, "", e.extend({},
                    n, {
                        expires: -1
                    })), !e.cookie(t))
            }
    }),
    define("lib/jquery.cookie",
        function() {}),
    define("common/optimize", ["lib/jquery.zclip", "lib/fingerprint", "lib/jquery.cookie"],
        function(e, t) {
            var n = 0,
                r = 0,
                i = 864e5,
                s = function() {
                    var e;
                    if (!n) {
                        window.PassportSC = {};
                        var t = +(new Date);
                        PassportSC.onApiLoaded = function() {
                            clearInterval(e);
                            var n = +(new Date) - t;
                            p("extra", n, "passport_load_time"),
                                PassportSC.appid = 10026,
                                PassportSC.redirectUrl = window.location.protocol + "//" + window.location.hostname + (window.location.port == 80 || window.location.port == "" ? "": ":" + window.location.port) + "/static/jump.html",
                            typeof PassportSC._logincb3rd == "undefined" && (typeof window._logincb3rd != "function" ? PassportSC._logincb3rd = function() {
                                window.location.reload()
                            }: PassportSC._logincb3rd = window._logincb3rd)
                        };
                        var r = document.createElement("script");
                        r.src = "",
                            document.body.appendChild(r),
                            n = 1,
                            e = setTimeout(function() {
                                    p("extra", "", "passport_load_error")
                                },
                                5e3)
                    }
                },
                o = function(e, t) {
                    var n, i;
                    if (!r) {
                        var s = +(new Date),
                            o = document.createElement("script");
                        o.src = "";
                        var u = function() {
                            i = setTimeout(function() {
                                    if (typeof PassportSC != "undefined") {
                                        clearInterval(n);
                                        var r = +(new Date) - s;
                                        p("extra", r, "newpassport_load_time"),
                                            t || typeof e == "undefined" ? (PassportSC({
                                                appid: 10026,
                                                redirectUrl: window.location.protocol + "//" + window.location.hostname + (window.location.port == 80 || window.location.port == "" ? "": ":" + window.location.port) + "/static/jump.html",
                                                trdRedirectUrl: window.location.protocol + "//" + window.location.hostname + (window.location.port == 80 || window.location.port == "" ? "": ":" + window.location.port) + "/static/popup.html"
                                            }).on("loginsuccess 3rdlogincomplete logoutsuccess",
                                                function(e) {
                                                    typeof window._logincb3rd != "function" ? location.reload() : window._logincb3rd()
                                                }), t && e && e()) : e && e(),
                                        typeof PassportSC._logincb3rd == "undefined" && (typeof window._logincb3rd != "function" ? PassportSC._logincb3rd = function() {
                                            window.location.reload()
                                        }: PassportSC._logincb3rd = window._logincb3rd)
                                    } else setTimeout(arguments.callee, 50)
                                },
                                50)
                        };
                        document.addEventListener ? o.addEventListener("load", u) : o.onreadystatechange = function() { / loaded | complete / .test(o.readyState) && (o.onreadystatechange = null, u())
                        },
                            r = 1,
                            n = setTimeout(function() {
                                    clearInterval(i),
                                        p("extra", "", "newpassport_load_error")
                                },
                                5e3),
                            document.body.appendChild(o)
                    }
                },
                u = function() {
                    var e = document.createElement("script");
                    e.type = "text/javascript",
                        e.async = !0,
                        e.src = "",
                        document.body.appendChild(e)
                },
                a = function(e) {
                    typeof e == "undefined" && (e = "input");
                    var t = "placeholder" in document.createElement("input");
                    t || $(e).each(function(e, t) {
                        t.nodeName.toLowerCase() == "input" && ($.trim($(t).val()).length > 0 ? $(t).siblings(".placeholder").hide() : $(t).siblings(".placeholder").show(), $(t).on("blur",
                            function(e) {
                                $.trim($(this).val()).length > 0 ? $(this).siblings(".placeholder").hide() : $(this).siblings(".placeholder").show()
                            }).on("focus keyup",
                            function(e) {
                                $(this).siblings(".placeholder").hide()
                            }), $(t).siblings(".placeholder").on("click focus",
                            function(e) {
                                e.preventDefault(),
                                    $(t).focus()
                            }))
                    })
                },
                f = function(e, t) {
                    var n = "";
                    return n += "&size=" + (t || 4),
                    n + "&url=" + e
                },
                l = function(e) {
                    function t() {
                        $.cookie("countdate") && n("countdate"),
                        $.cookie("hostid") && n("hostid"),
                        $.cookie("goldpwd") && n("goldpwd"),
                        $.cookie("newgift_state") && n("newgift_state"),
                            e ? e() : location.reload()
                    }
                    function n(e) {
                        $.removeCookie(e),
                            $.removeCookie(e, {
                                path: "/",
                                domain: ""
                            }),
                            $.removeCookie(e, {
                                path: "/",
                                domain: ""
                            })
                    }
                    var r = function() {
                        setTimeout(function() {
                                if (PassportSC && PassportSC.isInitialized()) try {
                                    PassportSC.logout(t)
                                } catch(e) {} else window.setTimeout(arguments.callee, 50)
                            },
                            50)
                    } ()
                },
                c = function(e) {
                    var t = (new RegExp("[?&]" + e + "=([^&#]+)", "g")).exec(location.href);
                    if (t) return t[1]
                },
                h = function(e, t, n, r, i, s) {
                    var o = function() {
                        setTimeout(function() {
                                PassportSC && PassportSC.isInitialized() ? PassportSC.login(e, t, n, r, i, s) : setTimeout(arguments.callee, 50)
                            },
                            50)
                    };
                    o()
                },
                p = function(e, t, n) {
                    var r = function() {
                        setTimeout(function() {
                                typeof Pingback != "undefined" ? Pingback.send(e, {
                                        tag: t,
                                        module: n
                                    },
                                    !1, !0) : setTimeout(arguments.callee, 50)
                            },
                            50)
                    } ()
                },
                d = function(e) {
                    return /^(http:\/\/|https:\/\/)/.test(e) ? e: location.protocol + "//" + location.hostname + (location.port ? ":" + location.port: "") + e
                },
                v = function(e, t, n) {
                    e = e || "#zclipCopyBtn",
                        t = t || "#zclipCopyCode",
                        n = n || "#zclipCopySuccess",
                        $(e).zclip({
                            path: "/static/ext/swf/ZeroClipboard.swf",
                            copy: function() {
                                return text = $(t).prop("value") || $(t).html(),
                                    $(n).show(),
                                    p("click", "", "zclip-copy"),
                                    text
                            }
                        })
                },
                m = function(e, t, n, r, i, s) {
                    var o = "" + encodeURIComponent(PassportSC.getOptions().trdRedirectUrl || window.location.protocol + "//" + window.location.hostname + "/static/popup.html");
                    e === "weixin" && (o += "&third_appid=wx6634d697e8cc0a29"),
                        s ? o += "&href=" + encodeURIComponent(s) : e == "weixin" && s != "";
                    if (!t) {
                        var u = r ? r: 800,
                            a = i ? i: 400;
                        window.open(o, "", "width=" + u + ",height=" + a)
                    } else location.href = o
                },
                g = function() {
                    return typeof PassportSC != "undefined" && PassportSC.userid && (window.uid = PassportSC.userid()) ? (window.logintype = window.uid.split("@").pop(), "email_" + window.uid) : ($.cookie("guest_uid") || $.cookie("guest_uid", "guest_" + (new t).get(), {
                        expires: 300,
                        path: "/"
                    }), $.cookie("guest_uid"))
                },
                y = function(e) {
                    var t = g(),
                        n = $.cookie("source") || c("source"),
                        r = c("source") || $.cookie("last_source");
                    window.source = n,
                        window.spb_vars = {
                            uigs_productid: "xiaoshuo",
                            productid: "xiaoshuo",
                            ptype: "read_pc",
                            pcode: window.pcode,
                            hostid: t,
                            logintype: window.logintype || "",
                            source: window.source || "",
                            last_source: r || ""
                        },
                        $.extend(window.spb_vars, e || {})
                },
                b = function(e, t) {
                    if (!e) return "";
                    var n = [];
                    for (var r = 0; r < e.length; r++) e.charCodeAt(r) > 127 && n.push(r),
                        n.push(r);
                    return n.length <= t ? e: n[t - 4] == n[t - 4] ? e.substr(0, n[t - 4]) + "...": e.substr(0, n[t - 3]) + "..."
                },
                w = function(e) {
                    return e < 10 ? "0" + e: e + ""
                },
                E = function(e) {
                    return [w(Math.floor(e / 3600)), w(Math.floor(e / 60 % 60)), w(Math.floor(e % 60))]
                },
                S = /^1[0-9]{10}$/;
            return {
                loadPassport: s,
                loadNewPassport: o,
                newThirdLogin: m,
                newCommonLogout: l,
                newCommonLogin: h,
                loadPingback: u,
                sendPingback: p,
                kv: c,
                getQrcode: f,
                regzclip: v,
                checkPlaceholder: a,
                initSpbVars: y,
                realSubString: b,
                convertTime: E,
                phoneRegex: S
            }
        }),
    define("lib/source", ["common/optimize", "lib/jquery.cookie"],
        function(e) {
            var t = function(t) {
                    var n = /^\d+(?:_\d+){0,5}_?$/,
                        r;
                    if (n.test(t)) return $.cookie("source", t, {
                        path: "/",
                        expires: 300
                    }),
                        !0;
                    if (!n.test($.cookie("source"))) {
                        r = e.kv("source");
                        if (n.test(r)) return $.cookie("source", r, {
                            path: "/",
                            expires: 300
                        }),
                            !0
                    }
                    return n.test(e.kv("source")) && $.cookie("last_source", e.kv("source"), {
                        path: "/",
                        expires: 300
                    }),
                        !1
                },
                n = function() {
                    return $.removeCookie("source", {
                        path: "/"
                    })
                };
            return {
                init: t,
                remove: n
            }
        }),
    function() {
        function e(e, t) {
            e = e || window;
            if (e.JS_Tracker) return e.JS_Tracker;
            t = t || {};
            var n = [],
                r = {},
                i = !1,
                s = 0,
                o = {
                    uigs_productid: t.uigs_productid || "bfo",
                    productid: t.productid || "bfo",
                    url: t.url || "",
                    ext: null,
                    level: t.level || 4,
                    ignore: t.ignore || [],
                    random: t.random || 1,
                    submit: t.submit || null,
                    delay: t.delay || 1e3,
                    repeat: t.repeat || 10
                },
                u = {
                    isOBJByType: function(e, t) {
                        return Object.prototype.toString.call(e) === "[object " + (t || "Object") + "]"
                    },
                    isOBJ: function(e) {
                        var t = typeof e;
                        return t === "object" && !!e
                    },
                    isEmpty: function(e) {
                        return e === null ? !0 : u.isOBJByType(e, "Number") ? !1 : !e
                    },
                    extend: function(e, t) {
                        for (var n in t) e[n] = t[n];
                        return e
                    },
                    processError: function(e) {
                        try {
                            if (e.stack) {
                                var t = e.stack.match("https?://[^\n]+");
                                t = t ? t[0] : "";
                                var n = t.match(":(\\d+):(\\d+)");
                                n || (n = [0, 0, 0]);
                                var r = u.processStackMsg(e);
                                return {
                                    msg: r,
                                    rowNum: n[1],
                                    colNum: n[2],
                                    target: t.replace(n[0], "")
                                }
                            }
                            return e.name && e.message && e.description ? {
                                msg: JSON.stringify(e)
                            }: e
                        } catch(i) {
                            return e
                        }
                    },
                    processStackMsg: function(e) {
                        var t = e.stack.replace(/\n/gi, "").split(/\bat\b/).slice(0, 9).join("@").replace(/\?[^:]+/gi, ""),
                            n = e.toString();
                        return t.indexOf(n) < 0 && (t = n + "@" + t),
                            t
                    },
                    isRepeat: function(e) {
                        if (!u.isOBJ(e)) return ! 0;
                        var t = e.msg,
                            n = r[t] = (parseInt(r[t], 10) || 0) + 1;
                        return n > o.repeat
                    }
                },
                a = e.onerror;
            e.onerror = function(t, n, r, i, s) {
                var o = t;
                s && s.stack && (o = u.processStackMsg(s)),
                u.isOBJByType(o, "Event") && (o += o.type ? "--" + o.type + "--" + (o.target ? o.target.tagName + "::" + o.target.src: "") : ""),
                    m.push({
                        msg: o,
                        target: n,
                        rowNum: r,
                        colNum: i
                    }),
                    p(),
                a && a.apply(e, arguments)
            };
            var f = function(e, t) {
                    var n = [],
                        r = [],
                        i = [];
                    if (u.isOBJ(e)) {
                        e.level = e.level || o.level;
                        for (var s in e) {
                            var a = e[s];
                            if (!u.isEmpty(a)) {
                                if (u.isOBJ(a)) try {
                                    a = JSON.stringify(a)
                                } catch(f) {
                                    a = "[JS_Tracker detect value stringify error] " + f.toString()
                                }
                                i.push(s + ":" + a),
                                    n.push(s + "=" + encodeURIComponent(a)),
                                    r.push(s + "[" + t + "]=" + encodeURIComponent(a))
                            }
                        }
                    }
                    return [r.join("&"), i.join(","), n.join("&")]
                },
                l = [],
                c = 0,
                h = function() {
                    clearTimeout(c),
                        c = 0,
                    i || m.init(window.spb_vars || {});
                    if (!l.length) return;
                    var e = o._reportUrl + l.join("&") + "&count=" + l.length + "&_t=" + +(new Date) + "&img=error.gif";
                    if (o.submit) o.submit(e);
                    else {
                        var t = new Image;
                        t.src = e
                    }
                    l = []
                },
                p = function(e) {
                    if (!o._reportUrl) {
                        if ( !! i || !window.spb_vars) return;
                        m.init(window.spb_vars)
                    }
                    var t = Math.random() >= o.random;
                    while (n.length) {
                        var r = !1,
                            s = n.shift();
                        s.msg = (s.msg + "" || "").substr(0, 500);
                        if (u.isRepeat(s)) continue;
                        var a = f(s, l.length);
                        if (u.isOBJByType(o.ignore, "Array")) for (var p = 0,
                                                                       d = o.ignore.length; p < d; p++) {
                            var v = o.ignore[p];
                            if (u.isOBJByType(v, "RegExp") && v.test(a[1]) || u.isOBJByType(v, "Function") && v(s, a[1])) {
                                r = !0;
                                break
                            }
                        }
                        r || !t && s.level != 20 && (l.push(a[0]), o.onReport && o.onReport(o.id, s))
                    }
                    e ? h() : c || (c = setTimeout(h, o.delay))
                },
                d = function() {
                    if (typeof window.jsReportStartTime == "undefined") return;
                    if (i && s) {
                        var e = o._reportUrl + "stype=loadtime&speed=" + s + "&img=speed.gif";
                        if (o.submit) o.submit(e);
                        else {
                            var t = new Image;
                            t.src = e
                        }
                        s = 0
                    }
                },
                v = function() {
                    var t = e.onload;
                    e.onload = function() {
                        s = +(new Date) - window.jsReportStartTime,
                            d(),
                        t && t.apply(e, arguments)
                    }
                },
                m = e.JS_Tracker = {
                    push: function(e) {
                        var t = u.isOBJ(e) ? u.processError(e) : {
                            msg: e
                        };
                        return o.ext && !t.ext && (t.ext = o.ext),
                        t.from || (t.from = location.href),
                            n.push(t),
                            p(),
                            m
                    },
                    report: function(e, t) {
                        return e && m.push(e),
                        t && p(!0),
                            m
                    },
                    info: function(e) {
                        return e ? (u.isOBJ(e) ? e.level = 2 : e = {
                            msg: e,
                            level: 2
                        },
                            m.push(e), m) : m
                    },
                    debug: function(e) {
                        return e ? (u.isOBJ(e) ? e.level = 1 : e = {
                            msg: e,
                            level: 1
                        },
                            m.push(e), m) : m
                    },
                    init: function(e) {
                        if (u.isOBJ(e)) for (var t in e) o[t] = e[t];
                        return o.uigs_productid && (o.url || (o.url = ""), o._reportUrl = o.url + "?uigs_productid=" + o.uigs_productid + "&productid=" + o.productid + (o.pcode ? "&pcode=" + o.pcode: "") + (o.ptype ? "&ptype=" + o.ptype: "") + "&"),
                        n.length && p(),
                            i = !0,
                        s && d(),
                            m
                    },
                    __onerror__: e.onerror
                };
            return i || setTimeout(function() {
                    typeof window["spb_vars"] != "undefined" ? m.init(window.spb_vars) : setTimeout(arguments.callee, 50)
                },
                0),
            typeof window.jsReportStartTime != "undefined" && v(),
            typeof console != "undefined" && console.error && setTimeout(function() {
                    var e = ((location.hash || "").match(/([#&])JT_ERROR=([^&$]+)/) || [])[2];
                    e && console.error("JT_ERROR", decodeURIComponent(e).replace(/(:\d+:\d+)\s*/g, "$1\n"))
                },
                0),
                m
        }
        var t = e;
        typeof module != "undefined" && typeof exports == "object" && define.cmd ? module.exports = t: typeof define == "function" && define.amd ? define("lib/jstracker", [],
            function() {
                return t
            }) : window.JS_Tracker = t()
    }.call(function() {
        return this || (typeof window != "undefined" ? window: global)
    }),
    define("common/main", ["common/optimize", "lib/source", "lib/jstracker", "lib/jquery.cookie"],
        function(e, t, n) {
            var r = ["*.sogou.com", "*.sogoucdn.com"],
                i = new RegExp("^(" + r.join("|").replace(/\./g, "\\.").replace(/\*/g, ".*") + ")$"),
                s = function(e) {
                    switch (e) {
                        case "s":
                        case "b":
                        case "m":
                            return "/";
                        default:
                            return ""
                    }
                },
                o = function(e) {
                    $(e).on("mouseenter", ".book-cover",
                        function() {
                            $(this).find(".slide-cover").stop().animate({
                                    top: "4px"
                                },
                                300)
                        }).on("mouseleave", ".book-cover",
                        function() {
                            $(this).find(".slide-cover").stop().animate({
                                    top: "167px"
                                },
                                200)
                        })
                },
                u = function(n) {
                    if (!i.test(window.location.hostname)) {}
                    e.loadNewPassport(function() {
                            e.initSpbVars(n),
                                e.loadPingback(),
                                t.init()
                        },
                        !0),
                        e.checkPlaceholder()
                };
            return {
                slideCover: o,
                defaultCover: s,
                init: u
            }
        }),
    define("lib/mask", [],
        function() {
            var e = $(window),
                t = $(document),
                n = $("html"),
                r = document.documentElement,
                i = document.body,
                s = window.VBArray && !window.XMLHttpRequest,
                o = function(e) {
                    e = e || {},
                        this.bgc = e.bgc || "#000",
                        this.opacity = e.opacity || .3,
                        this.zIndex = e.zIndex || 9999,
                        this.id = e.id || _.uniqueId("MASK_"),
                        this.init()
                };
            return o.prototype = {
                constructor: o,
                show: function() {
                    var t = this.$el;
                    s && (e.on("resize.re", _.debounce(function() {
                            t.css("height", e.height()).hide().show()
                        },
                        300)), t.css("height", e.height()), this.el.style.setExpression("top", "eval(document.documentElement.scrollTop)")),
                        t.show()
                },
                hide: function() {
                    this.el && (s && (this.el.style.removeExpression("top"), e.off("resize.re")), this.$el.hide())
                },
                init: function() { ! this.el && this.render();
                    var e = this.$el;
                    s && n.css("backgroundAttachment") != "fixed" && n.css({
                        zoom: 1,
                        backgroundImage: "url(about:blank)",
                        backgroundAttachment: "fixed"
                    })
                },
                render: function() {
                    var e = {
                        width: "100%",
                        backgroundColor: this.bgc,
                        left: 0,
                        top: 0,
                        display: "none",
                        zIndex: this.zIndex
                    };
                    s ? (e.position = "absolute", e.filter = "alpha(opacity=" + this.opacity * 100 + ")") : (e.height = "100%", e.position = "fixed", e.opacity = this.opacity);
                    var t = $("<div>", {
                        id: this.id,
                        css: e
                    });
                    s && t.append('<iframe src="about:blank" style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:-1;filter:alpha(opacity=0)"></iframe>'),
                        this.$el = t,
                        this.el = t[0],
                        t.prependTo("body")
                }
            },
                o
        }),
    define("lib/dialog", ["lib/mask"],
        function(e) {
            var t = new e,
                n = $(window),
                r = $(document),
                i = $("html"),
                s = document.documentElement,
                o = document.body,
                u = window.VBArray && !window.XMLHttpRequest,
                a = function(n) {
                    this.$el = $(n.el),
                        this.el = this.$el[0],
                        this.top = n.top || "auto",
                        this.left = n.left || "auto",
                        this.width = n.width || "auto",
                        this.height = n.height || "auto",
                        this.zIndex = n.zIndex || 99999,
                        this.onload = n.onload ||
                            function() {},
                        this.onbeforeshow = n.onbeforeshow ||
                            function() {},
                        this.onshow = n.onshow ||
                            function() {},
                        this.onbeforehide = n.onbeforehide ||
                            function() {},
                        this.onhide = n.onhide ||
                            function() {},
                        this.mask = n.mask ? new e(n.mask) : t,
                        this.init();
                    var r = this;
                    this.delaySet = _.debounce(function() {
                            r.set()
                        },
                        300)
                };
            return a.prototype = {
                constructor: a,
                $: function(e) {
                    return this.$el.find(e)
                },
                init: function() {
                    var e = this;
                    this.$el.on("click", ".close-btn",
                        function() {
                            return e.hide(),
                                !1
                        }),
                        this.onload()
                },
                show: function(e) {
                    var t = this,
                        r = this.onbeforeshow();
                    if (r == 0) return;
                    n.on("resize.set", t.delaySet),
                        n.on("scroll.set", t.delaySet),
                    e && e.call(this),
                        this.mask.show(),
                        this.onshow(),
                        this.$el.show(),
                        this.set(0)
                },
                hide: function(e) {
                    var t = this.onbeforehide();
                    if (t == 0) return;
                    n.off("resize.set", this.delaySet),
                        n.off("scroll.set", this.delaySet),
                    e && e.call(this),
                        this.$el.hide(),
                        this.mask.hide(),
                        this.onhide()
                },
                set: function(e) {
                    e = typeof e == "undefined" ? 300 : e;
                    var t = this.width,
                        i = this.$el.height(),
                        s = this.top == "auto" ? (n.height() - i) * .382 : this.top,
                        o = this.left == "auto" ? (n.width() - t) / 2 : this.left,
                        u = r.scrollTop();
                    this.$el.stop().css({
                        width: t,
                        position: "absolute",
                        zIndex: this.zIndex
                    }).animate({
                            left: o,
                            top: s + u
                        },
                        e)
                }
            },
                a
        }),
    function(e, t) {
        typeof exports == "object" ? module.exports = t() : typeof define == "function" && define.amd ? define("lib/tencent_captcha", [],
            function() {
                return e.T_Captcha = t(),
                    e.T_Captcha
            }) : window.T_Captcha = t()
    } (this,
        function() {
            var e = "",
                t = "2003658204",
                n = !1,
                r = function(e, t) {
                    this.callback = e,
                        this.option = t || {},
                        this._captcha,
                        this.init()
                };
            return r.prototype = {
                constructor: r,
                init: function() {
                    var e = this;
                    typeof window.TencentCaptcha == "undefined" && !n ? (e.loadScript(), n = !0) : e.initCaptcha()
                },
                initCaptcha: function() {
                    var e = this;
                    setTimeout(function() {
                            typeof window.TencentCaptcha != "undefined" ? e._captcha = new window.TencentCaptcha(t,
                                function(t) {
                                    t && t.ret === 0 && e.callback && e.callback(t)
                                },
                                e.option) : setTimeout(arguments.callee, 50)
                        },
                        0)
                },
                loadScript: function() {
                    var t = this,
                        n = document.createElement("script");
                    n.src = e,
                        document.addEventListener ? n.addEventListener("load",
                            function() {
                                t.initCaptcha()
                            }) : n.onreadystatechange = function() { / loaded | complete / .test(n.readyState) && (n.onreadystatechange = null, t.initCaptcha())
                        },
                        document.body.appendChild(n)
                },
                show: function() {
                    var e = this;
                    e._captcha && e._captcha.show && e._captcha.show()
                },
                destroy: function() {
                    var e = this;
                    e._captcha && e._captcha.destroy && e._captcha.destroy()
                },
                getTicket: function() {
                    var e = this;
                    if (e._captcha && e._captcha.getTicket) return e._captcha.getTicket()
                }
            },
                r
        }),
    define("module/common-login", ["common/optimize", "lib/dialog", "lib/tencent_captcha", "lib/jquery.cookie"],
        function(e, t, n) {
            var r, i, s, o, u, a, f, l, c = !1,
                h = function(e) {
                    $.get("/api/pc/v1/activity/lottery/isaddcount?t=" + +(new Date),
                        function(t) {
                            t.code || t.data && e && e()
                        },
                        "json")
                },
                p = function(e) {
                    T(e.ticket, e.randstr)
                },
                l = new n(p),
                d = function(e) {
                    e ? $(i).find(".info-vali").show().html('<i class="icon"></i>' + e) : $(i).find(".info-vali").hide()
                },
                v = function(e) {
                    PassportSC.setOption("_token", PassportSC.utils.math.uuid()),
                        e = "",
                        $(i).find(".captcha-code").attr("src", e)
                },
                m = function(e, t) {
                    d(t.msg);
                    if ( + t.needcaptcha || +t.status === 20221) $(i).find(".captcha-box").show(),
                        v(t.captchaimg)
                },
                g = function() {
                    var t = $.trim($(i).find(".username input").val()),
                        n = $.trim($(i).find(".password input").val()),
                        s = $.trim($(i).find(".captcha-input input").val());
                    if (!t) {
                        d("请输入用户名/手机号");
                        return
                    }
                    if (!PassportSC.tools.validateUsername(t)) {
                        d("请填写正确格式的用户名/手机号");
                        return
                    }
                    if (!n) {
                        d("请输入密码");
                        return
                    }
                    if (!PassportSC.tools.validatePassword(n)) {
                        d("请填写正确格式的密码");
                        return
                    }
                    if ($(i).find(".captcha-input input:visible").length > 0 && !s) {
                        d("请输入验证码");
                        return
                    }
                    e.newCommonLogin(t, n, s || "", +$(i).find(".autologin").hasClass("sel"),
                        function() {
                            r.callback ? r.callback() : window.location.reload()
                        },
                        m)
                },
                y = function(e) {
                    if (/WindowsWechat/.test(window.navigator.userAgent)) {
                        if (e == "weixin") {
                            var t = encodeURIComponent("");
                            return location.replace(""),
                                !0
                        }
                        return alert("微信浏览器暂不支持qq、微博登录，请用其他浏览器打开网页"),
                            !0
                    }
                    return ! 1
                },
                b = function(e) {
                    $("#bindMobile .input-link").hide(),
                        $("#bindMobile .phone .sended").text("重新发送(" + e + ")").show(),
                        setTimeout(function() {
                                e > 0 ? (e--, $("#bindMobile .phone .sended").text("重新发送(" + e + ")"), setTimeout(arguments.callee, 1e3)) : ($("#bindMobile .sended").hide(), $("#bindMobile .input-link").show())
                            },
                            1e3)
                },
                w = function() {
                    var t = $.trim($("#bindMobile .phone input").val());
                    return t ? e.phoneRegex.test(t) ? t: ($("#bindMobile .info-vali").show().find("span").text("手机号有误请重新输入"), !1) : ($("#bindMobile .info-vali").show().find("span").text("请输入您的手机号"), !1)
                },
                E = function() {
                    return $("#bindMobile .checktxt").hasClass("sel") ? ($("#bindMobile .info-vali span").text() == "请同意用户协议" && $("#bindMobile .info-vali").hide(), $("#bindMobile .sub-btn").removeClass("dis-btn"), !0) : ($("#bindMobile .info-vali").show().find("span").text("请同意用户协议"), $("#bindMobile .sub-btn").addClass("dis-btn"), !1)
                },
                S = function() {
                    var e = $.trim($("#bindMobile .captch input").val());
                    return e ? e + "": ($("#bindMobile .info-vali").show().find("span").text("请输入验证码"), !1)
                },
                x = function() {
                    if (! (phone = w())) return;
                    l.show()
                },
                T = function(e, t) {
                    $.post("/api/pc/v1/user/bindmobile/sendsms", {
                            mobile: phone,
                            ticket: e,
                            randstr: t
                        },
                        function(e) {
                            e.code == 0 ? (c = !0, b(60)) : $("#bindMobile .info-vali").show().find("span").text(e.msg || "网络异常，请重试")
                        },
                        "json")
                },
                N = function() {
                    var e, t;
                    if ((e = w()) && (t = S()) && E()) {
                        if (!c) {
                            $("#bindMobile .info-vali").show().find("span").text("请先获取手机验证码");
                            return
                        }
                        $.post("/api/pc/v1/user/bindmobile/bind", {
                                mobile: e,
                                smscode: t
                            },
                            function(e) {
                                e.code == 0 ? (a.hide(), f && f()) : $("#bindMobile .info-vali").show().find("span").text(e.msg || "网络异常，请重试")
                            },
                            "json")
                    }
                },
                C = function(e) {
                    f = e,
                        a.show(),
                        $("#bindMobile .checktxt").addClass("sel"),
                        $("#bindMobile .sub-btn").removeClass("dis-btn"),
                        $("#bindMobile .info-vali").hide()
                },
                k = function() {
                    r && !r.isPage && o && $(s).on("click",
                        function(e) {
                            e.preventDefault(),
                                o.show(),
                                $(i).find(".username input").focus()
                        }),
                        $(i).on("click", ".findpwd",
                            function(e) {
                                var t = "";
                                t += encodeURIComponent(window.location.href),
                                    window.open(t),
                                    e.preventDefault()
                            }).on("click", ".reg-tag",
                            function(e) {
                                var t = "/register?cb=";
                                t += encodeURIComponent(window.location.href),
                                    window.open(t),
                                    e.preventDefault()
                            }).on("click", ".autologin",
                            function(e) {
                                $(this).toggleClass("sel"),
                                    e.preventDefault()
                            }).on("click", ".third-login a",
                            function(t) {
                                var n = $(this);
                                if (y(n.attr("data-third"))) return ! 1;
                                e.newThirdLogin(n.attr("data-third"), !1, window.location.href, n.attr("openwindowwidth"), n.attr("openwindowheight")),
                                    t.preventDefault()
                            }).on("click", ".login-btn",
                            function(e) {
                                g(),
                                    e.preventDefault()
                            }).on("click", ".validate-img",
                            function(e) {
                                e.preventDefault(),
                                    v()
                            }).on("blur click", "input",
                            function(e) {
                                d("")
                            }).on("keyup", ".password input",
                            function(e) {
                                e.keyCode == 13 && g()
                            }),
                        $("#getchance").on("click", ".dia-btn",
                            function() {
                                Dchance.hide()
                            }),
                        $("#bindMobile").on("focus", "input",
                            function(e) {
                                $("#bindMobile .info-vali").hide()
                            }).on("click", ".input-link",
                            function(e) {
                                e.preventDefault(),
                                    x()
                            }).on("click", ".checktxt",
                            function(e) {
                                e.preventDefault(),
                                    $(this).toggleClass("sel"),
                                    E()
                            }).on("click", ".sub-btn",
                            function(e) {
                                if ($(this).hasClass("dis-btn")) return ! 1;
                                e.preventDefault(),
                                    N()
                            })
                },
                L = function() {
                    o.show()
                },
                A = function(e, t, n) {
                    if (n && n.length > 0) for (var r = 0,
                                                    i = n.length; r < i; r++) $("#checkinDialog .check-award li:eq(" + r + ") .text-title").text(n[r]);
                    e %= 8,
                        $("#checkinDialog .dialog-title span").text(t),
                        $("#checkinDialog .check-day").each(function(t) {
                            t < e ? $(this).addClass("sel") : $(this).removeClass("sel")
                        }),
                        $("#checkinDialog .sep-line").each(function(t) {
                            t < e - 1 ? $(this).addClass("sel") : $(this).removeClass("sel")
                        }),
                        $("#checkinDialog .check-award li").each(function(n) {
                            n < e - 1 ? $(this).addClass("sel") : n == e - 1 ? ($(this).addClass("sel"), $(this).find(".text-title").text(t)) : $(this).removeClass("sel")
                        }),
                        u.show(),
                    e == 7 && $("#checkinDialog").on("click", ".close-btn",
                        function() {
                            h(function() {
                                Dchance.show()
                            })
                        })
                },
                O = function(e) {
                    r = e || {},
                        i = $(r.ele || "#commonLogReg"),
                        s = $(r.loginBtn || "#headLoginbtn"),
                    r && !r.isPage && (o = new t({
                        el: i,
                        width: $(i).width() || 488
                    })),
                        k(),
                        Dchance = new t({
                            el: "#getchance",
                            width: $("#getchance").width()
                        }),
                        u = new t({
                            el: "#checkinDialog",
                            width: $("#checkinDialog").width()
                        }),
                        a = new t({
                            el: "#bindMobile",
                            width: $("#bindMobile").width()
                        })
                };
            return {
                init: O,
                wechatLogin: y,
                showLogin: L,
                showCheckin: A,
                bindMobile: C
            }
        }),
    define("lib/addfav", ["require"],
        function(e) {
            return function() {
                var e = $("#floatFunc").find(".add-fav"),
                    t = $("#floatFunc").find(".set-home"),
                    n = $("#floatFunc").find(".go-top"),
                    r = $("#floatFunc").find(".save-desk"),
                    i = function() {
                        var e = document.location.protocol + "",
                            t = "多多看书";
                        if (window.external) try {
                            window.external.AddFavorite(e, t)
                        } catch(n) {
                            alert("您的浏览器不支持自动收藏，请使用CTRL+D")
                        } else window.sidebar.addPanel ? window.sidebar.addPanel(t, e, "") : Alert.show(function() {
                            this.$(".txt-center").html("您的浏览器不支持自动收藏，请使用CTRL+D")
                        })
                    },
                    s = function() {
                        var e = document.location.protocol + "";
                        document.all ? (document.body.style.behavior = "url(#default#homepage)", document.body.setHomePage(e)) : window.open("/help/")
                    };
                e.on("click",
                    function() {
                        return i(),
                            !1
                    }),
                    t.on("click",
                        function() {
                            return s(),
                                !1
                        }),
                    n.on("click",
                        function() {
                            return $("html,body").animate({
                                scrollTop: 0
                            }),
                                !1
                        }),
                    r.attr("href", "/dissert/dlShortCut.do?&url=" + encodeURIComponent(document.location.protocol + ""))
            }
        }),
    define("lib/alert", ["lib/dialog"],
        function(e) {
            var t = '<div class="hide"><div class="alert-wp"><a href="#" class="cls close-btn">&times;</a><div class="content">{{content}}</div><div class="btns"><a href="#" class="btn1">{{btnText}}</a><a href="#" class="btn2 close-btn">取消</a></div></div></div>',
                n = function(e) {
                    return this.alertHtm = t.replace("{{content}}", e.content || "").replace("{{btnText}}", e.btnText || ""),
                        this.fn = e.fn,
                        this.init()
                };
            return n.prototype = {
                constructor: n,
                init: function() {
                    var t = _.uniqueId("alert_"),
                        n;
                    return document.getElementById(t) || document.body.appendChild($(this.alertHtm).attr("id", t)[0]),
                        n = new e({
                            el: "#" + t,
                            width: 300
                        }),
                    this.fn && this.fn.call(n),
                        n
                }
            },
                n
        }),
    function(e, t, n) {
        function a(e, t) {
            this._dom = e,
                this.init(t)
        }
        var r = "|9|16|17|18|19|20|33|34|35|36|37|39|41|42|43|45|47|",
            i = function(t) {
                return e.camelCase(t.replace(/_/g, "-"))
            },
            s = function(e) {
                return e.replace(/<[^>]+>/gi, "")
            },
            o = function() {
                var e = +(new Date);
                return function() {
                    return++e
                }
            } (),
            u = function() {
                function r(t) {
                    return '"' + t.replace(e,
                        function(e) {
                            var t = n[e];
                            return typeof t == "string" ? t: "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice( - 4)
                        }) + '"'
                }
                function i(e) {
                    return e < 10 ? "0" + e: e
                }
                function s(e, t) {
                    var n, o, u, a, l = t[e],
                        c = typeof l;
                    l && typeof l == "object" && typeof l.toJSON == "function" && (l = l.toJSON(e), c = typeof l);
                    switch (c) {
                        case "string":
                            return r(l);
                        case "number":
                            return isFinite(l) ? String(l) : "null";
                        case "boolean":
                            return String(l);
                        case "object":
                            if (!l) return "null";
                            switch (Object.prototype.toString.call(l)) {
                                case "[object Date]":
                                    return isFinite(l.valueOf()) ? '"' + l.getUTCFullYear() + "-" + i(l.getUTCMonth() + 1) + "-" + i(l.getUTCDate()) + "T" + i(l.getUTCHours()) + ":" + i(l.getUTCMinutes()) + ":" + i(l.getUTCSeconds()) + "Z" + '"': "null";
                                case "[object Array]":
                                    u = l.length,
                                        a = [];
                                    for (n = 0; n < u; n++) a.push(s(n, l) || "null");
                                    return "[" + a.join(",") + "]";
                                default:
                                    a = [];
                                    for (n in l) Object.prototype.hasOwnProperty.call(l, n) && (o = s(n, l), o && a.push(r(n) + ":" + o));
                                    return "{" + a.join(",") + "}"
                            }
                    }
                }
                function o(e) {
                    return t.JSON && t.JSON.stringify ? t.JSON.stringify(e) : s("", {
                        "": e
                    })
                }
                var e = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    n = {
                        "\b": "\\b",
                        "	": "\\t",
                        "\n": "\\n",
                        "\f": "\\f",
                        "\r": "\\r",
                        '"': '\\"',
                        "\\": "\\\\"
                    };
                return o
            } ();
        a.Version = "1.0.0",
            a.prototype = {
                dataUrl: "",
                curIndex: 0,
                suggestData: {},
                prefixProtected: !0,
                lazySuggestTime: 100,
                minWordLength: 0,
                itemSelectors: "li.fold-item",
                itemHoverStyle: "fold-hover",
                itemFakeClass: "fake",
                itemNoneClass: "error",
                posAdjust: {},
                getDataFun: "jsonp",
                getDataType: "json",
                ajax_jsonp: "callback",
                remoteCall: "baidu.sug",
                remoteCallCharset: "utf-8",
                remoteCallExpire: 0,
                autoFixListPos: !0,
                autoSubmit: !1,
                suggestProtectedTimer: !1,
                invalidWords: {},
                history: {},
                inputWord: "",
                isAutoOppDir: !0,
                emptyPrompt: !1,
                trimKW: !1,
                _parsing: 0,
                _suggestTimer: 0,
                init: function(t) {
                    var n = {};
                    this._dom.attr("autocomplete", "off");
                    for (var r in t) {
                        var s = t[r],
                            u = i(r);
                        n[u] = s
                    }
                    e.extend(!0, this, n),
                    !this.suggestList && (this.suggestList = e('<ul id="search-suggest-' + o() + '" class="suggest"></ul>'), e("body").append(this.suggestList)),
                    !this.renderDataFun && (this.renderDataFun = this._defaultRenderDataFun),
                    !this.fillDataFun && (this.fillDataFun = this._defaultFillDataFun),
                    this.customClass && this.suggestList.addClass(this.customClass),
                        this._bindEvent()
                },
                hideList: function() {
                    this.suggestList.hide(),
                        this._dom.val(this.inputWord),
                        this._fixPos(!1),
                        this.curIndex = 0,
                        this._stop()
                },
                getDom: function() {
                    return this._dom
                },
                getSuggestData: function(e) {
                    return e == n && (e = this._dom.val()),
                        "undefined" != typeof this.history[e] ? this.history[e] : {}
                },
                genDomId: function() {
                    return o()
                },
                _start: function() {
                    var t = this;
                    clearInterval(this._suggestTimer),
                        this._suggestTimer = setInterval(function() {
                                var n = e(t._dom).val(),
                                    r = t.inputWord;
                                t.trimKW && (n = e.trim(n));
                                if (t.inputWord != n) {
                                    if (e(t).triggerHandler("suggest.beforesuggest") === !1) return ! 1;
                                    t.inputWord = n,
                                        t._doGetData(n);
                                    if (e(t).triggerHandler("suggest.afterinputchange", r, n) === !1) return ! 1
                                }
                            },
                            t.lazySuggestTime)
                },
                _stop: function() {
                    clearInterval(this._suggestTimer)
                },
                _isValidWord: function(e) {
                    return e.length > 50 ? !1 : this.invalidWords[e] ? !1 : !0
                },
                _parseData: function(t, n) {
                    var r, i = this;
                    r = u(n),
                        this._initList(n),
                        r === "{}" || r === "[]" ? i.emptyPrompt || (this.invalidWords[t] = 1, this.hideList()) : this.history[t] = n,
                        this._parsing = 0;
                    if (e(this).triggerHandler("suggest.aftersuggest") === !1) return ! 1
                },
                _initList: function(t) {
                    var n = [],
                        r = this._dom.val();
                    this.trimKW && (r = e.trim(r)),
                        this._fixPos(!0),
                        n.push(this.renderDataFun(r, t)),
                        this.suggestList.html(n.join("")).show(),
                        this._dealwithListDirection()
                },
                _defaultFillDataFun: function(t) {
                    this._dom.val(s(e(t).html()))
                },
                _defaultRenderDataFun: function(e, t) {
                    var n = [],
                        r,
                        i = t.length;
                    n.push('<li class="fold-bg"></li>');
                    for (var s = 0; s < i; ++s) r = t[s].replace(e, "<em class='red'>" + e + "</em>"),
                        n.push('<li class="fold-item"><span class="title">' + r + "</span></li>");
                    return n.join("")
                },
                _doGetData: function(n) {
                    var r = this,
                        i;
                    if ("" == n) return this.hideList(),
                        !1;
                    if (this.prefixProtected && !r._isValidWord(n)) return this.hideList(),
                        !1;
                    if (n.length < r.minWordLength) return this.hideList(),
                        !1;
                    i = function() {
                        var e = this._parsing;
                        if (!e) return;
                        var t = +(new Date);
                        t - e > 2e3 && (this._parsing = 0)
                    },
                    r._parsing && i.apply(this);
                    if (!r._parsing) {
                        r._parsing = +(new Date),
                            setTimeout(function() {
                                    i.apply(r)
                                },
                                2e3);
                        if (r.history[n]) r._parseData(n, r.history[n]);
                        else if (this.dataUrl || !this.dataUrl && this.getDataFun == "data_provider_byword") {
                            var s = r.dataUrl.replace(/%KEYWORD%/, encodeURIComponent(n)),
                                o = function(t) {
                                    var n, r = {
                                        rawdata: t
                                    };
                                    return n = e(this).triggerHandler("suggest.aftergetdata", r),
                                        n === !1 ? !1 : r.rawdata
                                };
                            if (this.getDataFun == "ajax") e.get(s, {},
                                function(e) {
                                    e = o.call(r, e);
                                    if (e === !1) return ! 1;
                                    r._parseData(n, e)
                                },
                                r.getDataType);
                            else if (this.getDataFun == "jsonp") e.ajax({
                                url: s,
                                data: {},
                                success: function(e, t) {
                                    e = o.call(r, e);
                                    if (e === !1) return ! 1;
                                    r._parseData(n, u(e))
                                },
                                dataType: "jsonp",
                                jsonp: r.ajax_jsonp || "callback"
                            });
                            else if (this.getDataFun == "data_provider_byword") this.dataProvider.call(r, n,
                                function(e) {
                                    e = o.call(r, e);
                                    if (e === !1) return ! 1;
                                    r._parseData(n, u(e))
                                });
                            else if (this.getDataFun == "remotejs") {
                                var a = r.remoteCall.split("."),
                                    f = a.length,
                                    l = {},
                                    c = "";
                                if (f < 1) return;
                                l[a[f - 1]] = function(e) {
                                    e = o.call(r, e);
                                    if (e === !1) return ! 1;
                                    r._parseData(n, u(e))
                                };
                                for (var h = f - 2; h >= 0; --h) l[a[h]] = l[a[h]] || {},
                                    l[a[h]][a[h + 1]] = l[a[h + 1]];
                                f == 1 ? t[a[0]] = t[a[0]] || l[a[0]] || {}: (t[a[0]] = t[a[0]] || {},
                                    t[a[0]][a[1]] = l[a[1]]),
                                r.remoteCallExpire && (c = Math.floor( + (new Date) / 1e3 / r.remoteCallExpire), /\?/.test(s) ? c = "&_t=" + c: c = "?_t=" + c),
                                    e.ajax({
                                        url: s + c,
                                        dataType: "script",
                                        type: "GET",
                                        scriptCharset: r.remoteCallCharset,
                                        success: function() {}
                                    })
                            } else this.getDataFun == "remoteparam" && e.ajax({
                                url: s,
                                dataType: "script",
                                type: "GET",
                                scriptCharset: r.remoteCallCharset,
                                success: function() {
                                    var e = t[r.remoteCall];
                                    e = o.call(r, e);
                                    if (e === !1) return ! 1;
                                    r._parseData(n, u(e))
                                }
                            })
                        } else r._parseData(n, r.suggestData)
                    }
                },
                _submitMe: function(t) {
                    var n = this,
                        r, i;
                    e(t).removeClass(n.itemHoverStyle),
                    e(t).hasClass(n.itemFakeClass) || n.hideList(),
                        n.fillDataFun(t),
                    n.autoSubmit && (i = n._dom.closest("form"), r = i.triggerHandler("submit"), r !== !1 && i.submit()),
                    e.trim(n._dom.val()) != "" && (n.inputWord = e(n._dom).val())
                },
                _bindEvent: function() {
                    var n = this;
                    this._dom.on("blur",
                        function() {
                            n._stop()
                        }),
                        this._dom.on("keyup",
                            function(e) {
                                var t = e.which;
                                t != 38 && t != 40 && t != 13 && (n.curIndex = 0)
                            }),
                        this._dom.on("paste",
                            function(e) {
                                n._start()
                            }),
                        this._dom.on("keydown",
                            function(t) {
                                var i = t.which;
                                if (i > 111 && i < 138) return;
                                if (r.indexOf("|" + i + "|") != -1) return;
                                if (i == 27) {
                                    n.hideList();
                                    return
                                }
                                if (i == 13) {
                                    n.curIndex != 0 && (n.autoSubmit || t.preventDefault());
                                    return
                                }
                                if (i == 38 || i == 40) {
                                    n._stop();
                                    var s = n.suggestList.find(n.itemSelectors).length;
                                    if (s) {++s;
                                        if (i == 38) {
                                            n.curIndex = (n.curIndex - 1 + s) % s;
                                            var o = n.suggestList.find(n.itemSelectors)[n.curIndex - 1];
                                            o && e(o).hasClass(n.itemFakeClass) && (n.curIndex = (n.curIndex - 1 + s) % s)
                                        } else if (i == 40) {
                                            n.curIndex = (n.curIndex + 1 + s) % s;
                                            var o = n.suggestList.find(n.itemSelectors)[n.curIndex - 1];
                                            o && e(o).hasClass(n.itemFakeClass) && (n.curIndex = (n.curIndex + 1 + s) % s)
                                        }
                                        if (n.curIndex == 0) n._dom.val(n.inputWord),
                                            n.suggestList.find(n.itemSelectors).removeClass(n.itemHoverStyle);
                                        else {
                                            var u = n.suggestList.find(n.itemSelectors)[n.curIndex - 1];
                                            if (e(n).triggerHandler("suggest.beforechoose", u) === !1) return ! 1;
                                            n.suggestList.show(),
                                                n._dealwithListDirection(),
                                                n.fillDataFun(u),
                                                n.suggestList.find(n.itemSelectors).removeClass(n.itemHoverStyle),
                                                e(u).addClass(n.itemHoverStyle);
                                            if (e(n).triggerHandler("suggest.afterchoose", u) === !1) return ! 1
                                        }
                                    }
                                    t.preventDefault();
                                    return
                                }
                                n._start()
                            }),
                        n.suggestList.delegate("li", "mouseover",
                            function() {
                                e(this).addClass(n.itemHoverStyle)
                            }).delegate("li", "mouseout",
                            function() {
                                e(this).removeClass(n.itemHoverStyle)
                            }).delegate("li", "click",
                            function() {
                                n._submitMe.apply(n, [this])
                            }),
                        e("body").on("click",
                            function(t) {
                                var r = e(t.target).parents("li." + n.itemFakeClass);
                                if (r.length > 0 && e(t.target).parents(".suggest").attr("id") == n.suggestList.attr("id")) {
                                    if (!r.hasClass(n.itemNoneClass)) {
                                        var i = r.next("li:not(.fake)");
                                        n._dom.val(i.find(".sug-item").attr("data")),
                                            i.addClass(n.itemHoverStyle)
                                    }
                                    return ! 1
                                }
                                if (t.target == n._dom[0]) return n.inputWord && (n.suggestList.show(), n._dealwithListDirection()),
                                    !1;
                                n.hideList(),
                                    n.curIndex = 0
                            }),
                        e(t).on("resize",
                            function() {
                                var e;
                                return function() {
                                    clearTimeout(e),
                                        e = setTimeout(function() {
                                                n.autoFixListPos && n._resetPos()
                                            },
                                            100)
                                }
                            } ()),
                        e(this).on("suggest.beforesuggest",
                            function(e) {
                                if (n.onbeforesuggest) return n.onbeforesuggest(e)
                            }),
                        e(this).on("suggest.aftersuggest",
                            function(e) {
                                if (n.onaftersuggest) return n.onaftersuggest(e)
                            }),
                        e(this).on("suggest.afterinputchange",
                            function(e, t, r) {
                                if (n.onafterinputchange) return n.onafterinputchange(e, t, r)
                            }),
                        e(this).on("suggest.aftergetdata",
                            function(e, t) {
                                if (n.onaftergetdata) return n.onaftergetdata(e, t)
                            }),
                        e(this).on("suggest.beforechoose",
                            function(e, t) {
                                e.selectedDom = t;
                                if (n.onbeforechoose) return n.onbeforechoose(e)
                            }),
                        e(this).on("suggest.afterchoose",
                            function(e, t) {
                                e.selectedDom = t;
                                if (n.onafterchoose) return n.onafterchoose(e)
                            })
                },
                _dealwithListDirection: function() {},
                _fixPos: function() {
                    var e = {},
                        t = function() {
                            var t = this._dom.offset(),
                                n = e[this.suggestList.attr("id")];
                            if (t.left != n.left || t.top != n.top || t.forid != n.forid) this._resetPos(),
                                n = t
                        };
                    return function(n) {
                        n && this.autoFixListPos &&
                        function() {
                            var n = this.suggestList.attr("id"),
                                r;
                            e[n] || (r = this._dom.offset(), r.forid = n, e[n] = r, this._resetPos()),
                                t.apply(this)
                        }.call(this, arguments[0])
                    }
                }.apply(this),
                _resetPos: function() {
                    var e = this._dom.offset(),
                        t = this._dom.height(),
                        n = this._dom.width(),
                        r = {
                            top: e.top,
                            left: e.left,
                            right: e.left + n,
                            bottom: e.top + t,
                            width: n,
                            height: t
                        },
                        i = this.posAdjust;
                    this.suggestList.css({
                            position: "absolute",
                            top: (i.top ? i.top + r.bottom: r.bottom) + "px",
                            left: (i.left ? i.left + r.left: r.left) + "px",
                            width: (i.width ? i.width + r.width: r.width) + "px",
                            "z-index": i["z-index"] ? i["z-index"] : 99
                        },
                        1),
                        this._dealwithListDirection()
                }
            },
            t.Suggest = a
    } (jQuery, window),
    define("lib/suggest",
        function() {}),
    define("module/common-head", ["common/optimize", "module/common-login", "lib/addfav", "lib/dialog", "lib/alert", "lib/suggest", "lib/jquery.cookie"],
        function(e, t, n, r, i) {
            var s, o, u, a, f = 5,
                l = [],
                c = function() {
                    $.ajax({
                        url: "/api/pc/v1/msg/num/unread",
                        type: "GET",
                        dataType: "json",
                        success: function(e) {
                            e.code == 0 && e.data && $("#hdMsgCount").text(e.data.num || "0")
                        }
                    })
                },
                h = function(e) {
                    $.cookie("ppinf") ? $.ajax({
                        url: "/api/pc/v1/user/info",
                        type: "GET",
                        dataType: "json",
                        success: function(t) {
                            if (t.code == 0 && t.data) {
                                $("#hdNickname .text-ellips").text(t.data.nickname),
                                    $.cookie("hostid", t.data.uid, {
                                        expires: 365,
                                        path: "/",
                                        domain: "xs.sogou.com"
                                    }),
                                    t.data.isVip && t.data.vipExpireTime > +(new Date) ? $("#loginBar .vip-icon").removeClass("novip-icon") : $("#loginBar .vip-icon").addClass("novip-icon");
                                if (t.data.recentBooks && t.data.recentBooks.length > 0) {
                                    var n = "",
                                        r = t.data.recentBooks,
                                        i = Math.min(7, r.length);
                                    for (var s = 0; s < i; s++) n += '<li><a pbtag="书名_' + r[s].bid + "_" + r[s].bookName + '" class="text-ellips" target="_blank" href="/chapter/' + r[s].bid + "_" + r[s].lastReadCid + '/">' + r[s].bookName + "</a></li>";
                                    $("#hdBooksList").html(n)
                                } else $("#hdBooksList").html("<li><p>空</p></li>");
                                t.data.isSigned && $("#loginBar .hd-check-btn").addClass("hd-checked").text("已签"),
                                    $("#hdGoldCount").text((t.data.remainRP || "0") + "阅豆"),
                                    $("#loginBar .login").hide(),
                                    $("#loginBar .logged").show(),
                                    c()
                            } else $("#loginBar .login").show(),
                                $("#loginBar .logged").hide();
                            e && e(t)
                        }
                    }) : ($("#loginBar .login").show(), $("#loginBar .logged").hide(), e && e())
                },
                p = function(e) {
                    $.ajax({
                        url: "/api/pc/v1/search/suggest",
                        type: "GET",
                        data: {
                            keyword: e
                        },
                        dataType: "json",
                        success: function(t) {
                            if (t.code == 0 && t.data && t.data.pageList) {
                                var n = "",
                                    r, i = t.data.pageList;
                                for (var s = 0,
                                         o = Math.min(f, i.length); s < o; s++) n += '<li><a pbtag="' + i[s] + '" href="#" data-key="' + (i[s] || "") + '">' + (i[s] || "").replace(e, "<span>" + e + "</span>") + "</a></li>";
                                n.length > 0 && $("#sugSearchList").html(n).show()
                            }
                        }
                    })
                },
                d = function() {
                    $("#newsGiftIcon").parents("li").remove();
                    return
                },
                v = function() {
                    if (!$.cookie("ppinf")) {
                        m();
                        return
                    }
                    $.cookie("newgift_state") ? ($.cookie("newgift_state") * 1 !== 1 && d(), m()) : $.get("/api/pc/v1/activity/newgift/state",
                        function(e) {
                            e && e.code == 0 && e.data && ($.cookie("newgift_state", e.data.state * 1, {
                                expires: 1,
                                path: "/"
                            }), e.data.state * 1 !== 1 && d()),
                                m()
                        },
                        "json")
                },
                m = function() { !! window.newGifToken && $("#newsGiftDialog").length > 0 && $("#newsGiftIcon").length > 0 && (s = new r({
                    el: "#newsGiftDialog",
                    width: $("#newsGiftDialog").width()
                }), u = new i({
                    content: "没有可领取的礼包",
                    btnText: "知道了",
                    fn: function() {
                        var e = this;
                        e.$(".btn2").remove(),
                            e.$(".btn1").on("click",
                                function() {
                                    return e.hide(),
                                        !1
                                })
                    }
                }))
                },
                g = function(t, n) {
                    function s() {
                        var t = window.floatAdList[0].bg;
                        $.cookie("float-ads") == t && (t = window.floatAdList[Math.floor(Math.random() * window.floatAdList.length)].bg, i.css("background-image", "url(" + t + ")")),
                            e.sendPingback("extra", t, "浮层广告弹窗"),
                            o = new r({
                                el: "#floatTop",
                                width: i.width()
                            }),
                            o.show(),
                        window.pcode == "xs_reader" && ($("#" + o.mask.id).css("z-index", 2147483647), $("#floatTop").css("z-index", 2147483647), o.zIndex = 2147483647),
                            $("#floatTop").one("click", ".close-btn",
                                function(e) {
                                    e.preventDefault(),
                                    window.pcode == "xs_reader" && $("#" + o.mask.id).css("z-index", 9999),
                                        $.cookie("close-float-ads", "1", {
                                            expires: n * 1,
                                            path: "/"
                                        }),
                                    window.floatAdList && window.floatAdList.length > 0 && $.cookie("float-ads", window.floatAdList[0].bg, {
                                        expires: 365,
                                        path: "/"
                                    })
                                })
                    }
                    var i = $("#floatTop .bg");
                    n = n || $("#floatTop .ad-link").data("exp") || 1,
                    i.length > 0 && !$.cookie("close-float-ads") && window.floatAdList && window.floatAdList.length > 0 && (t && t.length > 0 && t != "#" ? $.get(t,
                        function(e) { (e.code != 0 || e.data && e.data.state == 0) && s()
                        },
                        "json") : s())
                },
                y = function(t, n, r) {
                    n = n || $.trim($("#commSearchInput").val()),
                        n && n != "" ? $("#commSearchInput").val(n) : $("#commSearchInput").val($("#commSearchInput").attr("data-def")),
                        $("#commSearchInput").siblings(".placeholder").hide(),
                        $("#sugSearchList").hide(),
                        e.sendPingback("other", n, t),
                    r || $("#formUrl").submit()
                },
                b = function(e, t) {
                    e && $(e).click(function(e) {
                        e.preventDefault(),
                            w()
                    }),
                        l.push(t)
                },
                w = function() {
                    $.ajax({
                        url: "/api/pc/v1/sign/signnow",
                        type: "POST",
                        dataType: "json",
                        success: function(e) {
                            if (e.code == 0) {
                                t.showCheckin(e.data.seriesCount, e.data.bonusRp, e.data.dict),
                                    h(),
                                    $("#loginBar .hd-check-btn").addClass("hd-checked").text("已签");
                                var n;
                                while (l && l.length > 0) n = l.pop(),
                                n && n()
                            } else if (e.code == 407 && $("#bindMobile").length > 0) t.bindMobile(w);
                            else {
                                var r = (e.msg || "网络故障，请刷新重试！") + "";
                                a || (a = new i({
                                    content: r,
                                    btnText: "知道了",
                                    fn: function() {
                                        var e = this;
                                        e.$(".btn2").remove(),
                                            e.$(".btn1").on("click",
                                                function() {
                                                    return e.hide(),
                                                        !1
                                                })
                                    }
                                })),
                                    a.$(".content").html(r),
                                    a.show()
                            }
                        }
                    })
                },
                E = function(e) {
                    e = e || window.newGifToken,
                        $.ajax({
                            url: "/api/pc/v1/activity/newgift/take",
                            type: "POST",
                            data: {
                                token: e
                            },
                            dataType: "json",
                            success: function(e) {
                                s.hide(),
                                    e.code == 0 ? (u.$(".btn1").html("关闭"), u.$(".content").html(e.msg), h(), u.show(), $.cookie("newgift_state", 2, {
                                        expires: 1,
                                        path: "/"
                                    }), d()) : e.code == 407 && $("#bindMobile").length > 0 ? t.bindMobile(E) : (u.$(".btn1").html("知道了"), u.$(".content").html(e.msg + ""), u.show())
                            }
                        })
                },
                S = function() {
                    $("#loginBar .hd-books-list,#loginBar .hd-info-tip,#sugSearchList").hide(),
                        $("#loginBar .hd-nickname").removeClass("sel"),
                        $("#loginBar .hd-books").removeClass("sel")
                },
                x = function() {
                    $("#loginBar").on("click", ".logout",
                        function(t) {
                            e.newCommonLogout(),
                                t.preventDefault()
                        }).on("click", ".login-btn",
                        function(e) {}).on("click", ".reg-btn",
                        function(e) {
                            var t = "/register?cb=";
                            t += encodeURIComponent(window.location.href),
                                window.open(t),
                                e.preventDefault()
                        }).on("click", ".third-login a",
                        function(n) {
                            var r = $(this);
                            if (t.wechatLogin(r.attr("data-third"))) return ! 1;
                            e.newThirdLogin(r.attr("data-third"), !1, window.location.href, r.attr("openwindowwidth"), r.attr("openwindowheight"), ""),
                                n.preventDefault()
                        }).on("click", ".hd-check-btn",
                        function(e) {
                            $(this).hasClass("hd-checked") || (w(), e.preventDefault())
                        }).on("click", ".hd-nickname",
                        function(e) {
                            var t = $(this).hasClass("sel");
                            S(),
                                t ? ($("#loginBar .hd-info-tip").hide(), $(this).removeClass("sel")) : ($("#loginBar .hd-info-tip").show(), $(this).addClass("sel")),
                                e.stopPropagation(),
                                e.preventDefault()
                        }).on("click", ".hd-books",
                        function(e) {
                            var t = $(this).hasClass("sel");
                            S(),
                                t ? ($("#loginBar .hd-books-list").hide(), $(this).removeClass("sel")) : ($("#loginBar .hd-books-list").show(), $(this).addClass("sel")),
                                e.stopPropagation(),
                                e.preventDefault()
                        }),
                        $("#allTypes .type-btn").on("click",
                            function(e) {
                                if ($(this).parents(".box-center").hasClass("list-on")) return ! 1;
                                $(this).hasClass("sel") ? ($("#allTypes .type-list").hide(), $("#allTypes .type-btn").removeClass("sel")) : ($("#allTypes .type-list").show(), $("#allTypes .type-btn").addClass("sel"))
                            }),
                        $("#allTypes").on("mouseenter",
                            function(e) {
                                if ($(this).parents(".box-center").hasClass("list-on")) return ! 1;
                                $("#allTypes .type-list").show(),
                                    $("#allTypes .type-btn").addClass("sel")
                            }).on("mouseleave",
                            function(e) {
                                if ($(this).parents(".box-center").hasClass("list-on")) return ! 1;
                                $("#allTypes .type-list").hide(),
                                    $("#allTypes .type-btn").removeClass("sel")
                            }),
                        $("#commSearchInput").on("keyup",
                            function(e) {
                                $(this).siblings(".placeholder").hide();
                                var t = $.trim($("#commSearchInput").val());
                                e.keyCode != 13 && (!t || t == "") && $("#sugSearchList").hide()
                            }).on("keydown",
                            function(e) {
                                e.keyCode == 13 && y("回车搜索", "", !0)
                            }).on("focus",
                            function(e) {}).on("blur",
                            function(e) {}),
                        $("#commSearchSubmit").on("click",
                            function(e) {
                                e.preventDefault(),
                                    y("点击搜索")
                            }),
                        $("#sugSearchList").on("click", "a",
                            function(e) {
                                e.stopPropagation(),
                                    e.preventDefault();
                                var t = $(this).attr("data-key");
                                y("推荐词搜索", t)
                            }).on("keydown", "a",
                            function(e) {}),
                        $("#adsList").on("click", ".close-btn",
                            function(e) {
                                $(this).parent().hide(),
                                    e.preventDefault()
                            }).on("click", "#newsGiftIcon",
                            function(e) {
                                e.preventDefault(),
                                !s || s.show()
                            }),
                        $("#newsGiftDialog").on("click", ".ticket",
                            function(e) {
                                e.preventDefault();
                                if (!$.cookie("ppinf")) return $("#headLoginbtn").click(),
                                    s.hide(),
                                    !1;
                                E()
                            }),
                        $("#footFb, #footFb2, #leftFb, #headFb").click(function(e) {
                            e.preventDefault(),
                                window.open("" + encodeURIComponent(window.location.href))
                        }),
                        $("#humanFb").on("mouseenter",
                            function(e) {
                                $("#humanFbTip").show()
                            }).on("click",
                            function(e) {
                                e.preventDefault()
                            }).on("mouseleave",
                            function(e) {
                                $("#humanFbTip").hide()
                            }),
                        $("#bottomAdBox").on("click", ".bottom-link",
                            function(e) {
                                return window.bottomAdUrl && window.bottomAdUrl != "#" && window.open(window.bottomAdUrl),
                                    !1
                            }).on("click", ".close-btn",
                            function(e) {
                                e.preventDefault(),
                                    $.cookie("close_bottomAds", 1, {
                                        expires: 1,
                                        path: "/"
                                    }),
                                    $("#bottomAdBox").animate({
                                            bottom: -$("#bottomAdBox").height()
                                        },
                                        300,
                                        function() {
                                            $(this).hide()
                                        })
                            }),
                        $(document).click(function(e) {
                            S(),
                                $("#jiaShare").hide()
                        })
                },
                T = function(e, t) {
                    if (!e || $.cookie("close_bottomAds") || $("#bottomAdBox:visible").length) return;
                    t && (window.bottomAdUrl = t.url, window.bottomAdAct = t.act, $(".bottom-fl .bottom-bg").css("height", t.height + "px").css("background-color", t.background), $(".bottom-fl .bottom-link").css("height", t.imgH + "px").css("background-image", "url(" + t.img + ")"), $(".bottom-fl .close-btn").css("bottom", t.height * 1 + 10 + "px")),
                        $("#bottomAdBox").css("bottom", -$("#bottomAdBox").height()).show().animate({
                                bottom: 0
                            },
                            300)
                },
                N = function() {
                    $.getJSON("",
                        function(e) {
                            if (!e) return;
                            if (e.hotwords && e.hotwords.length > 0) {
                                var t = "";
                                for (var n = 1,
                                         r = Math.min(8, e.hotwords.length); n < r; n++) t += '<a target="_blank" href="' + e.hotwords[n].url + '">' + e.hotwords[n].key + "</a>";
                                $("#headHotWords").html(t);
                                var i = e.hotwords[0].key;
                                $("#commSearchInput").attr("placeholder", i).attr("data-def", i).siblings(".placeholder").html(i)
                            }
                            if (e.hotCategorys && e.hotCategorys.length > 0) {
                                var s = "";
                                for (var n = 0,
                                         r = e.hotCategorys.length; n < r; n++) s += '<a href="/' + e.hotCategorys[n].id + '_0_0_0_heat/" target="_blank">' + e.hotCategorys[n].fullName + "</a>";
                                $("#headAllTypes").html(s)
                            }
                            if (e.leftads && e.leftads.length > 0) {
                                var o = "<ul>";
                                for (var n = 0,
                                         r = e.leftads.length; n < r; n++) o += '<li><a href="#" class="close-btn icon fr"></a>',
                                    o += '<a href="' + e.leftads[n].link + '" target="_blank"><img src="' + e.leftads[n].img + '"></a></li>';
                                o += "</ul>",
                                    $("#adsList").html(o)
                            }
                            e.headAd && e.headAd.length > 0 && $("#headPic").attr("href", e.headAd[0].link).find("img").attr("src", e.headAd[0].img),
                            e.wxqrcode && $(".wxqrcode img").attr("src", e.wxqrcode),
                            e.wbqrcode && $(".wbqrcode img").attr("src", e.wbqrcode),
                            e.fbqrcode && $("#humanFbTip img").attr("src", e.fbqrcode),
                            e.publink && e.pubname && $("#headPubType").attr("href", e.publink).text(e.pubname);
                            if ($("#newsGiftDialog").length > 0 && e.newGift && +e.newGift.canTake == 1) {
                                var u = e.newGift,
                                    a = +u.width || 543,
                                    f = +u.height || 467,
                                    l = +u.top || 285;
                                window.newGifToken = u.token;
                                var c = '<div class="bg"' + (u.background ? ' style="background-image:url(' + u.background + ");width:" + a + "px;height:" + f + 'px;"': "") + '><a href="#" pbtag="关闭" class="close-btn icon"></a>' + "<p" + (u.button ? ' style="top:' + l + 'px;"': "") + ">" + '<a href="#" class="ticket" pbtag="立即领取"' + (u.button ? ' style="background-image:url(' + u.button + ');"': "") + "></a></p></div>";
                                $("#newsGiftDialog").html(c),
                                    $("#adsList ul").prepend($('<li><a href="#" class="close-btn icon fr" target="_blank"></a><a href="#" id="newsGiftIcon" target="_blank" pbflag="新人礼包"><img src="' + u.img + '"></a></li>')),
                                    v()
                            }
                            if (e.floatAds && e.floatAds.act == "1" && e.floatAds.list && e.floatAds.list.length > 0) {
                                var h = e.floatAds,
                                    p = '<div class="bg" style="background-image:url(' + h.list[0].bg + ");width:" + h.w + "px;height:" + h.h + 'px;">' + (h.list[0].url && h.list[0].url != "#" ? '<a href="' + h.list[0].url + '" class="ad-link" pbtag="广告链接" target="_blank"></a>': "") + '<a href="#" pbtag="关闭" class="close-btn" style="right:' + h.r + "px;top:" + h.t + 'px;"></a></div>';
                                $("#floatTop").html(p),
                                    window.floatAdList = e.floatAds.list.concat(),
                                    g(e.floatAds.api, e.floatAds.exp)
                            }
                            e.bottomAd && e.bottomAd.act && T(e.bottomAd.act * 1, e.bottomAd)
                        })
                },
                C = function() {
                    $(window).width() < 1400 ? $("#floatFunc").hide() : ($(window).scrollTop() == 0 ? $("#floatFunc").addClass("on-top") : $("#floatFunc").removeClass("on-top"), $("#floatFunc").show())
                },
                k = function(e) {
                    $.cookie(e, "1", {
                        expires: 1,
                        path: "/"
                    })
                },
                L = function() {
                    var e = "offline_xs_pc",
                        t = $("#offLineDialogall");
                    $.cookie(e) === "1" && t.hide();
                    var n = null;
                    $("body").on("click", "#offLineDialogall .close-btn",
                        function() {
                            $(this).parent("#offLineDialogall").remove(),
                                k(e)
                        }),
                        clearTimeout(n),
                        n = setTimeout(function() {
                                k(e),
                                    $("#offLineDialogall").remove()
                            },
                            2e5)
                },
                A = function() {
                    var e = $.cookie("sgid"),
                        t = "" + e;
                    $.ajax({
                        type: "GET",
                        url: t,
                        dataType: "json",
                        crossDomain: !0,
                        success: function(e) {
                            e.data && e.code == 0 && ($("#userYueDou").append(O(e)), $("#realYd").append(M(e)))
                        }
                    })
                },
                O = function(e) {
                    var t = '<p class="">            <span class="text-title">充值阅豆：' + e.data.realYd + ' 阅豆</span>            <i>（此阅豆为您实际充值所得）</i>        </p>        <p class="">            <span class="text-title">虚拟阅豆：' + e.data.virtualYd + "阅豆</span>            <i>（此阅豆为系统赠送所得）</i>        </p>";
                    return t
                },
                M = function(e) {
                    var t = '<p class="">          <span>充值阅豆余额：' + e.data.realYd + " 阅豆</span>          <i>（此阅豆为您实际充值所得）</i>      </p>";
                    return t
                },
                _ = function(e) {
                    if (window.pcode == "xs_index" || window.pcode == "xs_baoyue") $(window).scroll(C),
                        C(),
                        n();
                    $(window).width() >= 1400 && $("#adsList").show(),
                        t.init(),
                        x(),
                        h(e),
                        L(),
                        A(),
                        v(),
                        g(window.floatApi),
                        T(window.bottomAdAct * 1);
                    var r = new Suggest($("#commSearchInput"), {
                        data_url: "",
                        get_data_fun: "ajax",
                        getDataType: "json",
                        item_selectors: "li",
                        trimKW: !0,
                        auto_submit: !0,
                        autoFixListPos: !1,
                        suggestList: $("#sugSearchList"),
                        render_data_fun: function(e, t) {
                            if (t.code == 0 && t.data && t.data.pageList) {
                                var n = "",
                                    r = t.data.pageList;
                                if (r.length < 1) return "";
                                for (var i = 0,
                                         s = Math.min(f, r.length); i < s; i++) n += '<li><a pbtag="' + r[i] + '" href="#" data-key="' + (r[i] || "") + '">' + (r[i] || "").replace(e, "<span>" + e + "</span>") + "</a></li>";
                                return '<ul class="search-list">' + n + "</ul>"
                            }
                        }
                    })
                };
            return {
                checkin: b,
                updateData: N,
                updateUserInfo: h,
                init: _
            }
        }),
    Date.prototype.Format = function(e) {
        var t = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            S: this.getMilliseconds()
        };
        /(y+)/.test(e) && (e = e.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (var n in t)(new RegExp("(" + n + ")")).test(e) && (e = e.replace(RegExp.$1, RegExp.$1.length == 1 ? t[n] : ("00" + t[n]).substr(("" + t[n]).length)));
        return e
    },
    define("lib/date.Format",
        function() {}),
    require.config({
        baseUrl: "/static/js/",
        urlArgs: "t=" + +(new Date)
    }),
    require(["common/optimize", "common/main", "module/common-head", "lib/alert", "lib/dialog", "lib/jquery.cookie", "lib/date.Format"],
        function(e, t, n, r, i) {
            var s = $("body"),
                o = $(".reader-setting"),
                u = o.find(".button:not(.back)"),
                a = $(".reader-setting-wp"),
                f = $(".show-toc .title .tab"),
                l = $("#tocListWp"),
                c = $("#contentWp"),
                h = $("#chargeWp"),
                p = $("#flwxBottom"),
                d = $("#flwxLeft"),
                v = $("#blockWp"),
                m = $(window),
                g = !0,
                y = !1,
                b = !1,
                w = new i({
                    el: "#helpTip",
                    width: 550,
                    mask: {
                        opacity: .001
                    }
                }),
                E = window.bid,
                S = window.cid,
                x = {},
                T = new r({
                    content: "请确认购买~",
                    btnText: "确认",
                    fn: function() {
                        var e = this;
                        e.$(".btn1").on("click",
                            function() {
                                return R(e.opts),
                                    e.hide(),
                                    !1
                            }),
                            e.onhide = function() {
                                e.opts = {}
                            }
                    }
                }),



                L = new r({
                    content: "--",
                    btnText: "确认",
                    fn: function() {
                        var e = this;
                        e.$(".btn2").remove(),
                            e.$(".btn1").on("click",
                                function() {
                                    return e.hide(),
                                        !1
                                })
                    }
                }),
                A = new i({
                    el: "#offLineDialog",
                    width: 500
                }),
                O = function() {
                    var e = $.cookie("reader_setting"),
                        t,
                        n,
                        r;
                    e ? (t = e.match(/theme:([^;]+)/)[1], n = e.match(/font:([^;]+)/)[1], r = e.match(/size:([^;]+)/)[1], $("#setTheme").find('[v="' + t + '"]').trigger("click"), $("#setFont").find('[v="' + n + '"]').trigger("click"), $("#setSize").find(".t2").text(r), c.css("font-size", r + "px")) : ($("#setTheme .t1").trigger("click"), $("#setFont .t1").trigger("click"), $("#setSize .t2").text(16), c.removeAttr("style")),
                        c.show()
                },
                M = function() {
                    var t = "theme:" + $("#setTheme .cur").attr("v") + ";font:" + $("#setFont .cur").attr("v") + ";size:" + $("#setSize .t2").text(),
                        n = $.cookie("reader_setting");
                    $.cookie("reader_setting", t, {
                        expires: 300,
                        path: "/"
                    });
                    var r = [];
                    t.match(/theme:([^;]+)/)[1] != n.match(/theme:([^;]+)/)[1] ? r.push("t:" + t.match(/theme:([^;]+)/)[1]) : !0,
                        t.match(/font:([^;]+)/)[1] != n.match(/font:([^;]+)/)[1] ? r.push("f:" + t.match(/font:([^;]+)/)[1]) : !0,
                        t.match(/size:([^;]+)/)[1] != n.match(/size:([^;]+)/)[1] ? r.push("s:" + t.match(/size:([^;]+)/)[1]) : !0,
                    r.length > 0 && e.sendPingback("extra", r.join(";"), "设置阅读器")
                },
                D = function() {
                    $.get("", {
                            bid: E,
                            t: +(new Date)
                        },
                        function(e) {
                            if (e.code == 0) {
                                var t = e.data;
                                t.bid = E,
                                    x.bookMarData = t,
                                    x.initMark = 1,
                                    B(t),
                                    P()
                            }
                        },
                        "json")
                },
                P = function() {
                    document.getElementById("bookMark").className = window.isMarded ? "bookmark marked": "bookmark"
                },
                H = function(e, t) {
                    $.post("" + e, {
                            bid: E,
                            cid: t || S
                        },
                        function(t) {
                            t.code == 0 ? (L.show(function() {
                                this.$(".content").html(e == "add" ? "加入书签成功~": "删除书签成功~")
                            }), D()) : L.show(function() {
                                this.$(".content").html(t.msg)
                            })
                        },
                        "json")
                },
                B = function(e) {
                    window.isMarded = 0,
                        document.getElementById("markListWp").innerHTML = _.template('<% pageList.length ? _.each(pageList, function(m){ %><% if(m.cid == cid){window.isMarded = 1} %><a href="/chapter/<%=bid%>_<%=m.cid%>"><span class="del" c="<%=m.cid%>">&times;</span><span class="name ellipsis"><%=m.chapterName%></span><span class="time"><%=new Date(m.insertTime).Format("yyyy-MM-dd hh:mm:ss")%></span></a><% }) : %><span class="empty">暂无书签，点击阅读器右上角可以添加书签哦~</span><% ; %>')(e)
                },
                j = function(e) {
                    document.getElementById("tocListWp").innerHTML = _.template('<% _.each(catalog, function(v){ %><dl class="toc-list"><dt><%=v.vname%><i class="icon"></i></dt><dd class="clear"><% _.each(v.clist, function(c){ %><a href="/chapter/<%=bid%>_<%=c.cid%>"<% if(c.cid == cid){ %> class="cur"<% } %>><span class="ellipsis"><%=c.cname%></span><% if(bookRS < 1 && !rsMap[c.cid]){ %><span class="icon lock"></span><% } %></a><% }) %></dd></dl><% }) %>')(e),
                        l.find(".cur").parent().prev().trigger("click")
                },
                F = function() {
                    return $.cookie("ppinf") ? !0 : ($("#headLoginbtn").click(), !1)
                },
                I = function() {
                    $.get("/api/pc/v1/weixin/follow/state",
                        function(e) {
                            e.code == 0 && e.data && e.data.state == 1 ? d.hide() && p.hide() : (b = !0, !g && p.length && p.show(), !$.cookie("reader_flwx_close") && d.show())
                        },
                        "json")
                },


                U = function(e) {
                    var t = $(".show-toc .title .cur").attr("data-sort");
                    e && (t = t != "rerv" ? "rerv": "forw", $(".show-toc .title .cur").attr("data-sort", t)),
                        t != "rerv" ? $("#reverseRank").text("⇓ 倒序") : $("#reverseRank").text("⇑ 正序");

                },
                z = function() {
                    $.post("", {
                            bid: E,
                            cid: S
                        },
                        function(e) {
                            e.code == 0 && ($("#addShelf").html(e.data && e.data.bookshelfTime ? "已加书架": "加入书架"), window.isMarded = !!e.data && !!e.data.hasBookmark, P())
                        })
                },
                W = function(e, t) {
                    var n = 10,
                        r = e.slice(0, -n) - t.slice(0, -n);
                    return r ? r > 0 : e.slice( - n) - t.slice( - n) > 0
                },
                X = function(e) {
                    if (!e) {
                        g = !1,
                        b && p.length && p.show(),
                        y && h.show();
                        return
                    }
                    g = !0;
                    var t = "";
                    if (e.tips && e.tips.length > 0) for (var n = 0,
                                                              r = e.tips.length; n < r; n++) t += "<p>" + e.tips[n] + "</p>";
                    t += '<img src="' + e.qrcode + '" />',
                        v.html(t).show(),
                        c.html("").hide()
                },
                V = function() {
                    $.getJSON("",
                        function(e) {
                            if (e && e.act == "1" && e.bList && e.bList.length > 0) {
                                var t;
                                for (var n = 0,
                                         r = e.bList.length; n < r; n++) {
                                    t = e.bList[n];
                                    if (t.bid == E && W(S, t.cid)) {
                                        X(t.info);
                                        return
                                    }
                                }
                            }
                            X(!1)
                        }).error(function() {
                        X(!1)
                    })
                },
                J = function() {
                    t.init({
                        bid: window.bid,
                        cid: window.cid,
                        bname: window.bname
                    }),
                        n.init(),
                        n.updateData(),
                    $.cookie("reader_help_tip") || ($.cookie("reader_help_tip", 1, {
                        expires: 90,
                        path: "/"
                    }), $(".reader-main").addClass("show-help"), w.show()),
                        z(),
                        O(),
                        D(),
                        q(),
                        I()
                };
            d.on("click", ".close-btn",
                function(e) {
                    e.preventDefault(),
                        d.hide(),
                        $.cookie("reader_flwx_close", 1, {
                            expires: 360,
                            path: "/"
                        })
                }),
                u.on("click",
                    function() {
                        var e = $(this),
                            t = this.className.split(" ")[1];
                        return e.hasClass("button-on") ? (u.removeClass("button-on"), a.hide()) : (u.removeClass("button-on"), e.addClass("button-on"), a.hide().filter(".show-" + t).show()),
                            !1
                    }),
                a.find(".cls").on("click",
                    function(e) {
                        e.preventDefault(),
                            u.removeClass("button-on"),
                            a.hide()
                    }),
                f.on("click",
                    function() {
                        var e = $(this),
                            t = "." + e.attr("show") + "-box";
                        return f.removeClass("cur"),
                            e.addClass("cur"),
                            $(t).show().siblings().hide(),
                            U(),
                            !1
                    }),
                l.on("click", "dt",
                    function(e) {
                        var t = $(this);
                        t.find(".down")[0] ? (t.next().hide(), t.find(".icon").removeClass("down")) : (l.find("dd").hide(), l.find(".icon").removeClass("down"), t.next().show(), t.find(".icon").addClass("down"))
                    }),
                $("#helpTip .close").on("click",
                    function() {
                        return w.hide(),
                            $(".reader-main").removeClass("show-help"),
                            !1
                    }),
                $("#setTheme span").on("click",
                    function() {
                        document.body.className = $(this).attr("v"),
                            $("#setTheme span").html("").removeClass("cur"),
                            this.innerHTML = '<i class="icon"></i>',
                            this.className += " cur"
                    }),
                $("#setFont span").on("click",
                    function() {
                        var e = $(this).attr("v");
                        $("#setFont span").removeClass("cur"),
                            this.className += " cur",
                            c.css("font-family", e == "yahei" ? "": e)
                    }),
                $("#setSize ._resize").on("click",
                    function() {
                        var e = $("#setSize .t2"),
                            t = +e.text(),
                            n = $(this).hasClass("t1") ? t - 2 : t + 2;
                        n < 12 && (n = 12),
                        n > 40 && (n = 40),
                            e.text(n),
                            c.css("font-size", n)
                    }),
                $("#reverseRank").on("click",
                    function() {
                        var e = $(".show-toc .title .cur").attr("show");
                        return e == "mark" && x.initMark ? (x.bookMarData.pageList.reverse(), B(x.bookMarData)) : x.initToc && (x.tocData.catalog.reverse(), _.each(x.tocData.catalog,
                            function(e) {
                                e.clist.reverse()
                            }), j(x.tocData)),
                            U(!0),
                            !1
                    }),
                $("#settingBtn a,.show-set .cls").on("click",
                    function() {
                        return this.className == "save" ? M() : O(),
                            u.removeClass("button-on"),
                            a.hide(),
                            !1
                    }),



                $("#gotop").on("click",
                    function() {
                        return $("html,body").animate({
                                scrollTop: 0
                            },
                            "slow"),
                            !1
                    }),
                $(".disabled").on("click",
                    function() {
                        return ! 1
                    }),
                m.on("scroll",
                    function() {
                        var e = m.scrollTop();
                        e < 1 ? o.attr("style") && o.removeAttr("style") : o.css("top", e - 0)
                    }).trigger("scroll"),
                s.on("keydown",
                    function(e) {
                        e.target.tagName.toUpperCase() != "INPUT" && (e.keyCode == 39 && location.assign($(".paper-footer .next")[0].href), e.keyCode == 37 && location.assign($(".paper-footer .prev")[0].href))
                    }),
                document.oncontextmenu = function() {
                    return ! 1
                },
                document.onselectstart = function() {
                    return ! 1
                },
                J()
        }),
    define("page/web/reader",
        function() {});