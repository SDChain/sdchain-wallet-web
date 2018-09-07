var load = new Vue({
    el:"#main",
    data:{
        sites: [],
        qb_sum:0,

    },
    mounted:function(){
       this.recommend();
    },
    methods:{
	
		checkNumber: function(theObj) {
			var reg = /^[0-9]{6}$/;
			return reg.test(theObj);
		},
		
        recommend:function(){

            $.ajax({
                url:baseurl + '/payment/walletList',
                type:'GET', //GET、PUT、DELETE
                async:true,    //是否异步
                data:{
                    userId:sessionStorage.getItem('id'),
                    apptoken:sessionStorage.getItem('apptoken'),
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
                        var sum = 0;
                        for( var i=0; i<data.data.walletList.length;i++){
                            data.data.walletList[i].num = i;
                            data.data.walletList[i].address= 'address_' + i ;
                            data.data.walletList[i].show_label= 'show_label_' + i ;
                            data.data.walletList[i].href= '#collapse' + i ;
                            data.data.walletList[i].hrefid= 'collapse' + i ;
                            data.data.walletList[i].inputid= 'input' + i ;
                            data.data.walletList[i].btnid= 'btnid' + i ;
                            data.data.walletList[i].passwordid= 'password' + i ;
                            data.data.walletList[i].userAccount= 'userAccount' + i ;
                            data.data.walletList[i].disEwmid= 'disEwmid' + i ;
                            data.data.walletList[i].disBtn= 'disBtn' + i ;
                            data.data.walletList[i].siYaoer= 'siYaoer' + i ;
                            data.data.walletList[i].qbErimg= 'qbErimg' + i ;
                            data.data.walletList[i].syErimg= 'syErimg' + i ;
                            if(data.data.walletList[i].isdefault=='1'){  //默认钱包展开
                                data.data.walletList[i].inshow= true;
                            }
                            $.ajax({
                                url:baseurl + '/payment/getBalance',
                                type: 'GET',
                                async: false,
                                data:{
                                    account:data.data.walletList[i].account,
                                    userId:sessionStorage.getItem('id'),
                                    apptoken:sessionStorage.getItem('apptoken'),
                                },
                                timeout:10000,    //超时时间
                                dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                                success: function (detail) {
                                    if (data.code == 'S00001'){
                                        if(detail.data!=null){
                                            for( var j=0; j<detail.data.balances.length;j++){
                                                detail.data.balances[j].num = j ;
                                                detail.data.balances[j].reserveBase = detail.data.reserveBase ;
                                                if(detail.data.balances[j].currency=="SDA"){ //js parseFloat精度问题
                                                    sum=accAdd(sum,parseFloat(detail.data.balances[j].value));
                                                }
                                            }
                                            data.data.walletList[i].detail= detail.data.balances;
                                        }
                                    }
                                },
                                error:function(xhr,textStatus){
                                    // 调用时，发生错误
                                    toastr.info(textStatus);
                                },
                             });
                        }
                        load.sites = data.data.walletList;
                        load.qb_sum = sum;
                        load.$nextTick(function(){  //页面数据加载完以后画钱包二位码
                            for( var i = 0; i<load.sites.length;i++){
                                $("#qbErimg" + i ).qrcode({
                                    render: "table", //table方式
                                    width: 130, //宽度
                                    height:130, //高度
                                    text: load.sites[i].account
                                });
                            }
                        })
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
        },
        showDetail: function (num) {
            var lengh_num =$(".panel_btn").length;
            for(var i = 0; i < lengh_num; i++){
                if(num == i ){
                    if ($("#show_label_"+num).text()=="收起钱包"){
                        $("#show_label_"+num).text("查看钱包");
                        $("#address_"+num).show();
                    }else {
                        $("#show_label_"+num).text("收起钱包");
                        $("#address_"+num).hide();
                    }
                }else {
                    if ($("#show_label_"+num).text()=="查看钱包"){
                        $("#show_label_"+i).text("查看钱包");
                        $("#address_"+i).show();
                    }else {
                        $("#show_label_"+i).text("查看钱包");
                        $("#address_"+i).show();
                    }
                }
            }
        },
        showInput: function (num) {
            $("#btnid"+num).hide();
            $("#input"+num).show();
        },
        hideInput: function (num) {
            $("#btnid"+num).show();
            $("#input"+num).hide();
        },
        submitQb: function (num) {
            var password=$("#password"+ num).val();
            var userAccountId=$("#userAccount"+ num).text();
            if($("#password"+num).val().trim()==""){
                toastr.info("请输入密码");
				return;
            }
			if (!this.checkNumber($("#password"+num).val())){
                toastr.info("请输入正确密码");
				return;				
			}
            else{ $.ajax({
                    url:baseurl + '/user/getWalletSecret',
                    type:'POST', //GET、PUT、DELETE
                    async:true,    //是否异步
                    data:{
                        id:sessionStorage.getItem('id'),
                        apptoken:sessionStorage.getItem('apptoken'),
                        userAccountId:userAccountId,
                        walletPassword:password,
                        validStr:'d2ViYXBwOg=='
                    },
                    timeout:10000,    //超时时间
                    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                    beforeSend:function(xhr){
                        // 发送前处理
                    },
                    success:function(data,textStatus,jqXHR){
                        // 调用成功，解析response中的data到自定义的data中
                        if (data.code == 'S00001'){
                            $("#disEwmid"+num).text(data.data.secret);  //改写二位码的值
                            $("#input"+num).hide();//输入框和按钮隐藏
                            $("#siYaoer"+num).show();  //隐藏密钥和二位码图片显示
                            $("#disBtn"+num).show();  //隐藏密钥按钮显示
                            $("#password"+num).val("");
                            $("#syErimg"+ num ).empty();
                            $("#syErimg"+ num ).qrcode({
                                render: "table", //table方式
                                width: 130, //宽度
                                height:130, //高度
                                text: data.data.secret
                            });
                        }else {
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
        },
        disQb: function (num) {
            $("#disEwmid"+num).text("**********************");  //改写二位码的值
            $("#btnid"+num).show();
            $("#siYaoer"+num).hide();
            $("#disBtn"+num).hide();
            $("#syErimg"+ num ).empty();
        },
    },
});








