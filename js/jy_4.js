var load = new Vue({
    el: "#main",
    data: {
        sites: [],
        page: 1,
        moreinfo: [],
    },
    mounted: function () {
        this.recommend(1);
    },
    methods: {
        recommend: function (page) {
            $.ajax({
                url: baseurl + '/payment/getAllPayments',
                type: 'POST', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    account: sessionStorage.getItem('account'),
                    page: page,
                },
                timeout:timeout_setting ,   //超时时间
                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                beforeSend: function (xhr) {
                    // 发送前处理
                },
                success: function (data, textStatus, jqXHR) {
                    // 调用成功，解析response中的data到自定义的data中
                    if (data.code == 'S00001') {
                        for (i = 0; i < data.data.length; i++) {
							load.sites.push(data.data[i])
                        }
                        if (data.data.length == 0) {
                            if (load.page != 1) {  //
                                toastr.info("没有数据了");
                            }
                        }
                        load.page = load.page + 1;
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

    },
});