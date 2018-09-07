var load = new Vue({
    el:"#main",
    data:{
        walletname: getUrlParam('walletname'),
        userAccountId: getUrlParam('userAccountId'),
		walletAccount:getUrlParam('account'),
        sites: [],
		password:'',
		currency:[],
    },
    mounted:function(){
        this.recommend();
    },
    methods:{
        recommend:function() {
            var userAccountId = this.userAccountId;
            if(userAccountId!=null){
                //
                $.ajax({
                    url:baseurl + '/payment/getCurrencyLists',
                    type:'GET', //GET、PUT、DELETE
                    async:true,    //是否异步
                    data:{
                        userId:sessionStorage.getItem('id'),
                        apptoken:sessionStorage.getItem('apptoken'),
						code:'',
						page:1,
						account:this.walletAccount,
                    },
                    timeout:10000,    //超时时间
                    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                    beforeSend:function(xhr){
                        // 发送前处理
                    },
                    success:function(data,textStatus,jqXHR){
                        // 调用成功，解析response中的data到自定义的data中
                        load.sites = data.data;
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
        },
		values:function(currency){
			load.password = '';
            load.currency = currency;
        }
    },
});

function trustline(){
			    $.ajax({
                    url:baseurl + '/payment/trustline',
                    type:'POST', //GET、PUT、DELETE
                    async:true,    //是否异步
                    data:{
                        userId:sessionStorage.getItem('id'),
                        apptoken:sessionStorage.getItem('apptoken'),
						userAccountId:load.userAccountId,
						walletPassword:load.password,
						limit:load.currency.limit,
						currency:load.currency.currency,
						counterparty:load.currency.counterparty,
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
                            toastr.info(data.message);
							$('#myModal').modal('hide');
							for (var i = 0;i<load.sites.length;i++){
								if (load.sites[i].currency == load.currency.currency){
									load.sites[i].trusted = true;
									break;
								}
							}
							
							
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
};

function canceltrustline(){
			    $.ajax({
                    url:baseurl + '/payment/cancelTrustline',
                    type:'POST', //GET、PUT、DELETE
                    async:true,    //是否异步
                    data:{
                        userId:sessionStorage.getItem('id'),
                        apptoken:sessionStorage.getItem('apptoken'),
						userAccountId:load.userAccountId,
						walletPassword:load.password,
						limit:0,
						currency:load.currency.currency,
						counterparty:load.currency.counterparty,
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
							$('#myModal2').modal('hide');
                            toastr.info(data.message);
							for (var i = 0;i<load.sites.length;i++){
								if (load.sites[i].currency == load.currency.currency){
									load.sites[i].trusted = false;
									break;
								}
							}
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