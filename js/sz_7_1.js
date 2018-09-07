var main_vue = new Vue({
  el: '#app',
  data: {
	bank:getUrlParam('bank'),
	cardNo:getUrlParam('cardNo'),
	prov:getUrlParam('prov'),
	provg:getUrlParam('prov'),
	city:getUrlParam('city'),
	bankAddr:getUrlParam('bankAddr'),
	name:getUrlParam('name'),
	cardId:getUrlParam('cardId'),
	bankList:[],
	provList:[],
	cityList:[]

  },

  methods:{
  // 在 `methods` 对象中定义方法
	save: function (id) {
		//编辑银行卡
      // `this` 在方法里指向当前 Vue 实例

			$.ajax({
				url:baseurl + '/bankCard/editCard',
				type:'POST', //GET、PUT、DELETE
				async:true,    //是否异步
				data:{
					userId:sessionStorage.getItem('id'),
					apptoken:sessionStorage.getItem('apptoken'),
					bank:this.bank,
					cardNo:this.cardNo,
					addr:(this.provg.name),
					city:this.city,
					bankAddr:this.bankAddr,
					name:this.name,
					cardId:this.cardId,
					validStr:'d2ViYXBwOg=='
				},

				timeout:10000,    //超时时间
				dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
				beforeSend:function(xhr){
					// 发送前处理
				},
				success:function(data,textStatus,jqXHR){
					// 调用成功，解析response中的data到自定义的data中
					
					if (data.code == 'S00001')
					{
						toastr.info(data.message);
					} else {
						toastr.info(data.message);
					}
				},
				error:function(xhr,textStatus){
					// 调用时，发生错误
					toastr.info(textStatus);
				},
				complete:function(){
					// 交互后处理
				}
			})


    },

      getCity: function(area){
          //console.log('取得市区')
          //main_vue.cityList = [];
          $.ajax({
              //取得市区
              url:baseurl + '/area/getCity',
              type:'GET', //GET、PUT、DELETE
              async:true,    //是否异步
              data:{
                  parentId:area.parentId,
              },
              timeout:10000,    //超时时间
              dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
              beforeSend:function(xhr){
                  // 发送前处理
              },
              success:function(data,textStatus,jqXHR){
                  // 调用成功，解析response中的data到自定义的data中


                  main_vue.cityList = data.data;

              },
              error:function(xhr,textStatus){
                  // 调用时，发生错误
                  toastr.info(textStatus);
              },
              complete:function(){
                  // 交互后处理
              }
          })
      }
  },
  //在 `computed` 对象中定义方法
  computed: {

  }
})


$(function () {
	// 初始化
	var h = document.documentElement.offsetHeight
    $(".qb_main").height(h-140);

	// 设定主菜单选择项
	$("#sz").addClass("active treeview"); 
	// 设定子菜单选择项
	$("#sz3").addClass("active"); 

});


$(function () {
	//console.log('取得银行列表')
	//main_vue.bankList = [];
	$.ajax({
		//取得银行列表
			url:baseurl + '/bankCard/getBankList',
			type:'POST', //GET、PUT、DELETE
			async:true,    //是否异步
			data:{
                validStr:'d2ViYXBwOg=='
			},
			timeout:10000,    //超时时间
			dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
			beforeSend:function(xhr){
				// 发送前处理
			},
			success:function(data,textStatus,jqXHR){
				// 调用成功，解析response中的data到自定义的data中
				if (data.code == 'S00001')
				{
					main_vue.bankList = data.data;
				}
			},
			error:function(xhr,textStatus){
				// 调用时，发生错误
				toastr.info(textStatus);
			},
			complete:function(){
				// 交互后处理
			}
		})
});

$(function () {
    //console.log('取得省份')
    //main_vue.provList = [];
    $.ajax({
        //取得省份
        url:baseurl + '/area/getProv',
        type:'GET', //GET、PUT、DELETE
        async:true,    //是否异步
        data:{

        },
        timeout:10000,    //超时时间
        dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        beforeSend:function(xhr){
            // 发送前处理
        },
        success:function(data,textStatus,jqXHR){
            // 调用成功，解析response中的data到自定义的data中

            main_vue.provList = data.data;
            for (var i = 0; i < main_vue.provList.length; i++) {
                if (main_vue.provList[i].name== main_vue.prov) {
                    main_vue.provg=main_vue.provList[i];
                    $.ajax({
                        //取得市区
                        url:baseurl + '/area/getCity',
                        type:'GET', //GET、PUT、DELETE
                        async:true,    //是否异步
                        data:{
                            parentId:main_vue.provList[i].parentId,
                        },
                        timeout:10000,    //超时时间
                        dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                        beforeSend:function(xhr){
                            // 发送前处理
                        },
                        success:function(data,textStatus,jqXHR){
                            // 调用成功，解析response中的data到自定义的data中
                          	main_vue.cityList = data.data;

                        },
                        error:function(xhr,textStatus){
                            // 调用时，发生错误
                            toastr.info(textStatus);
                        },
                        complete:function(){
                            // 交互后处理
                        }
                    })
                    break;
                }
            }
        },
        error:function(xhr,textStatus){
            // 调用时，发生错误
            toastr.info(textStatus);
        },
        complete:function(){
            // 交互后处理
        }
    })


})
