(function(){
	var app = angular.module('myMall',['ngRoute','myMall.ctrl']);

	// 路由配置
	// 利用$routeProvider来实现
	app.config([
		'$routeProvider',
		function($routeProvider){
			// 首页路由
			$routeProvider.when('/home',{
				// template:'<strong>首页</strong>'
				templateUrl:'view/home.html',
				controller:'homeController'
			})

			.when('/list',{
				templateUrl:'view/list.html',
				controller:'listController'
			})

			.when('/goods',{
				templateUrl:'view/goods.html',
				controller:'goodsController'
			})

			// 当以上所有路由都不匹配时使用
			.otherwise({redirectTo:'/home'})
		}
	]);

	app.run([
		'$rootScope',
		function($rootScope){
			$rootScope.page = {};
		}
	])
})();