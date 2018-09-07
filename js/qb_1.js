var load = new Vue({
    el: "#main",
    data: {
        sites: [],
		account:'',
		
    },
    mounted: function () {

    },
    methods: {
		checkNumber: function(theObj) {
			var reg = /^[0-9]{6}$/;
			return reg.test(theObj);
		},
        qbCreate: function () {
            var qbName = $("#qbName").val().trim();
            var qbPassword = $("#qbPassword").val();
            var rePassword = $("#rePassword").val();
            if (qbName == "") {
                toastr.info("请输入钱包名");
                return;
            }
            if (qbPassword == "") {
                toastr.info("请输入交易密码");
                return;
            }
            if (rePassword == "") {
                toastr.info("请确认交易密码");
                return;
            }
            if (qbPassword != rePassword) {
                toastr.info("两次密码不一致");
                return;
            }
			if (!this.checkNumber(qbPassword)) {
                toastr.info("请输入六位阿拉伯数字");
                return;
            }
            $.ajax({
                url: baseurl + '/payment/createWallet',
                type: 'POST', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    apptoken: sessionStorage.getItem('apptoken'),
                    id: sessionStorage.getItem('id'),
                    walletPassword: qbPassword,
					walletName:qbName,
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
                        toastr.info("创建成功");
						load.account = data.data.account;
						sessionStorage.setItem('walletpassword',qbPassword);
						window.open(encodeURI('qb_8.html?account='+load.account + '&qbname=' + qbName + '&userAccountId=' + data.data.userAccountId) , '_self')
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
        },
		
        canelCreate: function () {
            window.location.href = "qb_7.html";
        },
    },
});