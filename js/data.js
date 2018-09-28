var accountVersion = ""; // 账户版本
var cAppVersion = ""; //影视版本
var deviceInfo = null; //设备信息
var macAddress = null; //mac
var TVmodel = null; //机型	
var TVchip = null; //机芯
var activityId = null; //激活id
var emmcId = null;//emmcid;
var loginstatus = null; //登录状态-string
var tencentWay = null; //腾讯源机器调用登录的要求（both,qq,weixin)
var user_flag = null; //下单传递用户标识1-token；2-openid
var access_token = null; //token值
var login_type = null; //下单拓展信息 0-手机；1-qq;2-weixin
var vuserid = null; //vuserid
var showFlag = null; //用于判断当前账户是否发生改变，防止多次监听到账户变化多次刷新页面
var cOpenId = null;
var nick_name = null;
var movieSource = null;
var needQQ = false;

var initType = "all";
var needgotoshop = false;
var exitWeb = false;
var rememberMapFocus = null;//记录最新的地图的落焦位置
var needFresh = false;//resume时是否需要刷新
var refreshPayResult = false;   //支付完成监听，防止多次
var needRememberFocus = false;//刷新后是否需要记录焦点
var rememberFocus = null;//刷新后需要记录的焦点选择器

var setFocusFirst = false;//用于初始化焦点时的标志位，若true则不再焦点化【离起点最近的未点亮】
var lightCity = [];//已经点亮城市的列表
var cityNum = null;//点亮的城市数
var totalNum = null;//总的点亮次数
var remainNum = null;//剩余点亮次数
var giveCard = null;
var needShowWindow = false;

var gameStatus = "start";
var beginTime = null;
var endTime = null;
var nowTime = null;
var forNum = 0;

// var adressIp = "http://beta.restful.lottery.coocaatv.com";
var adressIp = "https://restful.skysrt.com";
// var actionId = "143";
var actionId = "55";

var _listenObj = null;
var _listenNum = null;
var _listenType = null;

var comefrom = 0; //影视：0；教育：1；购物：2[任务版面]

var needSentUserLog = false;
var startActionReplace = "coocaa.intent.action.HOME";

var drawurl = "https://webapp.skysrt.com/national/lottery/index.html?part=draw&source=main";
var awardurl = "https://webapp.skysrt.com/national/lottery/index.html?part=award&source=main&status=";
var mainurl = "https://webapp.skysrt.com/national/main/index.html";

// var drawurl = "http://beta.webapp.skysrt.com/lxw/gq/index.html?part=draw&source=main";
// var awardurl = "http://beta.webapp.skysrt.com/lxw/gq/index.html?part=award&source=main&status=";
// var mainurl = "http://beta.webapp.skysrt.com/games/yure/index.html";

