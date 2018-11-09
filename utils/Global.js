var domain=getDomain();
var artistcookie = "artistcookie";
var hostUrl= "https://wechat.qqyqh.com/api";
// var hostUrl= "http://localhost:8094";
var page=window.location.pathname;  // 得到路径和文件名
var url=encodeURI(window.location.href);  // 对整个url进行一次utf-8编码
setCookie("artistcookie","f57a737b5f1d57313499acf319417b0e7ffffe9a46eb001c05170bdf16168b70");
$(document).ready(function() {
    var artistcookie = getCookie("artistcookie");
    if (artistcookie==null || artistcookie=="" || artistcookie==undefined){
        wechatLogin();
    }
});

//发起获取code的调用
function wechatLogin(){
    $.getJSON(hostUrl + "/weixin/wechatauthor?sign=&fresh=" + Math.random() + "&callback=?", {"t":0,"url": "https://wechat.qqyqh.com/wechat/artist/redirect.html"}, function (ret) {
        var data = eval(ret);  // 将得到的数据转化为对象
        if (data.error_code != null) {  // 代表有错误，让其出现错误页面
            window.top.location.href = "404.html?" + data.error_code;
        } else {
            //转向，拿code,回调是获取use_base的接口
            window.location.href = data.url;  // 变路径
        }
    });
}
function getDomain(){
    var host1 = document.domain;   // document.domain为本文档的域名
    var start = host1.indexOf(".") + 1;
    var domain = host1.substring(start); // 这两步得到上级域名，去掉一层

    if(domain==""||domain==undefined)
    {
        domain="qqyqh.com";
    }
    return domain;
}

function getGlobalKey()
{
    var key="489430kjrewori430i0if93i943ewoi439";
    return key;
}
function len1to2(instr) {
    if (instr.toString().length == 1)
        return "0" + instr;
    return instr;
}

function ifContains(long_str,short_str) {
    if (long_str==""){
        return false;
    }else{
        var arr = long_str.split(",");
        for (var i=0;i<=arr.length-1;i++){
            if (arr[i]==short_str)
                return true;
        }
        return false;
    }
}
function addStr(old_str,str) {
    if (old_str==""){
        return str;
    }else{
        if (old_str==str){
            return "";
        }else{
            if (ifContains(old_str,str)){
                var arr = old_str.split(",");
                if (arr[0]==str){
                    return old_str.replace(str+",","");
                }else{
                    return old_str.replace(","+str,"");
                }
            }else{
                return old_str+","+str;
            }
        }
    }
}
function addStr1(old_str,str) {
    if (old_str==str){
        return "";
    }else{
        return str;
    }
}

function getNowMonth() {
    var myDate = new Date();
    var mo = parseInt(myDate.getMonth()) + 1;
    return len1to2(mo);
}
function getNowDay() {
    var myDate = new Date();
    var mo = myDate.getDate();
    return len1to2(mo);
}
function getNowYear() {
    var myDate = new Date();
    var mo = myDate.getFullYear();
    return mo;
}
function userAgentInit() {
    var userAgent = window.navigator.userAgent.toLowerCase();  // window.navigator.userAgent.toLowerCase() 用来区分设备和浏览器
    var agentState = 1;
    var mobile = !!userAgent.match(/AppleWebKit.*Mobile.*/)||!!userAgent.match(/applewebkit.*mobile.*/)||!!userAgent.match(/AppleWebkit.*mobile.*/)||!!userAgent.match(/applewebkit.*Mobile.*/);//是否为移动端   加!! 是为了判断布尔值，里面有可能是null 和undefined等等 ,这两个加上!!为false
    var microMessage = userAgent.match(/MicroMessenger/i) == "micromessenger";//是否为微信
    if(mobile){
        if(microMessage){
            agentState = 1;//微信
        }else{
            agentState = 5;//wap
        }
    }else{
        agentState = 3;//pc
    }
    return agentState;
}
function invokeApi(url, data,fresh, call) {
    var ticket = "";
    try {
        if (getCookie("artistcookie") != undefined && getCookie("artistcookie") != null && getCookie("artistcookie") != "") {
            ticket = getCookie("artistcookie")
        }else{
            return;
        }
    } catch (err) {}

    url=url.trim();
    if(url.substring(0,1)=="/")
        url=hostUrl+url;
    else
        url=hostUrl+"/"+url;
    data.userTerminal = userAgentInit();
    var f_str=JSON.stringify(data);
    f_str=f_str.split("\"").join('');
    f_str=f_str.split(" ").join('');
    f_str=f_str.replace("{","").replace("}","");
    f_str=f_str.split(",").sort().join(",");
    f_str=f_str.replace("&amp;","＆");
    f_str=f_str.replace("&","＆");
    f_str=f_str.replace("#","＃");
    var sign=$.md5(f_str+"_"+getGlobalKey());
    if(fresh!="")
        fresh ="&fresh="+ Math.random();

    $.ajax({
        url: url + "?sign=" + sign + fresh + "&ticket="+ticket+"&callback=?",
        data: data,
        dataType: "JSON",
        success: function (res) {
            setCookie("artistcookie",getCookie("artistcookie"));
            if (res.error_code != null) {
                localStorage.setItem('fromUrl', window.location.href);
                // window.top.location.href = "../../404.html?code=" + res.error_code + "&msg=" + res.error_msg + '&from=' + url + '&data=' + data;
            } else {
                call(res);
            }
        },
        error: function (res) {
            alert(res.statusText);
        },
        complete: function (res) {
            if (res.status != 200 && res.readyState != 4) {
                alert(res.statusText);
            }
        }
    })
}

