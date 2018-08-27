var accountVersion = ""; // 账户版本
var cAppVersion = ""; //影视版本
var deviceInfo = null; //设备信息
var macAddress = null; //mac
var TVmodel = null; //机型	
var TVchip = null; //机芯
var activityId = null; //激活id	
var loginstatus = null; //登录状态-string
var tencentWay = null; //腾讯源机器调用登录的要求（both,qq,weixin)
var user_flag = null; //下单传递用户标识1-token；2-openid
var access_token = null; //token值
var login_type = null; //下单拓展信息 0-手机；1-qq;2-weixin
var vuserid = null; //vuserid
var showFlag = null; //用于判断当前账户是否发生改变，防止多次监听到账户变化多次刷新页面
var cOpenId = null;
var nick_name = null;
var _hasloginandfresh = false;

var CLIENTID = "1AC139C3C3B92CE2";
var _hasStartLogin = false; //用户默认未点击登录，用于登录后直接跳转标识
var memberAdress = "https://member.coocaa.com"//"http://172.20.132.206:7070";//
var activityAdress = "https://restful.skysrt.com"//"http://beta.restful.lottery.coocaatv.com";//
var payAdress = "https://api-business.skysrt.com"//"http://172.20.132.182:8090";//
var _actionid = null;//活动id
var lotteryCode = null;//init接口获取的抽奖id
var remainingTimes = null ;//init接口获取的剩余抽奖次数
var usedTimes = null;//init接口获取的已经抽取的次数
var _awardExtend =null;//激活权益的拓展信息

var _setAge = null; //设置的年龄段
var _getAge = null; //获取到的年龄段
var nowLevel = 0; //当前用户等级
var hascoins = 0; //拥有的智慧果数
var dayCoins = 0; //一天所获取的智慧果数
var rememberMapFocus = null;

var nextCoinNum = 0; //到达下一关还需？个智慧果
var nextLevelName = null; //下一关解锁名称
var _uniqueid = null;
var _appcode = null;
var _productid = null;
var _price = null;
var needFresh = false//resume时是否需要刷新
var hasgotvipright = false;

var getviprank = null;//查询领取vip信息表的数据
var buyviprank = null;//查询购买产品包信息表的数据

var thispkgtype = null;//购买产品包类型3months,6mongths
var thisvipid = null;//领取vip类型3days，15days

var daysWord = null;//领取成功后显示多少天会员
var desWord = null;//领取成功后显示哪个年龄段；
var _tabid = null;//领取成功后需要跳转的tabid

var _ractivityid = null;//激活时传活动id
var _rawardId = null;//激活时传奖品id
var _rlotteryAwardRememberId = null;//激活时传奖品记录id
var _rawardTypeId = null;//激活时传奖品类型id
var vip_type = 0;//日志上传时，表明会员类型（0-3天，1-15天）
var refreshPayResult = false;   //支付完成监听，防止多次

var log_getvip_age = 0;//提交日志时，领取会员选择的年龄

var log_buyvip_age = 0;//提交日志时，买会员选择的年龄
var log_buyvip_type = 0;//0=季包，1=半年包

var startNoReveice = false;
var orderId = null;

//任务类型
	VIDEO = "100",
    VIDEO_01 = "10001",
    VIDEO_02 = "10002",
    VIDEO_03 = "10003",
    VIDEO_04 = "10004",
    VIDEO_05 = "10005",
    AD = "200",
    AD_01 = "20001",
    AD_02 = "20002",
    APP = "300",
    APP_01 = "30001",
    APP_02 = "30002",
    APP_03 = "30003",
    VOICE_01 = "60001",
    INSTALLAPP_01 = "70001",
    NEW_USER = "NEW_USER",
    SUBSCRIBE = "SUBSCRIBE",
    FIRST_START_VOICE_APP = "FIRST_START_VOICE_APP",
    FINISH_ALL_TASK = "FINISH_ALL_TASK",
    SIGN_UP = "SIGN_UP";

var dowLoadAppInfo = {};
var startActionReplace = "coocaa.intent.action.HOME";
var subscribeImgUrl = "";
var tipsOn = true;
const MIN_VOICE_MEM = 768*1024*1024;//768M
const MIN_INSTALL_SPACE = 200*1024*1024;//200M
var CAN_USE_VOICE = true; //是否值支持语音任务
var CAN_INSTALL_APP = true;//是否支持安装app
var requireAppInfos = {}; //系统的语音任务和主页任务的信息。
var UPDATE_MOVIE_APP = false; //是否升级了最新的影视app
var UPDATE_VOICE_APP = false; //是否升级了最新的语音app
var UPDATE_ACTIVE_APP = false; //是否升级了最新的活动app
var MOVIE_ACTIVITY_VERSION = 3300066;
var VOICE_ACTIVITY_VERSION = 4000042;
var ACTIVITY_VERSION = 101014;
//var ACTIVITY_VERSION = 101016;  //测试调高的版本号
var ACTIVITY_REQUIRED_APK_PKG = ["com.tianci.movieplatform","com.skyworth.lafite.srtnj.speechserver","com.coocaa.activecenter"];
var FIRST_START_VOICE_APP_INFO = {"appPackage":"com.skyworth.lafite.srtnj.speechserver", "appVersionMin":4000042, "appVersionMax":9999999}

