function debug(str) {
    // var debug = $("#debug");
    // if(debug.length == 0){
    // 	$("<div id='debug'></div>").appendTo($("body"));
    // }
    // $("#debug").html($("#debug").html() + str);
}

function coocaakeymap(buts, curlink, hover, getVal, setVal, keyDownEvent){

    this.linkbuttons = $(buts);
    for(var l = this.linkbuttons.length -1 ; l>=0; l--){
        var  i = this.linkbuttons[l];
        if(i.getAttribute("data-no-foucs") == "true"){
            this.linkbuttons.splice(i,1);
        }
    }
    if(this.linkbuttons.length == 0){
        this.linkbuttons = $("body");
    }
    var c = $(curlink);
    if(c.length != 0){
        for(var x = 0;  x < this.linkbuttons.length; x ++){
            if(this.linkbuttons.get(x) == c.get(0)){
                this.curLink = c;
                break;
            }
        }
    }
    if(this.curLink == null){
        for(var i = 0; i <this.linkbuttons.length; i++ ){
            if($(this.linkbuttons[i]).is(":visible")){
                this.curLink = $(this.linkbuttons[i]);
                break;
            }
        }
    }
    this.keyDownEvent = keyDownEvent || function(){};
    this.hoverClass = hover ? hover : "hover";
    this.input = null;

    this.setVal = setVal || function(val){
            $(this).val(val);
        };
    this.getVal = getVal ||function(){
            return $(this).val();
        };

    var _this = this;
    //设置只读属性
    //$(buts).attr('readonly',true);
    //设置鼠标事件
    // $(buts).unbind("keyinput").bind('keyinput', this.handleInputVal);

    $(window).unbind("keydown").bind('keydown', function(ev){_this.keyHandler(_this, ev);});
    this.cmd = [];
    this.iscmd = false;
    this.debugCmd = {
        "cmd3739373938384040": function(){
            var info = "访问地址:" + window.location.href;
            coocaa.alert(info,function(){
                _this.handlerKeydown();
                return true;
            });
        },
        "cmd3737393938384040":function(){
            var info = "版本号：" + coocaa.version;
            coocaa.alert(info,function(){
                _this.handlerKeydown();
                return true;
            });
        }
    };
    if(!true){
        var focusDom = $("#focus");
        if(focus.length == 0){
            focusDom = $("<div id='focus' class='" + this.hoverClass  + "'></div>").appendTo($("body"));
        }
        this.focusDom = focusDom;
    }
    _this.focusDomMoving = false;
    this.setHeightLight(this);
}
//移除焦点元素
coocaakeymap.prototype.remove = function(wh){
    this.linkbuttons = this.linkbuttons.not(wh);

};
//添加焦点元素
coocaakeymap.prototype.add = function(wh){
    this.linkbuttons = this.linkbuttons.add(wh);
};
coocaakeymap.prototype.handlerKeydown = function(){
    var _this = this;
    $(window).unbind("keydown").bind("keydown", function(ev){_this.keyHandler(_this, ev);});
}
coocaakeymap.prototype.triggerCmd = function(code){
    if(this.debugCmd == null || this.iscmd == false || this.debugCmd == null){
        return;
    }
    this.cmd.push(code);
    if(this.cmd.length > 10){
        this.cmd = [];
        return;
    }
    var cmd = "cmd" + this.cmd.join("");
    if(typeof(this.debugCmd[cmd]) =="function"){
        this.cmd = [];
        this.iscmd = false;
        this.debugCmd[cmd]();
    }
};
coocaakeymap.prototype.setFocus = function(curLink){
    //传入null则聚焦到第一个可见元素
    if(curLink.length == 0){
        return;
    }
    if(!curLink.is(":visible")){
        curLink = this.curLink;
    }
    this.curLink = curLink;
    var _this = this;
    if(this.focusDom != null){
        if(curLink != null){
            var top = curLink.position().top + parseInt(curLink.css('marginTop').replace("px",""));
            var left = curLink.position().left + parseInt(curLink.css('marginLeft').replace("px",""));
            //设置焦点框的值
            var hover = _this.hoverClass;
            _this.linkbuttons.removeClass(hover);
            _this.focusDom.show();
            _this.focusDomMoving = true;
            _this.focusDom.animate({width:curLink.width(),height:curLink.height(), top:top, left:left},100, function(){
                _this.focusDom.hide();
                _this.setHeightLight(_this);
                _this.focusDomMoving = false;
            });
        }else{
            _this.focusDom.hide();
        }
    }else{
        _this.setHeightLight(_this);
    }
};

