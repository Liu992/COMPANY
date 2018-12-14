
const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

let util = {};

util.isEmptyObj = (obj) => {
  for (var key in obj) {
    return false;
  }
  return true;
}
util.calcGuid = () => {
  return [s4(), s4(), '-', s4(), '-', s4(), '-', s4(), s4(), s4()].join('');
}

util.getUrl = (urlBase, params) => {
  return `${urlBase}?${Object.keys(params).map((key) => {
    return [key, encodeURIComponent(params[key])].join('=')
  }).join('&')}`;
}

util.getParams = (params) => {
  return `${Object.keys(params).map((key) => {
    return [key, encodeURIComponent(params[key])].join('=')
  }).join('&')}`;
}

util.fetch = (options) => {
  let defs = {
    url: '',
    method: 'post',
    data: {},
    auth: util.getCookie('Authorization'),
    dataType: 'json'
  };
  options = Object.assign(defs, options);

  let fetchOpts = {
    method: options.method,
    credentials: "include",
    headers: {
      'Content-Type': "application/x-www-form-urlencoded",
      'Authorization': 'Bearer ' + options.auth
    }
  }

  let url = options.url;
  let data = options.data;
  if ('GET' === options.method.toUpperCase()) {
    url = util.getUrl(url, data);
  } else {
    if (options.dataType === 'json') {
      data = util.getParams(data);
    }
    fetchOpts.body = data;
  }

  return fetch(url, fetchOpts).then((res) => {
    return res.json();
  }).then(json => {
    if (json.error) {
      return Promise.reject(json);
    }
    return json;
  })
}

util.getCookie = (name) => {
  //用处理字符串的方式查找到key对应value
  name = escape(name);
  //读cookie属性，这将返回文档的所有cookie
  var allcookies = document.cookie;
  //查找名为name的cookie的开始位置
  name += "=";
  var pos = allcookies.indexOf(name);
  //如果找到了具有该名字的cookie，那么提取并使用它的值
  if (pos !== -1) { //如果pos值为-1则说明搜索"version="失败
    var start = pos + name.length; //cookie值开始的位置
    var end = allcookies.indexOf(";", start); //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
    if (end === -1) end = allcookies.length; //如果end值为-1说明cookie列表里只有一个cookie
    var value = allcookies.substring(start, end); //提取cookie的值
    value = decodeURI(value); //对它解码
    return (value);
  } else { //搜索失败，返回空字符串
    return "";
  }
}

util.setCookie = (cname, cvalue, exdays) => {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  var cookie = cname + "=" + encodeURI(cvalue) + ";path=/;";
  if (exdays) {
    d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    expires = "expires=" + d.toUTCString();
    cookie += expires;
  }
  document.cookie = cookie;
}
util.clearAllCookie = () => {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if(keys) {
    for(var i = keys.length; i--;)
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
  }
}

util.removeCookie = (cname) => {
  util.setCookie(cname, '', -1);
}

util.isBrowser = function () {
  var Sys = {};
  var ua = navigator.userAgent.toLowerCase();
  var s;
  (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
      (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
          (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
  if (Sys.ie) {//Js判断为IE浏览器
    if (Sys.ie === '9.0') {//Js判断为IE 9
      return 'IE9';
    } else if (Sys.ie === '8.0') {//Js判断为IE 8
      return 'IE8';
    } else {
      return 'MSIE';
    }
  }
  if (Sys.firefox) {//Js判断为火狐(firefox)浏览器
    return 'firefox';
  }
  if (Sys.chrome) {//Js判断为谷歌chrome浏览器
    return 'chrome';
  }
  if (Sys.opera) {//Js判断为opera浏览器
    return 'opera';
  }
  if (Sys.safari) {//Js判断为苹果safari浏览器
    return 'safari';
  }
}
util.getType = function (obj) {
  //tostring会返回对应不同的标签的构造函数
  var toString = Object.prototype.toString;
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  if (obj instanceof Element) {
    return 'element';
  }
  return map[toString.call(obj)];
}

export default util;