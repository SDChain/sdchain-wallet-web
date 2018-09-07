// Vue App
var main_vue = new Vue({
  el: '#app',
  data: {
	userName:sessionStorage.getItem('userName'),
	realName:sessionStorage.getItem('realName'),
	createdTime:sessionStorage.getItem('createdTime'),
	//userName:sessionStorage.getItem('userName'),
	idType:'身份证',
	idCode:sessionStorage.getItem('idCode'),
	phone:sessionStorage.getItem('phone'),
	email:sessionStorage.getItem('email'),
	safeLevel:sessionStorage.getItem('safeLevel'),
	area:sessionStorage.getItem('area'),
	auth:sessionStorage.getItem('auth')
		
  }
})