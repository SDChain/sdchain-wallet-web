var load = new Vue({
    el:"#main",
    data:{
        sites: [],
    },
    mounted:function(){
        this.recommend();
    },
    methods:{
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
                dataType:'json',    //返回的数据格式：json/xml/html/script/json/text
                beforeSend:function(xhr){
                    // 发送前处理
                },
                success:function(data,textStatus,jqXHR){
                    // 调用成功，解析response中的data到自定义的data中
                    if (data.code == 'S00001')
                    {
                        for( var i=0; i<data.data.walletList.length;i++){
                            data.data.walletList[i].num = i;
                            data.data.walletList[i].dis_input= 'dis_input' + i ;
                            data.data.walletList[i].show_input= 'show_input' + i ;
                            data.data.walletList[i].my_input_qb= 'my_input_qb' + i ;
                            data.data.walletList[i].qb5_text= 'qb5_text' + i ;
                            data.data.walletList[i].qb_delete= 'qb_delete' + i ;
                            data.data.walletList[i].qb_del_input= 'qb_del_input' + i ;
							data.data.walletList[i].value = 0;
                            if(data.data.walletList[i].isdefault=='1'){  //默认钱包
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
                                                if(detail.data.balances[j].currency=="SDA"){
                                                    data.data.walletList[i].value = detail.data.balances[j].value;
													break;
                                                }
                                            }
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
        reName: function (num) {
            $("#dis_input"+ num).show();
            $("#show_input"+ num).hide();
        },
        canelName:function(num) {
             $("#dis_input"+ num).hide();
             $("#show_input"+ num).show();
        },
        reName_save:function(userAccountId,num) {
            var qb_name=$("#my_input_qb"+num).val();
            if(qb_name==""){
                toastr.info("请输入钱包名");
            }else {
                $.ajax({
                    url:baseurl + '/user/updateAccountname',
                    type:'GET', //GET、PUT、DELETE
                    async:true,    //是否异步
                    data:{
                        userId:sessionStorage.getItem('id'),
                        accountName:qb_name,
                        userAccountId:userAccountId,
                        apptoken:sessionStorage.getItem('apptoken'),
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
                            $("#dis_input"+ num).hide();
                            $("#show_input"+ num).show();
                            load.sites[num].name = qb_name;
                            toastr.info("保存成功");
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
        setDefault:function(account) {
                $.ajax({
                    url:baseurl + '/payment/changeDefaultWallet',
                    type:'POST', //GET、PUT、DELETE
                    async:true,    //是否异步
                    data:{
                        id:sessionStorage.getItem('id'),
                        apptoken:sessionStorage.getItem('apptoken'),
                        account:account,
                    },
                    timeout:10000,    //超时时间
                    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                    beforeSend:function(xhr){
                        // 发送前处理
                    },
                    success:function(data,textStatus,jqXHR){
                        // 调用成功，解析response中的data到自定义的data中
                        if (data.code == 'S00001'){
							sessionStorage.setItem('account', account)
                            load.recommend();
                            toastr.info("修改成功");
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
        },
        linkSx: function (userAccountId,walletname,account) {
            window.open(encodeURI('qb_6.html?userAccountId='+ userAccountId+'&walletname='+walletname+'&account='+account), '_self')
        },
        changePassword: function (userAccountId) {
            window.location.href = "qb_3and4.html?userAccountId="+ userAccountId;
        },
        showDel: function (num) {
            $("#qb_delete"+ num).show();
            $("#show_input"+ num).hide();
        },
        canelDelete:function(num) {
            $("#qb_delete"+ num).hide();
            $("#show_input"+ num).show();
        },
        delQb:function(accountId,num) {
            var qb_password=$("#qb_del_input"+num).val().trim();
            if(qb_password==""){
                toastr.info("请输入钱包密码");
            }else {
                $.ajax({
                    url:baseurl + '/payment/deleteWallet',
                    type:'POST', //GET、PUT、DELETE
                    async:true,    //是否异步
                    data:{
                        id:sessionStorage.getItem('id'),
                        validStr:'d2ViYXBwOg==',
                        userAccountId:accountId,
                        walletPassword:qb_password,
                    },
                    timeout:10000,    //超时时间
                    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                    beforeSend:function(xhr){
                        // 发送前处理
                    },
                    success:function(data,textStatus,jqXHR){
                        // 调用成功，解析response中的data到自定义的data中
                        if (data.code == 'S00001'){
                            $("#qb_delete"+ num).hide();
                            $("#show_input"+ num).show();
                            load.recommend();
                            toastr.info("删除成功");
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
        addQb_link: function () {
            if(load.sites.length>=6){
                toastr.info("最多可创建6个钱包");
                return;
            }else {
                window.open(encodeURI('qb_7.html'), '_self')
            }
        },
    },
});