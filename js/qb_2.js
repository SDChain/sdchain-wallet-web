var load = new Vue({
    el: "#main",
    data: {
        sites: [],
    },
    mounted: function () {

    },
    methods: {
        qbImport: function () {
            var qbName = $("#qbName").val().trim();
            var qbAddress_gy = $("#qbAddress_gy").val();
            var qbAddress_sy = $("#qbAddress_sy").val();
            var qbPassord = $("#qbPassord").val();
            if (qbName == "") {
                toastr.info("请输入钱包名");
                return;
            }
            if (qbAddress_gy == "") {
                toastr.info("请输入公钥地址");
                return;
            }
            if (qbAddress_sy == "") {
                toastr.info("请输入私钥地址");
                return;
            }
            if (qbPassord  == "") {
                toastr.info("请输入交易密码");
                return;
            }
            $.ajax({
                url: baseurl + '/payment/importWallet',
                type: 'POST', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    userId: sessionStorage.getItem('id'),
                    apptoken: sessionStorage.getItem('apptoken'),
                    walletPassword: qbPassord,
                    secret: qbAddress_sy,
                    account:qbAddress_gy,
					walletName:qbName,
                },
                timeout: timeout_setting,    //超时时间
                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                beforeSend: function (xhr) {
                    // 发送前处理
                },
                success: function (data, textStatus, jqXHR) {
                    // 调用成功，解析response中的data到自定义的data中
                    if (data.code == 'S00001') {
                        toastr.info("导入成功");
                        window.location.href = "qb_5.html";
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
        canelImport: function () {
            window.location.href = "qb_7.html";
        },
    },
});