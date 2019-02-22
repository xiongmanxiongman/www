function getStyle(obj, sName) {
    return (obj.currentStyle || getComputedStyle(obj, false))[sName];
}

function startMove(obj, json, options) {
    options = options || {};
    options.easing = options.easing || 'ease-out';
    options.duration = options.duration || 300;
    var start = {};
    var dis = {};
    for (var name in json) {
        start[name] = parseFloat(getStyle(obj, name));
        if (isNaN(start[name])) {
            switch (name) {
                case 'width':
                    start[name] = obj.offsetWidth;
                    break;
                case 'height':
                    start[name] = obj.offsetHeight;
                    break;
                case 'top':
                    start[name] = obj.offsetTop;
                    break;
                case 'left':
                    start[name] = obj.offsetLeft;
                    break;
                case 'opacity':
                    start[name] = 1;
                    break;
                case 'borderWidth':
                    start[name] = 0;
                    break;
            }
        }
        dis[name] = json[name] - start[name];
    }
    var count = Math.floor(options.duration / 30);
    var n = 0;
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        n++;
        for (var name in json) {
            switch (options.easing) {
                case 'linear':
                    var cur = start[name] + dis[name] * n / count;
                    break;
                case 'ease-in':
                    var a = n / count;
                    var cur = start[name] + dis[name] * Math.pow(a, 3);
                    break;
                case 'ease-out':
                    var a = 1 - n / count;
                    var cur = start[name] + dis[name] * (1 - Math.pow(a, 3));
                    break;
            }
            if (name == 'opacity') {
                obj.style[name] = cur;
                obj.style.filter = 'alpha(opacity:' + cur * 100 + ')';
            } else {
                obj.style[name] = cur + 'px';
            }
        }
        if (n == count) {
            clearInterval(obj.timer);
            options.callback && options.callback();
        }
    }, 30);
}

function getSon(oParent, obj) {
    while (obj) {
        if (oParent == obj) {
            return true;
        }
        obj = obj.offsetParent;
    }
    return false;
}

function getDir(obj, ev) {
    var x = obj.offsetLeft + obj.offsetWidth / 2 - ev.clientX;
    var y = obj.offsetTop + obj.offsetHeight / 2 - ev.clientY;
    return Math.round((Math.atan2(y, x) * 180 / Math.PI + 180) / 90) % 4;
}

function through(obj) {
    var oSpan = obj.children[0];
    obj.onmouseover = function (ev) {
        var oEvent = ev || event;
        var oFrom = oEvent.fromElement || oEvent.relatedTarget;
        if (getSon(obj, oFrom)) return;
        var dir = getDir(obj, oEvent);
        switch (dir) {
            case 0:
                oSpan.style.left = '140px';
                oSpan.style.top = 0;
                break;
            case 1:
                oSpan.style.left = 0;
                oSpan.style.top = '42px';
                break;
            case 2:
                oSpan.style.left = '-140px';
                oSpan.style.top = 0;
                break;
            case 3:
                oSpan.style.top = '-42px';
                oSpan.style.left = 0;
                break;
        }
        startMove(oSpan, {top: 0, left: 0});
    };
    obj.onmouseout = function (ev) {
        var oEvent = ev || event;
        var oTo = oEvent.toElement || oEvent.relatedTarget;
        if (getSon(obj, oTo)) return;
        var dir = getDir(obj, oEvent);
        switch (dir) {
            case 0:
                startMove(oSpan, {top: 0, left: 140});
                break;
            case 1:
                startMove(oSpan, {top: 42, left: 0});
                break;
            case 2:
                startMove(oSpan, {top: 0, left: -140});
                break;
            case 3:
                startMove(oSpan, {top: -42, left: 0});
                break;
        }
    };
}

window.onload = function () {
    var oLinks = document.getElementById('links');
    var aLinks = oLinks.getElementsByTagName('li');
    for (var i = 0; i < aLinks.length; i++) {
        through(aLinks[i]);
    }
};