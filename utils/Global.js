var domain=getDomain();
var loginCookieName = "qqyqhcomcookie";
var hostUrl= "https://wechat.qqyqh.com/api";
// var hostUrl= "http://localhost:8094";
var page=window.location.pathname;
var url=encodeURI(window.location.href);
// setCookie("qqyqhcomcookienew","f57a737b5f1d57313499acf319417b0e7ffffe9a46eb001c05170bdf16168b70");

$(document).ready(function() {
    var qqyqhcomcookienew = getCookie("qqyqhcomcookienew");
    if (qqyqhcomcookienew==null || qqyqhcomcookienew=="" || qqyqhcomcookienew==undefined){
        wechatLogin();
    }
});

//发起获取code的调用
function wechatLogin(){
    $.getJSON(hostUrl + "/weixin/wechatauthor?sign=&fresh=" + Math.random() + "&callback=?", {"url": "https://wechat.qqyqh.com/wechat/active/turntable/redirect.html"}, function (ret) {
        var data = eval(ret);
        if (data.error_code != null) {
            window.top.location.href = "404.html?" + data.error_code;
        } else {
            //转向，拿code,回调是获取use_base的接口
            window.location.href = data.url;
        }
    });
}

function getDomain(){
    var host1 = document.domain;
    var start = host1.indexOf(".") + 1;
    var domain = host1.substring(start);

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
function invokeApi(url, data,fresh, call) {
    var ticket = "";
    try {
        if (getCookie("qqyqhcomcookienew") != undefined && getCookie("qqyqhcomcookienew") != null && getCookie("qqyqhcomcookienew") != "") {
            ticket = getCookie("qqyqhcomcookienew")
        }else{
            return;
        }
    } catch (err) {};

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
            setCookie("qqyqhcomcookienew",getCookie("qqyqhcomcookienew"));
            if (res.error_code != null) {
                localStorage.setItem('fromUrl', window.location.href);
                window.top.location.href = "../../404.html?code=" + res.error_code + "&msg=" + res.error_msg + '&from=' + url + '&data=' + data;
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
function userAgentInit() {
    var userAgent = window.navigator.userAgent.toLowerCase();
    var agentState = 1;
    var mobile = !!userAgent.match(/AppleWebKit.*Mobile.*/)||!!userAgent.match(/applewebkit.*mobile.*/)||!!userAgent.match(/AppleWebkit.*mobile.*/)||!!userAgent.match(/applewebkit.*Mobile.*/);//是否为移动端
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
function isUserLogin(){
    var cookielogin=GetQueryString("cookielogin");
    if(cookielogin!=""){
        setCookie(loginCookieName,unescape(cookielogin));
    }
    var cookie=getCookie(loginCookieName);
    var isLogin = 0;
    if(cookie ==null || cookie==""){
        isLogin = 0;//未登录
    }else{
        isLogin = 1;//已登录
    }
    return isLogin;
}
function ajaxCommitForm(formId,url,success,fail)
{
    var submit_url = url=url.trim();
    if(url.substring(0,1)=="/")
        url=hostUrl+url;
    else
        url=hostUrl+"/"+url;

    var sign=$.md5(getGlobalKey());
    if(url.indexOf("?")>-1)
        url+="&sign="+sign;
    else
        url+="?sign="+sign;

    var options = {
        type:'POST',
        dataType:'json',
        url:submit_url,
        success:success,
        error:fail
    };
    $('#'+formId).ajaxSubmit(options);
}
//写cookies
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
}
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var u=window.location.search.substr(1);
    u= u.replace(/amp;/g,"");
    var r = u.match(reg);
    if(r!=null)return  decodeURIComponent(r[2]);
    return "";
}
function parseUrl(url,name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    url= url.replace(/amp;/g,"");
    var r = url.match(reg);
    if(r!=null)return  decodeURIComponent(r[2]);
    return "";
}
function isEmail(str) {
    var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    return reg.test(str);
}
function isMobile(str) {
    var reg = /^1[345687]\d{9}$/;
    return reg.test(str);
}
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