function setCookie(name,value,expiredSeconds)
{
    var Days = 365*24*60*60*1000;
    if(expiredSeconds!=undefined){
        Days=expiredSeconds*1000;
    }
    var exp = new Date();
    exp.setTime(exp.getTime() + Days);
    document.cookie = name + "="+ encodeURIComponent (value) + ";domain="+domain+";path=/;expires=" + exp.toGMTString();
}
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)) {
        var n=decodeURIComponent(arr[2]);
        return n;
    }
    else
        return null;
}
function getReferrer() {
    var referrer = '';
    try {
        referrer = window.top.document.referrer
    } catch (e) {
        if (window.parent) {
            try {
                referrer = window.parent.document.referrer
            } catch (e2) {
                referrer = ''
            }
        }
    };
    if (referrer === '') {
        referrer = document.referrer
    };
    return referrer
};

function getOrignalImaUrl(old_url, width0) {
    if (old_url.indexOf("Storage") < 0) return old_url;
    var arrayName = old_url.split("/");
    var lastName = arrayName[arrayName.length - 1];
    var preName = old_url.replace(lastName, "");
    var arrayNameLast = lastName.split(".");
    var newName = preName + arrayNameLast[0] + "_" + width0 + "." + arrayNameLast[1];
    return newName
};

function clearCookie() {
    $.cookie("user_id", "", {
        expires: -1,path:"/"
    });
    $.cookie("user_name", "", {
        expires: -1,path:"/"
    });
    $.cookie("display_name", "", {
        expires: -1,path:"/"
    });
    $.cookie("ticket", "", {
        expires: -1,path:"/"
    });
    $.cookie("user_type", "", {
        expires: -1,path:"/"
    });
    $.cookie("auth_type", "", {
        expires: -1,path:"/"
    });
    $.cookie("img_l", "", {
        expires: -1,path:"/"
    });
    $.cookie("img_s", "", {
        expires: -1,path:"/"
    });
    $.cookie("user_id", null, {
        expires: -1,path:"/"
    });
    $.cookie("USER_MOD", null, {
        expires: -1,path:"/"
    });
    $.cookie("USER_CHANNEL", null, {
        expires: -1,path:"/"
    });
    $.cookie("work_area", null, {
        expires: -1,path:"/"
    });
    $.cookie("DEPARTMENT_ID", null, {
        expires: -1,path:"/"
    });
    $.cookie("SJ_ID", null, {
        expires: -1,path:"/"
    });
    $.cookie("SJ_NAME", null, {
        expires: -1,path:"/"
    });
    $.cookie("SJ_NAME_SX", null, {
        expires: -1,path:"/"
    });
    $.cookie("GYS_ID", null, {
        expires: -1,path:"/"
    });
    $.cookie("GYS_NAME", null, {
        expires: -1,path:"/"
    });
    $.cookie("GYS_NAME_SX", null, {
        expires: -1,path:"/"
    });
    $.cookie("user_id", null, {path:"/"},"localhost");
    $.cookie("user_name", null, {path:"/"},"localhost");
    $.cookie("display_name", null, {path:"/"},"localhost");
    $.cookie("ticket", null, {path:"/"},"localhost");
    $.cookie("user_type", null, {path:"/"},"localhost");
    $.cookie("auth_type", null, {path:"/"},"localhost");
    $.cookie("img_l", null, {path:"/"},"localhost");
    $.cookie("img_s", null, {path:"/"},"localhost");
    $.cookie("USER_MOD", null, {path:"/"},"localhost");
    $.cookie("USER_CHANNEL", null, {path:"/"},"localhost");
    $.cookie("work_area", null, {path:"/"},"localhost");
    $.cookie("DEPARTMENT_ID", null, {path:"/"},"localhost");
    $.cookie("SJ_ID", null, {path:"/"},"localhost");
    $.cookie("GYS_ID", null, {path:"/"},"localhost");
    $.cookie("GYS_NAME", null, {path:"/"},"localhost");
    $.cookie("GYS_NAME_SX", null, {path:"/"},"localhost");
    $.cookie("SJ_NAME", null, {path:"/"},"localhost");
    $.cookie("SJ_NAME_SX", null, {path:"/"},"localhost");
    $.cookie("user_id", null, {path:"/"},"qqyqh.com");
    $.cookie("user_name", null, {path:"/"},"qqyqh.com");
    $.cookie("display_name", null, {path:"/"},"qqyqh.com");
    $.cookie("ticket", null, {path:"/"},"qqyqh.com");
    $.cookie("user_type", null, {path:"/"},"qqyqh.com");
    $.cookie("auth_type", null, {path:"/"},"qqyqh.com");
    $.cookie("img_l", null, {path:"/"},"qqyqh.com");
    $.cookie("img_s", null, {path:"/"},"qqyqh.com");
    $.cookie("USER_MOD", null, {path:"/"},"qqyqh.com");
    $.cookie("USER_CHANNEL", null, {path:"/"},"qqyqh.com");
    $.cookie("work_area", null, {path:"/"},"qqyqh.com");
    $.cookie("DEPARTMENT_ID", null, {path:"/"},"qqyqh.com");
    $.cookie("SJ_ID", null, {path:"/"},"qqyqh.com");
    $.cookie("GYS_ID", null, {path:"/"},"qqyqh.com");
    $.cookie("GYS_NAME", null, {path:"/"},"qqyqh.com");
    $.cookie("GYS_NAME_SX", null, {path:"/"},"qqyqh.com");
    $.cookie("SJ_NAME", null, {path:"/"},"qqyqh.com");
    $.cookie("SJ_NAME_SX", null, {path:"/"},"qqyqh.com");
};

