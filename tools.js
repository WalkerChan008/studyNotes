/* type方法 */
function type(target) {
    var ret = typeof (target);
    var toStr = Object.prototype.toString;
    var temp = {
        "[object Array]": "array",
        "[object Object]": "object",
        "[object Number]": "nmber_object",
        "[object Boolean]": "boolean_object",
        "[object String]": "string_object"
    }
    if (target === null) {
        return "null";
    } else if (ret == "object") {
        var str = toStr.call(target);
        return temp[str];
    } else {
        return ret;
    }
}

/* 深度克隆 */
function deepClone(origin, target) {
    var target = target || {},
        toStr = Object.prototype.toString,
        arrStr = '[object Array]';
    for (var prop in origin) {
        if (origin.hasOwnProperty(prop)) {
            if (origin[prop] !== 'null' && typeof (origin[prop]) == 'object') {
                target[prop] = (toStr.call(origin[prop]) == arrStr) ? [] : {};
                deepClone(origin[prop], target[prop]);
            } else {
                target[prop] = origin[prop];
            }
        }
    }
    return target;
}
/* 原型链上实现 */
Object.prototype.deepClone = function (origin) {
    var toStr = Object.prototype.toString,
        arrStr = '[object Array]';
    for(var prop in origin) {
        if(origin.hasOwnProperty(prop)) {
            if(origin[prop] !== null && typeof(origin[prop]) == 'object') {
                this[prop] = (toStr.call(origin[prop]) == arrStr) ? [] : {};
                this[prop].deepClone(origin[prop]);
            }else{
                this[prop] = origin[prop];
            }
        }
    }
}

/* 圣杯模式 */
var inherit = (function () {
    var F = function () {};
    return function (Target, Origin) {
        F.prototype = Origin.prototype;
        Target.prototype = new F();
        Target.prototype.constructor = Target;
        Target.prototype.uber = Origin.prototype;
    }
}());

/* 查看滚动条的滚动距离 */
function getScrollOffset() {
    if (window.pageXOffset) {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        };
    } else {
        return {
            x: document.body.scrollLeft + document.documentElement.scrollLeft,
            y: document.body.scrollTop + document.documentElement.scrollTop
        };
    }
}


/* 查看可视窗口尺寸 */
function getViewportOffset() {
    if (window.innerWidth) {
        return {
            w: window.innerWidth,
            h: window.innerHeight
        };
    } else {
        if (document.documentElement.clientWidth) {
            return {
                w: document.documentElement.clientWidth,
                h: document.documentElement.clientHeight
            };
        } else {
            return {
                w: document.body.clientWidth,
                h: document.body.clientHeight
            };
        }
    }
}

/* 获取指定元素的样式属性 */
function getStyle(ele, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(ele, null)[prop];
    } else {
        return ele.currentStyle[prop];
    }
}

/**
 * 绑定兼容事件
 * @param {*} ele 
 * @param {*} type 
 * @param {*} handle 
 */
function addEvent(ele, type, handle) {
    if (ele.addEventListener) {
        ele.addEventListener(type, handle, false);
    } else if (ele.attachEvent) { // 程序this指向window
        ele.attachEvent('on' + type, function () {
            handle.call(ele);
        });
    } else {
        ele['on' + type] = handle;
    }
}

/* 取消冒泡事件 */
function stopBubble(event) {
    event = event || window.event;
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
}

/* 阻止默认事件 */
function cancelHandler(event) {
    event = event || window.event;
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}

/* 拖拽物体运动 */
function drag(ele) {
    var disX,
        disY;
    addEvent(ele, 'mousedown', function (e) {
        var e = e || window.event;
        disX = e.clientX - parseInt(getStyle(ele, 'left'));
        disY = e.clientY - parseInt(getStyle(ele, 'top'));
        addEvent(document, 'mousemove', test);
        addEvent(document, 'mouseup', function (e) {
            document.removeEventListener('mousemove', test, false);
        });
    });

    function test(e) {
        ele.style.left = e.clientX - disX + 'px';
        ele.style.top = e.clientY - disY + 'px';
    }
}

