;(function($){
    $.extend($, {
        cookie_fix:function(){//cookie的前缀
            if(document.domain.split(".").length==3)
            {
                var o4_env = document.domain.split(".")[0].replace("corp","").replace("m","").replace("www","").replace("yunying","").replace("prod","");
            }else{
                var o4_env="";//如果域名是owhat.cn
            }
            return o4_env;
        },
        apiurl:function(){
            var href=window.location.href;
            return "/api";
        },                
        apimap:{
            v:'4.2.4',
            client:{
                platform:'mobile',
                version:'4.2.5',
                deviceid:deviceid(),
                channel:'owhat'
            },
            commentCount:{//获取评论总数
                cmd_s:'community.comment',
                cmd_m:'countcommentsbyarticleid'
            },
            addcomment:{//添加评论
                cmd_s:'community.comment',
                cmd_m:'addcomment'
            },
            randomcommentsbyarticleid:{//随机获取一条评论
                cmd_s:'community.comment',
                cmd_m:'randomcommentsbyarticleid'
            },
            findweixinsignature:{
                cmd_s:'common',
                cmd_m:'findweixinsignature'
            }
        },        
        apiInit:function(map,data,dataParam){//map为映射json，data为查找的key,dataParam为新增加的参数
            var params=map[data];
            if(getUrlParam("app")!=""){//判断是否从app过来的
                if(getUrlParam("userid")!="" && getUrlParam("token")!=""){
                    var userdata={
                        userid:getUrlParam("userid"),
                        token:getUrlParam("token")
                    }
                }else{
                    var userdata=null;
                }
                params.v=map.v;
                var client={}
                client.platform=getUrlParam("platform");
                client.version=getUrlParam("version");
                client.deviceid=getUrlParam("deviceid");
                client.channel=getUrlParam("channel");
                params.client=JSON.stringify(client);
                if(userdata!=null){
                    params.userid=userdata.userid;
                    params.token=userdata.token;
                }
            }else{
                var userdata=getCookie($.cookie_fix()+"_userData") && Base64.decode(getCookie($.cookie_fix()+"_userData"))!="undefined" ? $.parseJSON(Base64.decode(getCookie($.cookie_fix()+"_userData"))) : null;//获取浏览器cookie
                params.v=map.v;
                params.client=JSON.stringify(map.client);
                if(userdata!=null){
                    params.userid=userdata.userid;
                    params.token=userdata.token;
                }
            }
            

                // params.userid="2";
                // params.token="0d6a3af1aa30f845c36442ec5a1fd34d&data=";
            if(dataParam){
                if(typeof(dataParam)=="object"){
                    params.data=JSON.stringify(dataParam);
                }else{
                    params.data=dataParam;
                }
            }else{
                params.data={}
            }
            if(getUrlParam("console")!="") console.log($.apiurl()+"?userid="+params.userid+"&cmd_m="+params.cmd_m+"&v="+params.v+"&cmd_s="+params.cmd_s+"&token="+params.token+"&client="+params.client+"&data="+params.data);
            return params;
        },        
        owhatXHR:function(options){//公共ajax请求
            var This=this;
            if(options.path && options.path!=''){//新接口
                var url=$.apiurl_new()+$.apimap_new[options.path].path+"?requesttimestap="+ new Date().getTime();
                var data=$.apiInit_new(options.data);
                if(getUrlParam("console")!=''){
                    console.log(url+JSON.stringify(data));
                }
            }else{
                var url=$.apiurl()+"?requesttimestap="+ new Date().getTime();
                var data=options.data;
            }
            $.ajax({
                url:url,
                type:"post",
                async:options.async || true,
                data:data,
                dataType:"json",
                success:function(back){
                    if(back.result=="fail"){
                        if(back.code=="e_sys_unknown_method"){//找不到方法
                            if(navigator.userAgent.indexOf('QQBrowser') !== -1){
                                if($.maxRequest>0) $.owhatXHR(options);
                                $.maxRequest--;
                                return;
                            }
                        }
                        if(back.code=="e_sys_busyness"){
                            $.jAlert({
                                tips:back.message,
                                timer:2000
                            });
                            return;
                        }
                        if(options.fail) options.fail(back);//错误回调
                        if(options.noneedfail){
                            return;
                        }
                        if(back.code=="e_sys_invalid_token"){
                            // alert(back.message);
                            setStorge("refers",window.location.href);
                            $.ajaxload();
                            // window.location.href="/user/login.html";
                            $.openLogin();
                        }else if(back.code=="user_register_email_exist"||back.code=="user_register_mobile_exist"){
                            if(confirm(back.message)){
                                window.location.href="login.html";
                            }
                        }else{
                            if(back.code=="shop_order_express_fee_no_fee"){
                                return;
                            }
                            if(options.mustfail){
                                // options.fail(back);
                                return;
                            }
                            // $(".debug").append('<div>响应错误接口地址：'+$.apiurl()+'?data='+JSON.stringify(options)+'</div>');
                            alert(back.message);
                            // alert(JSON.stringify(options));
                        }
                        return;
                    }
                    if(options.success) options.success(back);
                },
                error:function(err){
                    if(options.noneedfail){
                        if(options.fail) options.fail(err);//错误回调
                    }else{
                        $.jAlert({
                            tips:'网络问题，再来一次！',
                            timer:2000
                        });
                    }
                }
            });
        },        
        isWeiXin:function(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                return true;
            }else{
                return false;
            }
        },
        isQq:function(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/QQ/i) == "qq"){
                return true;
            }else{
                return false;
            }            
        },
        isWeibo:function(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/WeiBo/i) == "weibo"){
                return true;
            }else{
                return false;
            }              
        },
        alertInter:null,
        jAlert:function(options){
            if($.alertInter==null){
                if(options.isbtn){
                    var jAlert_btn='<div class="alertBtns"><a href="javascript:void(0)" class="jAlert_cancel">取消</a><a href="javascript:void(0)" class="jAlert_confirm">确认</a></div>';
                }else{
                    var jAlert_btn='';
                }
                var jAlert_f=$('<div id="alert_out" style="position:fixed; width:100%;  z-index:10000;left:0; top:0;display:none;"><div class="jAlert"><div class="jAlert_mask"></div><div class="jAlert_con"><div class="alertTips">'+options.tips+'</div>'+jAlert_btn+'</div></div></div>');
                $("body").append(jAlert_f);jAlert_f.fadeIn(300);
                jAlert_f.height($(window).height());
                $(".jAlert").css({"margin-top":-parseInt($(".jAlert").height())/2});
                if(options.timer!=null){
                    $.alertInter=setTimeout(function(){
                        if(options.callback) options.callback();
                        jAlert_f.remove();
                        clearTimeout($.alertInter);
                        $.alertInter=null;
                        if(typeof(options.timfun)!="undefined"){
                            options.timfun();
                        }
                    },options.timer);
                }
                if(options.isbtn){
                    $(".jAlert_cancel").click(function(){
                        jAlert_f.fadeOut(100,function(){
                            jAlert_f.remove();
                            if(options.timer!=null){ clearTimeout($.alertInter); }
                            $.alertInter=null;
                            if(typeof(options.timfun)!="undefined"){
                                options.timfun();
                            }
                        });
                    });
                    $(".jAlert_confirm").click(function(){
                        if(options.callback) options.callback();
                        jAlert_f.remove();
                        if(options.timer!=null){ clearTimeout($.alertInter); }
                        $.alertInter=null;
                        if(typeof(options.timfun)!="undefined"){
                            options.timfun();
                        }
                    });
                }
                $(".jAlert").click(function(e){
                    e.stopPropagation();
                });
            }
        },
        closejAlert:function(){
            if($.alertInter!=null){ clearTimeout($.alertInter); }
            $.alertInter=null;
            $("#alert_out").remove();
        },
        gaAnalytics:function(category,action,label){
            try{
                ga("send","event",category,action,label);
            }catch(err){
                // console.log(err);
            }
        }
    });
})(Zepto)
;(function($,window){
    window.Dialog=function(options){
        var defaults={//初始化参数
            title:"",//标题
            cname:"",//对话框classname
            tips:"",//提示信息
            ismask:true,//是否显示蒙层
            maskColor:"#000",//蒙层背景颜色
            maskOpcity:0.2,//蒙层透明度
            width:510,//宽度
            close_btn:true,//关闭按钮打开
            confirm_btn:true,//确认按钮
            cancel_btn:false,//取消按钮
            confirm_art:"确定",
            cancel_art:"取消",
            confirm_call:null,//点击确认按钮之后的回调
            cancel_call:null,//点击取消按钮之后的回调
            close_call:null//点击关闭按钮之后的回调
        }
        if(options)
            var opt=$.extend(defaults,options);
        else
            var opt=defaults;
        $.CloseDialog();

        if(opt.title){
            var d_head='<div class="dialog_head"><h2>'+opt.title+'</h2></div>';
        }else{
            var d_head='<div class="dialog_head"><h2></h2></div>';
        }

        if(opt.close_btn){
            var close='<i class="i_close">×</i>';
        }else{
            var close="";
        }
        if(opt.confirm_btn){
            var confirm='<b class="btn-primary">'+opt.confirm_art+'</b>';
        }else{
            var confirm='';
        }
        if(opt.cancel_btn){
            var cancel='<b class="btn-cancel">'+opt.cancel_art+'</b>';
        }else{
            var cancel='';
        }

        if(opt.ismask){
            var dialog_mask=$('<div class="dialog_mask" style="display:none;background:'+opt.maskColor+';filter:alpha(opacity='+opt.maskOpcity*100+');-webkit-opacity:'+opt.maskOpcity+';-moz-opacity:'+opt.maskOpcity+';opacity:'+opt.maskOpcity+';"></div>'+
                '<div class="dialog_con '+opt.cname+'" style="display:none;">'+
                close+
                d_head+
                '<div class="dialog_body">'+
                opt.tips+
                '</div>'+
                '<div class="dialog-action">'+
                cancel+confirm+
                '</div>'+
                '</div>');
        }else{
            var dialog_mask=$('<div class="dialog_con '+opt.cname+'" style="display:none;">'+
                close+
                d_head+
                '<div class="dialog_body">'+
                opt.tips+
                '<div class="dialog-action">'+
                cancel+confirm+
                '</div>'+
                '</div>'+
                '</div>');
        }


        $("body").append(dialog_mask);
        if(typeof(opt.callback)=="function"){
            opt.callback();
        }
        function showDialog(){
            var con=$(".dialog_con");
            var wid=opt.width;
            con.width(wid);
            var hei=parseInt(con.height());
            var winW=$(window).width();
            var winH=$(window).height();
            if(winH>=hei){
                con.css({"top":(winH-hei)/2-50,"left":(winW-wid)/2});
            }else{
                con.css({"top":-50,"left":(winW-wid)/2});
            }
            if(opt.ismask){
                var mask=$(".dialog_mask");
                mask.height($(window).height());
                mask.fadeIn(50,function(){
                    if(winH>=hei){
                        con.fadeIn(0).animate({"top":(winH-hei)/2-50},200);
                    }else{
                        con.fadeIn(0).animate({"top":0},200);
                    }
                });
            }else{
                if(winH>=hei){
                    con.fadeIn(0).animate({"top":(winH-hei)/2-50},200);
                }else{
                    con.fadeIn(0).animate({"top":0},200);
                }
            }
        }

        function closeDialog(){
            $(".btn-primary").bind("click",function(){
                if(opt.confirm_call == null){
                    dialog_mask.remove();
                }else{
                    opt.confirm_call();
                }
            });
            $(".btn-cancel").bind("click",function(){
                if(opt.cancel_call == null){
                    dialog_mask.remove();
                }else{
                    opt.cancel_call();
                }
            });
            $(".i_close").bind("click",function(){
                if(opt.close_call == null){
                    dialog_mask.remove();
                }else{
                    opt.close_call();
                }               
            });
        }
        function close(){
            $('.dialog_mask').remove();
            $('.dialog_con').remove();
        }
        /* if(opt.ismask){
            var mask=$(".dialog_mask");
            mask.on("click",function(){
                $(".i_close").trigger("click");
            });
        } */
        showDialog();
        closeDialog();
        $(window).resize(function(){
            showDialog();
        });


    }
    $.Dialog=window.Dialog;
})(Zepto,window);
;(function($){
    window.CloseDialog=function(){
        function close(){
            $('.dialog_mask').remove();
            $('.dialog_con').remove();
        }
        close();
    }
    $.CloseDialog=window.CloseDialog;
})(Zepto,window);
function audioAutoPlay(id){  
    var audio = document.getElementById(id),  
        play = function(){  
            audio.play();  
            document.removeEventListener("touchstart",play, false);  
        };  
    audio.play();  
    document.addEventListener("WeixinJSBridgeReady", function () {  
        play();  
    }, false);  
    document.addEventListener('YixinJSBridgeReady', function() {  
        play();  
    }, false);  
    document.addEventListener("touchstart",play, false);  
} 
audioAutoPlay('audio'); 

