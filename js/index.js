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
        if (needFresh) {
            showPage();
        } else {}
    },
    handlepause: function() {
        console.log("===========================pause==========");
    },
    handleBackButton: function() {

    },
    handleBackButtonDown: function() {
        exit()
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
            // macAddress = message.mac;
            // TVmodel = message.model;
            // TVchip = message.chip;
            // activityId = message.activeid;
            // if (message.emmcid ==""||message.emmcid==null) {
            //     emmcId = "";
            // } else{
            //     emmcId = message.emmcid;
            // }
            macAddress = "333";
            TVmodel = "333";
            TVchip = "333";
            activityId = "333";
            emmcId = "333";
            // if (deviceInfo.version < '6') {
            //     android.getPropertiesValue("persist.service.homepage.pkg", function(data) {
            //         var val = data.propertiesValue;
            //         if ("com.tianci.movieplatform" == val) {
            //             startActionReplace = "coocaa.intent.action.HOME.Translucent";
            //         } else {
            //             startActionReplace = "coocaa.intent.movie.home";
            //         }
            //     });
            // }
            showPage();
            listenUser();
            listenPay();
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
            showPage();
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
            showPage();
        }
    })

    $(".cityBtn").unbind("itemClick").bind("itemClick",function(){
        var _thisIndex = $(".cityBtn").index($(this));
        var thisObj = this;
        if($(this).attr("class").indexOf("hasLight") == -1){
            console.log("未点亮，即将点亮");
            //是否有剩余点亮次数
            if(remainNum > 0){
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
                            if(totalNum != 0){
                                lightCityApi(thisObj,_thisIndex,"A001");
                            }else{
                                console.log("有机会，做任务即可点亮");
                            }
                        } else {}
                    },
                    error: function(error) {
                        console.log("--------访问失败" + JSON.stringify(error));
                    }
                });
            }else{
                console.log("没有机会，需要做任务!");
                $("#mainMap").hide();
                $("#moreChance").show();
                hasLogin(true);
                map = new coocaakeymap($(".coocaabtn2"),null,"btnFocus", function() {}, function(val) {}, function(obj) {});
            }

        }else{
            console.log("已经点亮");
            var needGotoNextCity = _thisIndex;
            for(var i=0;i<15;i++){
                if($("#city"+i).attr("class").indexOf("hasLight") == -1){
                    needGotoNextCity = i;
                    break;
                }else{}
            }
            initMap(".city:eq("+needGotoNextCity+")")
        }
    })

    $("#strategy").unbind("itemClick").bind("itemClick",function(){
       $("#mainMap").hide();
       $("#strategyPage").show();
        map = new coocaakeymap($(".coocaabtn3"),null,"btnFocus", function() {}, function(val) {}, function(obj) {});
    })

    $("#morecard").unbind("itemClick").bind("itemClick",function(){
       $("#mainMap").hide();
       $("#moreChance").show();
       hasLogin(true);
        map = new coocaakeymap($(".coocaabtn2"),null,"btnFocus", function() {}, function(val) {}, function(obj) {});
    })

    $(".moviePkg").unbind("itemClick").bind("itemClick",function(){
        console.log("loginStatus================="+loginstatus)
        if(loginstatus == "true"){
            order();
        }else{
            startLogin(true);
        }
    })
}

