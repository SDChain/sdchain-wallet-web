// Vue App
var main_vue = new Vue({
  el: '#app',
  data: {
	walletName:'',
	password1:'',
	password2:''
  },
  // 在 `methods` 对象中定义方法
  methods:{
	checkNumber: function(theObj) {
		var reg = /^[0-9]{6}$/;
		return reg.test(theObj);
	}
  },
  //在 `computed` 对象中定义方法
  computed: {

    bnt_ok_disabled: function (event) {
		//OK按钮状态
		var pass = false;
		
		pass = pass || this.password1 != this.password2;
		
		pass = pass || (!this.checkNumber(this.password1));

		return pass;
    },
    bnt_ok_style: function (event) {
		//OK按钮样式
		if (this.bnt_ok_disabled)
		{
			return {'background-color': 'white','color': 'lightgray'};
		} else {
			return {'background-color': '#1494ff','color': 'white'};
		}
	}
  }
})

function OK(){
	regist();
	
}

function regist() {
  // 注册
	$.ajax({
		url:baseurl + '/user/regist',
		type:'POST', //GET、PUT、DELETE
		async:true,    //是否异步
		data:{
			userName:sessionStorage.getItem('userName'),
			password:sessionStorage.getItem('password'),
			smsId:sessionStorage.getItem('smsId'),
			smsCode:sessionStorage.getItem('smsCode'),
			walletName:main_vue.walletName,
			walletPassword:main_vue.password1,
			phone:getPhone(),
			email:getMail(),
			validStr:'d2ViYXBwOg=='
		},
		timeout:10000,    //超时时间
		dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
		beforeSend:function(xhr){
			// 发送前处理
		},
		success:function(data,textStatus,jqXHR){
			// 调用成功，解析response中的data到自定义的data中
			
			if (data.code == 'S00001')
			{
				login();
				sessionStorage.setItem('walletpassword',main_vue.password1);
			} else {
				alert(data.message);
				clearsessionStorage();
				window.open('reg_0.html','_self')
			}
		},
		error:function(xhr,textStatus){
			// 调用时，发生错误
			toastr.info(textStatus);
		},
		complete:function(){
			// 交互后处理
		}
	})
}
// 取得绑定手机
function getPhone() {

	if (sessionStorage.getItem('userName').indexOf('@') < 0)
	{
		return sessionStorage.getItem('userName');
	} else {
		'';
	}
}
// 取得绑定邮箱
function getMail() {

	if (sessionStorage.getItem('userName').indexOf('@') < 0)
	{
		return '';
	} else {
		return sessionStorage.getItem('userName');
	}
}




