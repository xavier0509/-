/**
 * Created by Mr.jr on 2018/3/30.
 */

cordova.define("coocaaosapi", function(require, exports, module) {
    console.log("hi,this is coocaaosapi-------------------------")
    var argscheck = require('cordova/argscheck'),
        channel = require('cordova/channel'),
        exec = require('cordova/exec'),
        cordova = require('cordova'),
        startapp = {
            check: function(message, completeCallback, errorCallback) {
                exec(completeCallback, errorCallback, "startApp", "check", [message]);
            },
            start: function(message, completeCallback, errorCallback) {
                exec(completeCallback, errorCallback, "startApp", "start", (typeof message === 'string') ? [message] : message);
            },
            play: function(message, completeCallback, errorCallback) {
                exec(completeCallback, errorCallback, "startApp", "play", (typeof message === 'string') ? [message] : message);
            }
        },
        brocaster = require('cordova-plugin-broadcaster.broadcaster');

    channel.createSticky('onCoocaaOsInitReady');
    channel.waitForInitialization('onCoocaaOsInitReady');

    // console.log(JSON.stringify(config));
    function CoocaaOSApi() {
        console.log("------------>CoocaaOSApi()");
        startapp.check("com.coocaa.app_browser", function(message) { /* success */
            console.log("新版浏览器存在：" + JSON.stringify(message));
            hasNewBrowers = true;
        }, function(message) {
            console.log("新版浏览器不存在：" + JSON.stringify(message));
            hasNewBrowers = false;
        });

        startapp.check("com.tianci.user", function(message) { /* success */
            console.log("账户应用版本：" + JSON.stringify(message));
            accountVersion = message.versionCode
        }, function(message) {});

        startapp.check("com.tianci.movieplatform", function(message) { /* success */
            console.log("影视应用版本：" + JSON.stringify(message));
            cAppVersion = message.versionCode
        }, function(message) {});
        var thiz = this;
        channel.onCordovaReady.subscribe(function() {
            console.log("------------>CoocaaOSApi() channel.onCordovaReady.subscribe");
            thiz.waitForCoocaaOSInitReady(function(message) {
                console.log('success CoocaaOSInitReady ' + message);
                channel.onCoocaaOsInitReady.fire();
            }, function(message) {
                console.log('error : ' + message);
            });
        });

        if (!document.querySelector('meta[http-equiv=Content-Security-Policy]')) {
            var msg = 'No Content-Security-Policy meta tag found. Please add one when using the com-lampa-whitelist plugin.';
            console.error(msg);
        }
    }

    CoocaaOSApi.prototype.waitForCoocaaOSInitReady = function(success, error) {
        console.log("------------>waitForCoocaaOSInitReady()");
        argscheck.checkArgs('ff', 'CoocaaOSApi.waitForCoocaaOSInitReady', arguments);
        exec(success, error, 'CoocaaOSApi', 'waitForOSReady', []);
    }

    /*************************************内置应用相关*************************************************/
    /*
     * 启动本地媒体
     */
    CoocaaOSApi.prototype.startLocalMedia = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startLocalMedia', arguments);
        startapp.check("com.tianci.localmedia", function(message) { /* success */
                startapp.start([
                    ["com.tianci.localmedia", "com.tianci.localmedia.MainActivity"]
                ], success, error);
            },
            error);
    }

    /*
     *启动电视设置
     */
    CoocaaOSApi.prototype.startTVSetting = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startTVSetting', arguments);
        startapp.check("com.tianci.setting", function(message) { /* success */
                console.log("启动成功");
                startapp.start([
                    ["com.tianci.setting", "com.tianci.setting.TianciSetting"]
                ], success, error);
            },
            error);
    }

    /*
     *启动信号源
     */
    CoocaaOSApi.prototype.startSourceList = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startSourceList', arguments);
        exec(success, error, 'CoocaaOSApi', 'launchSourceList', []);
    }

    /*
     *启动二维码
     */
    CoocaaOSApi.prototype.startQRCode = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startTVSetting', arguments);
        startapp.check("com.tianci.qrcode", function(message) {
            startapp.start([
                ["com.tianci.qrcode", "com.tianci.qrcode.SkyQrcode"]
            ], success, error);
        }, error);
    }

    /*
     *启动影视历史
     */
    CoocaaOSApi.prototype.startMovieHistory = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startMovieHistory', arguments);
        startapp.start([
            ["action", "coocaa.intent.movie.history"]
        ], success, error);
    }

    /*
     *启动我的游戏
     */
    CoocaaOSApi.prototype.startMyGames = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startMyGames', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.GAME_CENTER_MYGAME"]
        ], success, error);
    }

    /*
     * 启动我的应用
     * mode: child / 其他，代表启动的是哪个模式下的程序
     */
    CoocaaOSApi.prototype.startMyApps = function(mode, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startMyApps', arguments);
        if (mode == 'child') {
            startapp.start([
                ["action", "coocaa.intent.action.MYAPP_CHILD_MODEL"]
            ], success, error);
        } else {
            startapp.start([
                ["action", "coocaa.intent.action.APP_STORE_MYAPPS"]
            ], success, error);
        }
    }

    /*
     *启动用户设置
     */
    CoocaaOSApi.prototype.startUserSetting = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startUserSetting', arguments);
        startapp.start([
            ["action", "android.settings.ADD_ACCOUNT_SETTINGS"]
        ], success, error);
    }

    /*
     *启动用户设置，登录成功就消失
     */
    CoocaaOSApi.prototype.startUserSettingAndFinish = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startUserSettingAndFinish', arguments);
        startapp.start([
            ["action", "android.settings.ADD_ACCOUNT_SETTINGS"],
            [{ 'needFinish': true }]
        ], success, error);
        //开机引导时多2个参数startapp.start([["action", "android.settings.ADD_ACCOUNT_SETTINGS"],[{'needFinish':true},{'layoutType':"LOGIN_MOBILE"},{'fromGuide':true}]], success,error);
    }
    //包名类名方式启动
    CoocaaOSApi.prototype.startUserSettingAndFinish2 = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startUserSettingAndFinish', arguments);
        startapp.check("com.tianci.user", function(message) { /* success */
            startapp.start([
                ["com.tianci.user", "com.tianci.webview.AccountWebActivity"],
                [{ 'needFinish': true }]
            ], success, error);
        }, error);
    }
    //包名+action方式启动
    CoocaaOSApi.prototype.startUserSettingAndFinish3 = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startUserSettingAndFinish', arguments);
        startapp.check("com.tianci.user", function(message) { /* success */
            startapp.start([
                ["action", "android.settings.ADD_ACCOUNT_SETTINGS", "com.tianci.user"],
                [{ 'needFinish': true }]
            ], success, error);
        }, error);
    }
    //包名方式启动
    CoocaaOSApi.prototype.startUserSettingAndFinish4 = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startUserSettingAndFinish', arguments);
        startapp.start("com.coocaa.mall", success, error);
    }

    /*
     *账户4.2版本开始支持微信、qq或二选一登录：启动用户设置，登录成功就消失
     */
    CoocaaOSApi.prototype.startWeixinOrQQ = function(type, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startWeixinOrQQ', arguments);
        startapp.start([
            ["action", "android.settings.ADD_ACCOUNT_SETTINGS"],
            [{ 'needFinish': true }, { 'type': type }]
        ], success, error);
    }
    //包名类名方式启动【账户版本4.3以上，酷开版本5.5以下】
    CoocaaOSApi.prototype.startWeixinOrQQ2 = function(type, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startWeixinOrQQ', arguments);
        startapp.check("com.tianci.user", function(message) { /* success */
            startapp.start([
                ["com.tianci.user", "com.tianci.webview.AccountWebActivity"],
                [{ 'needFinish': true }, { 'type': type }]
            ], success, error);
        }, error);
    }
    /*
     *启动网络设置
     */
    CoocaaOSApi.prototype.startNetSetting = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startNetSetting', arguments);
        startapp.start([
            ["action", "android.settings.NETWORK_OPERATOR_SETTINGS"]
        ], success, error);
    }

    /*
     *启动蓝牙设置
     */
    CoocaaOSApi.prototype.startBlueToothSetting = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startBlueToothSetting', arguments);
        startapp.start([
            ["action", "android.settings.BLUETOOTH_SETTINGS"]
        ], success, error);
    }

    /*
     *启动消息盒子
     */
    CoocaaOSApi.prototype.startMessageBox = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startMessageBox', arguments);
        startapp.start([
            ["action", "com.coocaa.action.MESSAGEBOX"]
        ], success, error);
    }

    /*
     * 启动升级界面
     */
    CoocaaOSApi.prototype.startSystemUpgrade = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startSystemUpgrade', arguments);
        startapp.start([
            ["action", "android.settings.SYSTEM_UPGRADE"]
        ], success, error);
    }

    /*
     * 获取用户access_token
     */
    CoocaaOSApi.prototype.getUserAccessToken = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.getUserAccessToken', arguments);
        exec(success, error, 'CoocaaOSApi', 'getUserAccessToken', []);
    }
    /*******************************************影视相关***********************************************/
    function MovieItem() {
        var thiz = this;
    }
    /*
     * 启动影视列表页
     */
    CoocaaOSApi.prototype.startMovieList = function(listid, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startMovieList', arguments);
        startapp.start([
            ["action", "coocaa.intent.movie.list"],
            [{
                'id': listid
            }]
        ], success, error);
    }
    /*
     * 启动影视详情页
     */
    CoocaaOSApi.prototype.startMovieDetail = function(detailid, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startMovieDetail', arguments);
        startapp.start([
            ["action", "coocaa.intent.movie.detailinfo"],
            [{
                'id': detailid
            }]
        ], success, error);
    }

    /*
     * 轮播专题
     */
    CoocaaOSApi.prototype.startVideospecial = function(param,detailid, success, error) {
        argscheck.checkArgs('ssff', 'CoocaaOSApi.startVideospecial', arguments);
        startapp.start([
            ["action", "coocaa.intent.movie.videospecial"],
            [{
                'pTopicCode': detailid
            }]
        ], success, error);
    }

    /*
     *启动影视专题页
     */
    CoocaaOSApi.prototype.startMovieTopic = function(topicid, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startMovieTopic', arguments);
        startapp.start([
            ["action", "coocaa.intent.movie.special"],
            [{
                'id': topicid
            }]
        ], success, error);
    }

    /*
     *启动影视会员中心
     */
    CoocaaOSApi.prototype.startMovieMemberCenter = function(businesstype,sourceid, success, error) {
        argscheck.checkArgs('ssff', 'CoocaaOSApi.startMovieMemberCenter', arguments);
        startapp.start([
            ["action", "coocaa.intent.vip.center"],
            [{'business_type': businesstype},{'source_id':sourceid}]
        ], success, error);
    }
    /*
     *启动主页专题
     */
    CoocaaOSApi.prototype.startMovieHomeSpecialTopic = function(id, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startMovieHomeSpecialTopic', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.HOME_SPECIAL_TOPIC"],
            [{ 'id': id }]
        ], success, error);
    }


    /*启动影视会员中心2级页面*/
    CoocaaOSApi.prototype.startMovieMemberCenter2 = function(source_id, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startMovieMemberCenter2', arguments);
        startapp.start([
            ["action", "coocaa.intent.vip.center.second"],
            [{
                'source_id': source_id
            }]
        ], success, error);
    }
    /*
     *启动影视中心
     */
    CoocaaOSApi.prototype.startMovieHome = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startMovieHome', arguments);
        startapp.start([
            ["action", "coocaa.intent.movie.home"]
        ], success, error);
    }

    /*
     *  启动播放器
     *  needparse: 需要传递'true'|'false'，默认传递false
     */
    CoocaaOSApi.prototype.playOnlineMovie = function(url, name, needparse, success, error) {
        argscheck.checkArgs('sssff', 'CoocaaOSApi.playOnlineMovier', arguments);
        exec(success, error, 'CoocaaOSApi', 'startOnLinePlayer', [{
            'url': url
        }, {
            'name': name
        }, {
            'needparse': needparse
        },{
            'urlType':"url"
        }]);
    }

    /*******************************************应用相关***********************************************/
    /*
     *启动应用商城
     */
    CoocaaOSApi.prototype.startAppStore = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startAppStore', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.APP_STORE_HOME"]
        ], success, error);
    }

    /*
     *启动应用商城榜单页
     */
    CoocaaOSApi.prototype.startAppStoreBD = function(rankid, success, error) {
        argscheck.checkArgs('nff', 'CoocaaOSApi.startAppStoreBD', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.APP_STORE_RANKING"],
            [{
                'rankId': rankid
            }]
        ], success, error);
    }

    /*
     *启动应用商城分类页
     */
    CoocaaOSApi.prototype.startAppStoreSort = function(sortid, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startAppStoreSort', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.APP_STORE_SORT"],
            [{
                'sortid': sortid
            }]
        ], success, error);
    }

    /*
     *启动应用商城列表页
     */
    CoocaaOSApi.prototype.startAppStoreList = function(listid, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startAppStoreList', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.APP_STORE_LIST"],
            [{
                'listId': listid
            }]
        ], success, error);
    }

    /*
     *启动应用商城详情页
     *可以传递pkg或者id
     */
    CoocaaOSApi.prototype.startAppStoreDetail = function(idorpgk, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startAppStoreDetail', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.APP_STORE_DETAIL"],
            [{
                'id': idorpgk
            }]
        ], success, error);
    }

    /*
     *启动应用商城专题页
     */
    CoocaaOSApi.prototype.startAppStoreZone = function(zoneid, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startAppStoreZone', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.ZONEPAGE"],
            [{
                'id': zoneid
            }]
        ], success, error);
    }
    CoocaaOSApi.prototype.startOrCreateDownloadTask = function(downloadurl, md5, title, packageName, appID, iconUrl, success, error) {
        argscheck.checkArgs('ssssssff', 'CoocaaOSApi.startOrCreateDownloadTask', arguments);
        startapp.check(packageName, function(checksuccess) {
            startapp.start(packageName, success, error);
        }, function(checkerror) {
            console.log(checkerror);
            exec(success, error, 'CoocaaOSApi', 'createDownloadTask', [{
                'url': downloadurl
            }, {
                'md5': md5
            }, {
                'title': title
            }, {
                'pkg': packageName
            }, {
                'appid': appID
            }, {
                'icon': iconUrl
            }]);
        });
    }

    CoocaaOSApi.prototype.createDownloadTask = function(downloadurl, md5, title, packageName, appID, iconUrl, success, error) {
        argscheck.checkArgs('ssssssff', 'CoocaaOSApi.createDownloadTask', arguments);
        startapp.check(packageName, function(checksuccess) {
            exec(success, error, 'CoocaaOSApi', 'createDownloadTask', [{ 'url': downloadurl }, { 'md5': md5 }, { 'title': title }, { 'pkg': packageName }, { 'appid': appID }, { 'icon': iconUrl }]);
        }, function(checkerror) {
            console.log(checkerror);
            exec(success, error, 'CoocaaOSApi', 'createDownloadTask', [{ 'url': downloadurl }, { 'md5': md5 }, { 'title': title }, { 'pkg': packageName }, { 'appid': appID }, { 'icon': iconUrl }]);
        });
    }


    /*
     * 恢复下载接口
     * 传递taskid。
     *
     */
    CoocaaOSApi.prototype.resumeDownloadTask = function(taskid, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.resumeDownloadTask', arguments);
        exec(success, error, 'CoocaaOSApi', 'resumeDownloadTask', [{
            'taskid': taskid
        }]);
    }

    /*
     * 暂停下载接口
     * 传递taskid。
     *
     */
    CoocaaOSApi.prototype.pauseDownloadTask = function(taskid, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.pauseDownloadTask', arguments);
        exec(success, error, 'CoocaaOSApi', 'pauseDownloadTask', [{
            'taskid': taskid
        }]);
    }

    /*
     * 继续下载接口
     * 传递taskid。
     */
    CoocaaOSApi.prototype.deleteDownloadTask = function(taskid, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.deleteDownloadTask', arguments);
        exec(success, error, 'CoocaaOSApi', 'deleteDownloadTask', [{
            'taskid': taskid
        }]);
    }

    /*******************************************游戏相关***********************************************/
    /*
     * 启动酷游吧
     */
    CoocaaOSApi.prototype.startGameCenter = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startGameCenter', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.GAME_CENTER_HOME"]
        ], success, error);
    }

    /*
     *启动酷游吧游戏详情页
     *可以传递pkg或者id
     */
    CoocaaOSApi.prototype.startGameCenterDetail = function(idorpgk, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startGameCenterDetail', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.GAME_CENTER_DETAIL"],
            [{
                'id': idorpgk
            }]
        ], success, error);
    }

    /*
     *启动酷游吧游戏列表页
     */
    CoocaaOSApi.prototype.startGameCenterList = function(id, title, success, error) {
        argscheck.checkArgs('ssff', 'CoocaaOSApi.startGameCenterList', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.GAME_CENTER_LIST"],
            [{
                'id': id,
                'title': title
            }]
        ], success, error);
    }

    /*
     *启动酷游吧游戏专题页
     */
    CoocaaOSApi.prototype.startGameCenterZone = function(id, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startGameZone', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.GAME_CENTER_ZONE"],
            [{
                'id': id
            }]
        ], success, error);
    }

    /*
     *启动军火库
     */
    CoocaaOSApi.prototype.startGameArsenal = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startGameArsenal', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.GAME_CENTER_ARSENAL"]
        ], success, error);
    }

    /*******************************************系统相关***********************************************/
    CoocaaOSApi.prototype.hasCoocaaUserLogin = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.hasCoocaaUserLogin', arguments);
        exec(success, error, 'CoocaaOSApi', 'hasCoocaaUserLogin', []);
    }

    /*
     * 直接启动到第三方QQ登录界面
     */
    CoocaaOSApi.prototype.startThirdQQAccount = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startThirdQQAccount', arguments);
        exec(success, error, 'CoocaaOSApi', 'startQQAccount', []);
    }

    CoocaaOSApi.prototype.getUserInfo = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.getUserInfo', arguments);
        exec(success, error, 'CoocaaOSApi', 'getUserInfo', []);
    }

    CoocaaOSApi.prototype.getDeviceInfo = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.getDeviceInfo', arguments);
        exec(success, error, 'CoocaaOSApi', 'getDeviceInfo', []);
    }

    CoocaaOSApi.prototype.isNetConnected = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.isNetConnected', arguments);
        exec(success, error, 'CoocaaOSApi', 'isNetConnected', []);
    }

    CoocaaOSApi.prototype.getNetType = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.getNetType', arguments);
        exec(success, error, 'CoocaaOSApi', 'getNetType', []);
    }

    CoocaaOSApi.prototype.getIpInfo = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.getIpAddress', arguments);
        exec(success, error, 'CoocaaOSApi', 'getIpInfo', []);
    }

    CoocaaOSApi.prototype.getDeviceLocation = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.getDeviceLocation', arguments);
        exec(success, error, 'CoocaaOSApi', 'getDeviceLocation', []);
    }

    CoocaaOSApi.prototype.addNetChangedListener = function(listener) {
        argscheck.checkArgs('f', 'CoocaaOSApi.addNetChangedListener', arguments);
        brocaster.addEventListener("NET_CHANGGED", listener);
    }
    CoocaaOSApi.prototype.removeNetChangedListener = function(listener) {
        argscheck.checkArgs('f', 'CoocaaOSApi.removeNetChangedListener', arguments);
        brocaster.removeEventListener("NET_CHANGGED", listener);
    }
    CoocaaOSApi.prototype.addUSBChangedListener = function(listener) {
        argscheck.checkArgs('f', 'CoocaaOSApi.addUSBChangedListener', arguments);
        brocaster.addEventListener("USB_CHANGGED", listener);
    }

    CoocaaOSApi.prototype.removeUSBChangedListener = function(listener) {
        argscheck.checkArgs('f', 'CoocaaOSApi.removeUSBChangedListener', arguments);
        brocaster.removeEventListener("USB_CHANGGED", listener);
    }

    CoocaaOSApi.prototype.addAppTaskListener = function(listener) {
        argscheck.checkArgs('f', 'CoocaaOSApi.addAppTaskListener', arguments);
        brocaster.addEventListener("APP_TASK_CALLBACK", listener);
    }
    CoocaaOSApi.prototype.removeAppTaskListener = function(listener) {
        argscheck.checkArgs('f', 'CoocaaOSApi.removeAppTaskListener', arguments);
        brocaster.removeEventListener("APP_TASK_CALLBACK", listener);
    }
    CoocaaOSApi.prototype.addUserChanggedListener = function(listener) {
        argscheck.checkArgs('f', 'CoocaaOSApi.addUserChanggedListener', arguments);
        brocaster.addEventListener("USER_CHANGGED", listener);
    }
    CoocaaOSApi.prototype.removeUserChanggedListener = function(listener) {
        console.log("kkkkkkkkkkkkkkkkkk");
        argscheck.checkArgs('f', 'CoocaaOSApi.removeUserChanggedListener', arguments);
        brocaster.removeEventListener("USER_CHANGGED", listener);
    }
    CoocaaOSApi.prototype.addPurchaseOrderListener = function(listener) {
        argscheck.checkArgs('f', 'CoocaaOSApi.addPurchaseOrderListener', arguments);
        brocaster.addEventListener("PURCHASE_CALLBACK", listener);
    }

    CoocaaOSApi.prototype.removePurchaseOrderListener = function(listener) {
        argscheck.checkArgs('f', 'CoocaaOSApi.removePurchaseOrderListener', arguments);
        brocaster.removeEventListener("PURCHASE_CALLBACK", listener);
    }
    CoocaaOSApi.prototype.purchaseOrder = function(appcode, tradeid, productname, productsubname, producttype, specialtype, amount, count, imgurl, spec, success, error) {
        argscheck.checkArgs('sssssonnssff', 'CoocaaOSApi.purchaseOrder', arguments);
        exec(success, error, 'CoocaaOSApi', 'purchaseOrder', [{
            'appcode': appcode
        }, {
            'tradeid': tradeid
        }, {
            'productname': productname
        }, {
            'productsubname': productsubname
        }, {
            'producttype': producttype
        }, {
            'specialtype': specialtype
        }, {
            'amount': amount
        }, {
            'count': count
        }, {
            'imgurl': imgurl
        }, {
            'spec': spec
        }]);
    }

    /*******************************************cordova 2.0新增***********************************************/
    //启动集成到webSDK内部的支付页面----------即2.2.3（含）"versionCode">=2020003以上使用
    CoocaaOSApi.prototype.purchaseOrder2 = function(appcode, Tradeid, ProductName, SpecialType, amount, ProductType, payAction, cmd, token, tel, success, error) {
        argscheck.checkArgs('ssssnsssssff', 'CoocaaOSApi.purchaseOrder', arguments);
        exec(success, error, 'CoocaaOSApi', 'purchaseOrder', [{ 'appcode': appcode }, { 'Tradeid': Tradeid }, { 'ProductName': ProductName }, { 'SpecialType': SpecialType }, { 'amount': amount }, { 'ProductType': ProductType }, { 'payAction': payAction }, { 'cmd': cmd }, { 'token': token }, { 'tel': tel }]);
    }

    //启动影视支付（用于自动续费）
    CoocaaOSApi.prototype.startMoviePay = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startMoviePay', arguments);
        startapp.start([
            ["action", "coocaa.intent.movie.pay"],
            [{
                "cmd": "login"
            }]
        ], success, error);
    }

    /*获取影视app版本*/
    CoocaaOSApi.prototype.getMoviePlatformInfo = function(success, error) {
        console.log("lxw " + "getMoviePlatformInfo in coocaaosapi.js");
        argscheck.checkArgs('ff', 'CoocaaOSApi.getMoviePlatformInfo', arguments);
        exec(success, error, 'CoocaaOSApi', 'getMoviePlatformInfo', []);
    }
    /*获取主题信息*/
    CoocaaOSApi.prototype.getCurTheme = function(success, error) {
        console.log("lxw " + "getCurTheme in coocaaosapi.js");
        argscheck.checkArgs('ff', 'CoocaaOSApi.getCurTheme', arguments);
        exec(success, error, 'CoocaaOSApi', 'getCurTheme', []);
    }
    /*获取web框架信息*/
    CoocaaOSApi.prototype.getWebViewSDKInfo = function(success, error) {
        console.log("lxw " + "getWebViewSDKInfo in coocaaosapi.js");
        argscheck.checkArgs('ff', 'CoocaaOSApi.getWebViewSDKInfo', arguments);
        exec(success, error, 'CoocaaOSApi', 'getWebViewSDKInfo', []);
    }
    /*获取应用圈信息*/
    CoocaaOSApi.prototype.getAppStoreInfo = function(success, error) {
        console.log("lxw " + "getAppStoreInfo in coocaaosapi.js");
        argscheck.checkArgs('ff', 'CoocaaOSApi.getAppStoreInfo', arguments);
        exec(success, error, 'CoocaaOSApi', 'getAppStoreInfo', []);
    }
    /*设置焦点位置*/
    CoocaaOSApi.prototype.setFocusPosition = function(focuspositioninfo, success, error) {
        console.log("lxw in coocaaOsApi" + focuspositioninfo);
        argscheck.checkArgs('sff', 'CoocaaOSApi.setFocusPosition', arguments);
        exec(success, error, 'CoocaaOSApi', 'setFocusPosition', [{
            'focusposition': focuspositioninfo
        }]);
    }
    /*web页面消息上传*/
    CoocaaOSApi.prototype.notifyJSMessage = function(mywebinfo, success, error) {
        console.log("lxw in coocaaOsApi " + mywebinfo);
        argscheck.checkArgs('sff', 'CoocaaOSApi.notifyJSMessage', arguments);
        exec(success, error, 'CoocaaOSApi', 'notifyJSMessage', [{
            'webInfo': mywebinfo
        }]);
    }
    /*日志消息上传*/
    //页面启动eventId = page_onResume              map:{"title":""}
    //页面退出eventId = page_onPause               map:{"title":""}两者title必须保持一致，不可缺省

    CoocaaOSApi.prototype.notifyJSLogInfo = function(eventId, ddata, success, error) {
        console.log("sent------------" + eventId + "-------------" + ddata);
        argscheck.checkArgs('ssff', 'CoocaaOSApi.notifyJSLogInfo', arguments);
        exec(success, error, 'CoocaaOSApi', 'notifyJSLogInfo', [{
            'eventId': eventId
        }, {
            'params': ddata
        }]);
    }

    //启动酷开商城首页
    CoocaaOSApi.prototype.startAppShop = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startAppShop', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.MALL_HOME"]
        ], success, error);
    }

    //启动酷开商城列表页
    CoocaaOSApi.prototype.startAppShopList = function(id, title, success, error) {
        argscheck.checkArgs('ssff', 'CoocaaOSApi.startAppShopList', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.MALL_LIST"],
            [{
                "id": id
            }, {
                "title": title
            }]
        ], success, error);
    }

    //启动购物图文详情页
    CoocaaOSApi.prototype.startAppShopDetail = function(id, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startAppShopDetail', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.MALL_DETAIL"],
            [{
                "id": id
            }]
        ], success, error);
    }

    //启动酷开商城专题页
    CoocaaOSApi.prototype.startAppShopZone = function(id, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startAppShopZone', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.MALL_ZONE"],
            [{
                "id": id
            }]
        ], success, error);
    }
    CoocaaOSApi.prototype.startAppShopZone2 = function(id, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startAppShopZone2', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.MALL_LIST_ZONE"],
            [{
                "pageId": id
            }]
        ], success, error);
    }
    //启动酷开商城专题列表页
    CoocaaOSApi.prototype.startAppShopZoneList = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.startAppShopZoneList', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.MALL_ZONE_LIST"]
        ], success, error);
    }

    //启动酷开商城视频详情页
    CoocaaOSApi.prototype.startAppShopVideo = function(id, url, name, success, error) {
        argscheck.checkArgs('sssff', 'CoocaaOSApi.startAppShopVideo', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.MALL_VIDEO"],
            [{
                "id": id
            }, {
                "url": url
            }, {
                "name": name
            }]
        ], success, error);
    }
    //启动购物酷开商城活动列表页
    CoocaaOSApi.prototype.startAppShopBUYING = function(id, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startAppShopBUYING', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.MALL_BUYING"],
            [{
                "id": id
            }]
        ], success, error);
    }
    //启动影视内部webview
    CoocaaOSApi.prototype.startMovieWebview = function(url, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startMovieWebview', arguments);
        startapp.start([
            ["action", "coocaa.intent.movie.webview"],
            [{
                "url": url
            }]
        ], success, error);
    }
    //启动影视内部web页面
    CoocaaOSApi.prototype.startMovieWebviewInsert = function(url, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startMovieWebviewInsert', arguments);
        startapp.start([
            ["action", "coocaa.intent.movie.webview"],
            [{
                "url": url
            }]
        ], success, error);
    }
    //启动影视一级页面
    CoocaaOSApi.prototype.startMovieWebviewOnePage = function(url, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startMovieWebviewOnePage', arguments);
        startapp.start([
            ["action", "coocaa.intent.vip.center"],
            [{
                "url": url
            }]
        ], success, error);
    }
    //启动影视二级页面
    CoocaaOSApi.prototype.startMovieWebviewTwoPage = function(url, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startMovieWebviewTwoPage', arguments);
        startapp.start([
            ["action", "coocaa.intent.vip.center.second"],
            [{
                "url": url
            }]
        ], success, error);
    }
    CoocaaOSApi.prototype.startMovieSomePage = function(detailid, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.startMovieDetail', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.HOME_SPECIAL_TOPIC"],
            [{
                "id": id
            }]
        ], success, error);
    }

    //启动CIBN聚体育
    CoocaaOSApi.prototype.startCIBN = function(third_pid, from_internal, success, error) {
        argscheck.checkArgs('ssff', 'CoocaaOSApi.startCIBN', arguments);
        startapp.check("com.pptv.tvsports", function(checksuccess) {
            console.log("checksuccess = " + checksuccess);
            startapp.start([
                ["action", "android.intent.action.VIEW", "com.pptv.tvsports", " ", "pptv_tvsports://tvsports_vip_duration?third_pid=5&from_internal=1"]
            ], success, error);
        }, function(checkerror) {
            console.log("checkerror = " + checkerror);
            startapp.start([
                ["action", "android.intent.action.VIEW", "com.pptv.tvsports", " ", "pptv_tvsports://tvsports_vip_duration?third_pid=5&from_internal=1"]
            ], success, error);
        });
    }
    //启动优惠券列表页
    CoocaaOSApi.prototype.startAllCoupon = function(sign, openId, appId, businessLine, businessType, success, error) {
        argscheck.checkArgs('sssssff', 'CoocaaOSApi.startAllCoupon', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.ALLCOUPON"],
            [{ "sign": sign }, { "openId": openId }, { "appId": appId }, { "businessLine": businessLine }, { "business_type": businessType }]
        ], success, error);
    }
    //启动我的优惠券
    CoocaaOSApi.prototype.startMyCoupon = function(sign, openId, appId, businessLine, businessType, success, error) {
        argscheck.checkArgs('sssssff', 'CoocaaOSApi.startAllCoupon', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.MYCOUPON"],
            [{ "sign": sign }, { "openId": openId }, { "appId": appId }, { "businessLine": businessLine }, { "business_type": businessType }]
        ], success, error);
    }
    //获取属性
    CoocaaOSApi.prototype.getPropertiesValue = function(data, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.getPropertiesValue', arguments);
        exec(success, error, 'CoocaaOSApi', 'getPropertiesValue', [{
            'propertiesKey': data
        }]);
    }

    //获取space
    CoocaaOSApi.prototype.getSpaceInfo = function(success, error) {
        console.log("getTotalSpace   in   coocaajs")
        argscheck.checkArgs('ff', 'CoocaaOSApi.getSpaceInfo', arguments);
        exec(success, error, 'CoocaaOSApi', 'getSpaceInfo', []);
    }

    //通用监听
    CoocaaOSApi.prototype.addCommonListener = function(listener) {
        argscheck.checkArgs('f', 'CoocaaOSApi.addCommonListener', arguments);
        brocaster.addEventListener("COMMON_CHANGED", listener);
    }

    CoocaaOSApi.prototype.removeCommonListener = function(listener) {
        argscheck.checkArgs('f', 'CoocaaOSApi.removeCommonListener', arguments);
        brocaster.removeEventListener("COMMON_CHANGED", listener);
    }


    /*
     *启动通用action
     */
    CoocaaOSApi.prototype.startCommonAction = function(action, params, success, error) {
        argscheck.checkArgs('ssff', 'CoocaaOSApi.startCommonAction', arguments);
        var newParams = JSON.parse(params);
        exec(success, error, 'CoocaaOSApi', action, newParams);
    }


    //启动web播放器
    CoocaaOSApi.prototype.startCommonWebview = function(id, uri, tips, height, width, call_url, type, name, success, error) {
        console.log("启动播放器")
        argscheck.checkArgs('ssssssssff', 'CoocaaOSApi.startCommonWebview', arguments);
        startapp.start([
            ["action", "app_browser.intent.action.PLAYER", "com.coocaa.app_browser"],
            [{ "extra.id": id }, { "extra.uri": uri }, { "extra.tips": tips }, { "extra.height": height }, { "extra.width": width }, { "extra.http_call_url": call_url }, { "extra.type": type }, { "extra.name": name }]
        ], success, error);
    }



    //启动新版本浏览器【无路径，即不启动多层activity】
    //##启动方式 
    // ###透明主题 
    // ####有路径
    //         Intent intent= new Intent("com.coocaa.app_browser");
    //         intent.setAction("coocaa.intent.action.browser");
    //         intent.putExtra("url","http://www.www.www");
    //         intent.setFlags(  Intent.FLAG_ACTIVITY_MULTIPLE_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
    // ####无路径
    //         Intent intent= new Intent("com.coocaa.app_browser");
    //         intent.setAction("coocaa.intent.action.browser.no_route");
    //         intent.putExtra("url","http://www.www.www");

    // ###非透明主题 
    // ####有路径
    //         Intent intent= new Intent("com.coocaa.app_browser");
    //         intent.setAction("coocaa.intent.action.browser.no_trans");
    //         intent.putExtra("url","http://www.www.www");
    //         intent.setFlags(  Intent.FLAG_ACTIVITY_MULTIPLE_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
    // ####无路径
    //         Intent intent= new Intent("com.coocaa.app_browser");
    //         intent.setAction("coocaa.intent.action.browser.no_trans.no_route");
    //         intent.putExtra("url","http://www.www.www");
    CoocaaOSApi.prototype.startNewBrowser = function(url, success, error) {
        console.log("启动新版浏览器")
        argscheck.checkArgs('sff', 'CoocaaOSApi.startNewBrowser', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.browser.no_trans", "com.coocaa.app_browser"],
            [{ "url": url }]
        ], success, error);
    }
    CoocaaOSApi.prototype.startNewBrowser2 = function(url, success, error) {
        console.log("启动新版浏览器")
        argscheck.checkArgs('sff', 'CoocaaOSApi.startNewBrowser', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.browser.no_trans.no_route", "com.coocaa.app_browser"],
            [{ "url": url }]
        ], success, error);
    }
    //启动新版浏览器+++activity【有路径，即启动多层activity】
    //如需要启动透明的，使用action：coocaa.intent.action.browser.withroute
    CoocaaOSApi.prototype.startNewBrowser3 = function(url, success, error) {
        console.log("启动新版浏览器")
        var FLAG_ACTIVITY_NEW_TASK = 268435456;
        var FLAG_ACTIVITY_MULTIPLE_TASK = 134217728;
        var task = FLAG_ACTIVITY_NEW_TASK | FLAG_ACTIVITY_MULTIPLE_TASK;
        argscheck.checkArgs('sff', 'CoocaaOSApi.startNewBrowser2', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.browser", "com.coocaa.app_browser", "", "", task + ""],
            [{ "url": url }]
        ], success, error);
    }
    CoocaaOSApi.prototype.startNewBrowser4 = function(url, success, error) {
        console.log("启动新版浏览器")
        var FLAG_ACTIVITY_NEW_TASK = 268435456;
        var FLAG_ACTIVITY_MULTIPLE_TASK = 134217728;
        var task = FLAG_ACTIVITY_NEW_TASK | FLAG_ACTIVITY_MULTIPLE_TASK;
        argscheck.checkArgs('sff', 'CoocaaOSApi.startNewBrowser2', arguments);
        startapp.start([
            ["action", "coocaa.intent.action.browser.no_trans", "com.coocaa.app_browser", "", "", task + ""],
            [{ "url": url }]
        ], success, error);
    }

    CoocaaOSApi.prototype.notifyJSLogResumeInfo = function(eventId, ddata, success, error) {
        console.log("resume===============")
        argscheck.checkArgs('ssff', 'CoocaaOSApi.notifyJSLogResumeInfo', arguments);
        exec(success, error, 'CoocaaOSApi', 'notifyJSLogInfoExtra', [{ 'eventId': eventId }, { 'params': ddata }, { 'type': 'resume' }]);
    }

    CoocaaOSApi.prototype.notifyJSLogPauseInfo = function(eventId, success, error) {
        console.log("pause===============")
        argscheck.checkArgs('sff', 'CoocaaOSApi.notifyJSLogPauseInfo', arguments);
        exec(success, error, 'CoocaaOSApi', 'notifyJSLogInfoExtra', [{ 'eventId': eventId }, { 'params': '{}' }, { 'type': 'pause' }]);
    }

    /*
     * 检测是否装有apk
     */
    CoocaaOSApi.prototype.hasApk = function(pkg, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.hasApk', arguments);
        startapp.check(pkg, success, error);
    }

    /*
     *退出用户登录状态
     */
    CoocaaOSApi.prototype.setCoocaaUserLogout = function(success, error) {
        argscheck.checkArgs('ff', 'CoocaaOSApi.setCoocaaUserLogout', arguments);
        exec(success, error, 'CoocaaOSApi', 'setCoocaaUserLogout', []);
    }

    //获取内存
    CoocaaOSApi.prototype.getMemInfo = function(success, error) {
        console.log("getMemInfo   in   coocaajs")
        argscheck.checkArgs('ff', 'CoocaaOSApi.getMemInfo', arguments);
        exec(success, error, 'CoocaaOSApi', 'getMemInfo', []);
    }

    /*获取app相关信息*/
    //参数传递一个对象，key为"pkgList",value为应用包名的数组。即{pkgList:["com.tianci.user","com.tianci.movieplatform"]}
    CoocaaOSApi.prototype.getAppInfo = function(packageName, success, error) {
        console.log("getAppInfo in coocaaosapi.js");
        argscheck.checkArgs('sff', 'CoocaaOSApi.getAppInfo', arguments);
        exec(success, error, 'CoocaaOSApi', 'getAppInfo', [{ 'pkgList': packageName }]);
    }
    /*获取push相关信息*/
    //参数传递一个对象，key为"pkgList",value为应用包名的数组。即{pkgList:["com.tianci.user","com.tianci.movieplatform"]}
    CoocaaOSApi.prototype.getPushInfo = function(packageName, success, error) {
        console.log("getPushInfo in coocaaosapi.js");
        argscheck.checkArgs('sff', 'CoocaaOSApi.getPushInfo', arguments);
        exec(success, error, 'CoocaaOSApi', 'getPushInfo', [{ 'pkgList': packageName }]);
    }

    //获取基础信息
    CoocaaOSApi.prototype.getBaseInfo = function(success, error) {
        console.log("getBaseInfo   in   coocaajs")
        argscheck.checkArgs('ff', 'CoocaaOSApi.getBaseInfo', arguments);
        exec(success, error, 'CoocaaOSApi', 'getBaseInfo', []);
    }

    /*获取Business相关信息*/
    CoocaaOSApi.prototype.getBusinessData = function(cc_type, cc_data, success, error) {
        console.log("getBusinessData in coocaaosapi.js");
        argscheck.checkArgs('ssff', 'CoocaaOSApi.getBusinessData', arguments);
        exec(success, error, 'CoocaaOSApi', 'getBusinessData', [{ 'cc_data': cc_data }, { 'cc_type': cc_type }]);
    }

    /*设置Business相关信息*/
    //cc_type区分同步、异步。默认为异步（async）,只有传sync时才会更改
    CoocaaOSApi.prototype.setBusinessData = function(cc_type, cc_data, success, error) {
        console.log("setBusinessData in coocaaosapi.js");
        argscheck.checkArgs('ssff', 'CoocaaOSApi.setBusinessData', arguments);
        exec(success, error, 'CoocaaOSApi', 'setBusinessData', [{ 'cc_data': cc_data }, { 'cc_type': cc_type }]);
    }

    //启动传参action 
    // 包名、版本号、startActivity、action、action名、拓展参数[{key1:"value1"},{key2:"value2"}]
    CoocaaOSApi.prototype.startParamAction = function(pkname, version, activity, action, param, str, success, error) {
        console.log("启动传参action")
        argscheck.checkArgs('ssssssff', 'CoocaaOSApi.startParamAction', arguments);
        str = JSON.parse(str);
        startapp.start([
            ["action", param, pkname], str
        ], success, error);
    }

    //
    /*web页面判断是否放开上下键需求*/
    CoocaaOSApi.prototype.setSpecialMachine = function(machineList, success, error) {
        argscheck.checkArgs('sff', 'CoocaaOSApi.setSpecialMachine', arguments);
        exec(success, error, 'CoocaaOSApi', 'setSpecialMachine', [{ 'machineList': machineList }]);
    }

    //启动主页指定tab
    // 1、如果系统是6.x的，action是coocaa.intent.action.HOME
    // 2、如果系统是5.x的，需要判断一下persist.service.homepage.pkg这个prop，如果值是com.tianci.movieplatform，那么action是coocaa.intent.action.HOME.Translucent  否则 action就是coocaa.intent.movie.home
    // 3、跳转到指定tab上，intent附带参数，key是jumpToPage 值是tab的id，由运营提供
    CoocaaOSApi.prototype.startHomeTab = function(actionName, tabid, success, error) {
        argscheck.checkArgs('ssff', 'CoocaaOSApi.startHomeTab', arguments);
        startapp.start([
            ["action", actionName],
            [{ 'jumpToPage': tabid }]
        ], success, error);
    }

    /*
     *启动主页专题
     */
    CoocaaOSApi.prototype.startHomeCommonList = function(id,success,error){
        argscheck.checkArgs('sff','CoocaaOSApi.startHomeCommonList',arguments);
        startapp.start([["action", "coocaa.intent.action.HOME_COMMON_LIST"],[{'id':id}]], success,error);
    }

    module.exports = new CoocaaOSApi();
});