function DateDiff000(sDate1, sDate2) {
    var aDate, bDate, iDays;
    aDate = sDate1.split("-");
    var d1 = new Date(aDate[0], parseInt(aDate[1]) - 1, aDate[2]);
    bDate = sDate2.split("-");
    var d2 = new Date(bDate[0], parseInt(bDate[1]) - 1, bDate[2]);
    iDays = parseInt(Math.abs(d1 - d2) / 1000 / 60 / 60 / 24);
    return iDays
};

function DateDiff001(sDate1, sDate2) {
    var aDate, bDate, iDays;
    var d1 = sDate1.split(" ");
    var d11 = d1[0].split("-");
    var d12 = d1[1].split(":");

    var d2 = sDate2.split(" ");
    var d21 = d2[0].split("-");
    var d22 = d2[1].split(":");

    var d1 = new Date(d11[0],d11[1],d11[2],d12[0],d12[1],d12[3]);
    var d2 = new Date(d21[0],d21[1],d21[2],d22[0],d22[1],d22[3]);
    iDays = parseInt((d1 - d2) / 1000);
    return iDays
};

function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    return y + "-" + m + "-" + d
};

function date2str(value) {
    if (value == null || isNaN(value)) {
        return null
    };
    Date.prototype.format = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
        };
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
            }
        };
        return fmt
    };
    var d = new Date();
    d.setTime(value);
    return d.format("yyyy-MM-dd hh:mm")
};


function myreplace(instr) {
    var tempStr = instr;
    while (tempStr.indexOf("\"") > -1) {
        tempStr = tempStr.replace("\"", "")
    }
    while (tempStr.indexOf(" ") > -1) {
        tempStr = tempStr.replace(" ", "")
    }
    while (tempStr.indexOf("'") > -1) {
        tempStr = tempStr.replace("'", "")
    }
    while (tempStr.indexOf("%") > -1) {
        tempStr = tempStr.replace("%", "")
    }
    while (tempStr.indexOf("^") > -1) {
        tempStr = tempStr.replace("^", "")
    };
    if (tempStr.length != instr.length) {
        return false
    } else {
        return true
    }
};

function newReplace(mystr, instr, tostr) {
    var re = new RegExp(instr, "g");
    var newstart = "";
    if (mystr != "") {
        newstart = mystr.replace(re, tostr)
    };
    return newstart
};

function myreplaceAll(mystr, instr, tostr) {
    var tempStr = mystr;
    while (tempStr.indexOf(instr) > -1) {
        tempStr = tempStr.replace(instr, tostr)
    };
    return tempStr
};

function mystrreplace(instr) {
    var tempStr = instr;
    tempStr = tempStr.replace("\"", "”");
    tempStr = tempStr.replace("'", "’");
    tempStr = tempStr.replace("%", "");
    tempStr = tempStr.replace("^", "");
    return tempStr
};