coocaakeymap.prototype.handleClick = function(obj){
    this.setFocus($(obj));
    this.curLink.trigger("itemClick");
};
coocaakeymap.prototype.keyHandler = function(_this, ev){
    if(_this.focusDomMoving == true){
        return;
    }
    //var ev = event;
    var curKey = ev.keyCode;
    debug("<br/>");
    debug("keyCode = " + ev.keyCode);
    debug("<br/>");
    debug(+new Date());
    debug("<br/>");
    _this.curLink.trigger("beforekeyinput", [curKey,ev, _this]);
    if(_this.input != null && _this.curLink.get(0) == _this.input.get(0)){
        //ev.stopPropagation();
        debug("开始执行keyinput事件");
        _this.input.trigger("keyinput", [curKey,_this]);

    }
    var lastLink = _this.curLink;
    _this.curLink.trigger("afterkeyinput", [curKey,ev, _this]);

    if(_this.iscmd == true){
        _this.triggerCmd(curKey);
    }
    //禁止select 左右上下 改变选项
    //var tag = _this.curLink.get(0).tagName;
    //if(tag  == "SELECT" || tag  == "INPUT"){
    //	ev.preventDefault();
    //}
    if(ev.isPropagationStopped() == false){
        switch(curKey){
            case 27: // esc返回

                break;
            case 37: // left
                //判断输入点的位置
                _this.moveLeft();
                ev.stopPropagation();
                break;
            case 38: // up
                _this.moveUp();
                ev.stopPropagation();
                break;
            case 39: // right
                _this.moveRight();
                ev.stopPropagation();
                break;
            case 40: // down
                _this.moveDown();
                ev.stopPropagation();
                break;
            case 13: // enter
                _this.curLink.trigger("itemClick");
                break;
            case 8:// 遥控器删除
                _this.iscmd = true;
                _this.cmd = [];
                ev.preventDefault();
            default:
                _this.handleInputVal(ev, curKey, _this);
        }
    }
    if(lastLink != _this.curLink){
        lastLink.trigger("itemBlur");
        _this.curLink.trigger("itemFocus");
    }
    this.keyDownEvent(ev);
};

coocaakeymap.prototype.setHeightLight = function(_this){

    if(_this.curLink == null){
        //将第一个可见元素设置为焦点元素
        for(var i = 0; i <_this.linkbuttons.length; i++ ){
            if($(_this.linkbuttons[i]).is(":visible")){
                _this.curLink = $(_this.linkbuttons[i]);
                break;
            }
        }
    }
    _this.linkbuttons.attr("readonly", true);
    var hover = _this.hoverClass;
    _this.linkbuttons.removeClass(hover);
    _this.curLink.addClass(hover);
    var curLink = _this.curLink;
    var type = curLink.attr('type');

    _this.input = null;
    //if ($.browser.mozilla && $.browser.version == "1.9.0.10") {
    //} else {
    // 如果是输入框就聚焦
    if (type == 'text' || type == 'password') {
        //curLink.get(0).focus();
    } else {
    }
    if($(_this.curLink).hasClass("input")){
        _this.input = $(_this.curLink);
    }
    //}
    //将焦点赋给文档
    $(document).focus();
    this.curLink.trigger("itemSelected");
    if(this.focusDom !=null){
        var top = curLink.position().top + parseInt(curLink.css('marginTop').replace("px",""));
        var left = curLink.position().left + parseInt(curLink.css('marginLeft').replace("px",""));
        //设置焦点框的值
        this.focusDom.css({width:curLink.width(),height:curLink.height(), top:top, left:left});
        this.focusDom.hide();
    }
};

