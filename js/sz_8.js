// Vue App
var main_vue = new Vue({
    el: '#app',
    data: {},
    // 在 `methods` 对象中定义方法
    methods: {},
    //在 `computed` 对象中定义方法
    computed: {}
})

var IdCardFront = ''
var IdCardBack = ''
jQuery(function () {

})

function sc1() {
    var animateimg = $("#f1").val(); //获取上传的图片名 带//  
    var imgarr = animateimg.split('\\'); //分割
    var myimg = imgarr[imgarr.length - 1]; //去掉 // 获取图片名
    var houzui = myimg.lastIndexOf('.'); //获取 . 出现的位置  
    var ext = myimg.substring(houzui, myimg.length).toUpperCase();  //切割 . 获取文件后缀  

    var file = $('#f1').get(0).files[0]; //获取上传的文件  
    var fileSize = file.size;           //获取上传的文件大小  
    var maxSize = 1048576 * 12;              //最大1MB
    if (ext != '.PNG' && ext != '.GIF' && ext != '.JPG' && ext != '.JPEG' && ext != '.BMP') {
        toastr.info('文件类型错误,请上传图片类型');
        return false;
    } else if (parseInt(fileSize) >= parseInt(maxSize)) {
        toastr.info('上传的文件不能超过12MB');
        return false;
    } else {
        var formData = new FormData();
        formData.append('pic1', file);
        $.ajax({
            url: baseurl + '/picUpload/picUpload',
            type: 'POST',
            data: formData,
            dataType: 'JSON',
            timeout: 5000,    //超时时间
            cache: false,
            processData: false,
            contentType: false
        }).done(function (ret) {
            if (ret.code == 'S00001') {
                IdCardFront = ret.data.path
                $("#frontimg").attr("src", ret.data.url);
            } else {
                toastr.info(ret.message);
            }
        });
        return false;
    }
}

function sc2() {
    var animateimg = $("#f2").val(); //获取上传的图片名 带//  
    var imgarr = animateimg.split('\\'); //分割
    var myimg = imgarr[imgarr.length - 1]; //去掉 // 获取图片名
    var houzui = myimg.lastIndexOf('.'); //获取 . 出现的位置  
    var ext = myimg.substring(houzui, myimg.length).toUpperCase();  //切割 . 获取文件后缀  

    var file = $('#f2').get(0).files[0]; //获取上传的文件  
    var fileSize = file.size;           //获取上传的文件大小  
    var maxSize = 1048576 * 12;              //最大1MB
    if (ext != '.PNG' && ext != '.GIF' && ext != '.JPG' && ext != '.JPEG' && ext != '.BMP') {
        toastr.info('文件类型错误,请上传图片类型');
        return false;
    } else if (parseInt(fileSize) >= parseInt(maxSize)) {
        toastr.info('上传的文件不能超过12MB');
        return false;
    } else {
        var formData = new FormData();
        formData.append('pic1', file);
        $.ajax({
            url: baseurl + '/picUpload/picUpload',
            type: 'POST',
            data: formData,
            dataType: 'JSON',
            timeout: 5000,    //超时时间
            cache: false,
            processData: false,
            contentType: false
        }).done(function (ret) {
            if (ret.code == 'S00001') {
                IdCardBack = ret.data.path
                $("#backimg").attr("src", ret.data.url);
            } else {
                toastr.info(ret.message);
            }
        });
        return false;
    }
}

function doRealNameAuth(page) {

    if ($("#idCode").val() == '') {
        toastr.info('证件号码不能为空。');
        return;
    }
    if ($("#realName").val() == '') {
        toastr.info('真实姓名不能为空。');
        return;
    }
    if (IdCardFront == "") {
        toastr.info('请上传证件正面。');
        return;
    }
    if (IdCardBack == "") {
        toastr.info('请上传证件反面。');
        return;
    }
    if (isCardNo($("#idCode").val()) == false) {
        toastr.info('身份证格式不正确。');
        return;
    }
    // 取得私钥
    var sessionStorage = window.sessionStorage;
    $.ajax({
        url: baseurl + '/user/doRealNameAuth',
        type: 'POST', //GET、PUT、DELETE
        async: true,    //是否异步
        data: {
            id: sessionStorage.getItem('id'),
            idCode: $("#idCode").val(),
            realName: $("#realName").val(),
            apptoken: sessionStorage.getItem('apptoken'),
            idCardFront: IdCardFront,
            idCardBack: IdCardBack,
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
                window.open(page, '_self')
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


function doRealName() {
    if ($("#realName").val() == '') {
        toastr.info('真实姓名不能为空。');
        return;
    }
    if ($("#idCode").val() == '') {
        toastr.info('证件号码不能为空。');
        return;
    }

    if (isCardNo($("#idCode").val()) == false) {
        toastr.info('身份证格式不正确。');
        return;
    }
    // 取得私钥
    var sessionStorage = window.sessionStorage;
    $.ajax({
        url: baseurl + '/user/doRealNameAuth',
        type: 'POST', //GET、PUT、DELETE
        async: true,    //是否异步
        data: {
            id: sessionStorage.getItem('id'),
            idCode: $("#idCode").val(),
            realName: $("#realName").val(),
            apptoken: sessionStorage.getItem('apptoken'),
            idCardFront: IdCardFront,
            idCardBack: IdCardBack,
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
				sessionStorage.setItem('auth', '1')
                window.open('sz_1.html','_self');
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

// 验证身份证
function isCardNo(card) {
    var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return pattern.test(card);
}


					