/* JS异步加载 */
/* loadScript('tools.js', function () { callback() }) */
function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    if (script.readyState) { // ie
        script.onreadystatechange = function () {
            if (script.readyState == 'complete' || script.readyState == 'loaded') {
                callback();
            }
        }
    } else { // safiri chrome firefox opera
        script.onload = function () {
            callback();
        }
    }
    script.src = url;
    document.head.appendChild(script);
}
function loadScript1(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    if (script.readyState) { // ie
        script.onreadystatechange = function () {
            if (script.readyState == 'complete' || script.readyState == 'loaded') {
                tools[callback]();
            }
        }
    } else { // safiri chrome firefox opera
        script.onload = function () {
            tools[callback]();
        }
    }
    script.src = url;
    document.head.appendChild(script);
}

/* 封装兼容性较好的getByClassName方法 */
Document.prototype.getByClassName = function (className) {
    var allDomArr = Array.prototype.slice.call(document.getElementsByTagName('*'), 0),
        filterArr = [];

    function formatClass(obj) {
        var reg = /\s+/g;
        var classNameArr = obj.className.replace(reg, ' ').trim();
        return classNameArr;
    }
    allDomArr.forEach(function (ele, index) {
        var itemClassName = formatClass(ele).split(' '),
            len = itemClassName.length;
        for (var i = 0; i < len; i++) {
            if (itemClassName[i] == className) {
                filterArr.push(ele);
                break;
            }
        }
    });
    return filterArr;
}

// 弹性运动
function elasticMove(dom, iTarget) {
    clearInterval(dom.timer);
    var iSpeed = 0,
        a = 0,
        u = 0.8;
    dom.timer = setInterval(function () {
        a = (iTarget - dom.offsetLeft) / 5;
        iSpeed = 0.8 * (iSpeed + a);
        if (Math.abs(iSpeed) < 1 && dom.offsetLeft === iTarget) {
            dom.style.left = iTarget + 'px';
            clearInterval(dom.timer);
        }
        dom.style.left = dom.offsetLeft + iSpeed + 'px';
    }, 30)
}

// 多物体多值链式运动框架(必须配合getStyle函数使用)
function getStyle(elem, prop) {
    if (elem.currentStyle) {
        return elem.currentStyle[prop];
    } else {
        return window.getComputedStyle(elem, null)[prop];
    }
}

function move(ele, data, callback) {
    clearInterval(ele.timer);
    var iSpeed,
        iCur;
    ele.timer = setInterval(function () {
        var bStop = true;
        for (var prop in data) {
            if (prop == 'opacity') {
                iCur = parseFloat(getStyle(ele, prop)) * 100;
            } else {
                iCur = parseInt(getStyle(ele, prop));
            }
            iSpeed = (data[prop] - iCur) / 8;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            if (prop == 'opacity') {
                ele.style.opacity = (iCur + iSpeed) / 100;
            } else {
                ele.style[prop] = iCur + iSpeed + 'px';
            }
            if (iCur != data[prop]) {
                bStop = false;
            }
        }
        if (bStop) {
            clearInterval(ele.timer);
            typeof (callback) == 'function' ? callback(): '';
        }
    }, 30);
}

// 原生JS AJAX方法
function ajax(method, url, data, callback, flag) {
    var xhr = null;
    method = method.toUpperCase();
    if(window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }else {
        xhr = new ActiveXObject('Microsoft.XMLHttp');
    }
    if(method == 'GET') {
        xhr.open(method, url + '?' + data, flag);
        xhr.send();
    }else if(method == 'POST') {
        xhr.open(method, url, flag);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    }
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4) {
            if(xhr.status == 200) {
                callback(xhr.responseText);
            }
        }
    }
}

