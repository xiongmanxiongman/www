;(()=> {
    //页面初始化,左侧菜单,顶部导航,顶部高度
    class PageInit{
        constructor(){
            this.href = location.href;
            this.navbar = document.getElementById('xNavbar');
            this.navbars = this.navbar.querySelectorAll('ul li a');
            this.menu = document.getElementById('xMenu');
            this.menuUl = this.menu.querySelectorAll('ul');
            this.menus = this.menu.querySelectorAll('ul li a');
            this.content = document.getElementById('xContent');
        }
        getMenu(){//获取左侧菜单
            this.menuUl.forEach(item=>{
                if (this.href.includes(item.getAttribute('data-path'))) {
                    item.style.display = 'block';
                }
            });
        }
        navOn(){//获取顶部选中
            this.navbars.forEach(item=>{
                if (this.href.includes(item.getAttribute('data-path'))) {
                    item.parentNode.className = 'on';
                }
            });
        }
        menuOn(){//获取左侧菜单选中
            this.menus.forEach(item=>{
                if (this.href.includes(item.href)) {
                    item.parentNode.className = 'on';
                }
            });
        }
        // htmlInit() {//页面初始化
        //     this.menu.style.paddingTop  = this.content.style.paddingTop = this.navbar.offsetHeight+'px';
        // }
        // htmlEvent(){
        //     window.addEventListener('resize', this.htmlInit.bind(this));//拉伸网页
        //     window.addEventListener('pageshow',  (e)=> {//从缓存中加载
        //         if (e.persisted) {//缓存中读取
        //             this.htmlInit().bind(this);
        //         }
        //     });
        // }
    }
    let pageInit = new PageInit();//页面初始化
    pageInit.getMenu();//获取菜单显示
    pageInit.menuOn();//菜单选中
    pageInit.navOn();//导航选中
    //pageInit.htmlInit();//修正导航遮挡区
    //pageInit.htmlEvent();//监听窗口大小变化
    //登录
    class Login{
        constructor(){
            this.shadow = document.getElementById('xShadow');//遮罩层
            this.name = document.getElementById('xName');//用户名
            this.password = document.getElementById('xPassword');//密码
            this.close = document.getElementById('xClose');//弹框关闭
            this.dialog = document.getElementById('xDialog');//弹框
            this.registerBtn = document.getElementById('xRegisterBtn');//导航注册按钮
            this.loginBtn = document.getElementById('xLoginBtn');//导航登录按钮
            this.personalBtn = document.getElementById('xPersonalBtn');//导航用户名展现
            this.logoutBtn = document.getElementById('xLogoutBtn');//导航退出按钮
            this.registerConfirm = document.getElementById('xRegisterConfirm');//弹框注册按钮
            this.loginConfirm = document.getElementById('xLoginConfirm');//弹框登录按钮
            this.dialogVisible = 0;//弹框状态
            this.act = '';//弹框出发行为
        }
        //关闭按钮
        clickClose(){
            this.close.onclick = this.shadow.onclick =()=>{
                this.resetDialog();
            }
        }
        //登录和注册按钮打开对话框
        clickOpen(){
            let mThis = this;
            this.loginBtn.onclick = this.registerBtn.onclick = function () {
                mThis.dialogVisible = 1;
                mThis.dialog.style.display = 'block';
                mThis.shadow.style.display = 'block';
                if(this.getAttribute('data-act')=='lgn'){
                    mThis.act ='lgn';
                    mThis.loginConfirm.style.display = 'block';
                    mThis.registerConfirm.style.display = 'none';
                }else if(this.getAttribute('data-act')=='reg'){
                    mThis.act ='reg';
                    mThis.registerConfirm.style.display = 'block';
                    mThis.loginConfirm.style.display = 'none';
                }
            }
        }
        //重置对话框
        resetDialog(){
            this.dialogVisible = 0;
            this.dialog.style.display = 'none';
            this.shadow.style.display = 'none';
            this.registerConfirm.style.display = 'none';
            this.loginConfirm.style.display = 'none';
            this.name.value = '';
            this.password.value = '';
        }
        //退出按钮点击
        clickLogoutBtn(){
            this.logoutBtn.onclick = () =>{
                localStorage.token = '';
                this.loginBtn.style.display = 'flex';
                this.registerBtn.style.display = 'flex';
                this.personalBtn.style.display = 'none';
                this.logoutBtn.style.display = 'none';
            }

        }
        //对话框注册按钮点击
        clickRegisterConfirm(){
            this.registerConfirm.addEventListener('click', () => {
                this.confirm();
            },false);
        }
        //对话框登录按钮点击
        clickLoginConfirm() {
            this.loginConfirm.addEventListener('click', () => {
                this.confirm();
            },false);
        }
        //点击函数
        async confirm(){
            //判断用户名密码是否填写
            let url = '';
            if (this.name.value && this.password.value) {
                //将提交按钮隐藏处理,防止重复提交
                if(this.act=='lgn'){
                    this.loginConfirm.style.display = 'none';
                    url = '/api/koa/permissions/login';
                }else if(this.act=='reg'){
                    this.registerConfirm.style.display = 'none';
                    url = '/api/koa/permissions/register';
                }
                //接口参数
                let queryData = {
                    type: 'post',
                    url,
                    data: {
                        name: this.name.value,
                        password: this.password.value
                    }
                };
                try {
                    //请求接口
                    let res = await this.api(queryData);
                    res = JSON.parse(res);
                    //成功后相关交互处理
                    if (res.success && res.data) {
                        //将后台传来的token存在localStorage里面,方便token验证使用
                        localStorage.token = res.data;
                        this.loginBtn.style.display = 'none';
                        this.registerBtn.style.display = 'none';
                        this.personalBtn.style.display = 'flex';
                        this.logoutBtn.style.display = 'flex';
                        this.personalBtn.innerHTML = '<i class="state-on"></i><span>' + this.name.value + '</span>';
                        this.resetDialog();
                    } else {
                        this.loginConfirm.style.display = 'block';
                        alert(res.msg);
                    }
                } catch (e) {
                    console.log(e);
                }
            } else {
                alert('用户名密码似乎没填');
            }
        }
        //token验证
        async token(){
            //本地token是否存在
            if(!localStorage.token) return;
            //接口参数
            let queryData = {
                type:'post',
                url:'/api/koa/permissions/token',
                data:{
                    token:localStorage.token
                }
            };
            try{
                //请求接口
                let res = await this.api(queryData);
                res = JSON.parse(res);
                //token验证成功后相关交互处理
                if(res.success&&res.data){
                    this.loginBtn.style.display = 'none';
                    this.registerBtn.style.display = 'none';
                    this.personalBtn.style.display = 'flex';
                    this.logoutBtn.style.display = 'flex';
                    this.personalBtn.innerHTML = '<i class="state-on"></i><span>'+res.data.name+'</span>';
                    //pageInit.htmlInit();//修正导航遮挡区
                }
            }catch(e) {
                console.log(e);
            }

        }
        /*tokenxhr(){
            if(localStorage.token){
                let xhr = new XMLHttpRequest();
                xhr.open("post", "/api/koa/permissions/token", true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send("token="+localStorage.token+"&t="+Math.random());
                xhr.onreadystatechange = ()=>{
                    if(xhr.readyState == 4){
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                            let res = JSON.parse(xhr.responseText)
                            if(res.success&&res.data){
                                this.loginBtn.style.display = 'none';
                                this.registerBtn.style.display = 'none';
                                this.personalBtn.style.display = 'flex';
                                this.logoutBtn.style.display = 'flex';
                                this.personalBtn.innerHTML = '<i class="state-on"></i><span>'+res.data+'</span>';
                            }
                        } else {
                            console.log("Request was unsuccessful: " + xhr.status);
                        }
                    }
                };
            }
        }*/
        //ajax再次封装为Promise
        api(queryData){
            return new Promise((resolve, reject)=> {
                this.ajax({
                    type:queryData.type,
                    url:queryData.url,
                    data:queryData.data,
                    success: function (res) {
                        resolve(res);
                    },
                    fail:function (res) {
                        reject(res);
                    }
                });
            });
        }
        //json转url
        json2url(json) {
            json.t = Math.random();
            var arr = [];
            for (var name in json) {
                arr.push(name + '=' + json[name]);
            }
            return arr.join('&');
        }
        //ajax简单封装
        ajax(json) {
            json = json || {};
            if (!json.url) return;
            json.data = json.data || {};
            json.type = json.type || 'get';
            var xhr = new XMLHttpRequest();
            switch (json.type.toLowerCase()) {
                case 'get':
                    xhr.open('GET', json.url + '?' + this.json2url(json.data), true);
                    xhr.send();
                    break;
                case 'post':
                    xhr.open('POST', json.url, true);
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.send(this.json2url(json.data));
                    break;
            }
            xhr.onreadystatechange = function () {
                if(xhr.readyState == 4){
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                        json.success && json.success(xhr.responseText);
                    } else {
                        json.fail && json.fail(xhr.status);
                    }
                }
            };
        }
        //enter键
        enter(){
            document.onkeyup = (ev)=> {
                if(ev.keyCode==13&&this.dialogVisible){
                    this.confirm();
                }
            };
        }
    }

    let login = new Login();//权限相关
    login.clickClose();//启用弹框关闭事件
    login.clickOpen();//启用弹框开启事件
    login.clickLoginConfirm();//启用弹框登录事件
    login.clickRegisterConfirm();//启用弹框注册事件
    login.clickLogoutBtn();//启用导航退出事件
    login.token();//启用token
    login.enter();//启用回车键
})();
//let docEl = document.documentElement;
//let psdWidth = 640;//设计稿大小
//let referenceFontSize = 12;//参照字体,PSD上量的字体大小除以参照字体
//let clientWidth = docEl.clientWidth > psdWidth ? psdWidth : docEl.clientWidth;//超过设计稿宽度的设备默认为参照字体
//let htmlFontSize = clientWidth * referenceFontSize / psdWidth;//计算公式12/640得到缩放率
//docEl.style.fontSize = htmlFontSize + 'px';//设置html字体