function encode64(input) {
    if (input == "") return "";
    if (input != null && input != undefined) {
        var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" + "wxyz0123456789+/" + "=";
        input = escape(input);
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64
            } else if (isNaN(chr3)) {
                enc4 = 64
            };
            output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = ""
        } while (i < input.length);
        return output
    } else {
        return ""
    }
};

function decode64(input) {
    if (input == "") return "";
    if (input != null && input != undefined) {
        var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" + "wxyz0123456789+/" + "=";
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {};
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        do {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2)
            };
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3)
            };
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = ""
        } while (i < input.length);
        return unescape(output)
    } else {
        return ""
    }
};

function GetUrlParms() {
    var args = new Object();
    var query = location.search.substring(1);
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        if (pos == -1) continue;
        var argname = pairs[i].substring(0, pos);
        var value = pairs[i].substring(pos + 1);
        args[argname] = unescape(value);
    };
    return args
};

function GetUrlParmsOrig() {
    var args = new Object();
    var query = location.search.substring(1);
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        if (pos == -1) continue;
        var argname = pairs[i].substring(0, pos);
        var value = pairs[i].substring(pos + 1);
        args[argname] = value;
    };
    return args
};

function EncodeUtf8(s1) {
    var s = escape(s1);
    var sa = s.split("%");
    var retV = "";
    if (sa[0] != "") {
        retV = sa[0]
    };
    for (var i = 1; i < sa.length; i++) {
        if (sa[i].substring(0, 1) == "u") {
            retV += Hex2Utf8(Str2Hex(sa[i].substring(1, 5)))
        } else retV += "%" + sa[i]
    };
    return retV
};

function Str2Hex(s) {
    var c = "";
    var n;
    var ss = "0123456789ABCDEF";
    var digS = "";
    for (var i = 0; i < s.length; i++) {
        c = s.charAt(i);
        n = ss.indexOf(c);
        digS += Dec2Dig(eval(n))
    };
    return digS
};

function Dec2Dig(n1) {
    var s = "";
    var n2 = 0;
    for (var i = 0; i < 4; i++) {
        n2 = Math.pow(2, 3 - i);
        if (n1 >= n2) {
            s += '1';
            n1 = n1 - n2
        } else s += '0'
    };
    return s
};

function Dig2Dec(s) {
    var retV = 0;
    if (s.length == 4) {
        for (var i = 0; i < 4; i++) {
            retV += eval(s.charAt(i)) * Math.pow(2, 3 - i)
        };
        return retV
    };
    return -1
};

function Hex2Utf8(s) {
    var retS = "";
    var tempS = "";
    var ss = "";
    if (s.length == 16) {
        tempS = "1110" + s.substring(0, 4);
        tempS += "10" + s.substring(4, 10);
        tempS += "10" + s.substring(10, 16);
        var sss = "0123456789ABCDEF";
        for (var i = 0; i < 3; i++) {
            retS += "%";
            ss = tempS.substring(i * 8, (eval(i) + 1) * 8);
            retS += sss.charAt(Dig2Dec(ss.substring(0, 4)));
            retS += sss.charAt(Dig2Dec(ss.substring(4, 8)))
        };
        return retS
    };
    return ""
};

function returnParam(instr) {
    Request = {
        QueryString: function(item) {
            var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
            return svalue ? svalue[1] : svalue
        }
    };
    return Request.QueryString(instr)
};

function strtotimestamp(datestr) {
    var new_str = datestr.replace(/:/g, "-");
    new_str = new_str.replace(/ /g, "-");
    var arr = new_str.split("-");
    var datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
    return (datum.getTime())
};

function timestamptostr(timestamp) {
    var d = new Date(timestamp.getTime());
    var m0 = len122Str(d.getMonth() + 1);
    var d0 = len122Str(d.getDate());
    var h0 = len122Str(d.getHours());
    var m1 = len122Str(d.getMinutes());
    var s0 = len122Str(d.getSeconds());

    var jstimestamp = (d.getFullYear()) + "-" + (m0) + "-" + (d0) + " " + (h0) + ":" + (m1) + ":" + (s0);
    return jstimestamp
};

function timestamptostr1(timestamp) {
    d = new Date(timestamp.getTime());
    var jstimestamp = (d.getFullYear()) + "-" + (d.getMonth() + 1) + "-" + (d.getDate()) + " " + (d.getHours()) + ":" + (d.getMinutes()) + ":" + (d.getSeconds());
    return jstimestamp
};

function len122Str(instr) {
    if (instr.toString().length == 1)
        return "0" + instr;
    return instr.toString();
}

