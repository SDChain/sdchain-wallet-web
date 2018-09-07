var load = new Vue({
    el: "#main",
    data: {
        sites: [],
        balances: [],
        qb_address: "",
        address2: "",
        type: 1,  //提交的哪个表单
        destinationAccount1: "",
        destinationAccount2: "",
        sendBztype: "",
        sendJe: 0,
        shown1: false,
        shown2: false,
        shown3: false,
        jsType1: '',
        jsType2: '',
        show_address2: '',
        sendparty: "",
        currency: '',
        currency2: '',
        now_id: sessionStorage.getItem('userAccountId'),
        isDisable: false,
        isClear2: false,
        isClear1: false,
        noChange: false,
        clickNum: ""
    },
    mounted: function () {
        this.pageload();
        this.$nextTick(function () {
            setInterval(this.recommend, zz_timeset);
        });
    },
    methods: {
        pageload: function () {
            var account = getUrlParam("account");
            var userName = getUrlParam("userName");
            var loadtype = getUrlParam("loadtype");
            if (loadtype != null) {
                if (loadtype == "1") {
                    $("#qb_tab1").show();
                    $("#qb_tab2").hide();
                    $("#act1").addClass("jy_active");
                    $("#act2").removeClass("jy_active");
                    this.type = 1;
                } else {
                    $("#qb_tab1").hide();
                    $("#qb_tab2").show();
                    $("#act2").addClass("jy_active");
                    $("#act1").removeClass("jy_active");
                    this.type = 2;
                }
            }
            if (account != null) {
                this.qb_address = account;
                this.destinationAccount1 = account;
                this.destinationAccount2 = account;
                this.show_address2 = "地址:" + account;
                $("#show_address2").text("地址:" + account);
                this.accountSearch(account);
            }

            if (userName != null) {  //提交以后不用再查用户
                this.address2 = userName;
                this.userSearch(userName);
            }
            this.recommend();
        },
        accountSearch: function (newValue) {
            $.ajax({
                url: baseurl + '/payment/getCurrencyLists',  //获取对方可接受的币种
                type: 'GET', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    userId: sessionStorage.getItem('id'),
                    apptoken: sessionStorage.getItem('apptoken'),
                    code: '',
                    page: 1,
                    account: newValue,
                },
                timeout: timeout_setting,    //超时时间
                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                beforeSend: function (xhr) {
                    // 发送前处理
                },
                success: function (data, textStatus, jqXHR) {
                    // 调用成功，解析response中的data到自定义的data中
                    if (data.code == 'S00001') {
                        load.currency2 = "";
                        var num = 0;
                        for (var i = 0; i < data.data.length; i++) {
                            if (data.data[i].trusted) {
                                load.currency2 += ' ';
                                load.currency2 += data.data[i].currency;
                                num++
                            }
                        }
                        if (num == 0) {
                            //$("#jsType1").text('钱包地址不存在');
                            //load.jsType1 = '钱包地址不存在';
                            if (load.currency2 == '') {
                                $("#jsType1").text('账号可接收SDA');
                                load.jsType1 = '账号可接收SDA';
                                load.shown1 = true;
                            }
                        } else {
                            if (load.currency2 == '') {
                                $("#jsType1").text('账号可接收SDA');
                                load.jsType1 = '账号可接收SDA';
                                load.shown1 = true;
                            }
                            else {
                                $("#jsType1").text('账号可接收SDA ' + load.currency2);
                                load.jsType1 = '账号可接收SDA ' + load.currency2;
                                load.shown1 = true;
                            }
                        }
                    } else {
                        $("#jsType1").text(data.message);
                        load.shown1 = true;
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
            this.destinationAccount1 = newValue;
        },
        userSearch: function (newValue) {
            var account = "";
            $.ajax({
                url: baseurl + '/user/searchUser',  //获取对方可接受的币种
                type: 'GET', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    userName: newValue,
                },
                timeout: timeout_setting,    //超时时间
                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                beforeSend: function (xhr) {
                    // 发送前处理
                },
                success: function (data, textStatus, jqXHR) {
                    // 调用成功，解析response中的data到自定义的data中
                    if (data.code == 'S00001') {
                        account = data.data.account;
                        var id = data.data.id;
                        $.ajax({
                            url: baseurl + '/payment/getCurrencyLists',  //获取对方可接受的币种
                            type: 'GET', //GET、PUT、DELETE
                            async: true,    //是否异步
                            data: {
                                userId: sessionStorage.getItem('id'),
                                apptoken: sessionStorage.getItem('apptoken'),
                                code: '',
                                page: 1,
                                account: account,
                            },
                            timeout: timeout_setting,    //超时时间
                            dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                            beforeSend: function (xhr) {
                                // 发送前处理
                            },
                            success: function (data, textStatus, jqXHR) {
                                if (data.code == 'S00001') {
                                    load.currency = "";
                                    load.shown3 = false;
                                    load.shown2 = true;
                                    for (var i = 0; i < data.data.length; i++) {
                                        if (data.data[i].trusted) {
                                            load.currency += data.data[i].currency;
                                            load.currency += ' ';
                                        }
                                    }
                                    $("#show_address2").text("地址:" + account);
                                    load.show_address2 = "地址:" + account;
                                    if (load.currency == '') {
                                        $("#jsType2").text('账号可接收SDA');
                                        load.jsType2 = '账号可接收SDA';
                                    }
                                    else {
                                        $("#jsType2").text('账号可接收SDA ' + load.currency);
                                        load.jsType2 = '账号可接收SDA ' + load.currency;
                                    }
                                }
                                load.destinationAccount2 = account;
                            },
                            error: function (xhr, textStatus) {
                                // 调用时，发生错误
                                toastr.info(textStatus);
                                load.destinationAccount2 = account;
                            },
                            complete: function () {
                                // 交互后处理
                            },
                        })


                    } else {
                        load.shown2 = false;
                        load.shown3 = true;
                        $("#jsType2").text(data.message);
                        load.jsType2 = data.message;
                    }
                },
                error: function (xhr, textStatus) {
                    // 调用时，发生错误
                    //toastr.info(textStatus);
                },
                complete: function () {
                    // 交互后处理
                }
            })
        },
        recommend: function () {
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
                            data.data.walletList[i].jy_menu = 'jy_menu' + i;
                            data.data.walletList[i].jy_arrow = 'jy_arrow' + i;
                            if (data.data.walletList[i].isdefault == '1') {  //默认钱包展开
                                data.data.walletList[i].inshow = true;
                            } else {
                                data.data.walletList[i].inshow = false;
                            }
                            $.ajax({
                                url: baseurl + '/payment/getBalance',
                                type: 'GET',
                                async: false,
                                data: {
                                    account: data.data.walletList[i].account,
                                    userId: sessionStorage.getItem('id'),
                                    apptoken: sessionStorage.getItem('apptoken'),
                                },
                                timeout: timeout_setting,    //超时时间
                                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                                success: function (detail) {
                                    if (data.code == 'S00001') {
                                        if (detail.data != null) {
                                            for (var j = 0; j < detail.data.balances.length; j++) {
                                                detail.data.balances[j].num = j;   //加排序
                                                detail.data.balances[j].reserveBase = detail.data.reserveBase; //冻结
                                                detail.data.balances[j].jy_select = 'jy_select' + j;
                                            }
                                            data.data.walletList[i].detail = detail.data.balances;
                                            if (data.data.walletList[i].isdefault == '1'&& load.noChange==false) {  //默认钱包展开
                                                load.noChange = true;
                                                load.balances = detail.data.balances;
                                                load.checkJy(0, load.balances[0].currency, parseFloat(load.balances[0].value), load.balances[0].reserveBase, load.balances[0].counterparty);
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
                        load.sites = data.data.walletList;
                        if (load.noChange==true&&load.clickNum!=""){
                            load.balances = data.data.walletList[load.clickNum].detail;
                        }
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
        showMenu: function (num) {
            load.clickNum = num;
            $(".jy_1_menu_active").addClass("jy_1_menu");
            $(".arrow_down_active").addClass("arrow_down");
            $(".jy_1_menu_active").removeClass("jy_1_menu_active");
            $(".arrow_down_active").removeClass("arrow_down_active");
            $("#jy_menu" + num).addClass("jy_1_menu_active");
            $("#jy_arrow" + num).addClass("arrow_down_active");
            if (load.sites[num].detail) {
                load.balances = load.sites[num].detail;
            } else {
                load.balances = [];
            }
            load.now_id = load.sites[num].userAccountId;
            load.sendBztype = "";
            load.sendJe = "";
            load.checkJy(0, load.balances[0].currency, load.balances[0].value, load.balances[0].reserveBase, load.balances[0].counterparty);
        },
        checkJy: function (num, currency, value, reserveBase, party) {
            var lengh_num = $(".jy_check").length;
            for (var i = 0; i < lengh_num; i++) {
                $("#jy_select" + i).removeClass("jy_select_active");
                $("#jy_select" + i).addClass("jy_select");
            }
            $("#jy_select" + num).removeClass("jy_select");
            $("#jy_select" + num).addClass("jy_select_active");
            load.sendBztype = currency;
            load.sendparty = party;
            load.sendJe = accAdd(value, reserveBase * -1)
        },
        showSuccess: function () {
            load.isDisable = true;
            if (load.type == 1) {
                var address1 = $("#address1").val();
                var je1 = $("#je1").val();
                var beizhu1 = $("#beizhu1").val();
                var password1 = $("#password1").val();
                if (address1 == "") {
                    toastr.info("请输入钱包地址");
                    load.isDisable = false;
                    return;
                }
                if (je1 == "") {
                    toastr.info("请输入金额");
                    load.isDisable = false;
                    return;
                }
                if (load.sendBztype == "") {
                    toastr.info("请选择币种");
                    load.isDisable = false;
                    return;
                }
                if (Number(je1) > Number(this.sendJe)) {
                    toastr.info("金额不足");
                    load.isDisable = false;
                    return;
                }
                if (password1 == "") {
                    toastr.info("请输入交易密码");
                    load.isDisable = false;
                    return;
                }
                $.ajax({
                    url: baseurl + '/payment/issueCurrency',  //转账
                    type: 'POST', //GET、PUT、DELETE
                    async: true,    //是否异步
                    data: {
                        destinationAccount: load.destinationAccount1, //目标账户
                        value: je1,
                        currency: load.sendBztype,
                        issuer: load.sendparty,
                        memo: beizhu1,
                        walletPassword: password1,
                        userId: sessionStorage.getItem('id'),
                        apptoken: sessionStorage.getItem('apptoken'),
                        userAccountId: load.now_id,
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
                            $("#je1").val("");
                            $("#beizhu1").val("");
                            $("#password1").val("");
                            load.isClear1 = true;
                            setTimeout(function () {
                                load.isDisable = false;
                            }, zz_submit_timeset);
                        } else {
                            toastr.info(data.message);
                            setTimeout(function () {
                                load.isDisable = false;
                            }, zz_submit_timeset);
                        }
                    },
                    error: function (xhr, textStatus) {
                        // 调用时，发生错误
                        toastr.info(textStatus);
                        setTimeout(function () {
                            load.isDisable = false;
                        }, zz_submit_timeset);
                    },
                    complete: function () {
                        // 交互后处理
                    }
                })
            } else {
                var address2 = load.address2;
                var je2 = $("#je2").val();
                var beizhu2 = $("#beizhu2").val();
                var password2 = $("#password2").val();
                if (address2 == "") {
                    toastr.info("请输入钱包地址");
                    load.isDisable = false;
                    return;
                }
                if (je2 == "") {
                    toastr.info("请输入金额");
                    load.isDisable = false;
                    return;
                }
                if (load.sendBztype == "") {
                    toastr.info("请选择币种");
                    load.isDisable = false;
                    return;
                }
                if (Number(je2) > Number(this.sendJe)) {
                    toastr.info("金额不足");
                    load.isDisable = false;
                    return;
                }
                if (password2 == "") {
                    toastr.info("请输入交易密码");
                    load.isDisable = false;
                    return;
                }
                $.ajax({
                    url: baseurl + '/payment/issueCurrency',  //获取对方可接受的币种
                    type: 'POST', //GET、PUT、DELETE
                    async: true,    //是否异步
                    data: {
                        destinationAccount: load.destinationAccount2, //目标账户
                        value: je2,
                        currency: load.sendBztype,
                        issuer: load.sendparty,
                        memo: beizhu2,
                        walletPassword: password2,
                        userId: sessionStorage.getItem('id'),
                        apptoken: sessionStorage.getItem('apptoken'),
                        userAccountId: load.now_id,
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
                            $("#je2").val("");
                            $("#beizhu2").val("");
                            $("#password2").val("");
                            load.isClear2 = true;
                            setTimeout(function () {//两秒后跳转
                                load.isDisable = false;
                            }, zz_submit_timeset);
                        } else {
                            toastr.info(data.message);
                            setTimeout(function () {
                                load.isDisable = false;
                            }, zz_submit_timeset);
                        }
                    },
                    error: function (xhr, textStatus) {
                        // 调用时，发生错误
                        toastr.info(textStatus);
                        setTimeout(function () {
                            load.isDisable = false;
                        }, zz_submit_timeset);
                    },
                    complete: function () {
                        // 交互后处理
                    }
                })
            }

        },
        act1: function () {
            $("#qb_tab1").show();
            $("#qb_tab2").hide();
            $("#act1").addClass("jy_active");
            $("#act2").removeClass("jy_active");
            load.type = 1;
        },
        act2: function () {
            $("#qb_tab2").show();
            $("#qb_tab1").hide();
            $("#act2").addClass("jy_active");
            $("#act1").removeClass("jy_active");
            load.type = 2;
        },
    },
    // watch: {
    //     qb_address: function (val) {
    //         this.qb_address = val;
    //     },
    //     address2: function (val) {
    //         this.address2 = val;
    //     }
    // }
});

$("#qb_address").blur(function(){
    load.shown1 = true;
    load.currency2 = "";
    var newValue=$("#qb_address").val();
    // 这个回调将在 qb_address 改变后调用
    if (newValue) {
        load.accountSearch(newValue);
    } else {
        load.shown1 = false;
    }
});
$("#address2").blur(function(){
    jsType2 = '';
    show_address2 = '';
    load.currency = "";
    var newValue=$("#address2").val();
    if (newValue != "") {
        load.userSearch(newValue);
    } else {
        load.shown3 = false;
        load.shown2 = false;
    }
});




// load.$watch('qb_address', function (newValue) {
//     load.shown1 = true;
//     load.currency2 = "";
//     // 这个回调将在 qb_address 改变后调用
//     if (newValue != "") {
//         load.accountSearch(newValue);
//     } else {
//         load.shown1 = false;
//     }
// })
//
// load.$watch('address2', function (newValue) {
//     jsType2 = '';
//     show_address2 = '';
//     load.currency = "";
//     if (newValue != "") {
//         load.userSearch(newValue);
//     } else {
//         load.shown3 = false;
//         load.shown2 = false;
//     }
// })








