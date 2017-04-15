/* Copyright (C) 2017
 * This file is part of my graduation project.
 *
 * filename : default.js
 * function :
 * action   :
 * version  : 1.0
 * author   : MarissaMan
 * date     : 2017/2/1
 * modify   :
 */
(function () {
    // 私有变量
    var TITLE = 'SaSa',
        PRECISION_QTY = 0,
        PRECISION_MONEY = 2,
        API_URL = '';

    // 私有方法
    function setCookie(key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    }

    function getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }

    function removeCookie(key) {
        var expires = new Date();
        expires.setTime(expires.getTime() - (7 * 24 * 60 * 60 * 1000));
        var current = getCookie(key);
        if (current != null) {
            document.cookie = key + '= undefined;expires=' + expires.toUTCString();
        }
    }

    // 全局变量
    var epm = {};

    // 变量
    epm.v = {
        get title() {
            return TITLE;
        }
    };

    // 配置项
    epm.c = {
        set goodsClassList(value) {
            if (typeof value !== 'string') {
                value = JSON.stringify(data);
            }

            epm.setSessionItem(epm.k.GOODS_CLASS_LIST, value);
        },
        get goodsClassList() {
            var value = epm.getSessionItem(epm.k.GOODS_CLASS_LIST);

            try {
                return JSON.parse(value);
            } catch (err) {
                return value;
            }
        }
    };

    // 键
    epm.k = {
        GOODS_CLASS_LIST: 'GOODS_CLASS_LIST'
    };

    // 业务相关
    epm.b = {};

    epm.setSessionItem = function (key, value) {
        if (window.sessionStorage) {
            sessionStorage.setItem(key, value);
        } else {
            // 后备方案
            setCookie(key, value);
        }
    };

    epm.getSessionItem = function (key) {
        if (window.sessionStorage) {
            return sessionStorage.getItem(key);
        } else {
            // 后备方案
            return getCookie(key);
        }
    };

    epm.removeSessionItem = function (key) {
        if (window.sessionStorage) {
            sessionStorage.removeItem(key);
        } else {
            // 后备方案
            removeCookie(key);
        }
    };

    epm.setLocalItem = function (key, value) {
        if (window.localStorage) {
            localStorage.setItem(key, value);
        } else {
            // 后备方案
            setCookie(key, value);
        }
    };

    epm.removeLocalItem = function (key) {
        if (window.localStorage) {
            localStorage.removeItem(key);
        } else {
            // 后备方案
            removeCookie(key);
        }
    };

    epm.getNumber = function (num) {
        if (isNaN(num) || num == null || num === '') {
            return num;
        }

        return num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    };

    epm.getDataTime = function (o) {
        if(o == null || o == ''){
            return null;
        }

        var d = new Date(o);
        if(typeof d === 'undefined'){
            o = o.substr(0,o.indexOf('.'));
            o = o.replace(/-/g, '/');
            d = new Date(o);
        }

        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();

        return d.getFullYear() + '-' + (('' + month).length < 2 ? '0' : '')
            + month + '-' + (('' + day).length < 2 ? '0' : '') + day + ' '
            + (('' + hour).length < 2 ? '0' : '') + hour + ':'
            + (('' + minute).length < 2 ? '0' : '') + minute + ':'
            + (('' + second).length < 2 ? '0' : '') + second;
    };

    epm.getDate = function(o) {
        if (o == null || o == '') {
            return null;
        }

        var d = new Date(o);
        if (typeof d === 'undefined') {
            o = o.substr(0, o.indexOf('.0'));
            o = o.replace(/-/g, '/');
            d = new Date(o);
        }

        var month = d.getMonth() + 1;
        var day = d.getDate();

        return d.getFullYear() + '-' + (('' + month).length < 2 ? '0' : '')
            + month + '-' + (('' + day).length < 2 ? '0' : '') + day;
    };

    epm.getFloat = function(o) {
        var ret = parseFloat(o);

        return isNaN(ret) ? 0 : ret;
    };

    epm.getQty = function(o) {
        var ret = this.getFloat(o);

        if (PRECISION_QTY == 0) {
            return Math.round(ret);
        } else if (PRECISION_QTY == 1) {
            return Math.round(ret * 10) / 10;
        } else if (PRECISION_QTY == 2) {
            return Math.round(ret * 100) / 100;
        } else {
            return Math.round(ret);
        }
    };

    epm.getMoney = function(o) {
        var ret = this.getFloat(o);

        if (PRECISION_MONEY == 2) {
            return Math.round(ret * 100) / 100;
        } else if (PRECISION_MONEY == 1) {
            return Math.round(ret * 10) / 10;
        } else if (PRECISION_MONEY == 2) {
            return Math.round(ret);
        } else {
            return Math.round(ret * 100) / 100;
        }
    };

    epm.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }

        return null;
    };

    epm.isEmpty = function(o) {
        if (o === undefined) {
            return true;
        }

        if (o == null) {
            return true;
        }

        return $.trim(o.toString()) == '';
    };

    epm.isArray = function(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };

    epm.ajax = function(params, success, successError, fail, always) {


        // var urlParams = {};
        // urlParams['params'] = JSON.stringify(params);

        $.ajax(API_URL, {
            xhrFields: {
                withCredentials: true
            },
            type: 'POST',
            dataType: 'text',
            data: params
        }).done(function(data, status, xhr) {
            if (data == undefined || data == null || data.length == 0) {
                alert('服务器繁忙');
                return;
            }

            if (typeof data !== 'object') {
                data = JSON.parse(data);
            }

            if (data['ans'] != 'ok') {

                if (data['ans'] == '用户不存在') {
                } else {
                    if ($.isFunction(successError)) {
                        successError(data);
                    } else {
                        alert(data['ans']);
                    }
                }

                return;
            }


            if ($.isFunction(success)) {
                success(data);
            }

        }).fail(function() {
            if ($.isFunction(fail)) {
                fail();
            } else {
                alert('服务器繁忙，请稍候重试');
            }

        }).always(function() {
            if ($.isFunction(always)) {
                always();
            }
        });
    };

    epm.extendAjax = function(url, urlParams, success, fail, always) {
        $.post(url, urlParams).done(function(data) {
            if (data == undefined || data == null || data.length == 0) {
                alert('服务器繁忙');
                return;
            }

            if (typeof data !== 'object') {
                data = JSON.parse(data);
            }

            if ($.isFunction(success)) {
                success(data);
            }

        }).fail(function() {
            if ($.isFunction(fail)) {
                fail();
            } else {
                alert('服务器繁忙，请稍候重试');
            }

        }).always(function() {
            if ($.isFunction(always)) {
                always();
            }
        });
    };

    window.epm = epm;

})();

