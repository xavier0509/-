var adjust=function(){
    if(/Android (\d+\.\d+)/.test(navigator.userAgent)){
        var version = parseFloat(RegExp.$1);
        if(version>2.3){
            var phoneScale = parseInt(window.screen.width)/1920;
            document.write('<meta name="viewport" content="width=1920, minimum-scale = '+ phoneScale +', maximum-scale = '+ phoneScale +', target-densitydpi=device-dpi">');
        }else{
            document.write('<meta name="viewport" content="width=1920, target-densitydpi=device-dpi">');
        }
    }else{
        document.write('<meta name="viewport" content="width=1920, user-scalable=no, target-densitydpi=device-dpi">');
    }
}
adjust();