// 管理cookie(可链式调用方法)
var manageCookie = {
    setCookie: function (name, value, time) {
        document.cookie = name + '=' + value + ';max-age=' + time;
        return this;
    },
    removeCookie: function (name) {
        return this.setCookie(name, '', -1);
    },
    getCookie: function (name, callback) {
        var allCookieArr = document.cookie.split('; ');
        for(var i = 0; i < allCookieArr.length; i ++) {
            var itemCookieArr = allCookieArr[i].split('=');
            if(itemCookieArr[0] == name) {
                callback(itemCookieArr[1]);
                return this;
            }
        }
        callback(undefined);
        return this;
    }
}

/**
 * 反转单向链表
 * @param {Object} head - 链表顶部对象
 */
function reverseLinkedList(head) {
	let curNode = head,
  		pPre = null,
      pNext;
  while(curNode) {
  	pNext = curNode.next;
  	curNode.next = pPre;
    pPre = curNode;
    curNode = pNext;
  }
  return pPre;
}

/**
 * 防抖
 * @param {Function} fn - 需要防抖的函数
 * @param {Number} wait - 防抖时间
 * @param {Boolean} immediate - 是否马上执行
 */
function debounce(fn, wait, immediate) {
    let timer = null;

    return function () {
        let args = arguments;

        if(immediate && !timer) {
            fn.apply(this, args);
        }

        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, wait);
    };
}

/**
 * 节流
 * @param {Function} fn - 需要防抖的函数
 * @param {Number} wait - 防抖时间
 * @param {Boolean} immediate - 是否马上执行
 */
function throttle(fn, wait, immediate) {
    let timer = null,
        callNow = immediate;

    return function () {
        let args = arguments;

        if(callNow) {
            fn.apply(this, args);
            callNow = false;
        }

        if(!timer) {
            timer = setTimeout(() => {
                fn.apply(this,args);
                timer = null;
            }, wait);
        }
    }
}

/* ES6 Map 数据结构 原生JS start */
function myMap(arr) {
    this.init();
    arr = arr || [];
    arr.forEach(item => this.set(item[0], item[1]));
    return this;
}
myMap.prototype.len = 8;
myMap.prototype.bucket = [];
myMap.prototype.init = function () {
    for(let i = 0; i < this.len; i ++) {
        this.bucket[i] = {
            next: null
        };
    }
};
myMap.prototype.makeHash = function (key) {
    let hash = 0;
    if(typeof key === 'string') {
        let len = (key.length > 3) ? key.length : 3;
        for(let i = len - 3; i < len; i ++) {
            hash += (key[i] !== undefined) ? key[i].charCodeAt() : 0;
        }
    } else if(typeof key !== 'undefined') {
        hash = +key;
    }
    return hash;
};
myMap.prototype.set = function (key, value) {
    let hash = this.makeHash(key),
        curNode = this.bucket[hash % this.len],
        lastNode = null;

    while(curNode) {
        if(curNode.key === key) {
            curNode.value = value;
            return this;
        } else {
            lastNode = curNode;
            curNode = curNode.next;
        }
    }

    lastNode.next = {
        key,
        value,
        next: null
    };

    return this;
};
myMap.prototype.get = function (key) {
    let hash = this.makeHash(key),
        curNode = this.bucket[hash % this.len];

    while(curNode) {
        if(curNode.key === key) {
            return curNode.value;
        } else {
            curNode = curNode.next;
        }
    }
    return;
};
myMap.prototype.has = function (key) {
    let hash = this.makeHash(key),
        curNode = this.bucket[hash % this.len];

    while(curNode) {
        if(curNode.key === key) {
            return true;
        } else {
            curNode = curNode.next;
        }
    }

    return false;
};
myMap.prototype.delete = function (key) {
    let hash = this.makeHash(key),
        curNode = this.bucket[hash % this.len],
        lastNode = curNode;
        
    while(curNode) {
        if(curNode.key === key) {
            lastNode.next = curNode.next;
            return true;
        } else {
            lastNode = curNode;
            curNode = curNode.next;
        }
    }

    return false;
}
myMap.prototype.clear = function () {
    this.init();
}
/* ES6 Map 数据结构 原生JS end */


