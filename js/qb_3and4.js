var load = new Vue({
    el: "#main",
    data: {
        sites: [],
        id: sessionStorage.getItem('id'),  //用户ID
        apptoken: sessionStorage.getItem('apptoken'),
        account:sessionStorage.getItem('userName'),
        userAccountId: getUrlParam('userAccountId'), //钱包ID
    },

    methods: {
		checkNumber: function(theObj) {
			var reg = /^[0-9]{6}$/;
			return reg.test(theObj);
		},
        updateWalletPassword: function () {
            var yzm1 = $("#yzm1").val();
            var oldPassword1 = $("#oldPassword1").val();
            var newPassword1 = $("#newPassword1").val();
            var rePassword1 = $("#rePassword1").val();
            if (yzm1 == "") {
                toastr.info("请输入验证码");
                return;
            }
            if (oldPassword1 == "") {
                toastr.info("请输入原交易密码");
                return;
            }
            if (newPassword1 == "") {
                toastr.info("请输入新交易密码");
                return;
            }
            if (rePassword1 == "") {
                toastr.info("请确认交易密码");
                return;
            }
			if (newPassword1 != rePassword1) {
                toastr.info("两次密码不一致");
                return;
            }
            if (!this.checkNumber(newPassword1)) {
                toastr.info("请输入六位整数");
                return;
            }
            $.ajax({
                url: baseurl + '/user/updateWalletPassword',
                type: 'POST', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    id: load.id,
                    userAccountId: load.userAccountId,
                    apptoken: load.apptoken,
                    walletPassword: oldPassword1,
                    newWalletPassword: newPassword1,
                    validStr: 'd2ViYXBwOg=='
                },
                timeout: timeout_setting,    //超时时间
                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                beforeSend: function (xhr) {
                    // 发送前处理
                },
                success: function (data, textStatus, jqXHR) {
                    // 调用成功，解析response中的data到自定义的data中
                    if (data.code == 'S00001') {
                        toastr.info("修改成功");
						$("#oldPassword1").val('');
						$("#newPassword1").val('');
						$("#rePassword1").val('');
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
        ,
        forgetWalletPassword: function () {
            var yzm2 = $("#yzm2").val();
            var address_sy = $("#address_sy").val();
            var newPassword2 = $("#newPassword2").val();
            var rePassword2 = $("#rePassword2").val();
            if (yzm2 == "") {
                toastr.info("请输入验证码");
                return;
            }
            if (address_sy == "") {
                toastr.info("请输入私钥地址");
                return;
            }
            if (newPassword2 == "") {
                toastr.info("请输入新交易密码");
                return;
            }
            if (rePassword2 == "") {
                toastr.info("请确认交易密码");
                return;
            }
            if (newPassword2 != rePassword2) {
                toastr.info("两次密码不一致");
                return;
            }
			if (!this.checkNumber(newPassword2)) {
                toastr.info("请输入六位整数");
                return;
            }
            $.ajax({
                url: baseurl + '/user/forgetWalletPassword',
                type: 'POST', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    id: load.id,
                    userAccountId: load.userAccountId,
                    apptoken: load.apptoken,
                    newWalletPassword: newPassword2,
                    secret: address_sy,
                    validStr: 'd2ViYXBwOg=='
                },
                timeout: timeout_setting,    //超时时间
                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                beforeSend: function (xhr) {
                    // 发送前处理
                },
                success: function (data, textStatus, jqXHR) {
                    // 调用成功，解析response中的data到自定义的data中
                    if (data.code == 'S00001') {
                        toastr.info("修改成功");
						$("#newPassword2").val('');
						$("#rePassword2").val('');
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
        ,
    },
})