$(document).ready(function () {
    var height = $(window).height() - 36;
    console.log(height);
    $('.cm-side').height(height);
    $('.cm-cont').height(height);

    if ($.isFunction(window.pageInit)) {
        pageInit();
    }
});
//
// function getData(url, args, callback) {
//
// }
//
//
// epm.ajax = function (params, success, successError, fail, always) {
//
//     if (!epm.isEmpty(params)
//         && !epm.isEmpty(epm.c.userToken)) {
//         params['user_token'] = epm.c.userToken;
//     }
//
//     // var urlParams = {};
//     // urlParams['params'] = JSON.stringify(params);
//
//     $.ajax(API_URL, {
//         xhrFields: {
//             withCredentials: true
//         },
//         type: 'POST',
//         dataType: 'text',
//         data: params
//     }).done(function (data, status, xhr) {
//         if (data == undefined || data == null || data.length == 0) {
//             alert('服务器繁忙');
//             return;
//         }
//
//         if (typeof data !== 'object') {
//             data = JSON.parse(data);
//         }
//
//         if (data['ans'] != 'ok') {
//
//             if (data['ans'] == '用户不存在') {
//                 epm.b.logOut();
//             } else {
//                 if ($.isFunction(successError)) {
//                     successError(data);
//                 } else {
//                     alert(data['ans']);
//                 }
//             }
//
//             return;
//         }
//
//         if (!epm.isEmpty(data['new_user_token'])) {
//             var newUserToken = data['new_user_token'];
//             if (newUserToken !== epm.c.userToken) {
//                 epm.c.userToken = newUserToken;
//             }
//         }
//
//         if ($.isFunction(success)) {
//             success(data);
//         }
//
//     }).fail(function () {
//         if ($.isFunction(fail)) {
//             fail();
//         } else {
//             alert('服务器繁忙，请稍候重试');
//         }
//
//     }).always(function () {
//         if ($.isFunction(always)) {
//             always();
//         }
//     });
// };