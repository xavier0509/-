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
        listenUser();
        if(needSentUserLog){
            needSentUserLog = false;
            sentLog("nalm_account_landing_result",'{"landing_result":"0"}');
            hasLogin(needQQ,false);
        }
        if (needFresh) {
            needFresh = false;
            showPage(false,true);
        } else {}
    },
    handlepause: function() {
        console.log("===========================pause==========");
    },
    handleBackButton: function() {

    },
    handleBackButtonDown: function() {
        if($("#toast2").css("display") == "block"){
            $("#blackbg").hide();
            $("#toast2").hide();
            initMap("#city"+rememberMapFocus);
        } else if($("#blackbg").css("display") == "block"){

        }else if($("#moreChance").css("display") == "block"){
            if(exitWeb){
                exitWeb = false;
                exit();
            }else{
                $("#moreChance").hide();
                $("#mainMap").show();
                needRememberFocus = true;
                rememberFocus = "#morecard";
                showPage(false,true);
            }
        }else if($("#strategyPage").css("display") == "block"){
            $("#strategyPage").hide();
            $("#mainMap").show();
            map = new coocaakeymap($(".coocaabtn"),$("#strategy"),"btnFocus", function() {}, function(val) {}, function(obj) {});
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
            if (deviceInfo.version < '6') {
                android.getPropertiesValue("persist.service.homepage.pkg", function(data) {
                    var val = data.propertiesValue;
                    if ("com.tianci.movieplatform" == val) {
                        startActionReplace = "coocaa.intent.action.HOME.Translucent";
                    } else {
                        startActionReplace = "coocaa.intent.movie.home";
                    }
                });
            }
            console.log("deviceinfo=============="+JSON.stringify(deviceInfo))
            macAddress = message.mac;
            TVmodel = message.model;
            TVchip = message.chip;
            activityId = message.activeid;
            if (message.emmcid ==""||message.emmcid==null) {
                emmcId = "";
            } else{
                emmcId = message.emmcid;
            }
            var a ={MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId,cSize:message.panel,cChannel:"coocaa"};
            console.log("data====="+JSON.stringify(a))
            $.ajax({
                type: "get",
                async: true,
                url: adressIp + "/light/active/tv/source",
                data: {MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId,cSize:message.panel,cChannel:"coocaa",aSdk:message.androidsdk,cTcVersion:message.version.replace(/\.*/g,""),cBrand:message.brand},
                dataType: "jsonp",
                jsonp: "callback",
                // timeout: 20000,
                success: function(data) {
                    console.log("返回状态：" + JSON.stringify(data));
                    if(data.code == 0){
                        movieSource = data.data.source;
                        if(movieSource == "tencent"){
                            needQQ = true;
                        }
                    }
                    hasLogin(needQQ,true);

                    listenUser();
                    listenPay();
                    listenCommon();
                },
                error: function(error) {
                    console.log("-----------访问失败---------"+JSON.stringify(error));
                }
            });
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
    $(setFocus).trigger("itemFocus");
    if(needgotoshop){
        needgotoshop = false;
        $("#morecard").trigger("itemClick");
    }

}
function initBtn() {
    $(".city").unbind("itemFocus").bind("itemFocus",function(){
        $(".city").removeClass("focus");
        $(this).addClass("focus");
        $(".citycard").hide();
        var _thisIndex = $(".city").index($(this));
        rememberMapFocus = _thisIndex;
        $(".citycard:eq("+_thisIndex+")").show();
        map = new coocaakeymap($(".coocaabtn"), $(".citycard:eq("+_thisIndex+") .cityBtn"), "btnFocus", function() {}, function(val) {}, function(obj) {});
        if(needFresh){
            needRememberFocus = true;
            rememberFocus = ".city:eq("+_thisIndex+")";
            needFresh = false;
            showPage(false,false);
        }
    })

    $(".rightBtn").unbind("itemFocus").bind("itemFocus",function(){
        $(".city").removeClass("focus");
        // $(".citycard").hide();
        $(".rightBtn").attr("leftTarget","#city"+rememberMapFocus);
        console.log("========"+$(this).attr("id"))
        if(needFresh){
            needRememberFocus = true;
            rememberFocus = "#"+$(this).attr('id');
            needFresh = false;
            showPage(false,false);
        }
    })

    $(".cityBtn").unbind("itemClick").bind("itemClick",function(){
        if(gameStatus == "wait"){
            return;
        }
        var _thisIndex = $(".cityBtn").index($(this));
        var thisObj = this;
        if(remainNum > 0){
            if($(this).attr("class").indexOf("hasLight") == -1){
                var landstatus = 0;
                if(loginstatus == "true"){landstatus = 1;}
                var activitystatus = 1;
                if(gameStatus == "wait"){activitystatus = 0}
                sentLog("nalm_view_card_page_button_onclick",'{"button_name":"1","activity_status":"'+activitystatus+'","login_status":"'+landstatus+'"}');
                console.log("未点亮，即将点亮");
                console.log("用户点击，记录需要点亮的城市卡");
                $.ajax({
                    type: "GET",
                    async: true,
                    url: adressIp + "/light/u/"+actionId+"/push/city",
                    data: {id:actionId, MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId,cityKey:"city"+(_thisIndex+1)},
                    dataType: "jsonp",
                    jsonp: "callback",
                    success: function(data) {
                        console.log("---------------rememberCity----result-----------------------------"+JSON.stringify(data));
                        if (data.code == 50100) {
                            //当前是否第一次游戏---是，点亮发放礼品接口
                            if(totalNum == 0){
                                lightCityApi(thisObj,_thisIndex,"A001",thisObj.parentNode);
                            }else{
                                console.log("有机会，做任务即可点亮");
                                _listenObj = thisObj;
                                _listenNum = _thisIndex;
                                _listenType = "A001";
                                _listenParent = thisObj.parentNode;
                                startMission(thisObj);
                            }
                        } else {}
                    },
                    error: function(error) {
                        console.log("--------访问失败" + JSON.stringify(error));
                    }
                });
            }else{
                console.log("已经点亮"+forNum);
                if(forNum == 15){
                    needFresh = false;
                    // $("#gotoLottery").trigger("itemClick");
                    needFresh = true;
                    needRememberFocus = true;
                    rememberFocus = "#gotoLottery";
                    coocaaosapi.removeUserChanggedListener(function(){});
                    coocaaosapi.startNewBrowser(drawurl,function(){},function(){});
                    var landstatus = 0;
                    if(loginstatus == "true"){landstatus = 1;}
                    var activitystatus = 1;
                    if(gameStatus == "wait"){activitystatus = 0}
                    sentLog("nalm_view_card_page_button_onclick",'{"button_name":"4","activity_status":"'+activitystatus+'","login_status":"'+landstatus+'"}');
                }else{
                    var needGotoNextCity = _thisIndex;
                    for(var i=0;i<15;i++){
                        if($("#city"+i).attr("class").indexOf("hasLight") == -1){
                            needGotoNextCity = i;
                            break;
                        }else{}
                    }
                    initMap(".city:eq("+needGotoNextCity+")");
                    var landstatus = 0;
                    if(loginstatus == "true"){landstatus = 1;}
                    var activitystatus = 1;
                    if(gameStatus == "wait"){activitystatus = 0}
                    sentLog("nalm_view_card_page_button_onclick",'{"button_name":"2","activity_status":"'+activitystatus+'","login_status":"'+landstatus+'"}');
                }
            }
        }else{
            if(forNum == 15){
                needFresh = true;
                needRememberFocus = true;
                rememberFocus = "#gotoLottery";
                var landstatus = 0;
                if(loginstatus == "true"){landstatus = 1;}
                var activitystatus = 1;
                if(gameStatus == "wait"){activitystatus = 0}
                sentLog("nalm_main_page_button_onclick",'{"button_name":"4","activity_status":"'+activitystatus+'","login_status":"'+landstatus+'"}');
                coocaaosapi.removeUserChanggedListener(function(){});
                coocaaosapi.startNewBrowser(drawurl,function(){},function(){});
            }else{
                console.log("没有机会，需要购买!");
                // $("#morecard").trigger("itemClick");
                $("#mainMap").hide();
                $("#moreChance").show();
                if(needQQ){
                    for(var i=1;i<=4;i++){
                        var name = "pkg"+i;
                        $(".moviePkg:eq("+(i-1)+") img").attr("src",_tencentPkginfo[name].img);
                        $(".moviePkg:eq("+(i-1)+")").attr("productid",_tencentPkginfo[name].product_id);
                        $(".moviePkg:eq("+(i-1)+")").attr("price",_tencentPkginfo[name].price);
                        $(".moviePkg:eq("+(i-1)+")").attr("type",_tencentPkginfo[name].type);
                        $(".moviePkg:eq("+(i-1)+")").attr("name",_tencentPkginfo[name].name);
                    }
                }else{
                    for(var i=1;i<=4;i++){
                        var name = "pkg"+i;
                        $(".moviePkg:eq("+(i-1)+") img").attr("src",_yinhePkginfo[name].img);
                        $(".moviePkg:eq("+(i-1)+")").attr("productid",_yinhePkginfo[name].product_id);
                        $(".moviePkg:eq("+(i-1)+")").attr("price",_yinhePkginfo[name].price);
                        $(".moviePkg:eq("+(i-1)+")").attr("type",_yinhePkginfo[name].type);
                        $(".moviePkg:eq("+(i-1)+")").attr("name",_yinhePkginfo[name].name);
                    }
                }
                map = new coocaakeymap($(".coocaabtn2"),null,"btnFocus", function() {}, function(val) {}, function(obj) {});
                var landstatus = 0;
                if(loginstatus == "true"){landstatus = 1;}
                var activitystatus = 1;
                if(gameStatus == "wait"){activitystatus = 0}
                sentLog("nalm_view_card_page_button_onclick",'{"button_name":"3","activity_status":"'+activitystatus+'","login_status":"'+landstatus+'"}');
                sentLog("web_page_show_new",'{"page_name":"nalm_buy_for_view_card_page","activity_status":"'+activitystatus+'","login_status":"'+landstatus+'"}');
            }
        }
    })

    $("#strategy").unbind("itemClick").bind("itemClick",function(){
       $("#mainMap").hide();
       $("#strategyPage").show();
        var landstatus = 0;
        if(loginstatus == "true"){landstatus = 1;}
        var activitystatus = 1;
        if(gameStatus == "wait"){activitystatus = 0}
        sentLog("nalm_main_page_button_onclick",'{"button_name":"money_strategyl","activity_status":"'+activitystatus+'","login_status":"'+landstatus+'"}');
        sentLog("web_page_show_new",'{"page_name":"nalm_money_strategy_page","activity_status":"'+activitystatus+'","login_status":"'+landstatus+'"}');
        map = new coocaakeymap($(".coocaabtn3"),$("#tips"),"btnFocus", function() {}, function(val) {}, function(obj) {});
        $("#tips").trigger("itemFocus");
    })
    var tab = null;
    $("#tips").unbind("itemFocus").bind("itemFocus",function(){
        $("#rulebox").hide();
        $("#tipsbox").show();
        tab = "#tips";
        $("#tips").addClass("focus");
        $("#rule").removeClass("focus");
        map = new coocaakeymap($(".coocaabtn3"),$("#tips"),"btnFocus", function() {}, function(val) {}, function(obj) {});
    })

    $("#rule").unbind("itemFocus").bind("itemFocus",function(){
        $("#rulebox").show();
        $("#tipsbox").hide();
        tab = "#rule";
        $("#rule").addClass("focus");
        $("#tips").removeClass("focus");
        map = new coocaakeymap($(".coocaabtn3"),$("#rule"),"btnFocus", function() {}, function(val) {}, function(obj) {});
    })

    $(".wordbox").unbind("itemFocus").bind("itemFocus",function(){
       $(".wordbox").attr("upTarget",tab);
       $(".wordbox").attr("rightTarget","#rule");
       $(".wordbox").attr("leftTarget","#tips");
    })

    $("#gotoLottery").bind("itemFocus",function(){
        $("#cityNum").css("top","429px");
    })
    $("#gotoLottery").bind("itemBlur",function(){
        $("#cityNum").css("top","427px");
    })
    $("#gotoLottery").unbind("itemClick").bind("itemClick",function(){
        needFresh = true;
        needRememberFocus = true;
        rememberFocus = "#gotoLottery";
        var landstatus = 0;
        if(loginstatus == "true"){landstatus = 1;}
        var activitystatus = 1;
        if(gameStatus == "wait"){activitystatus = 0}
        sentLog("nalm_main_page_button_onclick",'{"button_name":"draw_lottery","activity_status":"'+activitystatus+'","login_status":"'+landstatus+'"}');
        coocaaosapi.removeUserChanggedListener(function(){});
       coocaaosapi.startNewBrowser(drawurl,function(){},function(){});
    })
    $("#myGift,#myGift2").unbind("itemClick").bind("itemClick",function(){
        needFresh = true;
        needRememberFocus = true;
        rememberFocus = "#myGift";
        var landstatus = 0;
        if(loginstatus == "true"){landstatus = 1;}
        var activitystatus = 1;
        if(gameStatus == "wait"){activitystatus = 0}else if(gameStatus == "end"){activitystatus = 2}
        sentLog("nalm_main_page_button_onclick",'{"button_name":"my_award","activity_status":"'+activitystatus+'","login_status":"'+landstatus+'"}');
        coocaaosapi.removeUserChanggedListener(function(){});
       coocaaosapi.startNewBrowser(awardurl+activitystatus,function(){},function(){});
    })

    $("#morecard").unbind("itemClick").bind("itemClick",function(){
       $("#mainMap").hide();
       $("#moreChance").show();
        var landstatus = 0;
        if(loginstatus == "true"){landstatus = 1;}
        var activitystatus = 1;
        if(gameStatus == "wait"){activitystatus = 0}
        if(getUrlParam("goto")!="shop"){
            sentLog("nalm_main_page_button_onclick",'{"button_name":"more_chance","activity_status":"'+activitystatus+'","login_status":"'+landstatus+'"}');
        }
        sentLog("web_page_show_new",'{"page_name":"nalm_buy_for_view_card_page","activity_status":"'+activitystatus+'","login_status":"'+landstatus+'"}');
       if(needQQ){
            for(var i=1;i<=4;i++){
                var name = "pkg"+i;
                $(".moviePkg:eq("+(i-1)+") img").attr("src",_tencentPkginfo[name].img);
                $(".moviePkg:eq("+(i-1)+")").attr("productid",_tencentPkginfo[name].product_id);
                $(".moviePkg:eq("+(i-1)+")").attr("price",_tencentPkginfo[name].price);
                $(".moviePkg:eq("+(i-1)+")").attr("type",_tencentPkginfo[name].type);
                $(".moviePkg:eq("+(i-1)+")").attr("name",_tencentPkginfo[name].name);
            }
       }else{
           for(var i=1;i<=4;i++){
               var name = "pkg"+i;
               $(".moviePkg:eq("+(i-1)+") img").attr("src",_yinhePkginfo[name].img);
               $(".moviePkg:eq("+(i-1)+")").attr("productid",_yinhePkginfo[name].product_id);
               $(".moviePkg:eq("+(i-1)+")").attr("price",_yinhePkginfo[name].price);
               $(".moviePkg:eq("+(i-1)+")").attr("type",_yinhePkginfo[name].type);
               $(".moviePkg:eq("+(i-1)+")").attr("name",_yinhePkginfo[name].name);
           }
       }
        map = new coocaakeymap($(".coocaabtn2"),null,"btnFocus", function() {}, function(val) {}, function(obj) {});
    })

    $(".moviePkg").unbind("itemClick").bind("itemClick",function(){
        console.log("loginStatus================="+loginstatus);
        var pageid = $(this).attr("productid");
        var pagename = $(this).attr("name");
        var pagetype = $(this).attr("type");
        sentLog("nalm_buy_for_view_card_page_content_onclick",'{"module_type":"'+pagetype+'","content_id":"'+pageid+'","content_name":"'+pagename+'"}');
        if(loginstatus == "true"){
            var pageid = $(this).attr("productid");
            var pagename = $(this).attr("name");
            var pagetype = $(this).attr("type");
            sentLog("nalm_buy_for_view_card_pay_arouse",'{"module_type":"'+pagetype+'","content_id":"'+pageid+'","content_name":"'+pagename+'"}');
            order($(this).attr("productid"),$(this).attr("price"));
        }else{
            sentLog("nalm_account_landing_page_exposure",'{"page_name":"nalm_buy_for_view_card_page"}');
            startLogin(needQQ);
        }
    })

    $(".qmallPkg").unbind("itemClick").bind("itemClick",function () {
        var pageid = $(this).attr("pageid");
        var pagename = $(this).attr("name");
        var pagetype = $(this).attr("type");
        sentLog("nalm_buy_for_view_card_page_content_onclick",'{"module_type":"'+pagetype+'","content_id":"'+pageid+'","content_name":"'+pagename+'"}');
        coocaaosapi.startAppShopDetail(pageid,function(){},function(){});
    })
    $("#toastbtn1").unbind("itemClick").bind("itemClick",function () {
        $("#blackbg").hide();
        $("#toast2").hide();
        needFresh = true;
        needRememberFocus = true;
        rememberFocus = "#gotoLottery";
        coocaaosapi.removeUserChanggedListener(function(){});
        coocaaosapi.startNewBrowser(drawurl,function(){},function(){});
    })

    $("#toastbtn2").unbind("itemClick").bind("itemClick",function () {
        $("#blackbg").hide();
        $("#toast2").hide();
        initMap("#city"+rememberMapFocus);
    })

    $("#moreMovie").unbind("itemClick").bind("itemClick",function () {
        var landstatus = 0;
        if(loginstatus == "true"){landstatus = 1;}
        sentLog("nalm_buy_for_view_card_page_button_onclick",'{"button_name":"0","login_status":"'+landstatus+'"}');
        if(needQQ){
            coocaaosapi.startMovieMemberCenter("0","5",function(){exit()},function(){})
        }else{
            coocaaosapi.startMovieMemberCenter("0","1",function(){exit()},function(){})
        }
    })

    $("#moreEdu").unbind("itemClick").bind("itemClick",function () {
        var landstatus = 0;
        if(loginstatus == "true"){landstatus = 1;}
        sentLog("nalm_buy_for_view_card_page_button_onclick",'{"button_name":"1","login_status":"'+landstatus+'"}');
        coocaaosapi.startMovieMemberCenter("1","",function(){exit()},function(){})
    })

    $("#moreMall").unbind("itemClick").bind("itemClick",function () {
        var landstatus = 0;
        if(loginstatus == "true"){landstatus = 1;}
        sentLog("nalm_buy_for_view_card_page_button_onclick",'{"button_name":"2","login_status":"'+landstatus+'"}');
        coocaaosapi.startHomeCommonList("10168",function(){exit()},function(){})
    })
}

function order(productid,price) {
    console.log("-------------"+productid+"============"+price);
    var data = JSON.stringify({
        user_id: access_token, //accesstoken
        user_flag: 1,
        third_user_id: qqtoken,
        product_id: productid, //需改
        movie_id: "",
        node_type: "res",
        client_type: 1,
        title: "国庆套餐包",
        price: price, //需改
        count: 1,
        discount_price: "", //需改
        coupon_codes: "",
        auth_type: 0,
        mac: macAddress,
        chip: TVchip,
        model: TVmodel,
        extend_info: { "login_type": login_type, "wx_vu_id": vuserid },
    })
    var data1 = encodeURIComponent(data);
    console.log(data);
    $.ajax({
        type: "get",
        async: true,
        url: "https://api-business.skysrt.com/v3/order/genOrderByJsonp.html?data=" + data1, //需改
        dataType: "jsonp",
        jsonp: "callback",
        timeout: 20000,
        success: function(data) {
            console.log("返回状态：" + JSON.stringify(data));
            if (data.code == 0) {
                orderId = data.data.orderId;
                console.log("订单编号1：" + orderId);
                coocaaosapi.purchaseOrder2(data.data.appcode, data.data.orderId, data.data.orderTitle, data.data.back_url, data.data.total_pay_fee, "虚拟", "com.webviewsdk.action.pay", "pay", access_token, mobile,
                    function(success){console.log("----------startpaysuccess------------" + success);},
                    function(error){console.log(error);});
            } else {
                console.log("-----------异常---------" + data.msg);
            }
        },
        error: function() {
            console.log("-----------访问失败---------");
        }
    });
}

//监听账户状态变化
function listenUser() {
    coocaaosapi.addUserChanggedListener(function(message) {
        console.log("账户状态变化")
        //刷新前的逻辑判断
        needSentUserLog = true;
    });
}

//监听支付状态
function listenPay() {
    coocaaosapi.addPurchaseOrderListener(function(message) {
        console.log("xjr----------->startpurcharse message  支付结果 " + JSON.stringify(message));
        if (message.presultstatus == 0) {
            sentLog("nalm_buy_for_view_card_pay_result",'{"pay_result":"1"}');
        }else{
            sentLog("nalm_buy_for_view_card_pay_result",'{"pay_result":"0"}');
        }
    });
}

//通用播放器监听
function listenCommon() {
    coocaaosapi.addCommonListener(function(message) {
        console.log("addCommonListener==" + JSON.stringify(message));
        if(message.web_player_event == "on_complete") {
            lightCityApi(_listenObj,_listenNum,_listenType,_listenParent);
        }
    })
}

function startMission(obj) {
    if($(obj).attr("missionType") == "page"){
        if(cAppVersion < 3300001){
            coocaaosapi.startHomeCommonList($(obj).attr("missionId"),function(msg){exit()},function(error){});
        }else{
            coocaaosapi.startHomeTab(startActionReplace,$(obj).attr("missionId"),function(msg){exit()},function(error){})
        }
    }else  if($(obj).attr("missionType") == "video"){
        coocaaosapi.startCommonWebview("", $(obj).attr("missionUrl"), "观看精彩视频点亮城市卡", "", "", "", "视频广告", "", function(message) {
            console.log(message);
        }, function(error) {
            console.log("commonTask----error")
        });
    }
}

function initGameStatus() {
    console.log("has Light city=="+lightCity);
    $("#strategy").attr("upTarget","");
    $("#myGift").attr("upTarget","");
    $("#myGift").attr("upTarget","");
    if(gameStatus == "end"){
        $("#mainMap").hide();
        $("#endPage").show();
        $("#myGift2").show();
        initBtn();
        map = new coocaakeymap($("#myGift2"), $("#myGift2"), "btnFocus", function() {}, function(val) {}, function(obj) {});
    }else{
        $("#mainMap").show();
        $("#lefttips").show();
        $("#endPage").hide();
        for(var i=0; i<15; i++){
            $("#city"+i).removeClass("hasLight");
            $("#cityCard"+i+" .cityBtn").html("我要点亮");
            $("#cityCard"+i+" .cityBtn").attr("leftTarget","#city"+i);
            $("#cityCard"+i+" .cityWord").html("<span class='word1'><b>欢迎来到</b></span><br>"+_powerData["city"+(i+1)].name);
            if(lightCity.indexOf("city"+i) != -1){
                forNum += 1 ;
                console.log("---------"+i);
                $("#city"+i).addClass("hasLight");
                $("#cityCard"+i+" .cityBtn").addClass("hasLight");
                $("#cityCard"+i+" .cityBtn").html("继续点亮");
                $("#cityCard"+(i)+" .cityImg img").attr("src",_powerData["city"+(i+1)].lightimg);
                if(cityNum<3){
                    $("#cityCard"+i+" .cardTitle").html("累计点亮3张");
                    $("#cityCard"+i+" .cityBottom").html("<span class='lightmoney'>有机会领1000元现金！</span>");
                }else if(cityNum>=7){
                    $("#cityCard"+i+" .cardTitle").html("累计点亮15张");
                    $("#cityCard"+i+" .cityBottom").html("<span class='lightmoney'>有机会领10000元现金！</span>");
                }else{
                    $("#cityCard"+i+" .cardTitle").html("累计点亮7张");
                    $("#cityCard"+i+" .cityBottom").html("<span class='lightmoney'>有机会领5000元现金！</span>");
                }

            }else{
                $("#cityCard"+(i)+" .cityImg img").attr("src",_powerData["city"+(i+1)].img);
                if(needRememberFocus){
                    setFocusFirst = true;
                    needRememberFocus = false;
                    initMap(rememberFocus);
                }else{
                    if(!setFocusFirst){
                        setFocusFirst = true;
                        initMap(".city:eq("+i+")");
                    }else{

                    }
                }
            }
        }
        if(remainNum == 0){
            $(".cityBtn").html("更多景点卡");
            $(".cardTitle").html("今日点亮机会已用完");
            $(".cityBottom").html("<span class='nochancename'>快获得更多机会，冲刺万元现金大奖！</span>");
        }

        if(totalNum == 0){
            $(".cityBtn").html("我要点亮");
            $(".cardTitle").html("点亮景点可领现金/实物奖励");
            $(".cityBottom").html("<span class='immediatelyname'>累计点亮3张还有机会赢1000元大奖！</span>");
        }
        if(forNum == 15){
            $(".cardTitle").html("即刻抽取万元现金");
            $(".cityBottom").html("<span class='finishlightname'>获得赢取10000元现金的机会！</span>");
            $(".cityBtn").html("抽万元现金");
            initMap("#city0");
            initMap("#gotoLottery");
        }
        if(needShowWindow){
            needShowWindow = false;
            $("#blackbg").show();
            $("#toast2").show();
            $("#nowhave").html(cityNum);
            map = new coocaakeymap($(".toastbtn"),null,"btnFocus", function() {}, function(val) {}, function(obj) {});
        }
        if(gameStatus == "wait"){
            $("#gotoLottery").hide();
            $("#morecard").hide();
            $("#myGift").hide();
            $("#cityNum").hide();
            $("#remainNum").hide();
            $("#strategy").show();
            $("#strategy").attr("upTarget","#strategy");
            $(".cityBtn").html("29日0点开启");
            $(".cardTitle").html("点亮景点可领现金/实物奖励");
            $(".cityBottom").html("<span class='finishlightname'>活动即将开启，敬请期待~</span>");
            $("#mainMap").css("background","url('http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/waitbg.jpg')")
        }else{
            $("#gotoLottery").show();
            $("#morecard").show();
            $("#myGift").show();
            $("#strategy").show();
            $(".cityBtn").attr("rightTarget","#gotoLottery");
        }
    }
}

//页面初始化或刷新
function showPage(first,resume) {
    console.log("$$$$$$$$$$$$$$$$$$===="+first+"==========="+resume)
    if(first){
        if(getUrlParam("goto")=="shop"){
            needgotoshop = true;
            exitWeb = true;
        }
    }else if(resume){
        initType = "all";
    }else{
        initType = "no";
    }
    setFocusFirst = false;
    forNum = 0;
    lightCity = [];
    $(".cityBtn").removeClass("hasLight");
    console.log("---"+macAddress+"------"+TVchip+"-----"+TVmodel+"------"+emmcId+"--------"+activityId + "---------"+initType+"-------"+cOpenId);
    $.ajax({
        type: "GET",
        async: true,
        url: adressIp + "/light/active/"+actionId+"/init",
        data: {id:actionId, MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId,initType:initType,cOpenId:cOpenId,source:movieSource},
        dataType: "jsonp",
        jsonp: "callback",
        success: function(data) {
            console.log("------------init----result-------------"+JSON.stringify(data));
            if (data.code == 50100) {
                cityNum = data.data.userLightCity.lightNumber;
                totalNum = data.data.userChance.allOperation;
                remainNum = data.data.userChance.overNumber;
                nowTime = data.data.sysTime;
                beginTime = data.data.active.activeBeginTime;
                endTime = data.data.active.activeEndTime;
                giveCard = data.data.lightByDay;
                if(giveCard != undefined){
                    if(giveCard.lightNumber > 0){
                        needShowWindow = true;
                    }
                }
                if(nowTime > beginTime && nowTime < endTime){
                    gameStatus = "start";
                    if(first && getUrlParam("goto")!="shop"){
                        var landstatus = 0;
                        if(loginstatus == "true"){landstatus = 1;}
                        sentLog("web_page_show_new",'{"page_name":"nalm_main_activity_page","activity_status":"1","login_status":"'+landstatus+'"}')
                    }
                }
                for(var i=1;i<=15;i++){
                    var checkCity = "city"+i;
                    if(data.data.userLightCity.cityInfo[checkCity]!=undefined){
                        lightCity.push("city"+(i-1));
                    }
                    $("#cityCard"+(i-1)+" .cityBtn").attr("missionType",data.data.cityTask[checkCity].type);
                    $("#cityCard"+(i-1)+" .cityBtn").attr("missionId",data.data.cityTask[checkCity].id);
                    $("#cityCard"+(i-1)+" .cityBtn").attr("missionUrl",data.data.cityTask[checkCity].url);
                    $("#cityCard"+(i-1)+" .cityBottom").html("<span class='missionName' style='font-weight: bold'>"+data.data.cityTask[checkCity].name+"</span>");
                    if(data.data.cityTask[checkCity].type == "video"){
                        $("#cityCard"+(i-1)+" .cardTitle").html("点亮景点可领现金/实物奖励");
                    }else{
                        $("#cityCard"+(i-1)+" .cardTitle").html("点亮景点可领现金/实物奖励");
                    }
                }
            } else if(data.code == 50002){
                gameStatus = "wait";
                if(first && getUrlParam("goto")!="shop"){
                    var landstatus = 0;
                    if(loginstatus == "true"){landstatus = 1;}
                    sentLog("web_page_show_new",'{"page_name":"nalm_main_activity_page","activity_status":"0","login_status":"'+landstatus+'"}')
                }
            // }else if(data.code == 50003){
            }else{
                gameStatus = "end";
                if(first && getUrlParam("goto")!="shop"){
                    var landstatus = 0;
                    if(loginstatus == "true"){landstatus = 1;}
                    sentLog("web_page_show_new",'{"page_name":"nalm_main_activity_page","activity_status":"2","login_status":"'+landstatus+'"}')
                }
            }

            initGameStatus();
            $("#cityNum").html(cityNum);
            $("#remainNum").html(remainNum);
        },
        error: function(error) {
            console.log("--------访问失败" + JSON.stringify(error));
        }
    });
}