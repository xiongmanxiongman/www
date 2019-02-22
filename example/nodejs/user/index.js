//弹框
var oNewUser = document.getElementById('newUser');
var oPopup = document.getElementById('popup');
var oEdit = document.getElementById('edit');
var oAdd = document.getElementById('add');
var oClose = document.getElementById('close');
//翻页
var oPagination = document.getElementById('pagination');
var oPrevious = oPagination.querySelector('.previous');
var oNext = oPagination.querySelector('.next');
var oPaginationList = oPagination.querySelector('.paginationList');
var currentPage = 1;
var count = 0;
//弹框输入框
var oUsername = document.getElementById('username');
var oMail = document.getElementById('mail');
var oTel = document.getElementById('tel');
var oRemark = document.getElementById('remark');
//列表
var oList = document.getElementById('list');
//id
var oID = {};
//搜素输入框
var oSUsername = document.getElementById('sUsername');
var oSTel = document.getElementById('sTel');
var oSMail = document.getElementById('sMail');
//ajax请求数据
var data = {};
//初始化页面数据
fnRefreshList();
//上翻
oPrevious.onclick = function () {
    currentPage--;
    if (currentPage < 1) {
        currentPage = 1;
    } else {
        fnRefreshList();
    }
};
//下翻
oNext.onclick = function () {
    currentPage++;
    if (currentPage > count) {
        currentPage = count;
    } else {
        fnRefreshList();
    }
};
//页码点击
oPaginationList.onclick = function (ev) {
    var oEvent = ev || event;
    var oSrc = oEvent.srcElement || oEvent.target;
    if (oSrc.tagName == 'A') {
        currentPage = oSrc.innerHTML
        fnRefreshList();
    }
};
//列表点击-编辑用户
oList.onclick = function (ev) {
    var oEvent = ev || event;
    var oSrc = oEvent.srcElement || oEvent.target;
    if (oSrc.tagName == 'TD') {
        var aTd = oSrc.parentNode.children;
        oPopup.style.display = 'block';
        oEdit.style.display = 'block';
        oID.value = aTd[0].innerHTML;
        oUsername.value = aTd[1].innerHTML;
        oTel.value = aTd[2].innerHTML;
        oMail.value = aTd[3].innerHTML;
        oRemark.value = aTd[4].innerHTML;
    }
};
//弹框关闭
oClose.onclick = function () {
    fnClearPopup();
};
//新建按钮
oNewUser.onclick = function () {
    oPopup.style.display = 'block';
    oAdd.style.display = 'block';
};
//搜索
oSUsername.onkeyup = oSMail.onkeyup = oSTel.onkeyup = function () {
    currentPage = 1;
    fnRefreshList();
};
//弹框新建
oAdd.onclick = function () {
    data = {
        act: 'add',
        username: oUsername.value,
        mail: oMail.value,
        tel: oTel.value,
        remark: oRemark.value
    };
    fnApiUser(data).then(res => {
        currentPage = 1;
        fnRefreshList();
        fnClearPopup();
    });
};
//弹框编辑
oEdit.onclick = function () {
    data = {
        act: 'edit',
        ID: oID.value,
        username: oUsername.value,
        mail: oMail.value,
        tel: oTel.value,
        remark: oRemark.value
    };
    fnApiUser(data).then(res => {
        fnRefreshList();
        fnClearPopup();
    }).catch(err=>{
        console.log(err);
    });
};

//user接口
function fnApiUser(data) {
    var promise = new Promise(function (resolve, reject) {
        ajax({
            url: '/api/native/user',
            data: data,
            success: function (res) {
                resolve(res);
            },
            fail:function (res) {
                reject(res);
            }
        });
    });
    return promise;
}

//当前页选中
function fnCurrentPageSelection() {
    var oPaginationListA = oPaginationList.querySelectorAll('A');
    for (var i = 0; i < oPaginationListA.length; i++) {
        oPaginationListA[i].className = '';
    }
    if (oPaginationListA && oPaginationListA.length) {
        oPaginationListA[currentPage - 1].className = 'on';
    }
    if (count == 0 || count == 1) {
        oPrevious.className = 'none';
        oNext.className = 'none';
    } else if (currentPage == count) {
        oNext.className = 'off';
        oPrevious.className = '';
    } else if (currentPage == 1) {
        oPrevious.className = 'off';
        oNext.className = '';
    } else {
        oPrevious.className = '';
        oNext.className = '';
    }
}

//列表刷新
function fnRefreshList() {
    data = {
        act: 'list',
        pageNumber: currentPage,
        sUsername: oSUsername.value,
        sTel: oSTel.value,
        sMail: oSMail.value
    };
    fnApiUser(data).then(res => {
        fnRenderList(res);
    });
}

//页面渲染
function fnRenderList(res) {
    var json = eval('(' + res + ')');
    var arr = json.data;
    if(arr&&arr.length){
        var strList = '<tr><th>ID</th><th>用户名</th><th>手机</th><th>邮箱</th><th>备注</th></tr>';
        for (var i = 0; i < arr.length; i++) {
            strList += '<tr><td>' + arr[i].i + '</td><td>' + arr[i].u + '</td><td>' + arr[i].t + '</td><td>' + arr[i].m + '</td><td>' + arr[i].r + '</td></tr>';
        }
        oList.innerHTML = strList;
        //页码渲染
        count = json.count;
        var strPagination = '';
        for (var i = 0; i < count; i++) {
            strPagination += '<li><a href="javascript:;">' + (i + 1) + '</a></li>'
        }
        oPaginationList.innerHTML = strPagination;
        fnCurrentPageSelection();//当前页选中
    }
}

//清空弹框输入
function fnClearPopup() {
    oID.value = '';
    oUsername.value = '';
    oMail.value = '';
    oTel.value = '';
    oRemark.value = '';
    oPopup.style.display = 'none';
    oAdd.style.display = 'none';
    oEdit.style.display = 'none';
}

//json2url
function json2url(json) {
    json.t = Math.random();

    var arr = [];
    for (var name in json) {
        arr.push(name + '=' + json[name]);
    }
    return arr.join('&');
}

//ajax
function ajax(json) {
    json = json || {};
    if (!json.url) return;
    json.data = json.data || {};
    json.type = json.type || 'get';

    if (window.XMLHttpRequest) {
        var oAjax = new XMLHttpRequest();
    } else {
        var oAjax = new ActiveXObject('Microsoft.XMLHTTP');
    }

    switch (json.type) {
        case 'get':
            oAjax.open('GET', json.url + '?' + json2url(json.data), true);
            oAjax.send();
            break;
        case 'post':
            oAjax.open('POST', json.url, true);
            oAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            oAjax.send(json2url(json.data));
            break;
    }

    oAjax.onreadystatechange = function () {
        if (oAjax.readyState == 4) {
            if (oAjax.status >= 200 && oAjax.status < 300 || oAjax.status == 304) {
                json.success && json.success(oAjax.responseText);
            } else {
                json.error && json.error(oAjax.status);
            }
        }
    };
}