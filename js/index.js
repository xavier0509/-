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
        if ($("#setAge").css("display") == "block") {

            if(_hasloginandfresh == true){
                $("#setAge").hide();
                showPage();
            }else{
                $("#setAge").hide();
            $('.circle').css("background", "");
            _setAge = null;
            map = new coocaakeymap($(".coocaabtn"), $(".level:eq(" + rememberMapFocus + ")"), "btnFocus", function() {}, function(val) {}, function(obj) {});
            }
            
        } else
        if ($("#missionWindow").css("display") == "block") {
            $(".normalWindow").hide();
            $("#missionWindow").hide();
            $("#award").hide();
            $("#mission").hide();
            $(".vipright").hide();
            $(".buypkg").hide();
            $(".receiveResult").hide();
            console.log("rememberMapFocus==" + rememberMapFocus)
            map = new coocaakeymap($(".coocaabtn"), $(".level:eq(" + rememberMapFocus + ")"), "btnFocus", function() {}, function(val) {}, function(obj) {});
        } else {
            exit();
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

function initBtn() {
    //登录并领取
    $("#login_get").unbind("itemClick").bind("itemClick", function() {
        _hasStartLogin = true;
        // sentLog("esg_adopt_attend_button_onclick", '{"landing_status":"1"}');
        needFresh = false;
        sentLog("esg_landing_arouse", '{}');
        startLogin(false);
    })

    //立即领取
    $("#now_get").unbind("itemClick").bind("itemClick", function() {
        // sentLog("esg_adopt_attend_button_onclick", '{"landing_status":"0"}');
        $("#setAge").show();
        sentLog("esg_set_information_page_exposure", '{}');
        $("#rset1").show();
        $("#set1").trigger('focus');
        $(".leftbtnTar").attr("class", "coocaabtn10 leftbtnTar");
        map = new coocaakeymap($(".coocaabtn10"), null, "btnFocus", function() {}, function(val) {}, function(obj) {});
    })

    $(".pkDdiv").bind("focus", function() {
        var num = this.getAttribute("uptarget").split("#set")[1];
        var trueNum = num - 1;
        console.log("this is hi~~~~" + (num - 1))
        $(".leftbtnTar:eq(" + trueNum + ")").attr("class", "coocaabtn10 leftbtnTar blue")
    })

    //设置信息，左边tab落焦逻辑
    $(".leftbtnTar").bind('focus', function(event) {
        console.log("hi@@@@@@@@@@")
        $(".rset").hide();
        var thisClass = this.getAttribute("class");
        var resetClass = thisClass.replace("blue", "");
        this.setAttribute("class", resetClass);
        var nowfocus = $(".leftbtnTar").index($(this)) + 1;
        sentLog("esg_set_information_page_age_tab_exposure", '{"age_tab":"' + (nowfocus - 1) + '"}');
        // var needShowRightId = "#r"+this.id;
        // $(needShowRightId).show();
        for (var i = 1; i <= 5; i++) {
            var childLength = $("#rset" + i).children('.coocaabtn10').length;
            if (i == nowfocus) {
                $("#rset" + i).show();
                for (var j = 0; j < childLength; j++) {
                    var pkClass = $("#rset" + i).children('.coocaabtn10')[j].getAttribute("class") + " pkDdiv";
                    $("#rset" + i).children('.coocaabtn10')[j].setAttribute("class", pkClass)
                    $("#rset" + i).children('.coocaabtn10')[j].setAttribute("upTarget", '#set' + i);

                }
            } else {
                $("#rset" + i).hide();
                for (var j = 0; j < childLength; j++) {
                    var pkClass = $("#rset" + i).children('.coocaabtn10')[j].getAttribute("class");
                    var reg = new RegExp("pkDdiv", "g");
                    pkClass = pkClass.replace(reg, "");
                    $("#rset" + i).children('.coocaabtn10')[j].setAttribute("class", pkClass);

                }
            }
        }
    });

    //设置信息，选择具体年龄点击
    $(".pkDdiv").unbind("itemClick").bind("itemClick", function() {
        _setAge = this.getAttribute("setAge");
        console.log("=======" + _setAge)
        sentLog("esg_set_information_page_age_choice", '{"age_type":"' + (_setAge - 1) + '"}');
        var nowfocus = $(".pkDdiv").index($(this));
        $('.circle').css("background", "");
        $(".pkDdiv:eq(" + nowfocus + ")").children('.circle')[0].style.background = "url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/changeage/changed.png)";
        map = new coocaakeymap($(".coocaabtn10"), $("#setAgeBtn"), "btnFocus", function() {}, function(val) {}, function(obj) {});
    })

    //提交信息按钮
    $("#setAgeBtn").unbind("itemClick").bind("itemClick", function() {
        //todo=======ajax提交设置
        if (_setAge != null) {
            $.ajax({
                type: "GET",
                async: true,
                url: memberAdress + "/v3/edu/add-age-group",
                data: { accessToken: access_token, ageGroup: _setAge },
                dataType: "jsonp",
                jsonp: "callback",
                success: function(data) {
                    console.log("setAge=====result=======" + JSON.stringify(data))
                    if (data.code == 0) {
                        $("#setAge").hide();
                        $("#mainPage").show();
                        _getAge = _setAge;
                        sentLog("esg_start_learning_button_onclick", '{"age_type":"' + (_setAge - 1) + '","submit_result":"0"}');
                        selectConisNum();
                    } else {
                        showtoast("信息提交失败，请稍后再试~");
                        console.log("创建角色失败");
                        sentLog("esg_start_learning_button_onclick", '{"age_type":"' + (_setAge - 1) + '","submit_result":"1"}');
                    }
                },
                error: function(er) {
                    showtoast("信息提交失败，请稍后再试~");
                    sentLog("esg_start_learning_button_onclick", '{"age_type":"' + (_setAge - 1) + '","submit_result":"1"}');
                    console.log("error" + er);
                }
            });
        } else {
            showtoast("请先进行年龄段选择哦~");
            console.log("还未选择年龄！！！");
        }

    })

    //关卡点击
    $(".level").unbind("itemClick").bind("itemClick", function() {
        var nowfocus = $(".level").index($(this)) + 1;
        sentLog("esg_main_task_page_level_onclick", '{"age_type":"' + (_getAge - 1) + '","task_level":"' + (nowfocus - 1) + '"}');
        rememberMapFocus = nowfocus - 1;
        var _selectNextLevelInfoId = "level" + (nowfocus + 1);
        var _selectNowLevelInfoId = "level" + nowfocus;
        console.log("this level is ========" + nowfocus)
        if (nowfocus > nowLevel) {
            console.log("还没有完成前面的任务呦");
            sentLog("esg_task_undone_page_exposure", '{"task_level":"' + (nowfocus - 1) + '"}');
            $("#missionWindow").show();
            $("#lockMission").show();
            map = new coocaakeymap($(".coocaabtn1"), null, "btnFocus", function() {}, function(val) {}, function(obj) {});
        } else if (nowfocus < nowLevel) {
            console.log("展示所获得的奖励");
            sentLog("esg_main_task_page_card_exposure", '{"task_level":"' + (nowfocus - 1) + '"}');
            $("#missionWindow").show();
            $("#award").show();
            showAwardList(_selectNowLevelInfoId);
        } else {
            if (_getAge == null) {
                if (loginstatus == "true") {
                    // sentLog("esg_adopt_attend_button_onclick", '{"landing_status":"0"}');
                    $("#setAge").show();
                    sentLog("esg_set_information_page_exposure", '{}');
                    $("#rset1").show();
                    $("#set1").trigger('focus');
                    $(".leftbtnTar").attr("class", "coocaabtn10 leftbtnTar");
                    map = new coocaakeymap($(".coocaabtn10"), $("#set1"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                } else {
                    _hasStartLogin = true;
                    // sentLog("esg_adopt_attend_button_onclick", '{"landing_status":"1"}');
                    needFresh = false;
                    sentLog("esg_landing_arouse", '{}');
                    startLogin(false);
                }
            } else {
                console.log("获取任务列表");
                if (nowfocus != 10) {
                    nextCoinNum = levelInfo[_selectNextLevelInfoId].mincoins - hascoins;
                    nextLevelName = levelInfo[_selectNextLevelInfoId].levelname;
                    console.log("===再获取" + nextCoinNum + "即可解锁【" + nextLevelName + "】称号哦")
                    $.ajax({
                        type: "GET",
                        async: true,
                        url: memberAdress + "/v3/public/user-missions",
                        data: { accessToken: access_token, clientId: CLIENTID },
                        dataType: "jsonp",
                        jsonp: "callback",
                        success: function(data) {
                            missionList = data.data.dailyTasks;
                            console.log("getMission=====result=======" + JSON.stringify(data))
                            console.log("+++++++++++++++=" + dayCoins)
                            if (dayCoins >= 21) {
                                sentLog("esg_full_fruit_toast_exposure", '{"task_level":"' + (nowfocus - 1) + '"}');
                                $("#missionWindow").show();
                                $("#limit").show();
                                map = new coocaakeymap($(".coocaabtn3"), null, "btnFocus", function() {}, function(val) {}, function(obj) {});
                            } else {
                                sentLog("esg_main_task_page_card_exposure", '{"task_level":"' + (nowfocus - 1) + '"}');
                                $("#missionWindow").show();
                                $("#mission").show();
                                showMissionList(_selectNowLevelInfoId);
                            }

                        },
                        error: function(er) {
                            console.log("error");
                        }
                    });
                } else {
                    $("#missionWindow").show();
                    $("#noMission").show();
                    map = new coocaakeymap($("#noMission"), null, "btnFocus", function() {}, function(val) {}, function(obj) {});
                }
            }
        }

    })

    //关闭弹窗
    $(".closeWindow").unbind("itemClick").bind('itemClick', function(event) {
        /* Act on the event */
        $(".normalWindow").hide();
        $("#missionWindow").hide();
        $("#award").hide();
        $("#mission").hide();
        $(".vipright").hide();
        $(".buypkg").hide();
        $(".receiveResult").hide();
        if (this.getAttribute("id") == "learnlater") {
            sentLog("esg_guide_page_later_button_onclick", '{"vip_type":"' + vip_type + '"}');
        }
        map = new coocaakeymap($(".coocaabtn"), $(".level:eq(" + rememberMapFocus + ")"), "btnFocus", function() {}, function(val) {}, function(obj) {});
    });

    $("#eduenter").unbind("itemClick").bind('itemClick', function(event) {
        sentLog("esg_main_task_page_vip_buy_button_onclick", '{}');
        coocaaosapi.startMovieMemberCenter("1", function() {}, function() {})
    });

    $("#learn").unbind("itemClick").bind('itemClick', function(event) {
        sentLog("esg_full_fruit_toast_see_around_button_onclick", '{"task_level":"' + rememberMapFocus + '"}');
        coocaaosapi.startHomeTab(startActionReplace, "10738", function(meg) { exit() }, function(err) {});
    });
    $("#learnnow").unbind("itemClick").bind('itemClick', function(event) {
        sentLog("esg_guide_page_learn_now_button_onclick", '{"vip_type":"' + vip_type + '"}');
        coocaaosapi.startHomeTab(startActionReplace, _tabid, function(meg) { exit() }, function(err) {});
    });

    $("#tryagain").unbind("itemClick").bind('itemClick', function(event) {
        startNoReveice = true;
        $(".receiveResult").hide();
        $("#receiveGetting").show();
        if (thisvipid == "3days") {
            $("#get3now").trigger('itemClick');
        } else {
            $("#get15now").trigger('itemClick');
        }
    });

    //买会员选年龄段点击
    $(".buydays").unbind("itemClick").bind('itemClick', function(event) {
        var oldclass = this.getAttribute("class").replace("choice", "").replace("btnFocus", "")
        var choiceclass = oldclass + " choice btnFocus";
        var award_type = null;
        $(".buydays").attr("class", oldclass);
        this.setAttribute("class", choiceclass);
        if (thispkgtype == "3months") {
            log_buyvip_type = 0;
            award_type = 2;
            map = new coocaakeymap($(".coocaabtn7"), $(".buynow:eq(0)"), "btnFocus", function() {}, function(val) {}, function(obj) {});
        } else {
            log_buyvip_type = 1;
            award_type = 3;
            map = new coocaakeymap($(".coocaabtn7"), $(".buynow:eq(1)"), "btnFocus", function() {}, function(val) {}, function(obj) {});
        }

        buyviprank = this.getAttribute("pkgType");
        var a = buyviprank.split("r")[1];
        if (a > 14) {
            log_buyvip_age = a - 15;
        } else {
            log_buyvip_age = a - 1;
        }
        sentLog("esg_vip_related_age_choice", '{"award_type":"' + award_type + '","age_type":"' + log_buyvip_age + '"}');
        _productid = pkgInfo[buyviprank].productid;
        _price = pkgInfo[buyviprank].price;
    })
    //买会员点击
    $(".buynow").unbind("itemClick").bind('itemClick', function(event) {
        if (buyviprank == null) {
            showtoast("请先进行年龄段选择哦~");
            return;
        }
        needFresh = false;
        var data = JSON.stringify({
            user_id: access_token, //accesstoken
            user_flag: 1,
            third_user_id: qqtoken,
            product_id: _productid, //需改
            movie_id: "",
            node_type: "res",
            client_type: 4,
            title: "学霸养成优惠产品包",
            price: _price, //需改
            count: 1,
            discount_price: "", //需改
            coupon_codes: "",
            auth_type: 0,
            mac: deviceInfo.mac,
            chip: deviceInfo.chip,
            model: deviceInfo.model,
            extend_info: { "login_type": login_type, "wx_vu_id": vuserid },
        })
        var data1 = encodeURIComponent(data);
        console.log(data);
        $.ajax({
            type: "get",
            async: true,
            url: payAdress + "/v3/order/genOrderByJsonp.html?data=" + data1, //需改
            dataType: "jsonp",
            jsonp: "callback",
            timeout: 20000,
            success: function(data) {
                console.log("返回状态：" + JSON.stringify(data));
                if (data.code == 0) {
                    orderId = data.data.orderId;
                    console.log("订单编号1：" + orderId);
                    coocaaosapi.purchaseOrder2(data.data.appcode, data.data.orderId, data.data.orderTitle, data.data.back_url, data.data.total_pay_fee, "虚拟", "com.webviewsdk.action.pay", "pay", access_token, "",  function(success)  {
                        console.log("22222222222222" + success);
                    }, function(error)  { console.log(error); });
                } else {
                    console.log("-----------异常---------" + data.msg);
                }
            },
            error: function() {
                console.log("-----------访问失败---------");
            }
        });
    })

    //领会员选年龄段点击
    $(".getdays").unbind("itemClick").bind('itemClick', function(event) {
        var oldclass = this.getAttribute("class").replace("choice", "").replace("btnFocus", "")
        var choiceclass = oldclass + " choice btnFocus";
        var award_type = null;
        $(".getdays").attr("class", oldclass);
        this.setAttribute("class", choiceclass);
        if (thisvipid == "3days") {
            award_type = 0;
            map = new coocaakeymap($(".coocaabtn6"), $(".getnow:eq(0)"), "btnFocus", function() {}, function(val) {}, function(obj) {});
        } else {
            award_type = 1;
            map = new coocaakeymap($(".coocaabtn6"), $(".getnow:eq(1)"), "btnFocus", function() {}, function(val) {}, function(obj) {});
        }
        getviprank = this.getAttribute("rigthType");
        var a = getviprank.split("r")[1];
        if (a > 14) {
            log_getvip_age = a - 15;
        } else {
            log_getvip_age = a - 1;
        }
        sentLog("esg_vip_related_age_choice", '{"award_type":"' + award_type + '","age_type":"' + log_getvip_age + '"}');
        _uniqueid = rightinfo[getviprank].uniqueid;
        _appcode = rightinfo[getviprank].appcode;
        desWord = rightinfo[getviprank].desWord;
        _tabid = rightinfo[getviprank].tabid;
        _awardExtend = { type: _uniqueid, appCode: _appcode }
        _awardExtend = JSON.stringify(_awardExtend);
    })

    //会员立即领取点击
    $(".getnow").unbind("itemClick").bind('itemClick', function(event) {
        if (getviprank == null) {
            showtoast("请先进行年龄段选择哦~");
            return;
        }
        if (daysWord == 3) {
            vip_type = 0;
        } else {
            vip_type = 1;
        }
        console.log("是否有未激活的奖品=======" + startNoReveice)
        if (startNoReveice) {
            console.log("直接激活")
            //直接激活接口=====
            startNoReveice = false;
            $.ajax({
                type: "GET",
                async: true,
                url: activityAdress + "/v2/lottery/verify/receive",
                data: { activeId: _ractivityid, awardId: _rawardId, awardRememberId: _rlotteryAwardRememberId, awardTypeId: _rawardTypeId, userKeyId: cOpenId, MAC: deviceInfo.mac, awardExtend: _awardExtend },
                dataType: "jsonp",
                jsonp: "callback",
                success: function(data) {
                    console.log("getreceive=====result=======" + JSON.stringify(data));
                    if (data.code == 50100) {
                        $(".vipright").hide();
                        $(".receiveResult").hide();
                        $("#receiveSuccess").show();
                        $("#receiveword").html("成功领取" + daysWord + "天" + desWord + "会员");
                        sentLog("esg_vip_rights_result", '{"draw_result":"0","vip_type":"' + vip_type + '"}');
                        map = new coocaakeymap($(".coocaabtn8"), $("#learnnow"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                    } else {
                        $(".vipright").hide();
                        $(".receiveResult").hide();
                        $("#receiveFail").show();
                        sentLog("esg_vip_rights_result", '{"draw_result":"1","vip_type":"' + vip_type + '"}');
                        map = new coocaakeymap($(".coocaabtn8"), $("#tryagain"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                    }
                },
                error: function(er) {
                    console.log("error");
                    $(".vipright").hide();
                    $(".receiveResult").hide();
                    $("#receiveFail").show();
                    sentLog("esg_vip_rights_result", '{"draw_result":"1","vip_type":"' + vip_type + '"}');
                    map = new coocaakeymap($(".coocaabtn8"), $("#tryagain"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                }
            });
        } else {
            console.log("先抽奖！！！！")
            //开始抽奖接口-------------
            $.ajax({
                type: "GET",
                async: true,
                url: activityAdress + "/v3/lottery/" + _actionid + "/start",
                data: { id: _actionid, lotteryCode: lotteryCode, operateNumber: remainingTimes, operateTime: usedTimes, cNickName: nick_name, accessToken: access_token, cOpenId: cOpenId, cModel: deviceInfo.model, cChip: deviceInfo.chip, MAC: deviceInfo.mac, cUDID: deviceInfo.activeid },
                dataType: "jsonp",
                jsonp: "callback",
                success: function(data) {
                    console.log("getstart=====result=======" + JSON.stringify(data));
                    if (data.code == 50100) {
                        _ractivityid = data.data.activeId;
                        _rawardId = data.data.awardId;
                        _rlotteryAwardRememberId = data.data.lotteryAwardRememberId;
                        _rawardTypeId = data.data.awardTypeId
                        //------激活接口--------------
                        $.ajax({
                            type: "GET",
                            async: true,
                            url: activityAdress + "/v2/lottery/verify/receive",
                            data: { activeId: _ractivityid, awardId: _rawardId, awardRememberId: _rlotteryAwardRememberId, awardTypeId: _rawardTypeId, userKeyId: cOpenId, MAC: deviceInfo.mac, awardExtend: _awardExtend },
                            dataType: "jsonp",
                            jsonp: "callback",
                            success: function(data) {
                                console.log("getreceive=====result=======" + JSON.stringify(data));
                                if (data.code == 50100) {
                                    $(".vipright").hide();
                                    $(".receiveResult").hide();
                                    $("#receiveSuccess").show();
                                    $("#receiveword").html("成功领取" + daysWord + "天" + desWord + "会员");
                                    sentLog("esg_vip_rights_result", '{"draw_result":"0","vip_type":"' + vip_type + '"}');
                                    map = new coocaakeymap($(".coocaabtn8"), $("#learnnow"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                                } else {
                                    $(".vipright").hide();
                                    $(".receiveResult").hide();
                                    $("#receiveFail").show();
                                    sentLog("esg_vip_rights_result", '{"draw_result":"1","vip_type":"' + vip_type + '"}');
                                    map = new coocaakeymap($(".coocaabtn8"), $("#tryagain"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                                }
                            },
                            error: function(er) {
                                console.log("error");
                                $(".vipright").hide();
                                $(".receiveResult").hide();
                                $("#receiveFail").show();
                                sentLog("esg_vip_rights_result", '{"draw_result":"1","vip_type":"' + vip_type + '"}');
                                map = new coocaakeymap($(".coocaabtn8"), $("#tryagain"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                            }
                        });
                    } else {
                        $(".vipright").hide();
                        $(".receiveResult").hide();
                        $("#receiveFail").show();
                        sentLog("esg_vip_rights_result", '{"draw_result":"1","vip_type":"' + vip_type + '"}');
                        map = new coocaakeymap($(".coocaabtn8"), $("#tryagain"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                    }
                },
                error: function(er) {
                    console.log("error");
                    $(".vipright").hide();
                    $(".receiveResult").hide();
                    $("#receiveFail").show();
                    sentLog("esg_vip_rights_result", '{"draw_result":"1","vip_type":"' + vip_type + '"}');
                    map = new coocaakeymap($(".coocaabtn8"), $("#tryagain"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                }
            });
        }
    })

}
//展示奖励列表
function showAwardList(awardNum) {
    var titlename = "newword" + awardNum.split("level")[1];
    $("#bigtitle").css("background", "url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/mission/" + titlename + ".png)")
    document.getElementById("awardListBox").innerHTML = "";
    var listlength = awardList[awardNum].length;
    for (var i = 0; i < listlength; i++) {
        var box = document.getElementById("awardListBox");
        var awardlist = document.createElement("div");
        awardlist.setAttribute('class', 'awardlist coocaabtn4');
        var awardtitle = document.createElement("div");
        awardtitle.setAttribute('class', 'awardtitle');
        awardtitle.innerHTML = awardList[awardNum][i].title
        var awardststusbtn = document.createElement("div");
        awardststusbtn.setAttribute('class', 'awardststusbtn');
        if (awardList[awardNum][i].type == 1) {
            awardststusbtn.innerHTML = "已解锁";
            awardlist.setAttribute('class', 'awardlist coocaabtn4 nogo');
            awardststusbtn.setAttribute('class', 'awardststusbtn nogo hh');
            awardlist.setAttribute('clicktype', 'nohh');
        } else if (awardList[awardNum][i].type == 2) {
            awardststusbtn.innerHTML = "立即购买";
            awardlist.setAttribute('clicktype', 'goccmall');
        } else if (awardList[awardNum][i].type == 3 || awardList[awardNum][i].type == 4) {
            awardststusbtn.innerHTML = "立即购买";
            awardlist.setAttribute('clicktype', 'buypkg');
            awardlist.setAttribute('pkgType', awardList[awardNum][i].pkgType);
        } else {
            awardststusbtn.setAttribute("id", "waitAPI");
            awardlist.setAttribute("id", "waitAPIbox");
            var _thisId = awardList[awardNum][i].vipId;
            awardlist.setAttribute('vipId', _thisId);
            if (_thisId == "3days") {
                _actionid = 7;
            } else if (_thisId == "15days") {
                _actionid = 8;
            }
            // 查询是否有抽奖机会
            $.ajax({
                type: "GET",
                async: true,
                url: activityAdress + "/v3/lottery/" + _actionid + "/init",
                data: { userKeyId: cOpenId, thirdUserId: qqtoken, cOpenId: cOpenId, cModel: deviceInfo.model, cChip: deviceInfo.chip, MAC: deviceInfo.mac },
                dataType: "jsonp",
                jsonp: "callback",
                success: function(data) {
                    console.log("getinit=====result=======" + JSON.stringify(data));
                    if (data.code == 50100) {
                        remainingTimes = data.data.remainingTimes;
                        lotteryCode = data.data.lotteryCode;
                        usedTimes = data.data.usedTimes;
                        awardlist.setAttribute('clicktype', 'openRight');
                        $("#waitAPI").html("立即领取");
                        $("#waitAPIbox").attr('clicktype', 'openRight');
                    } else {
                        $.ajax({
                            type: "GET",
                            async: true,
                            url: activityAdress + "/v3/lottery/" + _actionid + "/winList",
                            data: { id: _actionid, accessToken: access_token, cOpenId: cOpenId, cModel: deviceInfo.model, cChip: deviceInfo.chip, MAC: deviceInfo.mac, cUDID: deviceInfo.activeid },
                            dataType: "jsonp",
                            jsonp: "callback",
                            success: function(data) {
                                console.log("getWinlist=====result=======" + JSON.stringify(data));
                                if (data.code == 50100) {
                                    if (data.data[0].awardExchangeFlag == 0) {
                                        startNoReveice = true;
                                        _ractivityid = data.data[0].activeId;
                                        _rawardId = data.data[0].awardId;
                                        _rlotteryAwardRememberId = data.data[0].lotteryAwardRememberId;
                                        _rawardTypeId = data.data[0].awardTypeId;
                                        $("#waitAPI").html("立即领取");
                                        $("#waitAPIbox").attr('clicktype', 'openRight');
                                    } else {
                                        $("#waitAPI").html("");
                                        $("#waitAPI").attr('class', 'awardststusbtn hasgot');
                                        $("#waitAPIbox").attr('clicktype', 'hasgot');
                                    }
                                } else {
                                    $("#waitAPI").html("");
                                    $("#waitAPI").attr('class', 'awardststusbtn hasgot');
                                    $("#waitAPIbox").attr('clicktype', 'hasgot');
                                }
                            },
                            error: function(er) {
                                console.log("error");
                            }
                        });
                    }
                },
                error: function(er) {
                    console.log("error");
                }
            });
        }
        awardlist.appendChild(awardtitle);
        awardlist.appendChild(awardststusbtn);
        box.appendChild(awardlist);
    }
    map = new coocaakeymap($(".coocaabtn4"), null, "btnFocus", function() {}, function(val) {}, function(obj) {});
    jqinitBtn();
}

//展示任务列表
function showMissionList(awardNum) {
    $("#missionListBox").stop(true, true).animate({ scrollTop: 0 })
    $("#smalltitle").html("Tips:再获得" + nextCoinNum + "颗智慧果即可解锁【" + nextLevelName + "】称号");
    $("#smalltitle").arctext("destroy");
    $("#smalltitle").arctext({ radius: 2000, dir: 1 });
    document.getElementById("missionListBox").innerHTML = "";
    var listlength = missionList.length;
    for (var i = 0; i < listlength; i++) {
        var box = document.getElementById("missionListBox");
        var missionlist = document.createElement("div");
        missionlist.setAttribute('class', 'missionlist coocaabtn5');
        var missiontitle = document.createElement("div");
        missiontitle.setAttribute('class', 'missiontitle');
        missiontitle.innerHTML = missionList[i].title
        var missionststusbtn = document.createElement("div");
        missionststusbtn.setAttribute('class', 'missionststusbtn');
        if (missionList[i].status == 2) {
            missionststusbtn.innerHTML = "";
            missionlist.setAttribute('class', 'missionlist coocaabtn5 finish');
            missionststusbtn.setAttribute('class', 'missionststusbtn finish');
            missionlist.setAttribute('clicktype', 'no');
        } else {
            missionststusbtn.innerHTML = "Go!";
            missionlist.setAttribute('clicktype', 'gotofinish');
            missionlist.setAttribute('missionId', missionList[i].missionId);
            missionlist.setAttribute('clickAction', missionList[i].clickAction);
            missionlist.setAttribute('event', JSON.stringify(missionList[i]));
        }
        var missionaward = document.createElement("div");
        missionaward.setAttribute('class', 'missionaward');
        var a = missionList[i].rewards;
        if (a.split("/").length == 1) {
            b = a.split("/")[0];
        } else {
            b = a.split("/")[0];
        }
        missionaward.innerHTML = "X" + b;

        var missionfinish = document.createElement("div");
        if (a.split("/").length == 1) {
            missionfinish.setAttribute('class', 'missionfinish noshow');
        } else {
            missionfinish.setAttribute('class', 'missionfinish');
        }
        missionfinish.innerHTML = (missionList[i].receiveNum / b) + "/" + (missionList[i].maxNum / b);

        missionlist.appendChild(missiontitle);
        missionlist.appendChild(missionfinish);
        missionlist.appendChild(missionststusbtn);
        missionlist.appendChild(missionaward);
        box.appendChild(missionlist);
    }
    var listlength = awardList[awardNum].length;
    for (var i = 0; i < listlength; i++) {
        var box = document.getElementById("missionListBox");
        var awardlist = document.createElement("div");
        awardlist.setAttribute('class', 'awardlist missionlist coocaabtn5');
        var awardtitle = document.createElement("div");
        awardtitle.setAttribute('class', 'awardtitle');
        awardtitle.innerHTML = awardList[awardNum][i].title
        var awardststusbtn = document.createElement("div");
        awardststusbtn.setAttribute('class', 'awardststusbtn nogo');
        if (awardList[awardNum][i].type == 1) {
            awardststusbtn.setAttribute('class', 'awardststusbtn nogo hh');
            awardststusbtn.innerHTML = "等待解锁";
            awardlist.setAttribute('clicktype', 'no');
        } else if (awardList[awardNum][i].type == 2 || awardList[awardNum][i].type == 3 || awardList[awardNum][i].type == 4) {
            awardststusbtn.innerHTML = "立即购买";
            awardlist.setAttribute('clicktype', 'no');
        } else {
            awardststusbtn.innerHTML = "等待发放";
            awardlist.setAttribute('clicktype', 'no');
        }
        awardlist.appendChild(awardtitle);
        awardlist.appendChild(awardststusbtn);
        box.appendChild(awardlist);
    }
    map = new coocaakeymap($(".coocaabtn5"), null, "btnFocus", function() {}, function(val) {}, function(obj) {});
    jqinitBtn();

}

function jqinitBtn() {
    console.log("gotomall-----------------------------")
    $(".missionlist").bind('focus', function(event) {
        var _index = $(".missionlist").index($(this));
        var boxheight = $(".missionlist")[0].offsetHeight + 17;
        var myScrollTopValue = 0;
        if (_index < $(".missionlist").length - 2) {
            myScrollTopValue = ((_index - 0) * boxheight);
            $("#missionListBox").stop(true, true).animate({ scrollTop: myScrollTopValue })
        }

    });
    //任务点击
    $(".missionlist").unbind("itemClick").bind('itemClick', function(event) {
        console.log("gotomall-----------------------------")
        var _thisClickType = this.getAttribute("clicktype");
        if (_thisClickType == "no") {} else {
            //做任务
            sentLog("esg_card_page_go_mission_button_onclick", '{"task_id":"' + this.getAttribute("missionId") + '","task_level":"' + rememberMapFocus + '"}');
            $("#missionWindow").hide();
            needFresh = true;
            var param = this.getAttribute("clickAction");
            var event = JSON.parse(this.getAttribute("event"));
            console.log("^^^^^^^^^^^^^^^^^" + event.eventTag)
            android.startParamAction(param, null, function() { android.sendCoinsEvent(event, null, null, null) }, null)
        }
    })
    //奖励点击
    $(".awardlist").unbind("itemClick").bind('itemClick', function(event) {
        console.log("gotomall-----------------------------")
        var _thisClickType = this.getAttribute("clicktype");
        if (_thisClickType == "no") {
            showtoast("该奖励还未开启哦~")
        } else if (_thisClickType == "hasgot") {
            showtoast("该权益已经领取过了哦")
        } else if (_thisClickType == "goccmall") {
            //跳转商城
            console.log("gotomall-----------------------------")
            sentLog("esg_card_page_shopping_rights_buy_button_onclick", '{"task_level":"' + rememberMapFocus + '"}');
            coocaaosapi.startAppShopZone2("95", function(msg) { console.log(msg) }, function(err) { console.log(err) })
        } else if (_thisClickType == "buypkg") {
            //购买产品包
            thispkgtype = this.getAttribute("pkgType");
            $(".buydays").attr("class", "coocaabtn7 buydays");
            buyviprank = null;
            if (thispkgtype == "3months") {
                $("#missionWindow").show();
                $("#buypkg3").show();
                sentLog("esg_card_page_vip_buy_button_onclick", '{"product_type":"0"}');
                map = new coocaakeymap($(".coocaabtn7"), null, "btnFocus", function() {}, function(val) {}, function(obj) {});
            } else {
                $("#missionWindow").show();
                $("#buypkg6").show();
                sentLog("esg_card_page_vip_buy_button_onclick", '{"product_type":"1"}');
                map = new coocaakeymap($(".coocaabtn7"), null, "btnFocus", function() {}, function(val) {}, function(obj) {});
            }
        } else if (_thisClickType == "openRight") {
            //出选择框开通会员权益
            getviprank = null;
            $(".getdays").attr("class", "coocaabtn6 getdays");
            thisvipid = this.getAttribute("vipId");
            if (thisvipid == "3days") {
                daysWord = 3;
                $("#missionWindow").show();
                $("#vipright3").show();
                sentLog("esg_card_page_vip_rights_draw_onclick", '{"vip_type":"0"}');
                map = new coocaakeymap($(".coocaabtn6"), null, "btnFocus", function() {}, function(val) {}, function(obj) {});
            } else {
                daysWord = 15;
                $("#missionWindow").show();
                $("#vipright15").show();
                sentLog("esg_card_page_vip_rights_draw_onclick", '{"vip_type":"1"}');
                map = new coocaakeymap($(".coocaabtn6"), null, "btnFocus", function() {}, function(val) {}, function(obj) {});
            }
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

//查智慧果数目
function selectConisNum() {
    $.ajax({
        type: "GET",
        async: true,
        url: memberAdress + "/v3/public/user-grade-info",
        data: { accessToken: access_token, clientId: CLIENTID },
        dataType: "jsonp",
        jsonp: "callback",
        success: function(data) {
            console.log("getCoins=====result=======" + JSON.stringify(data))
            dayCoins = data.data.grades[0].dayCoins
            hascoins = data.data.grades[0].coins;
            nowLevel = parseInt(data.data.grades[0].coins / 21) + 1;
            if(nowLevel>9){}else if(nowLevel>6){
                $("#gift4").css("background","url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/gift.png)");
            }else if(nowLevel>4){
                $("#gift4").css("background","url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/gift.png)");
                $("#gift3").css("background","url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/gift.png)");
            }else if(nowLevel>2){
                $("#gift4").css("background","url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/gift.png)");
                $("#gift3").css("background","url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/gift.png)");
                $("#gift2").css("background","url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/gift.png)");
            }else{
                $("#gift4").css("background","url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/gift.png)");
                $("#gift3").css("background","url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/gift.png)");
                $("#gift2").css("background","url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/gift.png)");
                $("#gift1").css("background","url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/gift.png)");
            }
            console.log("当前用户所处等级==" + nowLevel + "，拥有智慧果==" + data.data.grades[0].coins + ",用户年龄段是==" + _getAge);
            $("#iconNum").html(data.data.grades[0].coins + "个")
            map = new coocaakeymap($(".coocaabtn"), $(".level:eq(" + (nowLevel - 1) + ")"), "btnFocus", function() {}, function(val) {}, function(obj) {});
            $(".trueIcon").hide();
            $(".trueIcon:eq(" + (nowLevel - 1) + ")").show();
            for (var i = 0; i < nowLevel; i++) {
                var newclass = $(".usericon:eq(" + i + ")").attr("class") + " finish";
                $(".usericon:eq(" + i + ")").attr("class", newclass);
            }
        },
        error: function(er) {
            console.log("error");
        }
    });
}

//页面初始化或刷新
function showPage() {
    if (loginstatus == "true") {
        //查询是否创建角色
        console.log("accesstoken-------" + access_token)
        $.ajax({
            type: "GET",
            async: true,
            url: memberAdress + "/v3/edu/age-group-info",
            data: { accessToken: access_token },
            dataType: "jsonp",
            jsonp: "callback",
            success: function(data) {
                console.log("selectAI=====result=======" + JSON.stringify(data))
                if (data.code == 0) {
                    if (_hasStartLogin) {
                        _hasStartLogin = false;
                        sentLog("esg_landing_result", '{"infor_status":"0"}');
                    }
                    $("#firstPage").hide();
                    $("#mainPage").show();
                    $(".normalWindow").hide();
                    $("#missionWindow").hide();
                    $("#award").hide();
                    $("#mission").hide();
                    $(".vipright").hide();
                    $(".buypkg").hide();
                    $(".receiveResult").hide();
                    _getAge = JSON.parse(data.data).ageGroup;
                    console.log("用户年龄段是==" + _getAge)
                    sentLog("esg_main_task_page_exposure", '{"age_type":"' + (_getAge - 1) + '"}');
                    //todo----查询智慧果数，落焦到地图指定位置
                    selectConisNum();
                } else {
                    // $("#firstPage").show();
                    // $("#mainPage").hide();
                    // if (_hasStartLogin) {
                    //     _hasStartLogin = false;
                    //     sentLog("esg_landing_result", '{"infor_status":"1"}');
                    //     $("#login_get").hide();
                    //     $("#now_get").show();
                    //     $("#setAge").show();
                    //     sentLog("esg_set_information_page_exposure", '{}');
                    //     $("#rset1").show();
                    //     $("#set1").trigger('focus');
                    //     sentLog("esg_adopt_page_exposure", '{"landing_status":"0"}');
                    //     map = new coocaakeymap($(".coocaabtn"), null, "btnFocus", function() {}, function(val) {}, function(obj) {});
                    // } else {
                    //     $("#now_get").show();
                    //     sentLog("esg_adopt_page_exposure", '{"landing_status":"0"}');
                    //     map = new coocaakeymap($("#now_get"), null, "btnFocus1", function() {}, function(val) {}, function(obj) {});
                    // }
                    if (_hasStartLogin) {
                        _hasStartLogin = false;
                        _hasloginandfresh = true;
                        // sentLog("esg_adopt_attend_button_onclick", '{"landing_status":"0"}');
                        sentLog("esg_landing_result", '{"infor_status":"1"}');
                        $("#setAge").show();
                        sentLog("esg_set_information_page_exposure", '{}');
                        $("#rset1").show();
                        $("#set1").trigger('focus');
                        $(".leftbtnTar").attr("class", "coocaabtn10 leftbtnTar");
                        map = new coocaakeymap($(".coocaabtn10"), $("#set1"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                    } else {
                        $("#firstPage").hide();
                        $("#mainPage").show();
                        $(".normalWindow").hide();
                        $("#missionWindow").hide();
                        $("#award").hide();
                        $("#mission").hide();
                        $(".vipright").hide();
                        $(".buypkg").hide();
                        $(".receiveResult").hide();
                        nowLevel = 1;
                        map = new coocaakeymap($(".coocaabtn"), $(".level:eq(" + (nowLevel - 1) + ")"), "btnFocus", function() {}, function(val) {}, function(obj) {});
                        $(".trueIcon").hide();
                        $(".trueIcon:eq(" + (nowLevel - 1) + ")").show();
                        for (var i = 0; i < nowLevel; i++) {
                            var newclass = $(".usericon:eq(" + i + ")").attr("class") + " finish";
                            $(".usericon:eq(" + i + ")").attr("class", newclass);
                        }
                        $("#iconNum").html("0个")
                    }
                }
            },
            error: function(er) {
                console.log("error" + JSON.stringify(er));
            }
        });
    } else {
        $("#firstPage").hide();
        $("#mainPage").show();
        $(".normalWindow").hide();
        $("#missionWindow").hide();
        $("#award").hide();
        $("#mission").hide();
        $(".vipright").hide();
        $(".buypkg").hide();
        $(".receiveResult").hide();
        nowLevel = 1;
        map = new coocaakeymap($(".coocaabtn"), $(".level:eq(" + (nowLevel - 1) + ")"), "btnFocus", function() {}, function(val) {}, function(obj) {});
        $(".trueIcon").hide();
        $(".trueIcon:eq(" + (nowLevel - 1) + ")").show();
        for (var i = 0; i < nowLevel; i++) {
            var newclass = $(".usericon:eq(" + i + ")").attr("class") + " finish";
            $(".usericon:eq(" + i + ")").attr("class", newclass);
            $(".iconImg:eq(" + i + ")").css("background", "url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/user_1.jpg)");
            $(".iconImg").css("background-size", "100%");
        }
        $("#iconNum").html("0个")
    }
}