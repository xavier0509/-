function hasLogin(needQQ) {
    coocaaosapi.hasCoocaaUserLogin(function(message) {
        console.log("haslogin " + message.haslogin);
        loginstatus = message.haslogin;
        if (loginstatus == "false") {
            if (cAppVersion >= 3190030) {
                tencentWay = "both";
            } else {
                tencentWay = "qq";
            }
            user_flag = 0;
            access_token = "";
            showPage();
        } else {
            coocaaosapi.getUserInfo(function(message) {
                console.log("funnyxxxxxx==" + JSON.stringify(message))
                userInfo = message;
                cOpenId = message.open_id;
                exterInfo = message.external_info;
                mobile = message.mobile;
                avatar = message.avatar;
                if(avatar != null && avatar != "" && avatar != undefined){
                    $(".iconImg").css("background","url("+avatar+")");
                    $(".iconImg").css("background-size","100%");
                }else{
                    for (var i = 0; i < 3; i++) {
                        $(".iconImg:eq("+i+")").css("background","url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/user_1.jpg)");
                        $(".iconImg").css("background-size","100%");
                    }
                    for (var i = 3; i < 6; i++) {
                        $(".iconImg:eq("+i+")").css("background","url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/user_2.jpg)");
                        $(".iconImg").css("background-size","100%");
                    }
                    for (var i = 6; i < 10; i++) {
                        $(".iconImg:eq("+i+")").css("background","url(http://sky.fs.skysrt.com/statics/webvip/webapp/edu/user_3.jpg)");
                        $(".iconImg").css("background-size","100%");
                    }
                    
                }
                if (mobile == undefined) {
                    mobile = "";
                }
                nick_name = message.nick_name;
                coocaaosapi.getUserAccessToken(function(message) {
                    access_token = message.accesstoken;
                    if (exterInfo == "[]") {
                        exterInfo = '[{}]';
                    } else {}
                    user_flag = 1;
                    if (needQQ) {
                        qqinfo = JSON.parse(exterInfo);
                        if (qqinfo.length == 1) {
                            if (cAppVersion >= 3190030) {
                                if (JSON.stringify(qqinfo[0]) == "{}" || qqinfo[0].external_flag == "jscn") {
                                    tencentWay = "both";
                                } else {
                                    tencentWay = qqinfo[0].external_flag;
                                }
                            } else {
                                tencentWay = "qq";
                            }


                            if (qqinfo != "" && qqinfo != null && qqinfo[0].login && qqinfo[0].external_flag != "jscn") {
                                qqtoken = qqinfo[0].external_id;
                                if (qqinfo[0].external_flag == "qq") {
                                    login_type = 1;
                                } else {
                                    login_type = 2;
                                    vuserid = qqinfo[0].vuserid;
                                    if (vuserid == undefined) {
                                        vuserid = JSON.parse(qqinfo[0].refreshToken).vuserid
                                    }
                                    if (cAppVersion < 3190030) {
                                        loginstatus = "false";
                                    }
                                }
                                showPage();
                            } else {
                                tencentWay = "both";
                                loginstatus = "false";
                                showPage();
                            }
                        } else {
                            var needSelectNum = 0;
                            for (var b = 0; b < qqinfo.length; b++) {
                                needSelectNum = needSelectNum + 1;
                                if (qqinfo[b].login && qqinfo[b].external_flag != "jscn") {
                                    qqtoken = qqinfo[b].external_id;
                                    if (qqinfo[b].external_flag == "qq") {
                                        login_type = 1;
                                    } else {
                                        login_type = 2;
                                        vuserid = qqinfo[b].vuserid;
                                        if (vuserid == undefined) {
                                            vuserid = JSON.parse(qqinfo[b].refreshToken).vuserid
                                        }
                                        if (cAppVersion < 3190030) {
                                            loginstatus = "false";
                                            tencentWay = "qq";
                                        }
                                    }
                                    break
                                }
                                if (needSelectNum == qqinfo.length) {
                                    tencentWay = "both";
                                    loginstatus = "false";
                                }
                            }
                            showPage();
                        }
                    } else {
                        qqinfo = JSON.parse(exterInfo);
                        for (var b = 0; b < qqinfo.length; b++) {
                            if (qqinfo[b].login) {
                                qqtoken = qqinfo[b].external_id;
                                if (qqinfo[b].external_flag == "qq") {
                                    login_type = 1;
                                } else if (qqinfo[b].external_flag == "weixin") {
                                    login_type = 2;
                                    vuserid = qqinfo[b].vuserid;
                                    if (vuserid == undefined) {
                                        vuserid = JSON.parse(qqinfo[b].refreshToken).vuserid
                                    }
                                }
                                break;
                            } else {
                                qqtoken = "";
                            }
                        }
                        if(showFlag == access_token){
                            return;
                        }else{
                            showFlag = access_token
                            showPage();
                        }
                    }
                }, function(error) { console.log(error); })
            }, function(error) { console.log(error); });
        }

    }, function(error) { console.log(error); });
}

