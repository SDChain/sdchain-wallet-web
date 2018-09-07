// 清空 LocalSotrge
clearsessionStorage();

// Vue App
var maninvue = new Vue({
  el: '#app',
  data: {
    message: '',
  },
  // 在 `methods` 对象中定义方法
  methods: {
    login: function (event) {

      // POST请求
		$.ajax({
			url:baseurl + '/user/login',
			type:'POST', //GET、PUT、DELETE
			async:true,    //是否异步
			data:{
				userName:$('#username').val(),
				password:$('#password').val()
			},
			timeout:5000,    //超时时间
			dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
			beforeSend:function(xhr){
				// 发送前处理
			},
			success:function(data,textStatus,jqXHR){
				// 调用成功，解析response中的data到自定义的data中
				
				if (data.code == 'S00001')
				{
					sessionStorage.setItem('id',data.data.id)
					sessionStorage.setItem('userName',data.data.userName)
					sessionStorage.setItem('realName',data.data.realName)
					sessionStorage.setItem('nickName',data.data.nickName)
					sessionStorage.setItem('idCode',data.data.idCode)
					sessionStorage.setItem('phone',data.data.phone)
					sessionStorage.setItem('passwordKey',data.data.passwordKey)
					sessionStorage.setItem('email',data.data.email)
					sessionStorage.setItem('account',data.data.account)
					sessionStorage.setItem('walletName',data.data.walletName)
					sessionStorage.setItem('userAccountId',data.data.userAccountId)
					sessionStorage.setItem('type',data.data.type)
					sessionStorage.setItem('apptoken',data.data.apptoken)
					sessionStorage.setItem('createdTime',data.data.createdTime)
					sessionStorage.setItem('area',data.data.area)
					sessionStorage.setItem('safeLevel',data.data.safeLevel)
					sessionStorage.setItem('auth',data.data.auth)
					window.open('ye_1.html','_self')
				} else {
					toastr.info(data.message);
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
  }
})

$(document).keydown(function(event){
　　　　if(event.keyCode == 13){
　　　　　　maninvue.login(); 
　　　　}
});