coocaakeymap.prototype.moveLeft = function(){
    var _this = this;
    //如果有leftTarget 标识,直接聚焦到标识所属元素
    if(_this.curLink.attr("leftTarget")){
        var link = $(_this.curLink.attr("leftTarget"));
        if(link.size() > 0){
            _this.setFocus(link);
            return;
        }
    }
    var curLink = _this.curLink;
    var xthis;
    var upCoincide;
    var downCoincide;

    var diffDistance = 99999;
    var mx = curLink.offset().left;
    var my = curLink.offset().top;
    var objNoCoincide = curLink;
    var diffNoCoincide = 99999;


    var prev = _this.curLink.prev();
    while(prev.length > 0){
        //查找相邻的节点
        if(_this.linkbuttons.index(prev) != -1 && !(prev.is(":hidden"))){
            curLink = prev;
            break;
        }else{
            prev = prev.prev();
        }
    }
    if(_this.curLink == curLink){
        _this.linkbuttons.each(function () {
            xthis = $(this);
            if(xthis.is(":hidden")){
                return true;
            }
            nx = xthis.offset().left;
            ny = xthis.offset().top;
            // debug("x:" + nx + " --- y:" + ny);
            // 如果2个box有重叠，则计算x最近的即可
            upCoincide = ny <= my && ny + xthis.height() > my;
            downCoincide = ny >= my && ny < my + curLink.height();
            if (nx < mx && (upCoincide || downCoincide)) {
                xdist = mx - nx;
                if (xdist < diffDistance) {
                    diffDistance = xdist;
                    curLink = xthis;
                }
            }
            if (nx < mx) {
                // 向左边移动的时候，如果在目标上边，计算右下角，否则计算左上角
                if (ny >= my)
                    xdist = _this.lineDistance(nx + xthis.width(), ny, mx, my);
                else
                    xdist = _this.lineDistance(nx + xthis.width(), ny + xthis.height(),
                        mx, my);

                if (xdist < diffNoCoincide) {
                    diffNoCoincide = xdist;
                    objNoCoincide = xthis;
                    curLink = xthis;
                }
            }
        });
    }
    //
    _this.setFocus(curLink);
};

coocaakeymap.prototype.lineDistance = function(x1, y1, x2, y2) {
    var xs = 0;
    var ys = 0;

    xs = Math.abs(x1 - x2);
    xs = xs * xs;

    ys = Math.abs(y1 - y2);
    ys = ys * ys;

    return Math.sqrt(xs + ys);
};

coocaakeymap.prototype.moveRight = function(){
    var _this = this;
    // 如果有leftTarget 标识,直接聚焦到标识所属元素
    if(_this.curLink.attr("rightTarget")){
        var link = $(_this.curLink.attr("rightTarget"));
        if(link.size() > 0){
            _this.setFocus(link);
            return;
        }
    }

    var curLink = _this.curLink;
    var xthis;
    var upCoincide;
    var downCoincide;

    var diffDistance = 99999;
    var mx = curLink.offset().left;
    var my = curLink.offset().top;
    var tarLink = curLink;
    var objNoCoincide = curLink;
    var diffNoCoincide = 99999;

    var next = _this.curLink.next();
    while(next.length > 0){
        if(_this.linkbuttons.index(next) != -1 && !(next.is(":hidden"))){
            curLink = next;
            break;
        }else{
            next = next.next();
        }
    }
    if(_this.curLink == curLink){
        _this.linkbuttons.each(function () {
            xthis = $(this);
            if(xthis.is(":hidden")){
                return true;
            }
            nx = xthis.offset().left;
            ny = xthis.offset().top;
            upCoincide = ny <= my && ny + xthis.height() > my;
            downCoincide = ny >= my && ny < my + curLink.height();
            if (nx > mx && (upCoincide || downCoincide)) {
                xdist = nx - mx;
                if (xdist < diffDistance) {
                    //debug(xthis.html() + "xdist:" + xdist);
                    diffDistance = xdist;
                    curLink = xthis;
                }
            }
            if (nx > mx) {
                //向右边移动的时候，如果在目标上边，计算目标左下角，否则计算左上角
                if (ny >= my)
                    xdist = _this.lineDistance(nx, ny, mx + tarLink.width(), my);
                else
                    xdist = _this.lineDistance(nx, ny + xthis.height(), mx + tarLink.width(), my);

                if (xdist < diffNoCoincide) {
                    diffNoCoincide = xdist;
                    objNoCoincide = xthis;
                    curLink = xthis;
                }
            }
        });
    }

    _this.setFocus(curLink);
};