function startLogin(needQQ) {
    console.log("funny+++" + tencentWay);
    if (needQQ) {
        if (accountVersion > 4030000) {
            if (tencentWay == "qq") {
                coocaaosapi.startWeixinOrQQ2("LOGIN_QQ", function(message) { console.log(message); }, function(error) { console.log(error); });
            } else if (tencentWay == "weixin") {
                coocaaosapi.startWeixinOrQQ2("LOGIN_WEIXIN", function(message) { console.log(message); }, function(error) { console.log(error); });
            } else if (tencentWay == "both") {
                coocaaosapi.startWeixinOrQQ2("TENCENT", function(message) { console.log(message); }, function(error) { console.log(error); });
            }
        } else {
            coocaaosapi.startThirdQQAccount(function(message) { console.log(message); }, function(error) { console.log(error); });
        }
    } else {
        if (deviceInfo.version.replace(/\./g, "") < 550000000 && accountVersion > 4030000) {
            coocaaosapi.startUserSettingAndFinish2(function(message) { console.log(message); }, function(error) { console.log(error); });
        } else {
            coocaaosapi.startUserSettingAndFinish(function(message) { console.log(message); }, function(error) { console.log(error); });
        }
    }
}

//自定义数据
function sentLog(eventid,datalist) {
    coocaaosapi.notifyJSLogInfo(eventid, datalist, function(message) { console.log(message); }, function(error) { console.log(error); });
}


//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return decodeURI(r[2], 'utf-8');
    return null; //返回参数值
}

var android = {
    getPropertiesValue:function (value, success) {
        coocaaosapi.getPropertiesValue(value,
            function (message) {
                console.log("获取propertis的值为：" + JSON.stringify(data));
                success(message);
            },
            function (error) {
                console.log(error);
            });
    },
    startByPackName:function(packageName, success, error){
        coocaaosapi.startByPackName(packageName, function(d){
            if(typeof success == 'function'){
                success(d);
            }
        }, function (e) {
            if(typeof error == 'function'){
                error(e);
            }
        })
    },
    startParamAction: function (params, packageName, success, error) {
        try{
            if("" == params || null == params){
                android.startByPackName(packageName, success, error);
                return ;
            }
            console.log("启动应用参数为：" + params);
            console.log("启动应用包名为：" + packageName);
            var startObj = JSON.parse(params);

            var pkname = startObj.packagename;
            var dowhat = startObj.dowhat;

            var byvalue = startObj.byvalue;
            //更换系统启动action名
            byvalue = byvalue.replace("coocaa.intent.action.HOME",startActionReplace);
            var bywhat = startObj.bywhat;
            var params = startObj.params;
            var paramArray = [];
            for (var i in params) {
                var px = {};
                px[i] = params[i];
                paramArray.push(px);
            }
            coocaaosapi.startParamAction(pkname, '', dowhat, bywhat, byvalue, JSON.stringify(paramArray), function (d) {
                console.log(d);
                if(typeof success == 'function'){
                    success(d);
                }
            }, function (e) {
                console.error(e);
                if(null != packageName){
                    android.startByPackName(packageName, success, error);
                }else{
                    if(typeof error == 'function'){
                        error(e);
                    }
                }
            });
        }catch(ex){
            console.error("解析应用信息失败")
        }
    },
    sendCoinsEvent:function(event, appInfo, success, error){
        console.error("开始提交完成任务方法======="+event.eventTag+"====APP_02=="+APP_02)
        var param = {};
        param.action = "submitActivities";
        if(event.eventTag == APP_02){
            //打开应用
            var data = {};
            data.tagName = "app";
            data.appPackage=event.detailEvent1;
            data.openPage=event.detailEvent2;
            data.appName = event.title;
            data.appVersion = event.appVersionMin;
            data.memo = event.title;
            param.data = data;
            // param.appName
        }else if(event.eventTag == INSTALLAPP_01){
            //安装应用
            var data = {};
            data.tagName = "installApp";
            data.appPackage = event.detailEvent1;
            data.appVersion = appInfo.versioncode;
            data.appVersionName = appInfo.versionName;
            data.appName = appInfo.appName;
            data.memo = "安装并打开应用[" + appInfo.appName + "]";
            param.data = data;
        }else if(event.eventTag == AD_01) {
            //查看广告
            var data = {};
            data.tagName = "ad";
            data.adType = "movie";
            data.memo = "观看广告";
            param.data = data;
        }else if(event.eventTag == SIGN_UP) {
            //签到
            var data = {};
            data.tagName = "itemTag";
            data.itemTag = "SIGN_UP";
            data.memo = "签到";
            param.data = data;
        }else if(event.eventTag == FINISH_ALL_TASK){
            //完成所有任务的奖励
            var data = {};
            data.tagName = "itemTag";
            data.itemTag = "FINISH_ALL_TASK";
            data.memo = "完成所有任务奖励";
            param.data = data;
        }else{
            console.log("不需要我提交完成")
            return;
        }
        console.log("请求发放金币接口参数");
        var paramstr = JSON.stringify(param);
        coocaaosapi.getBusinessData("sync", paramstr, function(d){
            console.log("调用发放金币接口成功");
            console.log(JSON.stringify(d));
            console.log("--------success:"+d);
            if(null != success){
                success(d);
            }
        }, function(d){
            console.log("调用发放金币接口失败");
            console.log(JSON.stringify(d));
            if(null != error){
                error(d);
            }
        });
    }
};

function showtoast(data){
    $("#toast").html(data);
    $("#toast").show();
    setTimeout("$('#toast').hide()",2000);
}