function sub_html_str(str, num) {
    var reg = new RegExp('<[^>]+>', 'g');
    var rt, rts = [],
        indexs = [],
        tstr, endstr, rstr, endtag;
    while ((rt = reg.exec(str)) != null) {
        rts.push(rt[0]);
        indexs.push(rt['index'])
    };
    str = str.replace(reg, '');
    tstr = str.substr(0, num);
    endstr = (/&[^&]*$/.exec(tstr) || '');
    if (endstr !== '') endstr += '' + (/^[^;]*;/.exec(str.substr(num, str.length)) || '');
    if (/^(&\w{1,10};|&#\d+;)$/.test(endstr)) {
        str = tstr.replace(/&[^&]*$/, endstr)
    } else {
        str = tstr
    };
    var index = 0;
    for (var i = 0; i < rts.length; i++) {
        index = indexs[i];
        if (str.length >= index) {
            str = str.substr(0, index) + rts[i] + str.substr(index, str.length)
        } else {
            break
        }
    };
    var lastindex = i;
    tstr = str;
    rstr = '';
    while (rstr != tstr) {
        rstr = tstr;
        tstr = tstr.replace(/<[^>]+>[^<]*<\/[^>]+>/g, '').replace(/<[^>]+ \/>/g, '')
    };
    reg.lastIndex = 0;
    while (reg.exec(rstr) != null) {
        while (lastindex < rts.length) {
            endtag = rts[lastindex];
            if (/^<[ ]*\//.test(endtag)) {
                str = str + endtag;
                lastindex++;
                break
            } else if (/<[^>]+ \/>/.test(endtag)) {
                lastindex++
            } else {
                lastindex += 2
            }
        }
    };
    return str
};

function getWeek(indate) {
    var b = indate.split('-');
    var T = new Date(b[0], b[1] - 1, b[2]);
    var out = T.getDay();
    if (out == "0") return "星期日";
    if (out == "1") return "星期一";
    if (out == "2") return "星期二";
    if (out == "3") return "星期三";
    if (out == "4") return "星期四";
    if (out == "5") return "星期五";
    if (out == "6") return "星期六"
};

function getMonthEng(indate) {
    var b = indate.split('-');
    var M = b[1];
    if (M.length == 1) M = "0" + M;
    if (M == "01") return "Jan";
    if (M == "02") return "Feb";
    if (M == "03") return "Mar";
    if (M == "04") return "Apr";
    if (M == "05") return "May";
    if (M == "06") return "June";
    if (M == "07") return "July";
    if (M == "08") return "Aug";
    if (M == "09") return "Sept";
    if (M == "10") return "Oct";
    if (M == "11") return "Nov";
    if (M == "12") return "Dec"
};

function UrlEncode(str) {
    var ret = "";
    var strSpecial = "!\"#$%&'()*+,/:;<=>?[]^`{|}~%";
    var tt = "";
    for (var i = 0; i < str.length; i++) {
        var chr = str.charAt(i);
        var c = str2asc(chr);
        tt += chr + ":" + c + "n";
        if (parseInt("0x" + c) > 0x7f) {
            ret += "%" + c.slice(0, 2) + "%" + c.slice(-2)
        } else {
            if (chr == " ") ret += "+";
            else if (strSpecial.indexOf(chr) != -1) ret += "%" + c.toString(16);
            else ret += chr
        }
    };
    return ret
};

function UrlDecode(str) {
    var ret = "";
    for (var i = 0; i < str.length; i++) {
        var chr = str.charAt(i);
        if (chr == "+") {
            ret += " "
        } else if (chr == "%") {
            var asc = str.substring(i + 1, i + 3);
            if (parseInt("0x" + asc) > 0x7f) {
                ret += asc2str(parseInt("0x" + asc + str.substring(i + 4, i + 6)));
                i += 5
            } else {
                ret += asc2str(parseInt("0x" + asc));
                i += 2
            }
        } else {
            ret += chr
        }
    };
    return ret
};

function str2asc(str) {
    return str.charCodeAt(0).toString(16)
};

function asc2str(str) {
    return String.fromCharCode(str)
};


var my = {};
var hexcase = 0;
var b64pad = "=";

function b64_md5(s) {
    return rstr2b64(rstr_md5(str2rstr_utf8(s)))
};

function any_md5(s, e) {
    return rstr2any(rstr_md5(str2rstr_utf8(s)), e)
};

function hex_hmac_md5(k, d) {
    return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)))
};

function b64_hmac_md5(k, d) {
    return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)))
};

function any_hmac_md5(k, d, e) {
    return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e)
};

function rstr_md5(s) {
    return binl2rstr(binl_md5(rstr2binl(s), s.length * 8))
};

