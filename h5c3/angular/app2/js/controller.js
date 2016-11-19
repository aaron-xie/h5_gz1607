;(function(){
	angular.module('myMall.ctrl',[])

	.controller('homeController',[
		'$scope',
		'$rootScope',
		'$http',
		function($scope,$rootScope,$http){
			$rootScope.pagetitle = '首页';
			$http({
				url:'data/goodslist.json'
			}).success(function(res){
				$scope.datalist = res;
			})
		}
	])

	.controller('listController',[
		'$scope',
		'$rootScope',
		'$http',
		function($scope,$rootScope,$http){
			$rootScope.pagetitle = '列表页';

			$http({
				url:'data/goodslist.json'
			}).success(function(res){
				$scope.datalist = res;
			})
		}
	])

	.controller('goodsController',[
		'$scope',
		'$rootScope',
		'$routeParams',
		'$http',
		function($scope,$rootScope,$routeParams,$http){
			$rootScope.pagetitle = '商品详情';

			$http({
				url:'data/goodslist.json'
			}).success(function(res){
				console.log()
				$scope.goods = res.filter(function(item){
					return item.id == $routeParams.goodsid;
				})[0];
			})
		}
	])
})();