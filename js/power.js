var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.handleBackButton, false);
        document.addEventListener("backbuttondown", this.handleBackButtonDown, false);
        document.addEventListener("resume", this.handleresume, false);
        document.addEventListener("pause", this.handlepause, false);
    },
    handleresume: function() {
        console.log("===========================resume==========");
    },
    handlepause: function() {
        console.log("===========================pause==========");
    },
    handleBackButton: function() {
    },
    handleBackButtonDown: function() {
        if($("#errortoast").css("display") == "block"){
            hideToast();
        }else{
            exit()
        }
    },

    onDeviceReady: function() {
        cordova.require("coocaaosapi");
        app.receivedEvent('deviceready');
        app.triggleButton();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelectorAll('.received');
        // listeningElement.setAttribute('style', 'display:none;');
        for (var i = 0, j = receivedElement.length; i < j; i++) {
            // receivedElement[i].setAttribute('style', 'display:block;');
        }
        /*receivedElement.setAttribute('style', 'display:block;');*/

        console.log('Received Event: ' + id);
        coocaaosapi.getDeviceInfo(function(message) {
            deviceInfo = message;
            console.log("deviceinfo=============="+JSON.stringify(deviceInfo))
            macAddress = message.mac;
            TVmodel = message.model;
            TVchip = message.chip;
            activityId = message.activeid;
            if (message.emmcid ==""||message.emmcid==null) {
                emmcId = "654321";
            } else{
                emmcId = message.emmcid;
            }
            startPage();
        }, function(error) { console.log("get deviceinfo error") })
    },
    triggleButton: function() {
        cordova.require("coocaaosapi");
    }
};

app.initialize();

function exit() {
    navigator.app.exitApp();
}