var doc = document;
var canvas = doc.getElementById('canvas');
var ctx = canvas.getContext('2d');
var $gameBox = $('#gameBox');
var $lis = $gameBox.find('li');
var image = new Image();
var oriArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var imgArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var OWHAT={};
OWHAT={
    timeHandle: null,
    isComplete: false,
    level: 0,
    isFirstPlay:true,
    isPing:false,
    timeSum:0,
    levels: [
        {image: "images/fang/1.png"},
        {image: "images/fang/2.png"},
        {image: "images/fang/3.png"},
        {image: "images/fang/4.png"},
        {image: "images/fang/5.png"},
        {image: "images/fang/6.png"},
        {image: "images/fang/7.png"},
        {image: "images/fang/8.png"},
        {image: "images/fang/9.png"},
        {image: "images/fang/10.png"},
        {image: "images/fang/11.png"},
        {image: "images/fang/12.png"},
        {image: "images/fang/13.png"},
        {image: "images/fang/14.png"},
        {image: "images/fang/15.png"},
        {image: "images/fang/16.png"},
        {image: "images/fang/17.png"},
        {image: "images/fang/18.png"}
        // {image: "images/fang/19.png"},
        // {image: "images/fang/20.png"}

    ],
    start: function() {
        this.init();
        // this.render();
        this.bind();
        this.initWeixin();
    },      
    bind: function() {
        var This=this;
        //阻止手机上浏览器的弹性下拉。。。
        $('#pt-box').on('touchstart', function(e) {
            if(This.isPing){
                e.preventDefault();
            }
        });
        $lis.on('swipeLeft', function(e) {
            e.preventDefault();
            var $this = $(this);
            var index = $this.index();
            var html = $this.html();
            var $prev = $this.prev();
            if ($.inArray(index, [3, 6]) > -1 || $prev.size() <= 0) {
                return false;
            }
            $this.html($prev.html());
            $prev.html(html);
            This.check();
        });
        $lis.on('swipeRight', function(e) {
            e.preventDefault();
            var $this = $(this);
            var index = $this.index();
            var html = $this.html();
            var $next = $this.next();
            if ($.inArray(index, [2, 5]) > -1 || $next.size() <= 0) {
                return false;
            }
            $this.html($next.html());
            $next.html(html);
            This.check();
        });
        $lis.on('swipeUp', function(e) {
            e.preventDefault();
            var $this = $(this);
            var html = $this.html();
            var index = $this.index() - 3;
            var $up = $lis.eq(index);
            if (index >= 0 && $up.size() > 0) {
                $this.html($up.html());
                $up.html(html);
                This.check();
            }
        });
        $lis.on('swipeDown', function(e) {
            e.preventDefault();
            var $this = $(this);
            var html = $this.html();
            var index = $this.index() + 3;
            var $down = $lis.eq(index);
            if (index < 9 && $down.size() > 0) {
                $this.html($down.html());
                $down.html(html);
                This.check();
            }
        });

        $('#start').on('click', function() {
            This.randomImage(true);

            $(".js_has_start").removeClass("hide");
            $(".js_start").addClass("hide");
            if(This.isFirstPlay){
                This.isFirstPlay=false;
                $.jAlert({"tips":"滑动交换位置","timer":"2000"});
            }
            // This.resetData();
            This.countdown();
        });
        $('#reset').on('click', function() {
            
            // $(".js_start").removeClass("hide");
            // $(".js_has_start").addClass("hide");
            if(This.timeHandle) clearInterval(this.timeHandle);
            This.init();
        });

        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            slidesPerView: 4,
            paginationClickable: true,
        });
        $(".js_small_img").on("click",function(){
            var th=$(this);
            if(This.isPing){//正在拼
                $.Dialog({
                    cname:"owhat_dialog",
                    tips:"是否更换图片",
                    close_btn:false,
                    confirm_btn:true,//确认按钮
                    cancel_btn:true,//取消按钮
                    confirm_art:"确认",
                    cancel_art:"返回",
                    cancel_call:function(){
                        $.CloseDialog();
                    },
                    confirm_call:function(){
                        $.CloseDialog();
                       th.addClass("js_cur").parent(".swiper-slide").siblings().find("span").removeClass("js_cur");
                       This.level = th.attr("num");
                       This.init();          
                    }
                });                 
            }else{
                th.addClass("js_cur").parent(".swiper-slide").siblings().find("span").removeClass("js_cur");
                This.level = th.attr("num");
                This.init();              
            }
            This.imgsrc="http://www.mrzzfans.com/fang/"+(Number($(".js_cur").attr("num"))+1)+".png";
            $("#photo_share").attr("src",This.imgsrc);
        });
        $(".js_toshare").on("click",function(){
            if($.isWeiXin() || $.isQq() || $.isWeibo()){
                $(".share_mask").fadeIn(100);
            }else{
                $.jAlert({"tips":"请使用浏览器自带分享功能分享","timer":"2000"});
            }

        });
        $(".share_mask").on("click",function(){
            if($.isWeiXin() || $.isQq() || $.isWeibo()){
                $(".share_mask").fadeOut(100);
                $(".container").css("position","static");                
            }
        });
        $(".js_mark_close").on("click",function(){
            $(".js_haoran_mask").fadeOut(100);
            $(".container").css("position","static");
        });

        $(".swap_music").on("click",function(){
            var oAudio = document.getElementById('audio');
            if (oAudio.paused) {
                oAudio.play(); 
                $(".swap_music").addClass("rotate").addClass('icon_open').removeClass('ionc_close');
            }
            else {
                oAudio.pause(); 
                $(".swap_music").removeClass("rotate").addClass('ionc_close').removeClass('icon_open');

            }            
        })
    },
    
    countdown: function() {
        var This=this;
        This.isPing=true;
        $("#layer_mask").addClass("hide");
        if(This.timeHandle) clearInterval(this.timeHandle);
        var sec  = 0;
        This.timeHandle = setInterval(function() {
            sec += 1;
            $('.js_time').text(sec<10?"0"+sec:sec);
        }, 1000);
    },
    resetData: function() {
        var This=this;
        $(".js_time").text("00");
        This.isPing=false;
        if(This.timeHandle) clearInterval(this.timeHandle);
        $(".js_start").removeClass("hide");
        $(".js_has_start").addClass("hide"); 
        $("#layer_mask").removeClass("hide");
    },
    init: function() {
        var This=this;
        // $('#reset').prop('disabled', true);
        this.resetData();
        imgArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.render();
        This.isComplete=false;
    },
    render: function() {
        var This=this;
        image.src = this.levels[this.level].image+"?random="+Math.random()*1000;
        // image.crossOrigin = "*";
        image.onload = function() {
            This.randomImage();
        }
    },
    randomImage: function(flag) {
        var This=this;
        flag = flag || false;
        if (flag) {
            imgArr.sort(function(a, b) {
                return Math.random() - Math.random();
            });
        }
        var index = 1;
        for (var i=0; i<3; i++) {
            for (var j=0; j<3; j++) {
                ctx.drawImage(image, 297*j, 297*i, 297, 297, 0, 0, 297, 297);
                $lis.eq(imgArr[index-1]-1).find('img').data('seq', index).attr('src', canvas.toDataURL('image/jpeg'));
                index++;
            }
        }
    },
    check: function() {
        var This=this;
        var resArr = [];
        $('#gameBox img').each(function(k, v) {
            resArr.push(v.getAttribute("data-seq"));
        });
        if (resArr.join("") === oriArr.join("")) {
            setTimeout(function() {
                //This.isComplete = true;
                window.clearInterval(This.timeHandle);
                // if (This.level >= This.levels.length-1) {
                //     alert("哇塞,你居然通关了,好棒!");
                //     This.destory();
                // } else {
                    $(".js_haoran_mask").fadeIn(100);
                    $(".container").css("position","fixed");
                    This.timeSum=$(".js_time").text()
                    $(".js_time_mask").html(This.timeSum);
                    $(".js_haoranimg").attr("src","images/chang/"+(Number($(".js_cur").attr("num"))+1)+".png");
                    This.title='我用时'+This.timeSum+'秒，为刘昊然拼了';
                    This.init();
                    This.isComplete=true;
                // }
            }, 300);
        }
    },
    // update: function() {
    //     if (this.isComplete === false) {
    //         alert("时间到,游戏结束!");
    //         $('#layer').show();
    //         $('#start').html("再来一次");
    //         $('#reset').prop('disabled', true);
    //     }
    // },
    destory: function() {
        // $('#reset').prop('disabled', true);
        $lis.off("swipeLeft");
        $lis.off("swipeRight");
        $lis.off("swipeUp");
        $lis.off("swipeDown");
        $lis.css('border', 0);
        $gameBox.css('border', 0);
    },
    title:'来！一起拼出刘昊然20岁的模样',
    imgsrc:"http://www.mrzzfans.com/fang/"+(Number($(".js_cur").attr("num"))+1)+".png",
    initWeixin:function(){
        var This=this;
        // var title='我用'+This.timeSum+'';
        var title='来！一起拼出刘昊然20岁的模样';
        var summary='解锁刘昊然20岁的模样，360度线上看刘昊然个人摄影展';
        var url=window.location.href;
        var data={};
        data.pageurl=url;
        var josndata=$.apiInit($.apimap,"findweixinsignature",data);
        //请求后台获取详情
        $.owhatXHR({
            data:josndata,
            success:function(back){
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: back.data.appid, // 必填，公众号的唯一标识
                    timestamp:back.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: back.data.noncestr, // 必填，生成签名的随机串
                    signature: back.data.signature,// 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function(){
                    wx.onMenuShareTimeline({//分享到朋友圈
                        title: This.title, // 分享标题
                        link: url, // 分享链接
                        // imgUrl: 'https://mtest2.owhat.cn/activity/goddess/assets/images/share_img.jpg', // 分享图标
                        imgUrl: This.imgsrc, // 分享图标
                        trigger:function (res) { 
                            this.title=This.isComplete ?  '我用时'+This.timeSum+'秒，为刘昊然拼了' : '来！一起拼出刘昊然20岁的模样';
                            this.imgUrl="http://www.mrzzfans.com/fang/"+(Number($(".js_cur").attr("num"))+1)+".png";
                        },
                        success: function (back) { 
                            // 用户确认分享后执行的回调函数
                            // var data={};
                            // data.channel=4;
                            // data.userid=$.fp1().get();
                            // data.id=Number($(".js_cur").attr("num")+1);
                            // $.owhatXHR({//获取列表
                            //     path:"c_acitivity_share",
                            //     data:data,
                            //     success:function(back){
                            //         var call=function(){
                            //             $(".share_mask").fadeOut();
                            //             $(".js_haoran_mask").fadeOut();
                            //             $(".container").css("position","static");
                            //             $(".js_reset").trigger("click");
                            //         }
                            //         This.initDetail(call);

                            //     }
                            // });  
                        },
                        cancel: function () { 
                            // 用户取消分享后执行的回调函数
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: This.title, // 分享标题
                        desc: summary, // 分享描述
                        link: url, // 分享链接
                        // imgUrl: 'https://mtest2.owhat.cn/activity/goddess/assets/images/share_img.jpg', // 分享图标
                        imgUrl: This.imgsrc, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        trigger:function (res) { 
                            this.title=This.isComplete ?  '我用时'+This.timeSum+'秒，为刘昊然拼了' : '来！一起拼出刘昊然20岁的模样';
                            this.imgUrl="http://www.mrzzfans.com/fang/"+(Number($(".js_cur").attr("num"))+1)+".png";
                        },
                        success: function () { 
                            // 用户确认分享后执行的回调函数
                            // var data={};
                            // data.channel=4;
                            // data.userid=$.fp1().get();
                            // data.id=Number($(".js_cur").attr("num"))+1;
                            // $.owhatXHR({//获取列表
                            //     path:"c_acitivity_share",
                            //     data:data,
                            //     success:function(back){
                            //         var call=function(){
                            //             $(".share_mask").fadeOut();
                            //             $(".js_haoran_mask").fadeOut();
                            //             $(".container").css("position","static");
                            //             $(".js_reset").trigger("click");
                            //         }
                            //         This.initDetail(call);
                            //     }
                            // });  
                        },
                        cancel: function () { 
                            // 用户取消分享后执行的回调函数
                        }

                    });
                });
                wx.error(function(data){
                    // alert(JSON.stringify(data));
                });
            }
        });
    }

}

// window.Draw = new OWHAT.WWW();
var inter=setInterval(function(){
    if(isload){
        OWHAT.start();
        clearInterval(inter);
        inter=null;
    }
},100);
