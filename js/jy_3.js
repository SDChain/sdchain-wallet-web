var load = new Vue({
    el: "#main",
    data: {
        sites: [],
        account: sessionStorage.getItem('account'),
        myhb: "SDA",
        dfhb: "",
        mynum: 0,
        dfnum: 1,
    },
    mounted: function () {
        this.getCurrencyLists();
    },
    methods: {
        getCurrencyLists: function () {   //加载用户的币种列表
            $.ajax({
                url: baseurl + '/payment/getCurrencyLists',
                type: 'GET', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    userId: sessionStorage.getItem('id'),  //用户ID
                    apptoken: sessionStorage.getItem('apptoken'),
                    code: '',
                    page: 1,
                    account: this.account,  //钱包ID
                },
                timeout:timeout_setting,    //超时时间
                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                beforeSend: function (xhr) {
                    // 发送前处理
                },
                success: function (data, textStatus, jqXHR) {
                    // 调用成功，解析response中的data到自定义的data中
                    if (data.code == 'S00001') {
                        var c = 0;
                        var first = {
                            jc: 'jc' + c,
                            df: 'df' + c,
                            jchb: 'jchb' + c,
                            num: c,
                            currency:"SDA"
                        }
                        c++
                        load.sites.push(first);
                        for (var i = 0; i < data.data.length; i++) {
                            if (data.data[i].trusted) {
                                data.data[i].num = c;
                                data.data[i].jc = 'jc' + c;
                                data.data[i].df = 'df' + c;
                                data.data[i].jchb = 'jchb' + c;
                                load.sites.push(data.data[i]);
                                c++;
                            }
                        }


                    } else {
                        toastr.info(data.message);
                    }
                    load.$nextTick(function () {  //页面数据加载完
                        this.selectJc(0);
                        this.selectDf(1);
                    })

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

        selectJc: function (num) {
            var lengh_num = $(".jy1_sum").length;
            for (var i = 0; i < lengh_num; i++) {
                if (num == i) {
                    $("#jc" + i).removeClass("jy_usd_btn");
                    $("#jc" + i).addClass("jy_usd_btn_hover");
                    var selectJc = $("#jchb" + i).text();
                    $("#showJc").text(selectJc);
                } else {
                    $("#jc" + i).removeClass("jy_usd_btn_hover");
                    $("#jc" + i).addClass("jy_usd_btn");
                }
            }
            load.mynum=num;
        },
        selectDf: function (num) {
            var lengh_num = $(".jy1_sum").length;
            for (var i = 0; i < lengh_num; i++) {
                if (num == i) {
                    $("#df" + i).removeClass("jy_usd_btn");
                    $("#df" + i).addClass("jy_usd_btn_hover");
                    var selectJc = $("#jchb" + i).text();
                    $("#showDf").text(selectJc);
                } else {
                    $("#df" + i).removeClass("jy_usd_btn_hover");
                    $("#df" + i).addClass("jy_usd_btn");
                }
            }
            load.dfnum=num;
        },
        changeHb: function () {
            var showJc = $("#showJc").text();
            var showDf = $("#showDf").text();
            $("#showJc").text(showDf);
            $("#showDf").text(showJc);
            var myselect=load.mynum;
            var dfselect=load.dfnum;

            var lengh_num = $(".jy1_sum").length;
            for (var i = 0; i < lengh_num; i++) {
                if (load.dfnum == i) {
                    $("#jc" + i).removeClass("jy_usd_btn");
                    $("#jc" + i).addClass("jy_usd_btn_hover");
                    var selectJc = $("#jchb" + i).text();
                    $("#showJc").text(selectJc);
                } else {
                    $("#jc" + i).removeClass("jy_usd_btn_hover");
                    $("#jc" + i).addClass("jy_usd_btn");
                }
            }
            for (var i = 0; i < lengh_num; i++) {
                if (load.mynum == i) {
                    $("#df" + i).removeClass("jy_usd_btn");
                    $("#df" + i).addClass("jy_usd_btn_hover");
                    var selectJc = $("#jchb" + i).text();
                    $("#showDf").text(selectJc);
                } else {
                    $("#df" + i).removeClass("jy_usd_btn_hover");
                    $("#df" + i).addClass("jy_usd_btn");
                }
            }
            load.mynum=dfselect;
            load.dfnum=myselect;
        },
        linkjy_5: function () {
            var showJc = $("#showJc").text();
            var showDf = $("#showDf").text();
            if (showJc == showDf) {
                toastr.info("请选择不同种类的货币");
                return;
            }
            window.location.href = "jy_5.html?Jc=" + showJc + "&Df=" + showDf;
        }
    },
});