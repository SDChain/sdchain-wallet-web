var load = new Vue({
    el: "#main",
    data: {
        sites: [],
        qblist: [],  //钱包下拉
        qbaddress: [],  //钱包地址
        bblist_buy: [],
        bblist_sell: [],
        mylist: [],  //我的列表
        myHb: "SDA",     //基础货币
        brHb: "CNY",     //对方货币
        select: -1,
        select_sell: -1,
        num1: "",      //买的数量
        price1: "",
        num2: "",      //卖的数量
        price2: "",
        canMoney1: 0,
        canMoney2: 0,
        sequence: "",
        getsCounterparty: "",
        paysCounterparty: "",
        sell_getsCounterparty: "",
        sell_paysCounterparty: "",
        baseparty: "",
        party: "",
        buy_password: "",
        sell_password: "",
        now_id: "",
        now_account: "",
        buy_account: "",
        sell_account: "",
        isDisable: false,
        isDisabletwo: false,
        buy_now_id: "",
        sell_now_id: ""
    },
    mounted: function () {
        this.walletList();
        this.$nextTick(function () {
            setInterval(this.exchange, jy_timeset);
            setInterval(this.getOrdersLists, jy_timeset);
            setInterval(this.refreshQb, jy_timeset);
            setInterval(this.refreshQb2, jy_timeset);
        });
    },
    methods: {
        click: function (price, base_amount, counter_amount) {
            this.price2 = price;
            this.num2 = counter_amount;
            $("#sell_num").text(base_amount);
        },
        click2: function (price, base_amount, counter_amount) {
            this.price1 = price;
            this.num1 = base_amount;
            $("#buy_num").text(counter_amount);
        },
        linkJyd: function () {
            // if (this.now_account == ""){
            // 	toastr.info("请选择钱包");
            // 	return;
            // }
            window.open(encodeURI('jy_3.html?account=' + this.now_account), '_self')
        },
        walletList: function () {  //获取钱包下拉
            var Jc = getUrlParam("Jc");
            var Df = getUrlParam("Df");
            if (Jc != null) {
                this.myHb = Jc;
                $("#showJc").text(Jc);
            }
            if (Df != null) {
                this.brHb = Df;
                $("#showDf").text(Df);
            }
            $.ajax({
                url: baseurl + '/payment/walletList',
                type: 'GET', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    userId: sessionStorage.getItem('id'),
                    apptoken: sessionStorage.getItem('apptoken'),
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
                        }
                        load.qblist = data.data.walletList;
                    } else {
                        toastr.info(data.message);
                    }
                    load.getAllCurrencyLists();
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
        getAllCurrencyLists: function () {  //获取币种地址

            $.ajax({
                url: baseurl + '/payment/getAllCurrencyLists',
                type: 'GET', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    userId: sessionStorage.getItem('id'),
                    apptoken: sessionStorage.getItem('apptoken'),
                },
                timeout: timeout_setting,    //超时时间
                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                beforeSend: function (xhr) {
                    // 发送前处理
                },
                success: function (data, textStatus, jqXHR) {
                    // 调用成功，解析response中的data到自定义的data中
                    if (data.code == 'S00001') {
                        load.qbaddress = data.data;
                        for (var i = 0; i < data.data.length; i++) {
                            if (data.data[i].currency == load.myHb) {
                                load.baseparty = data.data[i].counterparty;
                            }
                            else if (data.data[i].currency == load.brHb) {
                                load.party = data.data[i].counterparty;
                            }
                        }
                        if (load.myHb == "SDA") {
                            load.baseparty = null;
                        }
                        else if (load.brHb == "SDA") {
                            load.party = null;
                        }
                        load.exchange();
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
        exchange: function () {   //买单
            $.ajax({
                url: baseurl + '/orders/getExchangeLists',
                type: 'POST', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    baseCurrency: this.myHb,
                    baseCounterparty: this.baseparty,
                    counterCurrency: this.brHb,
                    counterCounterparty: this.party,
                },
                timeout: timeout_setting,    //超时时间
                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                beforeSend: function (xhr) {
                    // 发送前处理
                },
                success: function (data, textStatus, jqXHR) {
                    // 调用成功，解析response中的data到自定义的data中
                    if (data.code == 'S00001') {
                        for (var i = 0; i < data.data.exchangesBuy.length; i++) {
                            if (i % 2 == 1) {
                                data.data.exchangesBuy[i].color = true;
                            } else {
                                data.data.exchangesBuy[i].color = false;
                            }
                            data.data.exchangesBuy[i].price = Math.round(data.data.exchangesBuy[i].price * 1000000) / 1000000;

                        }
                        load.bblist_buy = data.data.exchangesBuy;
                        for (var i = 0; i < data.data.exchangesSell.length; i++) {
                            if (i % 2 == 1) {
                                data.data.exchangesSell[i].color = true;
                            } else {
                                data.data.exchangesSell[i].color = false;
                            }
                        }
                        load.bblist_sell = data.data.exchangesSell;
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
            });
        },
        submitOrder: function () {  //买入
            load.isDisable = true;
            if (this.num1 == "") {
                toastr.info("请输入数量");
                load.isDisable = false;
                return;
            }
            if (this.select == -1) {
                toastr.info("请选择钱包");
                load.isDisable = false;
                return;
            }
            if (this.buy_password == "") {
                toastr.info("请输入交易密码");
                load.isDisable = false;
                return;
            }
            if (Number(this.num1) * Number(this.price1) > Number(this.canMoney1)) {
                toastr.info("钱包余额不足");
                load.isDisable = false;
                return;
            }
            $.ajax({
                url: baseurl + '/orders/submitOrder',
                type: 'POST', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    userId: sessionStorage.getItem('id'),
                    apptoken: sessionStorage.getItem('apptoken'),
                    userAccountId: load.now_id,
                    walletPassword: this.buy_password,
                    paysCurrency: this.brHb,
                    paysCounterparty: this.getsCounterparty,
                    paysValue: $("#buy_num").text(),
                    getsCurrency: this.myHb,
                    getsCounterparty: this.paysCounterparty,
                    getsValue: this.num1,
                    type: "buy",
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
                        toastr.info(data.message);
                        // load.getOrdersLists();
                        // load.exchange();
                        setTimeout(function () {
                            load.num2 = "";
                            load.price2 = "";
                            load.select_sell = "";
                            load.sell_password = "";
                            load.canMoney2 = 0;
                            load.num1 = "";
                            load.price1 = "";
                            load.buy_password = "";
                            load.isDisable = false;

                        }, jy_submit_timeset);
                    } else {
                        toastr.info(data.message);
                        load.isDisable = false;
                    }
                },
                error: function (xhr, textStatus) {
                    // 调用时，发生错误
                    toastr.info(textStatus);
                    load.isDisable = false;
                },
                complete: function () {
                    // 交互后处理
                }
            })
        },
        submitOrder2: function () {  //卖出
            load.isDisable = true;
            if (this.num2 == "") {
                toastr.info("请输入数量");
                load.isDisable = false;
                return;
            }
            if (this.select_sell == -1) {
                toastr.info("请选择钱包");
                load.isDisable = false;
                return;
            }
            if (this.sell_password == "") {
                toastr.info("请输入交易密码");
                load.isDisable = false;
                return;
            }
            if (Number(this.num2) * Number(this.price2) > Number(this.canMoney2)) {
                toastr.info("钱包余额不足");
                load.isDisable = false;
                return;
            }
            $.ajax({
                url: baseurl + '/orders/submitOrder',
                type: 'POST', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    userId: sessionStorage.getItem('id'),
                    apptoken: sessionStorage.getItem('apptoken'),
                    userAccountId: load.now_id,
                    walletPassword: this.sell_password,
                    paysCurrency: this.myHb,
                    paysCounterparty: this.sell_getsCounterparty,
                    paysValue: this.num2,
                    getsCurrency: this.brHb,
                    getsCounterparty: this.sell_paysCounterparty,
                    getsValue: $("#sell_num").text(),
                    type: "sell",
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
                        toastr.info(data.message);
                        setTimeout(function () {
                            load.num2 = "";
                            load.price2 = "";
                            load.sell_password = "";
                            //买清空
                            load.num1 = "";
                            load.price1 = "";
                            load.select = "";
                            load.buy_password = "";
                            load.canMoney1 = 0;
                            load.isDisable = false;
                        }, jy_submit_timeset);
                    } else {
                        toastr.info(data.message);
                        load.isDisable = false;
                    }
                },
                error: function (xhr, textStatus) {
                    // 调用时，发生错误
                    toastr.info(textStatus);
                    load.isDisable = false;
                },
                complete: function () {
                    // 交互后处理
                }
            })
        },
        getOrdersLists: function () {  //委托单
            if (load.now_id != "") {
                $.ajax({
                    url: baseurl + '/orders/getOrdersLists',
                    type: 'GET', //GET、PUT、DELETE
                    async: false,    //是否异步
                    data: {
                        userId: sessionStorage.getItem('id'),
                        apptoken: sessionStorage.getItem('apptoken'),
                        userAccountId: load.now_id,
                        page: 1,
                    },
                    timeout: timeout_setting,    //超时时间
                    dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                    beforeSend: function (xhr) {
                        // 发送前处理
                    },
                    success: function (data, textStatus, jqXHR) {
                        // 调用成功，解析response中的data到自定义的data中
                        if (data.code == 'S00001') {
                            load.mylist = data.data.ordersLists;
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
        },


        sequence1: function (s) {
            $("#picCode").val(''),
                load.sequence = s;
        },

        refreshQb: function () {   //刷新买单钱包余额
            if (load.buy_now_id) {
                load.now_account = (load.qblist[load.buy_now_id]).account;
                load.buy_account = (load.qblist[load.buy_now_id]).account;
                $.ajax({
                    url: baseurl + '/payment/getBalance',
                    type: 'GET', //GET、PUT、DELETE
                    async: true,    //是否异步
                    data: {
                        account: load.buy_account,
                        userId: sessionStorage.getItem('id'),
                        apptoken: sessionStorage.getItem('apptoken'),
                    },
                    timeout: timeout_setting,    //超时时间
                    dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                    beforeSend: function (xhr) {
                        // 发送前处理
                    },
                    success: function (data, textStatus, jqXHR) {
                        // 调用成功，解析response中的data到自定义的data中
                        if (data.code == 'S00001') {
                            load.now_id = load.qblist[load.buy_now_id].userAccountId;
                            for (var i = 0; i < data.data.balances.length; i++) {
                                if (data.data.balances[i].currency == load.brHb) {
                                    load.canMoney1 = data.data.balances[i].value;
                                    load.getsCounterparty = data.data.balances[i].counterparty;
                                }
                                else if (data.data.balances[i].currency == load.myHb) {
                                    load.paysCounterparty = data.data.balances[i].counterparty;
                                }
                            }
                            load.now_id = load.qblist[load.buy_now_id].userAccountId;
                        } else {
                            load.canMoney1 = 0;
                        }
                    },
                    error: function (xhr, textStatus) {
                        // 调用时，发生错误
                        toastr.info(textStatus);
                        load.mylist = [];
                    },
                    complete: function () {
                        // 交互后处理
                    }
                })
            }
        },

        refreshQb2: function () {   //刷新卖单钱包余额
            if (load.sell_now_id) {
                load.now_account = load.qblist[load.sell_now_id ].account;
                load.sell_account = load.qblist[load.sell_now_id ].account;
                $.ajax({
                    url: baseurl + '/payment/getBalance',
                    type: 'GET', //GET、PUT、DELETE
                    async: true,    //是否异步
                    data: {
                        account: load.sell_account,
                        userId: sessionStorage.getItem('id'),
                        apptoken: sessionStorage.getItem('apptoken'),
                    },
                    timeout: timeout_setting,    //超时时间
                    dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                    beforeSend: function (xhr) {
                        // 发送前处理
                    },
                    success: function (data, textStatus, jqXHR) {

                        // 调用成功，解析response中的data到自定义的data中
                        if (data.code == 'S00001') {
                            load.now_id = load.qblist[load.sell_now_id].userAccountId;
                            for (var i = 0; i < data.data.balances.length; i++) {
                                if (data.data.balances[i].currency == load.myHb) {
                                    load.canMoney2 = data.data.balances[i].value;
                                    load.sell_getsCounterparty = data.data.balances[i].counterparty;
                                }
                                else if (data.data.balances[i].currency == load.brHb) {
                                    load.sell_paysCounterparty = data.data.balances[i].counterparty;
                                }
                            }
                            load.now_id = load.qblist[load.sell_now_id].userAccountId;
                        } else {
                            load.canMoney2 = 0;
                        }
                    },
                    error: function (xhr, textStatus) {
                        // 调用时，发生错误
                        toastr.info(textStatus);
                        load.mylist = [];
                    },
                    complete: function () {
                        // 交互后处理
                    }
                })
            }
        },
        changeQb: function (num) {
            load.buy_now_id = num;
            if (num == undefined) return;
            load.now_account = (load.qblist[num]).account;
            load.buy_account = (load.qblist[num]).account;
            $.ajax({
                url: baseurl + '/payment/getBalance',
                type: 'GET', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    account: load.buy_account,
                    userId: sessionStorage.getItem('id'),
                    apptoken: sessionStorage.getItem('apptoken'),
                },
                timeout: timeout_setting,    //超时时间
                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                beforeSend: function (xhr) {
                    // 发送前处理
                },
                success: function (data, textStatus, jqXHR) {
                    // 调用成功，解析response中的data到自定义的data中
                    if (data.code == 'S00001') {
                        load.now_id = load.qblist[num].userAccountId;
                        for (var i = 0; i < data.data.balances.length; i++) {
                            if (data.data.balances[i].currency == load.brHb) {
                                load.canMoney1 = data.data.balances[i].value;
                                load.getsCounterparty = data.data.balances[i].counterparty;
                            }
                            else if (data.data.balances[i].currency == load.myHb) {
                                load.paysCounterparty = data.data.balances[i].counterparty;
                            }
                        }
                        load.now_id = load.qblist[num].userAccountId;
                        load.getOrdersLists();
                    } else {
                        toastr.info(data.message);
                        load.canMoney1 = 0;
                        load.mylist = [];
                    }
                },
                error: function (xhr, textStatus) {
                    // 调用时，发生错误
                    toastr.info(textStatus);
                    load.mylist = [];
                },
                complete: function () {
                    // 交互后处理
                }
            })
            load.num2 = "";
            load.price2 = "";
            load.select_sell = "";
            load.sell_password = "";
            load.canMoney2 = 0;
        },
        changeQb2: function (num) {
            load.sell_now_id = num;
            if (num == undefined) return;
            load.now_account = load.qblist[num].account;
            load.sell_account = load.qblist[num].account;
            $.ajax({
                url: baseurl + '/payment/getBalance',
                type: 'GET', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    account: load.sell_account,
                    userId: sessionStorage.getItem('id'),
                    apptoken: sessionStorage.getItem('apptoken'),
                },
                timeout: timeout_setting,    //超时时间
                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                beforeSend: function (xhr) {
                    // 发送前处理
                },
                success: function (data, textStatus, jqXHR) {

                    // 调用成功，解析response中的data到自定义的data中
                    if (data.code == 'S00001') {
                        load.now_id = load.qblist[num].userAccountId;
                        for (var i = 0; i < data.data.balances.length; i++) {
                            if (data.data.balances[i].currency == load.myHb) {
                                load.canMoney2 = data.data.balances[i].value;
                                load.sell_getsCounterparty = data.data.balances[i].counterparty;
                            }
                            else if (data.data.balances[i].currency == load.brHb) {
                                load.sell_paysCounterparty = data.data.balances[i].counterparty;
                            }
                        }
                        load.now_id = load.qblist[num].userAccountId;
                        load.getOrdersLists();
                    } else {
                        toastr.info(data.message);
                        load.canMoney2 = 0;
                        load.mylist = [];
                    }
                },
                error: function (xhr, textStatus) {
                    // 调用时，发生错误
                    toastr.info(textStatus);
                    load.mylist = [];
                },
                complete: function () {
                    // 交互后处理
                }
            })
            load.num1 = "";
            load.price1 = "";
            load.select = "";
            load.buy_password = "";
            load.canMoney1 = 0;
        },


        changeHb: function () {
            var showJc = this.myHb;
            var showDf = this.brHb;
            var tmpparty = this.baseparty;
            this.baseparty = this.party;
            this.party = tmpparty;
            this.myHb = showDf;
            this.brHb = showJc;
            load.num2 = "";
            load.price2 = "";
            load.select_sell = "";
            load.sell_password = "";
            load.canMoney2 = 0;

            load.num1 = "";
            load.price1 = "";
            load.select = "";
            load.buy_password = "";
            load.canMoney1 = 0;

            load.exchange();
            load.now_id = "";
            load.mylist = [];
        },
    },
    watch: {
        num1: function (val) {
            this.num1 = val;
        },
        price1: function (val) {
            this.price1 = val;
        },
        num2: function (val) {
            this.num2 = val;
        },
        price2: function (val) {
            this.price2 = val;
        }
    }
});
// $watch 是一个实例方法
load.$watch('num1', function (newValue) {
    var num1 = newValue;
    var price1 = this.price1;
    if (!isNaN(num1 * price1)) {
        $("#buy_num").text(accMul(num1, price1));
    } else {
        $("#buy_num").text(0);
    }
});
load.$watch('price1', function (newValue) {
    var num1 = this.num1;
    var price1 = newValue;
    if (!isNaN(num1 * price1)) {
        $("#buy_num").text(accMul(num1, price1));
    } else {
        $("#buy_num").text(0);
    }
});
load.$watch('num2', function (newValue) {
    var num2 = newValue;
    var price2 = this.price2;
    if (!isNaN(num2 * price2)) {
        $("#sell_num").text(accMul(num2, price2));
    } else {
        $("#sell_num").text(0);
    }
});
load.$watch('price2', function (newValue) {
    var num2 = this.num2;
    var price2 = newValue;
    if (!isNaN(num2 * price2)) {
        $("#sell_num").text(accMul(num2, price2));
    } else {
        $("#sell_num").text(0);
    }
})


function cancelOrder() {
    $.ajax({
        url: baseurl + '/orders/cancelOrder',
        type: 'POST', //GET、PUT、DELETE
        async: true,    //是否异步
        data: {
            userId: sessionStorage.getItem('id'),
            apptoken: sessionStorage.getItem('apptoken'),
            userAccountId: load.now_id,
            walletPassword: $("#picCode").val(),
            sequence: load.sequence,
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
                for (var i = 0; i < load.mylist.length; i++) {
                    if (load.mylist[i].sequence == load.sequence) {
                        load.mylist.splice(i, 1);
                        break;
                    }
                }
                toastr.info("撤单成功");
                $("#myModal").modal("hide");
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
