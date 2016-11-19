;(function(){
	angular.module('myMall.ctrl',[])

	.controller('homeController', [
		'$scope', 
		'$rootScope', 
		'$http',
		function($scope,$rootScope,$http){
			$rootScope.page.title = '首页';
			$rootScope.page.current = 'home';

			$http.get('data/goodslist.json').success(function(res){
				console.log(res);

				$scope.datalist = res;
			})
		}
	])

	.controller('listController', [
		'$scope', 
		'$rootScope', 
		function($scope,$rootScope){
			$rootScope.page.title = '列表';
			$rootScope.page.current = 'list';
		}
	])

	.controller('goodsController', [
		'$scope', 
		'$rootScope', 
		function($scope,$rootScope){
			$rootScope.page.title = '商品详情';
			$rootScope.page.current = 'goods';
		}
	])
})();