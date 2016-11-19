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
		'$routeParams',
		'$http',
		function($scope,$rootScope,$routeParams,$http){
			$rootScope.page.title = '商品详情';
			$rootScope.page.current = 'goods';
			console.log($routeParams)

			$http.get('data/goodslist.json').success(function(res){
				console.log(res)
				var goods = res.filter(function(item){
					// 当前item的id等于$routeParams.id
					return item.id == $routeParams.id
				});

				$scope.goods = goods[0];
			});
			
		}
	])
})();