function initMap(setFocus) {
    initBtn();
    map = new coocaakeymap($(".coocaabtn"), $(setFocus), "btnFocus", function() {}, function(val) {}, function(obj) {});
}
function initBtn() {
    $("#citybtn").unbind("itemClick").bind("itemClick",function () {
        if(btnFrom == "gohome"){
            var landstatus = 0;
            if(loginstatus == "true"){landstatus = 1;}
            var activitystatus = 1;
            if(gameStatus == "wait"){activitystatus = 0}
            sentLog("nalm_channel_task_page_button_onclick",'{"module_type":"'+comefrom+'","button_name":"1","activity_status":"'+activitystatus+'","login_status":"'+landstatus+'"}');
            coocaaosapi.startNewBrowser(mainurl,function(){},function(){});
        }else if(btnFrom == "gogift"){
            var landstatus = 0;
            if(loginstatus == "true"){landstatus = 1;}
            var activitystatus = 1;
            if(gameStatus == "wait"){activitystatus = 0}
            sentLog("nalm_channel_task_page_button_onclick",'{"module_type":"'+comefrom+'","button_name":"0","activity_status":"'+activitystatus+'","login_status":"'+landstatus+'"}');
            coocaaosapi.startNewBrowser2(awardurl+activitystatus,function(){},function(){});
        }
    })

    $("#goindex").unbind("itemClick").bind("itemClick",function () {
        var landstatus = 0;
        if(loginstatus == "true"){landstatus = 1;}
        var activitystatus = 1;
        if(gameStatus == "wait"){activitystatus = 0}
        sentLog("nalm_channel_task_page_button_onclick",'{"module_type":"'+comefrom+'","button_name":"2","activity_status":"'+activitystatus+'","login_status":"'+landstatus+'"}');
        coocaaosapi.startNewBrowser(mainurl+"?goto=shop",function(){},function(){});
    })

    $(".pkg").unbind("itemClick").bind("itemClick",function () {
        var newaction = false;
        var newhomeaction = false;
        var param = "";
        var pageid = $(this).attr("pageid");
        var pagename = $(this).attr("name");
        var pagetype = $(this).attr("type");
        if(pagetype == "99"){
            pagetype = 1;
            param = "pTopicCode";
            newaction = true;
        }else if(pagetype == "66"){
            pagetype = 0;
            param = "topicCode";
            newhomeaction = true;
        }else{}
        sentLog("nalm_channel_task_page_content_onclick",'{"module_type":"'+pagetype+'","content_id":"'+pageid+'","content_name":"'+pagename+'"}');
        if(newaction){
            newaction = false;
            if(cAppVersion < 3300000){
                $("#errortoast").show();
                map = new coocaakeymap($("#errortoast"), $("#errortoast"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                setTimeout(hideToast,3000);
            }else{
                coocaaosapi.startVideospecial(param,pageid,function(){},function(){});
            }
        }else if(newhomeaction){
            newhomeaction = false;
            coocaaosapi.startMovieHomeSpecialTopic(pageid,function(){exit()},function(){});
        }else{
            coocaaosapi.startMovieDetail(pageid,function(){},function(){});
        }
    })

    $(".shop").unbind("itemClick").bind("itemClick",function () {
        var pageid = $(this).attr("pageid");
        var pagename = $(this).attr("name");
        var pagetype = $(this).attr("type");
        sentLog("nalm_channel_task_page_content_onclick",'{"module_type":"'+pagetype+'","content_id":"'+pageid+'","content_name":"'+pagename+'"}');
        coocaaosapi.startAppShopDetail(pageid,function(){},function(){});
    })
}
function hideToast() {
    $("#errortoast").hide();
    map = new coocaakeymap($(".coocaabtn"), $(".pkg:eq(3)"), "btnFocus", function() {}, function(val) {}, function(obj) {});
}

//页面初始化或刷新
function startPage() {
    $.ajax({
        type: "get",
        async: true,
        url: adressIp + "/light/active/tv/source",
        data: {MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId,cSize:deviceInfo.panel,cChannel:"coocaa",aSdk:deviceInfo.androidsdk,cTcVersion:deviceInfo.version.replace(/\.*/g,""),cBrand:deviceInfo.brand},
        dataType: "jsonp",
        jsonp: "callback",
        success: function(data) {
            console.log("返回状态：" + JSON.stringify(data));
            if(data.code == 0){
                if (data.data.source == "tencent"){needQQ = true};
                hasLogin(needQQ,false);
                var fromTab = getUrlParam("from");
                if(fromTab == "mall"){
                    comefrom = 2;
                    $("#deviceready").css("background","url('http://sky.fs.skysrt.com/statics/webvip/webapp/national/power/finalmallbg.jpg')")
                    $("#mallbox").show();
                    initMap(".shop:eq(0)")
                    initPkg(_mallinfo,"mall");
                }else{
                    $("#moviebox").show();
                    initMap(".pkg:eq(0)")
                    if(fromTab == "edu"){
                        comefrom = 1;
                        initPkg(_eduinfo,"movie");
                    }else if(data.data.source == "tencent"){
                        initPkg(_tencentinfo,"movie");
                    }else {
                        initPkg(_yinheinfo,"movie");
                    }
                }
            }
            lightCityApi(null,null,"A002");
        },
        error: function(error) {
            console.log("-----------访问失败---------"+JSON.stringify(error));
        }
    });
}

function initPkg(data,type){
    for(var i=1;i<=6;i++){
        var name = "pkg"+i;
        if(type == "movie"){
            $(".pkg:eq("+(i-1)+") img").attr("src",data[name].img);
            $(".pkg:eq("+(i-1)+")").attr("pageid",data[name].id);
            $(".pkg:eq("+(i-1)+")").attr("name",data[name].name);
            $(".pkg:eq("+(i-1)+")").attr("type",data[name].type);
        }else{
            $(".shop:eq("+(i-1)+") img").attr("src",data[name].img);
            $(".shop:eq("+(i-1)+")").attr("pageid",data[name].id);
            $(".shop:eq("+(i-1)+")").attr("name",data[name].name);
            $(".shop:eq("+(i-1)+")").attr("type",data[name].type);
        }
    }
}