/* ES6 Map 数据结构 ES6语法 start */
class myMap1 {
    constructor(arr = []) {
        this.len = 8;
        this.bucket = [];
        this.init(arr);
    }
    init(arr) {
        for(let i = 0; i < this.len; i ++) {
            this.bucket[i] = {
                next: null
            };
        }
        arr.forEach(item => this.set(item[0], item[1]));
    }
    makeLen(arr) {
        let len = Math.ceil(Math.sqrt(arr.length)),
            bucketLen = len > 8 ? len : 8;
        return bucketLen;
    }
    makeHash(key) {
        let hash = 0;
        if(typeof key === 'string') {
            let len = key.length > 3 ? key.length : 3;
            for(let i = len - 3; i < key.length; i ++) {
                hash += key[i] ? key[i].charCodeAt() : 0;
            }
        } else if(key !== undefined) {
            hash = +key;
        }
        return hash;
    }
    set(key, val) {
        let hash = this.makeHash(key),
            curNode = this.bucket[hash % this.len],
            lastNode = null;

        while(curNode) {
            if(curNode.key === key) {
                curNode.val = val;
                return this;
            } else {
                lastNode = curNode;
                curNode = curNode.next;
            }
        }

        lastNode.next = {
            key,
            val,
            next: null
        };

        return this;
    }
    get(key) {
        let hash = this.makeHash(key),
            curNode = this.bucket[hash % this.len];

        while(curNode) {
            if(curNode.key === key) {
                return curNode.val;
            } else {
                curNode = curNode.next;
            }
        }

        return;
    }
    has(key) {
        let hash = this.makeHash(key),
            curNode = this.bucket[hash % this.len];

        while(curNode) {
            if(curNode.key === key) {
                return true;
            } else {
                curNode = curNode.next;
            }
        }

        return false;
    }
    delete(key) {
        let hash = this.makeHash(key),
            curNode = this.bucket[hash % this.len],
            lastNode = curNode;

        while(curNode) {
            if(curNode.key === key) {
                lastNode.next = curNode.next;
                return true;
            } else {
                lastNode = curNode;
                curNode = curNode.next;
            }
        }

        return false;
    }
    clear() {
        this.init();
    }
}
/* ES6 Map 数据结构 ES6语法 end */


/* ES6 Set 数据结构 ES6语法 start */
class mySet {
    constructor(arr = []) {
        this.len = 8;
        this.bucket = [];
        this.init(arr);
    }
    init(arr) {
        for(let i = 0; i < this.len; i ++) {
            this.bucket[i] = {
                next: null
            };
        }

        arr.forEach(item => this.add(item));
    }
    makeHash(val) {
        let hash = 0;
        if(typeof val === 'string') {
            let len = val.length > 3 ? val.length : 3;
            for(let i = len - 3; i < len; i ++) {
                hash += val[i] ? val[i].charCodeAt() : 0;
            }
        } else if(typeof val !== 'undefined') {
            hash = +val;
        }
        return hash;
    }
    add(value) {
        let hash = this.makeHash(value),
            curNode = this.bucket[hash % this.len],
            lastNode = null;

        while(curNode) {
            if(curNode.value === value) {
                return this;
            } else {
                lastNode = curNode;
                curNode = curNode.next;
            }
        }

        lastNode.next = {
            value,
            next: null
        };
    }
}
/* ES6 Set 数据结构 ES6语法 end */


/* 斐波那契数列 start */
function fbnc1(n = 1) {  // 不会导致栈溢出
    let num1 = 1, num2 = 1, i = 1;
    if(n === 1 || n === 2) {
        return 1;
    }
    for(; i < n; i ++) {
        [num1, num2] = [num2, num1 + num2];
    }
    return num1;
}
function fibonacci(n, ac1, ac2) {
    ac1 = ac1 || 1;
    ac2 = ac2 || 1;

    if(n <= 2) return ac2;

    return fibonacci(n - 1, ac2, ac1 + ac2);
}
/* 斐波那契数列 end */