coocaakeymap.prototype.moveUp = function(){
    var _this = this;
    //如果有leftTarget 标识,直接聚焦到标识所属元素
    if(_this.curLink.attr("upTarget")){
        var link = $(_this.curLink.attr("upTarget"));
        if(link.size() > 0){
            _this.setFocus(link);
            return;
        }
    }

    var curLink = _this.curLink;
    var xthis;
    var leftCoincide;
    var rightCoincide;

    var diffDistance = 99999;
    var mx = curLink.offset().left;
    var my = curLink.offset().top;
    var tarLink = curLink;
    var objNoCoincide = curLink;
    var diffNoCoincide = 99999;
    var findF = false;
    _this.linkbuttons.each(function () {
        xthis = $(this);
        if(xthis.is(":hidden") ){
            return true;
        }
        nx = xthis.offset().left;
        ny = xthis.offset().top;
        //先找重叠的，直接算Y坐标
        leftCoincide = nx <= mx && nx + xthis.width() > mx;
        rightCoincide = nx >= mx && mx + tarLink.width() > nx;
        if (ny < my && (leftCoincide || rightCoincide)) {
            xdist = my - ny;
            if (xdist < diffDistance) {
                diffDistance = xdist;
                curLink = xthis;
            }
            findF = true;
        }else if(findF == false){
            ///这里找距离最短的，不在乎是否有重叠
            if (ny < my) {
                //向上移动的时候，如果在目标右边，计算左下角，否则计算右下角
                if (nx >= mx)
                    xdist = _this.lineDistance(nx, ny + xthis.height(), mx, my);
                else
                    xdist = _this.lineDistance(nx + xthis.width(), ny + xthis.height(), mx, my);
                if (xdist < diffNoCoincide) {
                    diffNoCoincide = xdist;
                    objNoCoincide = xthis;
                    curLink = xthis;
                }
            }
        }
    });

    _this.setFocus(curLink);
};

coocaakeymap.prototype.moveDown = function(){
    var _this = this;
    //如果有leftTarget 标识,直接聚焦到标识所属元素
    if(_this.curLink.attr("downTarget")){
        var link = $(_this.curLink.attr("downTarget"));
        if(link.size() > 0){
            _this.setFocus(link);
            return;
        }
    }

    var curLink = _this.curLink;
    var xthis;
    var leftCoincide;
    var rightCoincide;

    var diffDistance = 99999;
    var mx = curLink.offset().left;
    var my = curLink.offset().top;
    var tarLink = curLink;
    var objNoCoincide = curLink;
    var diffNoCoincide = 99999;
    var findF = false;
    _this.linkbuttons.each(function () {
        xthis = $(this);
        if(xthis.is(":hidden")){
            return true;
        }
        nx = xthis.offset().left;
        ny = xthis.offset().top;
        leftCoincide = nx <= mx && nx + xthis.width() > mx;
        rightCoincide = nx >= mx && mx + tarLink.width() > nx;
        if (ny > my && (leftCoincide || rightCoincide)) {
            xdist = ny - my;
            if (xdist < diffDistance) {
                diffDistance = xdist;
                curLink = xthis;
            }
            findF = true;
        }else if(findF == false){
            if (ny > my) {
                //xdist = lineDistance(nx, ny, mx, my);
                //向下移动的时候，如果在目标右边，计算左下角，否则计算右下角
                if (nx >= mx)
                    xdist = _this.lineDistance(nx, ny, mx, my + tarLink.height());
                else
                    xdist = _this.lineDistance(nx + xthis.width(), ny, mx, my + tarLink.height());

                if (xdist < diffNoCoincide) {
                    diffNoCoincide = xdist;
                    objNoCoincide = xthis;
                    curLink = xthis;
                }
            }
        }
    });
    _this.setFocus(curLink);
};

coocaakeymap.prototype.handleInputVal = function(ev, code, map){
    if(typeof map.setVal != 'function' || typeof map.getVal != 'function'){
        return;
    }

    var _this = map;

    var char = "";
    switch(code){
        case 48: // key 0
        case 49: // 1
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
            //输入法输入
            //ev.isPropagationStopped();
            char =  String.fromCharCode(code);
            var old = _this.getVal.call(this);

            if(typeof $(this).attr("maxlength") != "nudefined"){
                var length = old.length;
                var maxlength = parseInt($(this).attr("maxlength"));
                if(maxlength <= length){
                    return;
                }
            }

            _this.setVal.call(this, old + char);
            break;
        case 96:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
            //ev.isPropagationStopped();
            var c = code - 48;
            char = String.fromCharCode(c);
            var old = _this.getVal.call(this);

            if(typeof $(this).attr("maxlength") != "nudefined"){
                var length = old.length;
                var maxlength = parseInt($(this).attr("maxlength"));
                if(maxlength <= length){
                    return;
                }
            }
            _this.setVal.call(this, old + char);

            break;
        case 8:
        case 0:
            //ev.isPropagationStopped();
            var old = _this.getVal.call(this);
            if(old.length > 0){
                _this.setVal.call(this, old.substring(0, old.length - 1));
            }

            return;
        case 13://回车键
            break;
    }

};