// Vue App


jQuery(function(){
	// 清空 LocalSotrge
	clearsessionStorage();
})

var main_vue = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue.js!',
        smsId: '',
        smsCode: 'default',
        inputsmsCode: '',
        account: '',
        password1: '',
        password2: '',
    },
    // 在 `methods` 对象中定义方法
    methods: {

    },
    //在 `computed` 对象中定义方法
    computed: {
        bnt_vail_disabled: function (event) {
            //验证码按钮状态
            return this.account == '';
        },
        bnt_vail_style: function (event) {
            //验证码按钮样式
            if (this.bnt_vail_disabled) {
                return {'background-color': 'white', 'color': 'lightgray'};
            } else {
                return {'background-color': 'white', 'color': '#1494ff'};
            }
        },
        bnt_ok_disabled: function (event) {
            //OK按钮状态


            return false;
        },
        bnt_ok_style: function (event) {
            //OK按钮样式
            if (this.bnt_ok_disabled) {
                return {'background-color': 'white', 'color': 'lightgray'};
            } else {
                return {'background-color': '#1494ff', 'color': 'white'};
            }
        },
        safeleve1: function (event) {
            var leve_new = getSafeleve(this.password1);
            if (leve_new <= 1) {
                return 'cell_active1'
            } else {
                return 'cell_disable'
            }
        },
        safeleve2: function (event) {
            var leve_new = getSafeleve(this.password1);
            if (leve_new > 1 && leve_new <= 2) {
                return 'cell_active2'
            } else {
                return 'cell_disable'
            }
        },
        safeleve3: function (event) {
            var leve_new = getSafeleve(this.password1);
            if (leve_new >= 3) {
                return 'cell_active3'
            } else {
                return 'cell_disable'
            }
        }
    }
})

function next() {
    if ($("#account").val() == "") {
        toastr.info("请输入手机号/邮箱信息");
        return;
    }
    if (isPhoneNo($("#account").val()) == false && isEmail($("#account").val())==false) {
        toastr.info("请输入正确的手机号/邮箱");
        return;
    }
    if ($("#password1").val().length == 0) {
        toastr.info("密码长度不能为零。");
        return;
    }
    if ($("#password1").val() != $("#password2").val()) {
        toastr.info("确认密码不相同");
        return;
    }
    if ($("#password1").val().length < 6) {
        toastr.info("密码过短");
        return;
    }
    if ($("#password1").val().length > 16) {
        toastr.info("密码过长");
        return;
    }
    if (main_vue.inputsmsCode == '') {
        toastr.info("验证码不能为空。");
        return;
    }
    if (main_vue.smsId == '') {
        toastr.info("验证码获取失败。");
        return;
    }
    sessionStorage.setItem('smsId', main_vue.smsId);
    sessionStorage.setItem('smsCode', main_vue.inputsmsCode);
    sessionStorage.setItem('userName', main_vue.account);
    sessionStorage.setItem('password', main_vue.password1);
    window.open('reg_1.html', '_self');
}

// 验证手机号
function isPhoneNo(phone) {
    var pattern = /^1[34578]\d{9}$/;
    return pattern.test(phone);
}

// 验证邮箱
function isEmail(email) {
    var emailreg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    return emailreg.test(email);
}

//取得密码安全级别
function getSafeleve(s) {
    var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    //密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等
    var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var enoughRegex = new RegExp("(?=.{6,}).*", "g");
    if (false == enoughRegex.test(s)) {
        return 1;
    } else if (strongRegex.test(s)) {
        return 3;
    } else if (mediumRegex.test(s)) {
        return 2;
    } else {
        return 1;
    }
}

function getPicCode() {
    if ($("#account").val() == "") {
        toastr.info("请输入手机号/邮箱信息");
        return;
    }
    if (isPhoneNo($("#account").val()) == false && isEmail($("#account").val())==false) {
        toastr.info("请输入正确的手机号/邮箱");
        return;
    }
    $("#img_code").show();
    $("#load_img").hide();
    $("#picCode").val("");
    $("#myModal").modal();
    // 取得图像验证码
    $.ajax({
        url: baseurl + '/sms/getRandomCodePic',
        type: 'GET', //GET、PUT、DELETE
        async: true,    //是否异步
        data: {
            machineId: machineId
        },
        timeout: timeout_setting,    //超时时间
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        beforeSend: function (xhr) {
            // 发送前处理
        },
        success: function (data, textStatus, jqXHR) {
            // 调用成功，解析response中的data到自定义的data中

            if (data.code == 'S00001') {
                $("#load_img").attr("src", 'data:image/gif;base64,' + data.data);
                $("#load_img").show();
            } else {
                toastr.info(data.message);
            }
            $("#img_code").hide();

        },
        error: function (xhr, textStatus) {
            // 调用时，发生错误
            toastr.info(textStatus);
            $("#load_img").hide();
        },
        complete: function () {
            // 交互后处理
        }
    })
}

var countdown=60;
function changgeBtn(){
    var obj = $("#btn");
    settime(obj);
}
function settime(obj) { //发送验证码倒计时
    if (countdown == 0) {
        obj.attr('disabled',false);
        //obj.removeattr("disabled");
        obj.val("获取验证码");
        countdown = 60;
        return;
    } else {
        obj.attr('disabled',true);
        obj.val("重新发送(" + countdown + ")");
        countdown--;
    }
    setTimeout(function() {
            settime(obj) }
        ,1000)
}


function getCode() {
    // 取得手机验证码
    if ($("#account").val().indexOf('@') < 0) {
        getPhoneCode();
    } else {
        getEmailCode();
    }
}

function getPhoneCode() {
    // 取得手机验证码
    //$("#img_code").show();
    //$("#load_img").hide();
    $.ajax({
        url: baseurl + '/sms/getPhoneCode',
        type: 'GET', //GET、PUT、DELETE
        async: true,    //是否异步
        data: {
            account: $("#account").val(),
            mark: 0,
            machineId: machineId,
            randomPic: $("#picCode").val(),
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
                main_vue.smsId = data.data.smsId;
                main_vue.smsCode = data.data.smsCode;
                //$("#load_img").attr("src", 'data:image/gif;base64,' + data.data);
                //$("#load_img").show();
                $('#myModal').modal('hide');
                changgeBtn();
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

function getEmailCode() {
    // 取得手机验证码
    $.ajax({
        url: baseurl + '/sms/getEmailCode',
        type: 'GET', //GET、PUT、DELETE
        async: true,    //是否异步
        data: {
            account: $("#account").val(),
            mark: 0,
            machineId: machineId,
            randomPic: $("#picCode").val(),
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
                main_vue.smsId = data.data.smsId;
                main_vue.smsCode = data.data.smsCode;
                //$("#load_img").attr("src", 'data:image/gif;base64,' + data.data);
				//$("#load_img").show();
                $('#myModal').modal('hide');
                changgeBtn();
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


