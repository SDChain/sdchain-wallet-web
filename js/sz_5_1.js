var main_vue = new Vue({
    el: '#app',
    data: {
        userName: getUrlParam('userName'),
        memo: getUrlParam('memo'),
        userRelationId: getUrlParam('userRelationId'),
    },

    methods: {
        // 在 `methods` 对象中定义方法
        save: function (id) {
            //编辑联系人
            // `this` 在方法里指向当前 Vue 实例

            $.ajax({
                url: baseurl + '/user/editRelation',
                type: 'POST', //GET、PUT、DELETE
                async: true,    //是否异步
                data: {
                    id: sessionStorage.getItem('id'),
                    apptoken: sessionStorage.getItem('apptoken'),
                    adverseUserName: this.userName,
                    userRelationId:this.userRelationId,
                    relationMemo: this.memo,
                    validStr: 'd2ViYXBwOg=='
                },
                timeout: 10000,    //超时时间
                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                beforeSend: function (xhr) {
                    // 发送前处理
                },
                success: function (data, textStatus, jqXHR) {
                    // 调用成功，解析response中的data到自定义的data中

                    if (data.code == 'S00001') {
                        toastr.info(data.message);
                        setTimeout(function(){
                            window.open('sz_4.html', '_self');
                        },1000);
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
    //在 `computed` 对象中定义方法
    computed: {}
})
$(function () {
    // 初始化
    var h = document.documentElement.offsetHeight
    $(".qb_main").height(h - 140);

    // 设定主菜单选择项
    $("#sz").addClass("active treeview");
    // 设定子菜单选择项
    $("#sz2").addClass("active");

});


