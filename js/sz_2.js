var main_vue = new Vue({
    el: '#app',
    data: {
        smsId: '',
        smsCode: '',
        inputsmsCode: '',
        account: ''
    },
    // 在 `methods` 对象中定义方法
    methods: {},
    //在 `computed` 对象中定义方法
    computed: {}
})

// 验证手机号
function isPhoneNo(phone) {
    var pattern = /^1[34578]\d{9}$/;
    return pattern.test(phone);
}

function ok() {

    if ($("#account").val().length == 0) {
        toastr.info("新手机号不能为空。");
        return;
    }
    if (isPhoneNo($("#account").val())==false) {
        toastr.info("请输入正确的手机号。");
        return;
    }
    if ($("#password").val().length == 0) {
        toastr.info("密码不能为空。");
        return;
    }
    if (main_vue.inputsmsCode == '') {
        toastr.info("验证码不能为空。");
        return;
    }
    // 修改手机号
    $.ajax({
        url: baseurl + '/user/bindPhone',
        type: 'POST', //GET、PUT、DELETE
        async: true,    //是否异步
        data: {
            smsId: main_vue.smsId,
            userId: sessionStorage.getItem('id'),
            code: main_vue.inputsmsCode,
            password: $("#password").val(),
            apptoken: sessionStorage.getItem('apptoken'),
            phone: $("#account").val(),
            validStr: 'd2ViYXBwOg=='
        },
        timeout: timeout_setting,    //超时时间
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        beforeSend: function (xhr) {
            // 发送前处理
        },
        success: function (data, textStatus, jqXHR) {
            // 调用成功，解析response中的data到自定义的data中
            toastr.info(data.message);
            if (data.code == 'S00001') {
                alert('请重新登录。');
                logout();
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

function getPicCode() {
    if ($("#account").val().length == 0) {
        toastr.info("新手机号不能为空。");
        return;
    }
    if (isPhoneNo($("#account").val())==false) {
        toastr.info("请输入正确的手机号。");
        return;
    }
    $("#img_code").show();
    $("#load_img").hide();
    $("#picCode").val('');
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
                $('#myModal').modal('show');
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
            $("#img_code").hide();
        },
        complete: function () {
            // 交互后处理
        }
    })
}

function getCode() {
    // 取得手机验证码
    getPhoneCode();

}

function getPhoneCode() {
    // 取得手机验证码
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

                //$("#img_code").attr("src", 'data:image/gif;base64,' + data.data);
                changgeBtn()
                $('#myModal').modal('hide');
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