function rstr_hmac_md5(key, data) {
    var bkey = rstr2binl(key);
    if (bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);
    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C
    };
    var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
    return binl2rstr(binl_md5(opad.concat(hash), 512 + 128))
};

function rstr2hex(input) {
    try {
        hexcase
    } catch (e) {
        hexcase = 0
    };
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var output = "";
    var x;
    for (var i = 0; i < input.length; i++) {
        x = input.charCodeAt(i);
        output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F)
    };
    return output
};

function rstr2b64(input) {
    try {
        b64pad
    } catch (e) {
        b64pad = ''
    };
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var output = "";
    var len = input.length;
    for (var i = 0; i < len; i += 3) {
        var triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > input.length * 8) output += b64pad;
            else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F)
        }
    };
    return output
};

function rstr2any(input, encoding) {
    var divisor = encoding.length;
    var i, j, q, x, quotient;
    var dividend = Array(Math.ceil(input.length / 2));
    for (i = 0; i < dividend.length; i++) {
        dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1)
    };
    var full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)));
    var remainders = Array(full_length);
    for (j = 0; j < full_length; j++) {
        quotient = Array();
        x = 0;
        for (i = 0; i < dividend.length; i++) {
            x = (x << 16) + dividend[i];
            q = Math.floor(x / divisor);
            x -= q * divisor;
            if (quotient.length > 0 || q > 0) quotient[quotient.length] = q
        };
        remainders[j] = x;
        dividend = quotient
    };
    var output = "";
    for (i = remainders.length - 1; i >= 0; i--) output += encoding.charAt(remainders[i]);
    return output
};

function str2rstr_utf8(input) {
    var output = "";
    var i = -1;
    var x, y;
    while (++i < input.length) {
        x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
            x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
            i++
        };
        if (x <= 0x7F) output += String.fromCharCode(x);
        else if (x <= 0x7FF) output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
        else if (x <= 0xFFFF) output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        else if (x <= 0x1FFFFF) output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F))
    };
    return output
};

function str2rstr_utf16le(input) {
    var output = "";
    for (var i = 0; i < input.length; i++) output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
    return output
};

function str2rstr_utf16be(input) {
    var output = "";
    for (var i = 0; i < input.length; i++) output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
    return output
};

function rstr2binl(input) {
    var output = Array(input.length >> 2);
    for (var i = 0; i < output.length; i++) output[i] = 0;
    for (var i = 0; i < input.length * 8; i += 8) output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
    return output
};

function binl2rstr(input) {
    var output = "";
    for (var i = 0; i < input.length * 32; i += 8) output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
    return output
};

function binl_md5(x, len) {
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd)
    };
    return Array(a, b, c, d)
};

function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
};

function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
};

function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
};

function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t)
};

function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
};

function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF)
};

function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
}


