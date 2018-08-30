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
    },
    handleresume: function() {
        if (needFresh) {
            showPage();
        } else {}
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
        }, function(error) { console.log("get deviceinfo error") })
    },
    triggleButton: function() {
        cordova.require("coocaaosapi");

        initBtn();
        hasLogin(false);
        listenUser();
        listenPay();
    }
};


app.initialize();


function exit() {
    navigator.app.exitApp();
}

function initMap(setFocus) {
    console.log("hhhhh")
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
            console.log("99999999999999999999999")
            needRememberFocus = true;
            rememberFocus = "#"+$(this).attr('id');
            needFresh = false;
            showPage();
        }
    })

    $(".cityBtn").unbind("itemClick").bind("itemClick",function(){
        var _thisIndex = $(".cityBtn").index($(this));
        if($(this).attr("class").indexOf("hasLight") == -1){
            console.log("needMission")
            //是否有剩余点亮次数
            if(remainNum > 0){
                //当前是否第一次游戏---是，点亮发放礼品接口
                if(totalNum == 0){
                    console.log("直接点亮城市");
                    $(this).html("恭喜点亮");
                    $(this).addClass("hasLight");
                    $("#city"+_thisIndex).addClass("hasLight");
                    cityNum += 1;
                    $("#cityNum").html(cityNum);
                    needFresh = true;
                }else{

                }
            }else{

            }
        }else{
            console.log("dontMission");
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
    if(gameTime == "wait"){
        $("#gotoLottery").hide();
        $("#morecard").hide();
        $("#myGift").hide();
        $("#strategy").show();
    }else if(gameTime == "end"){
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
    initGameStatus();
    $("#cityNum").html(cityNum)
}