function order() {
    var data = JSON.stringify({
        user_id: "2.378b41b74eb048f795637b0d7d0d9aa6", //accesstoken
        user_flag: 1,
        third_user_id: "o-G_Ut1rSA99Mx4lV0cB6W3yP4aE",
        product_id: "1", //需改
        movie_id: "",
        node_type: "res",
        client_type: 1,
        title: "买年卡套餐送背包",
        price: 1, //需改
        count: 1,
        discount_price: 1, //需改
        coupon_codes: "",
        auth_type: 0,
        mac: "bcec23afef7f",
        chip: "5S07",
        model: "A2",
        extend_info: { "login_type": 2, "wx_vu_id": "123456789" },
    })
    var data1 = encodeURIComponent(data);
    console.log(data);
    $.ajax({
        type: "get",
        async: true,
        url: "http://172.20.132.182:8090/v3/order/genOrderByJsonp.html?data=" + data1, //需改
        dataType: "jsonp",
        jsonp: "callback",
        timeout: 20000,
        success: function(data) {
            console.log("返回状态：" + JSON.stringify(data));
            if (data.code == 0) {
                orderId = data.data.orderId;
                console.log("订单编号1：" + orderId);
                coocaaosapi.purchaseOrder2(data.data.appcode, data.data.orderId, data.data.orderTitle, data.data.back_url, data.data.total_pay_fee, "虚拟", "com.webviewsdk.action.pay", "pay", "2.378b41b74eb048f795637b0d7d0d9aa6", "13333333333",  function(success)  {
                    console.log("33333333333322" + success);
                },             function(error)  {                 console.log(error);             });
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
        hasLogin(false);
    });
}

//监听支付状态
function listenPay() {
    coocaaosapi.addPurchaseOrderListener(function(message) {
        console.log("xjr----------->startpurcharse message  支付结果 " + JSON.stringify(message));
        if (message.presultstatus == 0) {
            if (refreshPayResult == true) {
                return;
            }
            sentLog("esg_buy_vip_result", '{"buy_result":"0","age_type":"' + log_buyvip_age + '","product_type":"' + log_buyvip_type + '","order_id":"' + orderId + '"}');
            $(".normalWindow").hide();
            $("#missionWindow").hide();
            $("#award").hide();
            $("#mission").hide();
            $(".vipright").hide();
            $(".buypkg").hide();
            $(".receiveResult").hide();
            map = new coocaakeymap($(".coocaabtn"), $(".level:eq(" + rememberMapFocus + ")"), "btnFocus", function() {}, function(val) {}, function(obj) {});
        } else {
            sentLog("esg_buy_vip_result", '{"buy_result":"1","age_type":"' + log_buyvip_age + '","product_type":"' + log_buyvip_type + '","order_id":"' + orderId + '"}');
        }
    });
}

function initGameStatus() {
    console.log("has Light city=="+lightCity)
    if(nowTime < beginTime){
        $("#gotoLottery").hide();
        $("#morecard").hide();
        $("#myGift").hide();
        $("#strategy").show();
    }else if(nowTime > endTime){
        $("#gotoLottery").hide();
        $("#morecard").hide();
        $("#myGift").show();
        $("#strategy").hide();
    }else{
        $("#gotoLottery").show();
        $("#morecard").show();
        $("#myGift").show();
        $("#strategy").show();
        $(".cityBtn").attr("rightTarget","#gotoLottery")
    }
    for(var i=0; i<15; i++){
        $("#city"+i).removeClass("hasLight");
        if(lightCity.indexOf("city"+i) != -1){
            console.log("---------"+i);
            $("#city"+i).addClass("hasLight");
            $("#cityCard"+i+" .cityBtn").addClass("hasLight");
            $("#cityCard"+i+" .cityBtn").html("继续点亮");
        }else{
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
}

//页面初始化或刷新
function showPage() {
    setFocusFirst = false;
    lightCity = [];
    console.log("---"+macAddress+"------"+TVchip+"-----"+TVmodel+"------"+emmcId+"--------"+activityId);
    $.ajax({
        type: "GET",
        async: true,
        url: adressIp + "/light/active/"+actionId+"/init",
        data: {id:actionId, MAC:macAddress,cChip:TVchip,cModel:TVmodel,cEmmcCID:emmcId,cUDID:activityId},
        dataType: "jsonp",
        jsonp: "callback",
        success: function(data) {
            console.log("------------init----result-------------"+JSON.stringify(data));
            if (data.code == 50100) {
                cityNum = data.data.userCity.allCityNumber;
                totalNum = data.data.userChance.allOperation;
                remainNum = data.data.userChance.overNumber;
                nowTime = data.data.sysTime;
                beginTime = data.data.active.activeBeginTime;
                endTime = data.data.active.activeEndTime;
                for(var i=1;i<=15;i++){
                    var checkCity = "city"+i;
                    if(data.data.userCity.userCity[checkCity]!=undefined){
                        lightCity.push("city"+(i-1));
                    }
                }
                initGameStatus();
                $("#cityNum").html(cityNum);
            } else {

            }
        },
        error: function(error) {
            console.log("--------访问失败" + JSON.stringify(error));
        }
    });
}