var activity_app_download_info = {
    url: "https://apk-sky-fs.skysrt.com/uploads/20180612/20180612201648472551.apk",
    md5: "C77A51F2F4B72A10AA99550D854F1A6A",
    name: "ActiveCenter",
    pkg: "com.coocaa.activecenter",
    appId: 26417,
    fileSize:5205338,
    icon: "https://img.sky.fs.skysrt.com/uploads/20180612/20180612201648024761.png"
}




//关卡最小值、称号
var levelInfo = {
    level1: { levelname: "小小学渣", mincoins: 0 },
    level2: { levelname: "倔强学渣", mincoins: 21 },
    level3: { levelname: "不屈学渣", mincoins: 42 },
    level4: { levelname: "潜力学渣", mincoins: 63 },
    level5: { levelname: "奋斗学渣", mincoins: 84 },
    level6: { levelname: "最强学渣", mincoins: 105 },
    level7: { levelname: "边缘学霸", mincoins: 126 },
    level8: { levelname: "热血学霸", mincoins: 147 },
    level9: { levelname: "实力学霸", mincoins: 168 },
    level10: { levelname: "天才学霸", mincoins: 189 }
}

var rightinfo = {
    r1: { uniqueid: "coocaa-P-3Days-HxNCGkiz", appcode: "7759", tabid: "10709", desWord: "0-2岁" },
    r2: { uniqueid: "coocaa-P-3Days-5y4X7R49", appcode: "7759", tabid: "10705", desWord: "3-6岁" },
    r3: { uniqueid: "coocaa-P-3Days-BA08lpQv", appcode: "7759", tabid: "10711", desWord: "一年级" },
    r4: { uniqueid: "coocaa-P-3Days-bIsyRxlE", appcode: "7759", tabid: "10736", desWord: "二年级" },
    r5: { uniqueid: "coocaa-P-3Days-bI2H7Jk5", appcode: "7759", tabid: "10715", desWord: "三年级" },
    r6: { uniqueid: "coocaa-P-3Days-Y9R58QtS", appcode: "7759", tabid: "10717", desWord: "四年级" },
    r7: { uniqueid: "coocaa-P-3Days-DvWNB4z4", appcode: "7759", tabid: "10719", desWord: "五年级" },
    r8: { uniqueid: "coocaa-P-3Days-B850lKK2", appcode: "7759", tabid: "10735", desWord: "六年级" },
    r9: { uniqueid: "coocaa-P-3Days-SH82Glvz", appcode: "7759", tabid: "10723", desWord: "初一" },
    r10: { uniqueid: "coocaa-P-3Days-NNyEXt8F", appcode: "7759", tabid: "10725", desWord: "初二" },
    r11: { uniqueid: "coocaa-P-3Days-Yg5g7B3Z", appcode: "7759", tabid: "10728", desWord: "初三" },
    r12: { uniqueid: "coocaa-P-3Days-vh6J05Ws", appcode: "7759", tabid: "10729", desWord: "高一" },
    r13: { uniqueid: "coocaa-P-3Days-416L82rK", appcode: "7759", tabid: "10731", desWord: "高二" },
    r14: { uniqueid: "coocaa-P-3Days-1S0W5W3o", appcode: "7759", tabid: "10733", desWord: "高三" },
    r15: { uniqueid: "coocaa-P-15Days-QoEDiR7f", appcode: "7759", tabid: "10709", desWord: "0-2岁" },
    r16: { uniqueid: "coocaa-P-15Days-iyhSa6qM", appcode: "7759", tabid: "10705", desWord: "3-6岁" },
    r17: { uniqueid: "coocaa-P-15Days-PGlFq3bH", appcode: "7759", tabid: "10711", desWord: "一年级" },
    r18: { uniqueid: "coocaa-P-15Days-4CZ3xKql", appcode: "7759", tabid: "10736", desWord: "二年级" },
    r19: { uniqueid: "coocaa-P-15Days-1vL853qV", appcode: "7759", tabid: "10715", desWord: "三年级" },
    r20: { uniqueid: "coocaa-P-15Days-qT78I9eH", appcode: "7759", tabid: "10717", desWord: "四年级" },
    r21: { uniqueid: "coocaa-P-15Days-Rl4H7UZY", appcode: "7759", tabid: "10719", desWord: "五年级" },
    r22: { uniqueid: "coocaa-P-15Days-Fh52626n", appcode: "7759", tabid: "10735", desWord: "六年级" },
    r23: { uniqueid: "coocaa-P-15Days-l3IsW0Bj", appcode: "7759", tabid: "10723", desWord: "初一" },
    r24: { uniqueid: "coocaa-P-15Days-Gd12VjGZ", appcode: "7759", tabid: "10725", desWord: "初二" },
    r25: { uniqueid: "coocaa-P-15Days-JDlSXGY0", appcode: "7759", tabid: "10728", desWord: "初三" },
    r26: { uniqueid: "coocaa-P-15Days-26RBT5SD", appcode: "7759", tabid: "10729", desWord: "高一" },
    r27: { uniqueid: "coocaa-P-15Days-3bO6z35g", appcode: "7759", tabid: "10731", desWord: "高二" },
    r28: { uniqueid: "coocaa-P-15Days-XLFQ5UKQ", appcode: "7759", tabid: "10733", desWord: "高三" }
}

