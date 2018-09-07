var baseurl = 'http://192.168.0.24:8080/sdchainWallet-webservice/resSDnWalt';

toastr.options={
    positionClass : 'toast-top-center',
    // maxOpened: 3,   无效果
    preventDuplicates: true, //重复的只显示一次
    timeOut: 5000,  //提示框显示时间,
    closeButton: true,
};




var machineId = uuid();
var timeout_setting = 20000;  //所有API超时时间设置
var jy_timeset = 120000;  //交易刷新间隔
var jy_submit_timeset = 0;  //交易买入卖出按下以后刷新间隔
var zz_timeset = 120000;  //转账刷新间隔
var zz_submit_timeset = 0;  //转账发送按钮按下以后间隔

$(function () {
	if (sessionStorage.getItem('userName') == null)
	{
			//alert('test')

		if (window.location.href.indexOf('index.') > 0 ||
			window.location.href.indexOf('reg_') > 0)
		{
			
		} else {
			window.open('index.html','_self');
		}
	}

	$( document ).ajaxSuccess(function( event, request, settings ) {
	  if (request.responseJSON.code == 'E00002')
	  {
		  //alert('test')
		  window.open('index.html','_self');
	  }
	});

});

function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
// 页面头部HTML 注册画面用
var topside_reg = Vue.component('topside_reg', {
    template: '<div class="header">' +
    '<div style="color:white;float:right;padding-top:15px;margin-right:20px;">' +
    '</div>' +
    '</div>',
    props: ['username', 'isshow'],
    data() {
        return {
            tempUsername: this.username,
            tempIsshow: this.isshow
        }
    }
})

// 创建根实例 注册画面用
new Vue({
    el: '#app_topside_reg',
    components: {
        // <runoob> 将只在父模板可用
        'topside_reg': topside_reg
    }
})

// 页面头部HTML
var topside = Vue.component('topside', {
    template: '<div class="header">' +
    '<div style="color:white;float:right;padding-top:15px;margin-right:20px;" v-show="tempIsshow">' +
    '<img src="img/per.png"/><span style="padding-left:15px;">{{tempUsername}}</sapn>' +
    '<img style="padding-left:15px;" src="img/out.png"/><a herf="#" onclick = "logout()" style="color:white;padding-left:15px;">退出</a>' +
    '</div>' +
    '</div>',
    props: ['username', 'isshow'],
    data() {
        return {
            tempUsername: this.username,
            tempIsshow: this.isshow
        }
    }
})

// 创建根实例
var vue_app_topside = new Vue({
    el: '#app_topside',
    components: {
        // <runoob> 将只在父模板可用
        'topside': topside
    },
    data: {username: sessionStorage.getItem('userName'), isshow: (sessionStorage.getItem('userName') != null)}
})

// 页面尾部HTML
var footerside = Vue.component('footerside', {
    template: '<div class="footer">' +

    '<div class="right"><a href="https://www.sdchain.io">关于我们</a> | 帮助中心 | 联系客服 | 语言：<span class="active_txt">简体中文</span> 英文</div>' +
    '</div>'
})
// 页面尾部创建根实例
new Vue({
    el: '#app_footerside',
    components: {
        // <runoob> 将只在父模板可用
        'footerside': footerside
    }
})


// 侧边栏
var leftside = Vue.component('leftside', {
    template: '<aside class="main-sidebar">' +
    '<section class="sidebar">' +
    '<ul class="sidebar-menu" data-widget="tree">' +
    '<li id = "zc" class="treeview">' +
    '<a href="#">' +
    '<img src="img/menu_icon1.png"  />' +
    '<span>资产</span>' +
    '<span class="pull-right-container">' +
    '<i class="fa fa-angle-left pull-right"></i>' +
    '</span>' +
    '</a>' +
    '<ul class="treeview-menu">' +
    '<li id = "zc1"><a href="ye_1.html">余额</a></li>' +
    '<li id = "zc2"><a href="qb_5.html">钱包管理</a></li>' +
    '</ul>' +
    '</li>' +
    '<li id = "jy" class="treeview">' +
    '<a href="javascript:;">' +
    '<img src="img/menu_icon2.png" />' +
    '<span>交易</span>' +
    '<span class="pull-right-container">' +
    '<i class="fa fa-angle-left pull-right"></i>' +
    '</span>' +
    '</a>' +
    '<ul class="treeview-menu">' +
    
    '<li id = "jy2"><a href="jy_1and2.html">C2C转账</a></li>' +
    '<li id = "jy3"><a href="jy_4.html">交易记录</a></li>' +
    '</ul>' +
    '</li>' +
    
    '<li id = "sz" class="treeview">' +
    '<a href="javascript:;">' +
    '<img src="img/menu_icon4.png" />' +
    '<span>设置</span>' +
    '<span class="pull-right-container">' +
    '<i class="fa fa-angle-left pull-right"></i>' +
    '</span>' +
    '</a>' +
    '<ul class="treeview-menu">' +
    '<li id = "sz1" class=""><a href="sz_1.html">个人中心</a></li>' +
    '<li id = "sz2" ><a href="sz_4.html">联系人</a></li>' +
    
    '</ul>' +
    '</li>' +
    '</ul>' +
    '</section>' +
    ' </aside>'
})
// 侧边栏创建根实例
new Vue({
    el: '#app_leftside',
    components: {
        // <runoob> 将只在父模板可用
        'leftside': leftside
    }
})