cordova.define("cordova-plugin-broadcaster.broadcaster", function(require, exports, module) {
    var exec = require('cordova/exec');
    var channel = require('cordova/channel');

    module.exports = {

        _channels: {},
        createEvent: function(type, data) {
            var event = document.createEvent('Event');
            event.initEvent(type, false, false);
            if (data) {
                for (var i in data) {
                    if (data.hasOwnProperty(i)) {
                        event[i] = data[i];
                    }
                }
            }
            return event;
        },
        fireNativeEvent: function(eventname, data, success, error) {
            exec(success, error, "broadcaster", "fireNativeEvent", [eventname, data]);
        },
        fireEvent: function(type, data) {
            var event = this.createEvent(type, data);
            if (event && (event.type in this._channels)) {
                this._channels[event.type].fire(event);
            }
        },

        addEventListener: function(eventname, f) {
            if (!(eventname in this._channels)) {
                console.log("00000===" + eventname);

                var me = this;
                exec(function() {
                    me._channels[eventname] = channel.create(eventname);
                    me._channels[eventname].subscribe(f);
                }, function(err) {
                    console.log("ERROR addEventListener: " + err)
                }, "broadcaster", "addEventListener", [eventname]);
            } else {
                console.log("1111===" + eventname);
                var me = this;
                exec(function() {
                    //  me._channels[eventname].subscribe(f);
                }, function(err) {
                    console.log("ERROR addEventListener: " + err)
                }, "broadcaster", "addEventListener", [eventname]);

            }
        },
        removeEventListener: function(eventname, f) {
            if (eventname in this._channels) {
                var me = this;
                exec(function() {}, function(err) {
                    console.log("ERROR removeEventListener: " + err)
                }, "broadcaster", "removeEventListener", [eventname]);
            }
        }

    };

});