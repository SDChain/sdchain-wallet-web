var main_vue = new Vue({
  el: '#app',
  data: {
	pageNum:1,
	pageRecNum:20,
	relationList:[]
  },

  methods:{
  // 在 `methods` 对象中定义方法
	del: function (id) {
		//删除联系人
      // `this` 在方法里指向当前 Vue 实例
      for (var i = 0; i < this.relationList.length; i++)
      {
		  if (this.relationList[i].userRelationId == id)
		  {
			$.ajax({
				url:baseurl + '/user/deleteRelation',
				type:'POST', //GET、PUT、DELETE
				async:true,    //是否异步
				data:{
					id:sessionStorage.getItem('id'),
					apptoken:sessionStorage.getItem('apptoken'),
					userRelationId:id,
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
						main_vue.relationList.splice(i,1);
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
			break;
		  }
      }

    },

	edit: function (userName,userRelationId,memo) {
		//编辑联系人
      // `this` 在方法里指向当前 Vue 实例
		window.open(encodeURI('sz_5_1.html?userName='+ userName +'&memo=' + memo + '&userRelationId=' + userRelationId) , '_self')

    },

	c2c:function(account,userName) {
		window.open('jy_1and2.html?loadtype=2&account=' + account + '&userName='+ userName, '_self')
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
			var count = parseInt(this.relationList.length / this.pageRecNum);
			var mod = this.relationList.length % this.pageRecNum
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
	$("#sz2").addClass("active"); 
	//console.log('取得联系人列表')
	//main_vue.relationList = [];
	$.ajax({
		//取得联系人列表
			url:baseurl + '/user/getRelationList',
			type:'POST', //GET、PUT、DELETE
			async:true,    //是否异步
			data:{
				id:sessionStorage.getItem('id'),
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
					main_vue.relationList = data.data.relationArray;
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