//获取url中的参数
function getUrlParam(name) {
    var index = window.location.href.indexOf('?') + 1;
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = decodeURI(window.location.href.substr(index)).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

function login() {
    // 登录
    $.ajax({
        url: baseurl + '/user/login',
        type: 'POST', //GET、PUT、DELETE
        async: true,    //是否异步
        data: {
            userName: sessionStorage.getItem('userName'),
            password: sessionStorage.getItem('password')
        },
        timeout: 10000,    //超时时间
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        beforeSend: function (xhr) {
            // 发送前处理
        },
        success: function (data, textStatus, jqXHR) {
            // 调用成功，解析response中的data到自定义的data中

            if (data.code == 'S00001') {
                sessionStorage.setItem('id', data.data.id)
                sessionStorage.setItem('userName', data.data.userName)
                sessionStorage.setItem('realName', data.data.realName)
                sessionStorage.setItem('nickName', data.data.nickName)
                sessionStorage.setItem('idCode', data.data.idCode)
                if (data.data.phone == '') {
                    sessionStorage.setItem('phone', '********')
                } else {
                    sessionStorage.setItem('phone', data.data.phone)
                }

                sessionStorage.setItem('passwordKey', data.data.passwordKey)
                if (data.data.email == '') {
                    sessionStorage.setItem('email', '********')
                } else {
                    sessionStorage.setItem('email', data.data.email)
                }

                sessionStorage.setItem('account', data.data.account)
                sessionStorage.setItem('walletName', data.data.walletName)
                sessionStorage.setItem('userAccountId', data.data.userAccountId)
                sessionStorage.setItem('type', data.data.type)
                sessionStorage.setItem('apptoken', data.data.apptoken)
                window.open('reg_2.html', '_self');
            } else {
                toastr.info(data.message);
            }
        },
        error: function (xhr, textStatus) {
            // 调用时，发生错误
            toastr.info(textStatus);
        },
        complete: function () {
            // 交互后处理
        }
    })
}

//退出
function logout() {
    // 清空 LocalSotrge
    clearsessionStorage();
    window.open('index.html', '_self');
}

function clearsessionStorage() {
// 清空 LocalSotrge
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('realName');
    sessionStorage.removeItem('nickName');
    sessionStorage.removeItem('idCode');
    sessionStorage.removeItem('phone');
    sessionStorage.removeItem('passwordKey');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('account');
    sessionStorage.removeItem('walletName');
    sessionStorage.removeItem('userAccountId');
    sessionStorage.removeItem('type');
    sessionStorage.removeItem('apptoken');
    sessionStorage.removeItem('createdTime');
    sessionStorage.removeItem('walletpassword');
    sessionStorage.removeItem('area');
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('safeLevel');
    sessionStorage.removeItem('smsCode');
    sessionStorage.removeItem('smsId');

    vue_app_topside.userName = null;
}


//jquery计算精度问题
function accAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2))
    var result= ((arg1*m+arg2*m)/m).toFixed(6);
    return result;

}

function accMul(arg1,arg2){
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    var result= Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
    return result;
}

function accDiv(arg1,arg2){
    var t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}
    with(Math){
        r1=Number(arg1.toString().replace(".",""))
        r2=Number(arg2.toString().replace(".",""))
        var result= (r1/r2)*pow(10,t2-t1);
        return result;
    }
}