var pkgInfo = {
    r1: { productid: "997", price: "6320" },
    r2: { productid: "998", price: "6320" },
    r3: { productid: "999", price: "8640" },
    r4: { productid: "1000", price: "8640" },
    r5: { productid: "1001", price: "8640" },
    r6: { productid: "1002", price: "8640" },
    r7: { productid: "1003", price: "8640" },
    r8: { productid: "1004", price: "8640" },
    r9: { productid: "1005", price: "8640" },
    r10: { productid: "1006", price: "8640" },
    r11: { productid: "1007", price: "8640" },
    r12: { productid: "1008", price: "8640" },
    r13: { productid: "1009", price: "8640" },
    r14: { productid: "1010", price: "8640" },
    r15: { productid: "983", price: "13900" },
    r16: { productid: "984", price: "13900" },
    r17: { productid: "985", price: "19800" },
    r18: { productid: "986", price: "19800" },
    r19: { productid: "987", price: "19800" },
    r20: { productid: "988", price: "19800" },
    r21: { productid: "989", price: "19800" },
    r22: { productid: "990", price: "19800" },
    r23: { productid: "991", price: "19800" },
    r24: { productid: "992", price: "19800" },
    r25: { productid: "993", price: "19800" },
    r26: { productid: "994", price: "19800" },
    r27: { productid: "995", price: "19800" },
    r28: { productid: "996", price: "19800" }
}


var missionList = [{
        "appMinVersion": 0,
        "appPackage": "",
        "appVersionMax": 0,
        "appVersionMin": 0,
        "clickAction": "{\"params\":{}}",
        "completeRunningDay": 1,
        "cycle": 1,
        "description": "教育测试任务",
        "detailEvent1": "",
        "detailEvent2": "",
        "eventTag": "10002",
        "getDate": null,
        "getNum": 0,
        "getTime": null,
        "groupTag": "100",
        "increaseType": 2,
        "lastRuningDate": null,
        "maxNum": 18,
        "missionId": 636,
        "receiveNum": 0,
        "requireApp": [],
        "rewards": "13",
        "rewardsStatus": 0,
        "runningTime": 0,
        "sortOrder": 1,
        "status": -1,
        "subTitle": "",
        "title": "教育测试任务",
        "type": 1,
        "userMissionId": 0,
        "videoDescription": ""
    }
]
//type奖励类型===1称号，2购物立减，3--8折，4--6送1,5--3天权益，6--15天权益
var awardList = {
    level1: [{ title: "有声图书套装立减30元", type: 2 }, { title: "解锁【倔强学渣】", type: 1 }],
    level2: [{ title: "3天会员权益", type: 5, vipId: "3days" }, { title: "解锁【不屈学渣】", type: 1 }],
    level3: [{ title: "9折购鲁奇亚早教机特权", type: 2 }, { title: "解锁【潜力学渣】", type: 1 }],
    level4: [{ title: "8折季卡购买特权", type: 3,pkgType:"3months" }, { title: "解锁【奋斗学渣】", type: 1 }],
    level5: [{ title: "购智能机器人立减100元", type: 2 }, { title: "解锁【最强学渣】", type: 1 }],
    level6: [{ title: "买六送一购买特权", type: 4 ,pkgType:"6months"}, { title: "解锁【边缘学霸】", type: 1 }],
    level7: [{ title: "折扣购格灵点读笔", type: 2 }, { title: "解锁【热血学霸】", type: 1 }],
    level8: [{ title: "智能早教机折扣购物专场", type: 2 }, { title: "解锁【实力学霸】", type: 1 }],
    level9: [{ title: "15天会员权益", type: 6, vipId: "15days" }, { title: "解锁【天才学霸】", type: 1 }],
}