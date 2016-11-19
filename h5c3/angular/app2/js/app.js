;(function(){
	/*
		1.创建主模块，并依赖其他模块
		2.配置路由
		3.全局变量的配置，run()
	 */
	
	var app = angular.module('myMall',['ngRoute','myMall.ctrl']);

	app.config([
		'$routeProvider',
		function($routeProvider){
			// 主页
			$routeProvider.when('/home',{
				templateUrl:'view/home.html',
				controller:'homeController'
			})

			// 列表页
			.when('/list',{
				templateUrl:'view/list.html',
				controller:'listController'
			})

			// 列表页
			.when('/goods/:goodsid',{
				templateUrl:'view/goods.html',
				controller:'goodsController'
			})


			.otherwise({
				redirectTo:'/home'
			});
		}
	])
})();