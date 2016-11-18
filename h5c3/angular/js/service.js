;(function(){
	var app = angular.module('gds.service',[])

	app.config(function($provide){
		/*$provide.provider('mySev',function(){

			// provider方式创建的服务，必须定义$get函数
			// 注入时得到的是$get函数内部返回的值
			this.$get = function(){
				var calc = {};

				// 求和方法
				calc.sum = function(){
					var res = 0;
					for(var i=0;i<arguments.length;i++){
						res += arguments[i]
					}
					return res;
				}
				return calc;
			}
		})*/

		$provide.factory('mySev',function(){
			var calc = {};

			// 求和方法
			calc.sum = function(){
				var res = 0;
				for(var i=0;i<arguments.length;i++){
					res += arguments[i]
				}
				return res;
			}
			return calc;
		});

		$provide.service('mySev2',function(){
			this.add = function(a,b){
				return a + b;
			}
		})
	});

	// 直接在模块上创建
	/*app.provider('xx',function(){
		this.$get = function(){
			return ;
		}
	});
	app.factory('xxx',function(){
		return ;
	})
	app.service('xxxx',function(){
		this
	});
	app.value('className','h5 1607')*/
})();