function hex_md5(a)
{
    if(a=="") return a;
    return rstr2hex(rstr_md5(str2rstr_utf8(a)))}function hex_hmac_md5(a,b){return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a),str2rstr_utf8(b)))}function md5_vm_test(){return hex_md5("abc").toLowerCase()=="900150983cd24fb0d6963f7d28e17f72"}function rstr_md5(a){return binl2rstr(binl_md5(rstr2binl(a),a.length*8))}function rstr_hmac_md5(c,f){var e=rstr2binl(c);if(e.length>16){e=binl_md5(e,c.length*8)}var a=Array(16),d=Array(16);for(var b=0;b<16;b++){a[b]=e[b]^909522486;d[b]=e[b]^1549556828}var g=binl_md5(a.concat(rstr2binl(f)),512+f.length*8);return binl2rstr(binl_md5(d.concat(g),512+128))}function rstr2hex(c){try{hexcase}catch(g){hexcase=0}var f=hexcase?"0123456789ABCDEF":"0123456789abcdef";var b="";var a;for(var d=0;d<c.length;d++){a=c.charCodeAt(d);b+=f.charAt((a>>>4)&15)+f.charAt(a&15)}return b}function str2rstr_utf8(c){var b="";var d=-1;var a,e;while(++d<c.length){a=c.charCodeAt(d);e=d+1<c.length?c.charCodeAt(d+1):0;if(55296<=a&&a<=56319&&56320<=e&&e<=57343){a=65536+((a&1023)<<10)+(e&1023);d++}if(a<=127){b+=String.fromCharCode(a)}else{if(a<=2047){b+=String.fromCharCode(192|((a>>>6)&31),128|(a&63))}else{if(a<=65535){b+=String.fromCharCode(224|((a>>>12)&15),128|((a>>>6)&63),128|(a&63))}else{if(a<=2097151){b+=String.fromCharCode(240|((a>>>18)&7),128|((a>>>12)&63),128|((a>>>6)&63),128|(a&63))}}}}}return b}function rstr2binl(b){var a=Array(b.length>>2);for(var c=0;c<a.length;c++){a[c]=0}for(var c=0;c<b.length*8;c+=8){a[c>>5]|=(b.charCodeAt(c/8)&255)<<(c%32)}return a}function binl2rstr(b){var a="";for(var c=0;c<b.length*32;c+=8){a+=String.fromCharCode((b[c>>5]>>>(c%32))&255)}return a}function binl_md5(p,k){p[k>>5]|=128<<((k)%32);p[(((k+64)>>>9)<<4)+14]=k;var o=1732584193;var n=-271733879;var m=-1732584194;var l=271733878;for(var g=0;g<p.length;g+=16){var j=o;var h=n;var f=m;var e=l;o=md5_ff(o,n,m,l,p[g+0],7,-680876936);l=md5_ff(l,o,n,m,p[g+1],12,-389564586);m=md5_ff(m,l,o,n,p[g+2],17,606105819);n=md5_ff(n,m,l,o,p[g+3],22,-1044525330);o=md5_ff(o,n,m,l,p[g+4],7,-176418897);l=md5_ff(l,o,n,m,p[g+5],12,1200080426);m=md5_ff(m,l,o,n,p[g+6],17,-1473231341);n=md5_ff(n,m,l,o,p[g+7],22,-45705983);o=md5_ff(o,n,m,l,p[g+8],7,1770035416);l=md5_ff(l,o,n,m,p[g+9],12,-1958414417);m=md5_ff(m,l,o,n,p[g+10],17,-42063);n=md5_ff(n,m,l,o,p[g+11],22,-1990404162);o=md5_ff(o,n,m,l,p[g+12],7,1804603682);l=md5_ff(l,o,n,m,p[g+13],12,-40341101);m=md5_ff(m,l,o,n,p[g+14],17,-1502002290);n=md5_ff(n,m,l,o,p[g+15],22,1236535329);o=md5_gg(o,n,m,l,p[g+1],5,-165796510);l=md5_gg(l,o,n,m,p[g+6],9,-1069501632);m=md5_gg(m,l,o,n,p[g+11],14,643717713);n=md5_gg(n,m,l,o,p[g+0],20,-373897302);o=md5_gg(o,n,m,l,p[g+5],5,-701558691);l=md5_gg(l,o,n,m,p[g+10],9,38016083);m=md5_gg(m,l,o,n,p[g+15],14,-660478335);n=md5_gg(n,m,l,o,p[g+4],20,-405537848);o=md5_gg(o,n,m,l,p[g+9],5,568446438);l=md5_gg(l,o,n,m,p[g+14],9,-1019803690);m=md5_gg(m,l,o,n,p[g+3],14,-187363961);n=md5_gg(n,m,l,o,p[g+8],20,1163531501);o=md5_gg(o,n,m,l,p[g+13],5,-1444681467);l=md5_gg(l,o,n,m,p[g+2],9,-51403784);m=md5_gg(m,l,o,n,p[g+7],14,1735328473);n=md5_gg(n,m,l,o,p[g+12],20,-1926607734);o=md5_hh(o,n,m,l,p[g+5],4,-378558);l=md5_hh(l,o,n,m,p[g+8],11,-2022574463);m=md5_hh(m,l,o,n,p[g+11],16,1839030562);n=md5_hh(n,m,l,o,p[g+14],23,-35309556);o=md5_hh(o,n,m,l,p[g+1],4,-1530992060);l=md5_hh(l,o,n,m,p[g+4],11,1272893353);m=md5_hh(m,l,o,n,p[g+7],16,-155497632);n=md5_hh(n,m,l,o,p[g+10],23,-1094730640);o=md5_hh(o,n,m,l,p[g+13],4,681279174);l=md5_hh(l,o,n,m,p[g+0],11,-358537222);m=md5_hh(m,l,o,n,p[g+3],16,-722521979);n=md5_hh(n,m,l,o,p[g+6],23,76029189);o=md5_hh(o,n,m,l,p[g+9],4,-640364487);l=md5_hh(l,o,n,m,p[g+12],11,-421815835);m=md5_hh(m,l,o,n,p[g+15],16,530742520);n=md5_hh(n,m,l,o,p[g+2],23,-995338651);o=md5_ii(o,n,m,l,p[g+0],6,-198630844);l=md5_ii(l,o,n,m,p[g+7],10,1126891415);m=md5_ii(m,l,o,n,p[g+14],15,-1416354905);n=md5_ii(n,m,l,o,p[g+5],21,-57434055);o=md5_ii(o,n,m,l,p[g+12],6,1700485571);l=md5_ii(l,o,n,m,p[g+3],10,-1894986606);m=md5_ii(m,l,o,n,p[g+10],15,-1051523);n=md5_ii(n,m,l,o,p[g+1],21,-2054922799);o=md5_ii(o,n,m,l,p[g+8],6,1873313359);l=md5_ii(l,o,n,m,p[g+15],10,-30611744);m=md5_ii(m,l,o,n,p[g+6],15,-1560198380);n=md5_ii(n,m,l,o,p[g+13],21,1309151649);o=md5_ii(o,n,m,l,p[g+4],6,-145523070);l=md5_ii(l,o,n,m,p[g+11],10,-1120210379);m=md5_ii(m,l,o,n,p[g+2],15,718787259);n=md5_ii(n,m,l,o,p[g+9],21,-343485551);o=safe_add(o,j);n=safe_add(n,h);m=safe_add(m,f);l=safe_add(l,e)}return Array(o,n,m,l)}function md5_cmn(h,e,d,c,g,f){return safe_add(bit_rol(safe_add(safe_add(e,h),safe_add(c,f)),g),d)}function md5_ff(g,f,k,j,e,i,h){return md5_cmn((f&k)|((~f)&j),g,f,e,i,h)}function md5_gg(g,f,k,j,e,i,h){return md5_cmn((f&j)|(k&(~j)),g,f,e,i,h)}function md5_hh(g,f,k,j,e,i,h){return md5_cmn(f^k^j,g,f,e,i,h)}function md5_ii(g,f,k,j,e,i,h){return md5_cmn(k^(f|(~j)),g,f,e,i,h)}function safe_add(a,d){var c=(a&65535)+(d&65535);var b=(a>>16)+(d>>16)+(c>>16);return(b<<16)|(c&65535)}function bit_rol(a,b){return(a<<b)|(a>>>(32-b))};


