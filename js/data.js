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

var rememberMapFocus = null;//记录最新的地图的落焦位置
var needFresh = false;//resume时是否需要刷新
var refreshPayResult = false;   //支付完成监听，防止多次
var needRememberFocus = false;//刷新后是否需要记录焦点
var rememberFocus = null;//刷新后需要记录的焦点选择器

var setFocusFirst = false;//用于初始化焦点时的标志位，若true则不再焦点化【离起点最近的未点亮】
var lightCity = [];//已经点亮城市的列表
var cityNum = null;
var totalNum = null;//总的点亮次数
var remainNum = null;

var gameTime = "start";
var beginTime = null;
var endTime = null;
var nowTime = null;

var adressIp = "http://172.20.139.236:9094";
var actionId = "137";