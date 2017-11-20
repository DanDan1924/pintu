function getUrlParam(t) {//获取浏览器参数
    var e = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"),
        n = window.location.search.substr(1).match(e);
    return null != n ? decodeURI(n[2]) : ""
}
function getCookie(t) {//获取浏览器cookie
    for (var e = t + "=", n = document.cookie.split(";"), r = 0; r < n.length; r++) {
        for (var o = n[r];
        " " == o.charAt(0);) o = o.substring(1, o.length);
        if (0 == o.indexOf(e)) return unescape(o.substring(e.length, o.length))
    }
    return !1
}
function clearCookie(t) {//清除cookie
    setCookie(t, "", -1)
}
function setCookie(t, e, n) {//设置cookie
    n = n || 0;
    var r = "";
    if (0 != n) {
        var o = new Date;
        o.setTime(o.getTime() + 24 * n * 60 * 60 * 1e3), r = "; expires=" + o.toGMTString()
    }
    document.cookie = t + "=" + escape(e) + r + ";domain=owhat.cn;path=/"
}
function getStorge(param){
    return window.localStorage.getItem(param) ? window.localStorage.getItem(param) : null;
}
function setStorge(param,value){
    window.localStorage.setItem(param,value);
}
function removeStorge(param){
    window.localStorage.removeItem(param);
}
//base64 code 2.1.8
(function(global) {
    'use strict';
    // existing version for noConflict()
    var _Base64 = global.Base64;
    var version = "2.1.8";
    // if node.js, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
        buffer = require('buffer').Buffer;
    }
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                   + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                   + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var btoa = global.btoa ? function(b) {
        return global.btoa(b);
    } : function(b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = buffer ? function (u) {
        return (u.constructor === buffer.constructor ? u : new buffer(u))
        .toString('base64')
    }
    : function (u) { return btoa(utob(u)) }
    ;
    var encode = function(u, urisafe) {
        return !urisafe
            ? _encode(String(u))
            : _encode(String(u)).replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function(u) { return encode(u, true) };
    // decoder stuff
    var re_btou = new RegExp([
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}'
    ].join('|'), 'g');
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var atob = global.atob ? function(a) {
        return global.atob(a);
    } : function(a){
        return a.replace(/[\s\S]{1,4}/g, cb_decode);
    };
    var _decode = buffer ? function(a) {
        return (a.constructor === buffer.constructor
                ? a : new buffer(a, 'base64')).toString();
    }
    : function(a) { return btou(atob(a)) };
    var decode = function(a){
        return _decode(
            String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    // that's it!
    if (global['Meteor']) {
       Base64 = global.Base64; // for normal export in Meteor.js
    }
})(this);


/// <summary>辅助方法:格式化字符串</summary>
window.stringFormat = function() {
    if (arguments.length == 0)
        return null;

    var str = arguments[0];

    for (var i = 1; i < arguments.length; i++) {
        var reg = new RegExp('\\{' + (i - 1) + '\\}', 'gm');

        str = str.replace(reg, arguments[i]);
    }

    return str;
}

/// <summary>parseURL</summary>
window.parseURL =  function(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length, i = 0, s;
            for (; i < len; i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}
function GUID() {
  this.date = new Date();
 
  /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
  if (typeof this.newGUID != 'function') {
     
    /* 生成GUID码 */
    GUID.prototype.newGUID = function() {
      this.date = new Date();
      var guidStr = '';
        sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
        sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
      for (var i = 0; i < 9; i++) {
        guidStr += Math.floor(Math.random()*16).toString(16);
      }
      guidStr += sexadecimalDate;
      guidStr += sexadecimalTime;
      while(guidStr.length < 32) {
        guidStr += Math.floor(Math.random()*16).toString(16);
      }
      return this.formatGUID(guidStr);
    }
 
    /*
     * 功能：获取当前日期的GUID格式，即8位数的日期：19700101
     * 返回值：返回GUID日期格式的字条串
     */
    GUID.prototype.getGUIDDate = function() {
      return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
    }
 
    /*
     * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933
     * 返回值：返回GUID日期格式的字条串
     */
    GUID.prototype.getGUIDTime = function() {
      return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero( parseInt(this.date.getMilliseconds() / 10 ));
    }
 
    /*
    * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现
     * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串
     * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串
     */
    GUID.prototype.addZero = function(num) {
      if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
        return '0' + Math.floor(num);
      } else {
        return num.toString();
      }
    }
 
    /* 
     * 功能：将y进制的数值，转换为x进制的数值
     * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10
     * 返回值：返回转换后的字符串
     */
    GUID.prototype.hexadecimal = function(num, x, y) {
      if (y != undefined) {
        return parseInt(num.toString(), y).toString(x);
      } else {
        return parseInt(num.toString()).toString(x);
      }
    }
 
    /*
     * 功能：格式化32位的字符串为GUID模式的字符串
     * 参数：第1个参数表示32位的字符串
     * 返回值：标准GUID格式的字符串
     */
    GUID.prototype.formatGUID = function(guidStr) {
      var str1 = guidStr.slice(0, 8) + '-',
        str2 = guidStr.slice(8, 12) + '-',
        str3 = guidStr.slice(12, 16) + '-',
        str4 = guidStr.slice(16, 20) + '-',
        str5 = guidStr.slice(20);
      return str1 + str2 + str3 + str4 + str5;
    }
  }
}
//获取guid
var deviceid=function(){
    var guid=new GUID().newGUID();
    var deviceids=getStorge("deviceid")!=null ? getStorge("deviceid") : guid;
    setStorge("deviceid",deviceids);
    return deviceids;
}

