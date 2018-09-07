var load = new Vue({
    el: "#main",
    data: {
        sites: [],
        cardList: [],
        bankCard: [],
        walletId: '',
        num: 1,
        tx_card: '',
        kt_money: 0, //选择钱包可提现金
        name: sessionStorage.getItem('realName'),
        userAccountId: sessionStorage.getItem('userAccountId'),
        page: 0,
        input_num: 0, //提现数量
        pagenum: 1, //分页页码
        total_page: 1, //一共的页数
        pd: '',
        choose: false,
        forwardList: [], //提现列表
        rows: 10,//提现列表总条数
        isDisable: false,
    },
    mounted: function () {
        this.recommend();
    },
    methods: {
        recommend: function () {
        	if(sessionStorage.getItem('realName')=="null"){
        	    this.name="--";
            }
            $.ajax({
                url: baseurl + '/payment/walletList',
                type: 'GET', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    userId: sessionStorage.getItem('id'),
                    apptoken: sessionStorage.getItem('apptoken'),
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
                        for (var i = 0; i < data.data.walletList.length; i++) {
                            data.data.walletList[i].num = i;
                            data.data.walletList[i].fw_select = 'fw_select' + i;
                            if (data.data.walletList[i].isdefault == '1') {  //默认钱包展开
                                data.data.walletList[i].inshow = true;
                                load.num=i;
                            }
                            load.sites.push(data.data.walletList[i]);
                            $.ajax({
                                url: baseurl + '/payment/getBalance',
                                type: 'GET',
                                async: false,
                                data: {
                                    account: data.data.walletList[i].account,
                                    userId: sessionStorage.getItem('id'),
                                    apptoken: sessionStorage.getItem('apptoken'),
                                    validStr: 'd2ViYXBwOg=='
                                },
                                timeout: timeout_setting,    //超时时间
                                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                                success: function (detail) {
                                    if (detail.code == 'S00001') {
                                        if (detail.data != null) {
                                            for (var j = 0; j < detail.data.balances.length; j++) {
                                                if (detail.data.balances[j].currency == 'CNY') {
                                                    detail.data.balances[j].num = j;
                                                    detail.data.balances[j].reserveBase = detail.data.reserveBase;
                                                    data.data.walletList[i].detail = detail.data.balances[j];
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                },
                                error: function (xhr, textStatus) {
                                    // 调用时，发生错误
                                    toastr.info(textStatus);
                                },
                            });
                        }
                        load.$nextTick(function(){  //页面数据加载完以后
                            load.checkJy(load.num);
                        })
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
        putForwardList: function (num) {   //获取提现列表
            load.pagenum = num;
            $.ajax({
                url: baseurl + '/bankCard/putForwardList',
                type: 'POST',
                async: true,
                data: {
                    userId: sessionStorage.getItem('id'),
                    apptoken: sessionStorage.getItem('apptoken'),
                    page: load.pagenum,
                    validStr: 'd2ViYXBwOg=='
                },
                timeout: timeout_setting,    //超时时间
                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                success: function (data) {
                    load.rows = data.rows;
                    load.forwardList = data.data;
                },
                error: function (xhr, textStatus) {
                    //调用时，发生错误
                    toastr.info(textStatus);
                },
            });
        },
        putForward: function () {   //提现

            if (!load.choose) {
                toastr.info("请选择钱包")
            }
            else if (load.input_num <= 0) {
                toastr.info("提现失败，金额不正确")
            }
            else if (load.input_num <= 2) {
                toastr.info("提现失败，金额过少")
            }
            else if (load.sites[load.num].detail == null) {
                toastr.info("提现失败，钱包余额为零，无法提现")
            }
            else {
                load.kt_money = (load.sites[load.num].detail.value) - (load.sites[load.num].detail.reserveBase);
                if (load.kt_money < load.input_num) {
                    toastr.info("提现失败，金额过多")
                }
                else if (load.tx_card == '') {
                    toastr.info("请选择银行卡信息")
                }
                else if (load.pd == '') {
                    toastr.info("请输入交易密码")
                }

                else {
                    // 提现出的总额
                    var act_money = 0;
                    var sx = 0;
                    if (load.input_num <= 400) {
                        act_money = load.input_num - 2;
                        sx = 2;
                    }
                    else {
                        sx = load.input_num * 0.005
                        act_money = load.input_num - sx;
                    }

                    $.ajax({
                        url: baseurl + '/bankCard/putForward',
                        type: 'POST',
                        async: true,
                        data: {
                            userId: sessionStorage.getItem("id"),
                            apptoken: sessionStorage.getItem("apptoken"),
                            userAccountId: load.sites[load.num].userAccountId,
                            putValue: load.input_num,
                            putFee: sx,
                            putRealValue: act_money,
                            cardId: load.tx_card,
                            walletPassword: load.pd,

                            validStr: 'd2ViYXBwOg=='
                        },
                        timeout: timeout_setting,    //超时时间
                        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                        success: function (data) {

                            if (data.code == 'S00001') {
                                toastr.info("提现成功");
                                setTimeout(function(){//两秒后跳转
                                    load.isDisable = false;
                                },submit_timeset);
                            } else {
                                toastr.info(data.message);
                            }
                        },
                        error: function (xhr, textStatus) {
                            // 调用时，发生错误
                            oastr.info(textStatus);
                        },
                    });
                }

            }
        },
        checkJy: function (num) {
            this.num = num;
            this.choose = true;
            var lengh_num = $(".fw_line").length;
            for (var i = 0; i < lengh_num; i++) {
                $("#fw_select" + i).removeClass("fw_select_active");
                $("#fw_select" + i).addClass("fw_select");
            }
            $("#fw_select" + num).removeClass("fw_select");
            $("#fw_select" + num).addClass("fw_select_active");

        },

        pageUp: function () {
            if (this.pagenum == 1) {
                return;
            }
            this.pagenum = this.pagenum - 1;
            load.putForwardList(this.pagenum);
        },
        pageDown: function () {
            if (this.pagenum == this.total_page) {
                return;
            }
            this.pagenum = this.pagenum + 1;
            load.putForwardList(this.pagenum);
        }

    },
    computed: {

        pageCode: function () {
            var pages = []
            for (var i = 1; i <= this.total_page; i++) {
                pages.push(i);
            }
            return pages;
            //return '第'+this.pageNum + '页/共' + this.pageCount + '页';
        },
    }
});
$(function () {

    var h = document.documentElement.offsetHeight;
    $(".jy_main").height(h - 95);
    // 设定主菜单选择项
    $("#fw").addClass("active treeview");
    // 设定子菜单选择项
    $("#fw2").addClass("active");
    $.ajax({
        //取得银行卡列表
        url: baseurl + '/bankCard/getCardList',
        type: 'POST', //GET、PUT、DELETE
        async: true,    //是否异步
        data: {
            userId: sessionStorage.getItem('id'),
            apptoken: sessionStorage.getItem('apptoken'),
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
                load.cardList = data.data;
            }

        },
        error: function (xhr, textStatus) {
            // 调用时，发生错误
            toastr.info(textStatus);
        },
        complete: function () {
            // 交互后处理
        }
    });

    $.ajax({
        url: baseurl + '/bankCard/putForwardList',
        type: 'POST',
        async: true,
        data: {
            userId: sessionStorage.getItem('id'),
            apptoken: sessionStorage.getItem('apptoken'),
            page: load.pagenum,
            validStr: 'd2ViYXBwOg=='
        },
        timeout: timeout_setting,    //超时时间
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        success: function (data) {
            load.rows = data.rows;
            total_page = load.rows / load.pagenum + 1;
            load.forwardList = data.data;
        },
        error: function (xhr, textStatus) {
            // 调用时，发生错误
            toastr.info(textStatus);
        },
    });


});