var _powerData = {
    "city1":{"from":"——李静宜《台湾海峡的风》","title":"台湾海峡的风，吹向稀微的山坪。","name":"台北101","img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/city1.png","lightimg":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/fcity1.png"},
    "city2":{"from":"——广州童谣《月光光》","title":"月光光照地堂，年三晚摘槟榔，五谷丰收堆满仓。","name":"广州小蛮腰","img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/city2.png","lightimg":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/fcity2.png"},
    "city3":{"from":"——宋之问《始安秋日》","title":"桂林风景异,秋似洛阳春。 ","name":"桂林象鼻山","img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/city3.png","lightimg":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/fcity3.png"},
    "city4":{"from":"——俞仪《天心阁眺望》","title":"楼高浑似踏虚空，四面云山屏障同。","name":"长沙天心阁","img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/city4.png","lightimg":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/fcity4.png"},
    "city5":{"from":"——苏轼《饮湖上初晴后雨二首》","title":"欲把西湖比西子，淡妆浓抹总相宜。","name":"杭州西湖","img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/city5.png","lightimg":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/fcity5.png"},
    "city6":{"from":"——张继《枫桥夜泊》","title":"月落乌啼霜满天，江枫渔火对愁眠。","name":"苏州寒山寺","img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/city6.png","lightimg":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/fcity6.png"},
    "city7":{"from":"——《乌苏里船歌》","title":"乌苏里江人儿笑，笑开了满山红杜鹃。","name":"索菲亚教堂","img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/city7.png","lightimg":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/fcity7.png"},
    "city8":{"from":"——佚名《敕勒歌》","title":"天苍苍，野茫茫。风吹草低见牛羊。","name":"鄂尔多斯大草原","img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/city8.png","lightimg":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/fcity8.png"},
    "city9":{"from":"——杨慎《敦煌乐》","title":"白雁西风紫塞，皂雕落日黄沙。","name":"敦煌莫高窟","img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/cityn9.png","lightimg":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/fcityn9.png"},
    "city10":{"from":"——陶渊明《还旧居》","title":"步步寻往迹，有处特依依。","name":"塔克拉玛干沙漠","img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/city10.png","lightimg":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/fcity10.png"},
    "city11":{"from":"——布达拉宫门前题词","title":"竺法渐传三界远，盛音近绕佛堂前。","name":"布达拉宫","img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/city11.png","lightimg":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/fcity11.png"},
    "city12":{"from":"——郝云《去大理》","title":"不喜欢这里，不如一路向西去大理。","name":"大理三塔","img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/city12.png","lightimg":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/fcity12.png"},
    "city13":{"from":"——赵雷《成都》","title":"走到玉林路的尽头，坐在小酒馆的门口。","name":"成都安顺廊桥","img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/city13.png","lightimg":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/fcity13.png"},
    "city14":{"from":"——蔡榷《登慈恩寺雁塔怀汴京》","title":"叠叠燕台迷蓟羯，层层雁塔却幽州。","name":"西安大雁塔","img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/city14.png","lightimg":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/fcity14.png"},
    "city15":{"from":"——《天安门诗八首》","title":"烈士碑前人如潮,缕缕哀思化怒涛。","name":"北京天安门","img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/city15.png","lightimg":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mainMap/fcity15.png"}
}

var _eduinfo = {
    "pkg1":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/edu1.png","id":"_otx_tch_hdeh023","name":"超级飞侠","type":"1"},
    "pkg2":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/edu2.png","id":"_otx_tch_bomei041","name":"小猪佩奇","type":"1"},
    "pkg3":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/edu3.png","id":"_otx_tch_hdeh021","name":"小马宝莉大电影3-友谊大赛","type":"1"},
    "pkg4":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/edu4.png","id":"1455","name":"小学同步辅导","type":"99"},
    "pkg5":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/edu5.png","id":"_otx_tch_jiukan065","name":"宝宝辅食烩","type":"1"},
    "pkg6":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/edu6.png","id":"_otx_tch_jiukan071","name":"宝妈瑜伽第6季","type":"1"}
}
var _mallinfo = {
    "pkg1":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/shop1.png","id":"13515","name":"SWISSWIN优选24英寸拉杆箱套组","type":"2"},
    "pkg2":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/shop2.png","id":"15106","name":"双立人随心生活搅拌机套装","type":"2"},
    "pkg3":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/shop3.png","id":"16535","name":"康宁新一代多功能蒸烤箱旗舰装S","type":"2"},
    "pkg4":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/shop4.png","id":"16007","name":"瑞琪奥兰UMF10新西兰麦卢卡蜂蜜养生套组","type":"2"},
    "pkg5":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/shop5.png","id":"15939","name":"日本泰福高尊享保温套组","type":"2"},
    "pkg6":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/shop6.png","id":"16118","name":"康浩电动扫拖一体机1加1组","type":"2"}
}
var _tencentinfo = {
    "pkg1":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/tx1.jpg","id":"_otx_fgqtuu38z91hfyw","name":"一出好戏","type":"0"},
    "pkg2":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/tx2.jpg","id":"_otx_mlet450ud9xai1h","name":"侏罗纪世界2","type":"0"},
    "pkg3":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/tx3.jpg","id":"_otx_6983f15b7g5xch7","name":"动物世界 ","type":"0"},
    "pkg4":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/tx4.jpg","id":"_otx_coqnq6i120wojq6","name":"复仇者联盟3：无限战争 ","type":"0"},
    "pkg5":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/tx5.jpg","id":"_otx_7ai02pj2ra57ev8","name":"橙红年代 ","type":"0"},
    "pkg6":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/tx6.jpg","id":"_otx_hf3sw5dijpzz0h2","name":"欧洲攻略 ","type":"0"}
}
var _yinheinfo = {
    "pkg1":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/qy1.jpg","id":"102668","name":"一出好戏","type":"66"},
    "pkg2":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/qy2.jpg","id":"102667","name":"动物世界","type":"66"},
    "pkg3":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/qy33.jpg","id":"102562","name":"漫威系列","type":"66"},
    "pkg4":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/qy4.jpg","id":"_oqy_215589001","name":"橙红年代 ","type":"0"},
    "pkg5":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/qy5.jpg","id":"_oqy_760312500","name":"欧洲攻略","type":"0"},
    "pkg6":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/mycard/qy6.jpg","id":"_oqy_222869601","name":"鸣鸿传","type":"0"}
}

var _tencentPkginfo = {
    "pkg1":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/moreChance/txpkg1.png","product_id":"1103","price":"6800","name":"腾讯季卡","type":"0"},
    "pkg2":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/moreChance/txpkg2.png","product_id":"1102","price":"19900","name":"腾讯年卡","type":"0"},
    "pkg3":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/moreChance/edupkg3.png","product_id":"1107","price":"9800","name":"三年级季卡","type":"1"},
    "pkg4":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/moreChance/edupkg4.png","product_id":"1106","price":"11120","name":"3-6岁半年卡","type":"1"}
}
var _yinhePkginfo = {
    "pkg1":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/moreChance/yinhepkg1.png","product_id":"1105","price":"8800","name":"爱奇艺季卡","type":"0"},
    "pkg2":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/moreChance/yinhepkg2.png","product_id":"1104","price":"24900","name":"爱奇艺年卡","type":"0"},
    "pkg3":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/moreChance/edupkg3.png","product_id":"1107","price":"9800","name":"三年级季卡","type":"1"},
    "pkg4":{"img":"http://sky.fs.skysrt.com/statics/webvip/webapp/national/moreChance/edupkg4.png","product_id":"1106","price":"11120","name":"3-6岁半年卡","type":"1"}
}