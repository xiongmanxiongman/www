//连接服务器
var sock=io.connect('api.ijilu.cn:84');
var oChat = document.getElementById('chat');
var oMessage = document.getElementById('message');
var oSend=document.getElementById('send');
var animate = ['bounce','flash','pulse','rubberBand','shake','swing','tada','wobble','jello','bounceIn','bounceInDown','bounceInLeft','bounceInRight','bounceInUp','fadeIn','fadeInDown','fadeInLeft','fadeInRight','fadeInUp','flip','flipInX','flipInY','lightSpeedIn','rotateIn','rotateInDownLeft','rotateInDownRight','rotateInUpLeft','rotateInUpRight','slideInUp','slideInDown','slideInLeft','slideInRight','zoomIn','zoomInDown','zoomInLeft','zoomInRight','zoomInUp','rollIn'];
var animatelength = animate.length
//第一次
sock.emit('firstTime');
sock.once('firstTime2',function(firstTime){
    if(firstTime&&firstTime.length){
        var arr = firstTime.split(',');
        for(let i=0;i<arr.length;i++){
            setTimeout(function () {
                var oSpan=document.createElement('span');
                var num = Math.floor(Math.random() * animatelength + 1);//1-animatelength
                oSpan.innerHTML=arr[i];
                oSpan.classList = 'animated '+animate[num-1];
                oChat.appendChild(oSpan);
            },100*i)
        }
    }
});
//接收
sock.on('msg2',function(msg){
    var oSpan=document.createElement('span');
    var num = Math.floor(Math.random() * animatelength + 1);//1-animatelength
    oSpan.innerHTML=msg;
    oSpan.classList = 'animated '+animate[num-1];
    oChat.insertBefore(oSpan,oChat.children[0]);
});
oSend.onclick=function(){
    var str = oMessage.value.replace(/^\s+|\s+$/g,'');
    if(str){
        var oSpan=document.createElement('span');
        var num = Math.floor(Math.random() * animatelength + 1);//1-animatelength
        oSpan.innerHTML=oMessage.value;
        oSpan.classList = 'animated '+animate[num-1];
        oChat.insertBefore(oSpan,oChat.children[0]);
        //发送
        sock.emit('msg',oMessage.value);
        oMessage.value = '';
    }else{
        oMessage.value = '';
    }
};
