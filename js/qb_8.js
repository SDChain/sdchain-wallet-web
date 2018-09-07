// Vue App
var main_vue = new Vue({
  el: '#app',
  data: {
	account:getUrlParam('account'),
	qb_name:getUrlParam('qbname'),
	userAccountId:getUrlParam('userAccountId'),
  },
  // 在 `methods` 对象中定义方法
  methods:{		

  },
  //在 `computed` 对象中定义方法
  computed: {

	
  }
})
jQuery(function(){
	$("#userAccountId").text(main_vue.account);
	$("#userAccountIdQR").qrcode({
		render: "table", //table方式
		width: 130, //宽度
		height:130, //高度
		text: main_vue.account //任意内容
	});
	getWalletSecret()
})

function getWalletSecret() {
  // 取得私钥
	$.ajax({
		url:baseurl + '/user/getWalletSecret',
		type:'POST', //GET、PUT、DELETE
		async:true,    //是否异步
		data:{
			id:sessionStorage.getItem('id'),
			apptoken:sessionStorage.getItem('apptoken'),
			userAccountId:main_vue.userAccountId,
			walletPassword:sessionStorage.getItem('walletpassword'),
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
				$("#account").html(data.data.secret)
				$("#accountQR").qrcode({
					render: "table", //table方式
					width: 130, //宽度
					height:130, //高度
					text: data.data.secret //任意内容
				});
				
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