(function($){
    $.session = {

        _id: null,

        _cookieCache: undefined,

        _init: function()
        {
            if (!window.name) {
                window.name = Math.random();
            }
            this._id = window.name;
            this._initCache();

            // See if we've changed protcols

            var matches = (new RegExp(this._generatePrefix() + "=([^;]+);")).exec(document.cookie);
            if (matches && document.location.protocol !== matches[1]) {
                this._clearSession();
                for (var key in this._cookieCache) {
                    try {
                        window.sessionStorage.setItem(key, this._cookieCache[key]);
                    } catch (e) {};
                }
            }

            document.cookie = this._generatePrefix() + "=" + document.location.protocol + ';path=/;expires=' + (new Date((new Date).getTime() + 120000)).toUTCString();

        },

        _generatePrefix: function()
        {
            return '__session:' + this._id + ':';
        },

        _initCache: function()
        {
            var cookies = document.cookie.split(';');
            this._cookieCache = {};
            for (var i in cookies) {
                var kv = cookies[i].split('=');
                if ((new RegExp(this._generatePrefix() + '.+')).test(kv[0]) && kv[1]) {
                    this._cookieCache[kv[0].split(':', 3)[2]] = kv[1];
                }
            }
        },

        _setFallback: function(key, value, onceOnly)
        {
            var cookie = this._generatePrefix() + key + "=" + value + "; path=/";
            if (onceOnly) {
                cookie += "; expires=" + (new Date(Date.now() + 120000)).toUTCString();
            }
            document.cookie = cookie;
            this._cookieCache[key] = value;
            return this;
        },

        _getFallback: function(key)
        {
            if (!this._cookieCache) {
                this._initCache();
            }
            return this._cookieCache[key];
        },

        _clearFallback: function()
        {
            for (var i in this._cookieCache) {
                document.cookie = this._generatePrefix() + i + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
            this._cookieCache = {};
        },

        _deleteFallback: function(key)
        {
            document.cookie = this._generatePrefix() + key + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            delete this._cookieCache[key];
        },

        get: function(key)
        {
            return window.sessionStorage.getItem(key) || this._getFallback(key);
        },

        set: function(key, value, onceOnly)
        {
            try {
                window.sessionStorage.setItem(key, value);
            } catch (e) {}
            this._setFallback(key, value, onceOnly || false);
            return this;
        },

        'delete': function(key){
            return this.remove(key);
        },

        remove: function(key)
        {
            try {
                window.sessionStorage.removeItem(key);
            } catch (e) {};
            this._deleteFallback(key);
            return this;
        },

        _clearSession: function()
        {
            try {
                window.sessionStorage.clear();
            } catch (e) {
                for (var i in window.sessionStorage) {
                    window.sessionStorage.removeItem(i);
                }
            }
        },

        clear: function()
        {
            this._clearSession();
            this._clearFallback();
            return this;
        }

    };

    $.session._init();

})(jQuery);