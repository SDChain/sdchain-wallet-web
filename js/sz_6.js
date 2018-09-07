var main_vue = new Vue({
  el: '#app',
  data: {
	pageNum:1,
	pageRecNum:10,
	cardList:[]
  },

  methods:{
  // 在 `methods` 对象中定义方法
	del: function (cid) {
		//删除银行卡
      // `this` 在方法里指向当前 Vue 实例
		$.ajax({
				url:baseurl + '/bankCard/deleteCard',
				type:'POST', //GET、PUT、DELETE
				async:true,    //是否异步
				data:{
					userId:sessionStorage.getItem('id'),
					apptoken:sessionStorage.getItem('apptoken'),
					cardId:cid,
					validStr:'d2ViYXBwOg=='
				},
				timeout:10000,    //超时时间
				dataType:'json',  //返回的数据格式：json/xml/html/script/jsonp/text
				beforeSend:function(xhr){
					// 发送前处理
				},
				success:function(data,textStatus,jqXHR){
					// 调用成功，解析response中的data到自定义的data中

					if (data.code == 'S00001')
					{
                        for (var i = 0; i < main_vue.cardList.length; i++) {
                            if (main_vue.cardList[i].cardId == cid) {
                                main_vue.cardList.splice(i, 1);
                                break;
                            }
                        }
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
	addCard: function () {
		//添加银行卡
      // `this` 在方法里指向当前 Vue 实例
		window.open(encodeURI('sz_7.html') , '_self')

    },
	
	edit: function (bank,cardNo,prov,city,bankAddr,name,cardId) {
		//编辑银行卡
      // `this` 在方法里指向当前 Vue 实例
		window.open(encodeURI('sz_7_1.html?cardNo='+ cardNo +'&bank=' + bank +'&bankAddr=' + bankAddr +'&prov=' + prov +'&city=' + city +'&name='+name+'&cardId='+cardId) , '_self')

    },
	

	pageTo: function (num) {
		this.pageNum = num;
	},
	pageUp: function () {
		if (this.pageNum == 1)
		{
			return;
		}
		this.pageNum = this.pageNum - 1;
	},
	pageDown: function () {
		if (this.pageNum == this.pageCount)
		{
			return;
		}
		this.pageNum = this.pageNum + 1;
	}
  },
  //在 `computed` 对象中定义方法
  computed: {

		pageCount: function () {
			var count = parseInt(this.cardList.length / this.pageRecNum);
			var mod = this.cardList.length % this.pageRecNum
			if (mod!=0)
			{
				count = count + 1
			}
			return count;
		},
		pageCode : function () {
			var pages = []
			for (var i = 1; i <= this.pageCount; i++)
			{
				pages.push(i);
			}
			return pages;
			//return '第'+this.pageNum + '页/共' + this.pageCount + '页';
		},
  }
})



$(function () {
	var h = document.documentElement.offsetHeight
	$(".jy_main").height(h-100);
	$(".jy4_detail").height(h-110);
	$(".qb_main").height(h-100);
	// 设定主菜单选择项
	$("#sz").addClass("active treeview"); 
	// 设定子菜单选择项
	$("#sz3").addClass("active"); 
	//console.log('取得银行卡列表')
	//main_vue.cardList = [];
	$.ajax({
		//取得银行卡列表
			url:baseurl + '/bankCard/getCardList',
			type:'POST', //GET、PUT、DELETE
			async:true,    //是否异步
			data:{
				userId:sessionStorage.getItem('id'),
				apptoken:sessionStorage.getItem('apptoken'),
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
					main_vue.cardList = data.data;
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


