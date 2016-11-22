[TOC]
#angularjs


##简介
AngularJS诞生于2009年，由Misko Hevery 等人创建（后为Google所收购），是一个为动态WEB应用设计的结构框架。简称ng，为克服HTML在构建应用上的不足而设计。它通过**扩展HTML的语法**，让你能更清楚、简洁地构建你的应用组件。它的创新点在于，利用*数据绑定* 和 *依赖注入*，它使你不用再写大量的代码了。这些全都是通过浏览器端的Javascript实现，这也使得它能够完美地和任何服务器端技术结合。有了这一类框架就可以轻松构建 SPA 应用程序
>SPA: Single Page Application

**AngularJS的特点**

* MVC
* 模块化
* 双向数据绑定
* 依赖注入
* 指令系统


**AngularJS的优点**

* Angular 最大程度的减少了页面上的 DOM 操作；
* 让 JavaScript 中专注业务逻辑的代码；
* 通过简单的指令结合页面结构与逻辑数据；
* 通过自定义指令实现组件化编程；
* 代码结构更合理；
* 维护成本更低；


##使用步骤
1. 引入文件：
    angular官方建议把引入代码放在head标签里，因为加载angular之前把html渲染出来没意义（html中有很多angular指令）
    `<script src="lib/angular.js"></script>`
    - 使用 CDN 上的 angular.js
    `http://cdn.bootcss.com/angular.js/1.5.8/angular-animate.js`
2. ng-app属性
>定义一个 AngularJS 应用程序, 该指令告诉AngularJS，这个元素是应用程序管理的边界。
    * 自定义模块（模块化编程）
        - 创建模块：两个参数，第一个参数是这个模块的名字，第二个参数是这个模块所依赖的模块,
        - 获取模块：只传一个参数

    ```
    //创建模块
    var myApp = angular.module("MyApp", []);

    //获取模块
    var myApp = angular.module('MyApp');
    ```

##控制器（Controller）
**控制器的三种主要职责：**

* 为应用中的模型设置初始状态
* 通过$scope对象把数据模型或函数行为暴露给视图
* 监视模型的变化，做出相应的动作

###创建控制器
>控制器必须在模块下创建，angular在执行控制器函数时，会根据参数的名字（$scope）自动的注入对象，所以名字不能修改（这是注入对象，不能理解为传统的形参）

```
myApp.controller('HelloController', function($scope) {
    $scope.person = {
        name: '老谢'
    };
});
```

###使用控制器
>同一页面中可以同时存在多个控制器，每个控制器用来实现不同的功能

```
<div ng-controller="HelloController">
    大家好，我叫{{person.name}}
</div>
```

###$scope
上下文模型，是view和controller之间的桥梁，用于在视图和控制器之间传递数据，我们可以利用$scope向视图暴露数据和行为


##数据绑定

###表达式
>使用 表达式 把数据绑定到 HTML，表达式的方式是单向数据绑定

* 语法
表达式写在双大括号内：{{ expression }}，可以包含文字、运算符和变量
表达式作用类似于ng-bind指令

* 表达式实现的原理


###单向数据绑定
>模型变化过后，自动同步到界面上

* ng-bind

###双向数据绑定
>模型或视图的数据变化会自动同步到两个方向

* ng-model


##内置指令(directive)
* ng-app
* ng-controller
* ng-model
* ng-click
* ng-class
* ng-repeat
* ng-show
* ng-hide
* ng-if
* ng-src
* ng-href
* ng-include
    - onload:页面加载完成后执行
* ng-bind
* ng-bind-html
    - $sce.trustAsHtml()经过此方法处理的html才能显示到页面
* ng-non-bindable


##过滤器（filter）
使用管道字符（|）把过滤器添加到表达式或指令中

* 基本过滤器
>{{ expression | filter }} 

* 链式过滤器
>{{ expression | filter1 | filter2 | ... }}

* 多参数过滤器
>{{ expression | filter:argument1:argument2:... }}

###内置过滤器
* currency 格式化数字为货币格式。
```
{{ currency_expression | currency : symbol}}
```
    - symbol 可选，默认为$

* number 格式化数字到文本
number过滤器可以为一个数字加上千位分割(12,345,678)。
```
{{ number_expression | number : fractionSize}}

$scope.num = 12345678;
{{num|number:2}}//12,345,678.00
```
    - fractionSize，指定保留几位小数（可选）

* date 格式化日期
```
{{ date_expression | date : format}}
```
    - format可选

* json 把js对象转换成JSON字符串,与JSON.stringify()相同
    - 使用双花括号的绑定会自动转换成JSON字符串

* lowercase   格式化字符串为小写。
* uppercase   格式化字符串为大写。
* orderBy 根据某个表达式排列数组。
```
{{ orderBy_expression | orderBy : expression : reverse}}
```
    - expression，一个用于通过比较来决定元素顺序的声明，类型可以为：
        + function: 这个函数的结果可使用 <, =, >操作符进行排序。 
        + string: 一个Angular表达式，对一个对象求值来排序，如用'name'来对属性名为'name'排序。用可选前缀 + 或 -来确定是正序或倒序 (例如，+name or -name)。 
        + Array: 一个函数或字符串声明数组。数组中的第一个声明用于排序，但是当两个条目相等时，会用下一个声明。
    - reverse 是否对数组进行反向排序(布尔值，可选)
    [表格排序]

* limitTo 选取前N个记录
```
{{ limitTo_expression | limitTo : limit}}
```
    - limit可以为负数
    
* filter
```
{{ expression | filter : expression}}
```
* string，如：'a'，匹配属性值中含有'a'的数组项
* object,如：{name:'i'}，匹配name属性值中含有'i'的数组项
* function,如：function(a){return a.age > 18}，匹配数组中age属性大于18的项


###自定义过滤器
```
app.filter('filterName', function(){
    return function(inputArray,param1,param2...){
        return result;
    }
});
```

###在js代码中使用过滤器
* 注入过滤器
>格式：name + Filter
```
.controller('myCtrl',function($scope,currencyFilter){
    currencyFilter('998');//=>$998.00
    currencyFilter('998','￥');//=>￥998.00
})
```

* 注入$filter服务
```
$filter('currency')(amount, symbol)
```


##表单

###双向数据绑定
ng-model

###验证
>AngularJS自带了对表单或控件的输入数据进行验证的功能，对于Html5的基础控件均有内建的验证器（写上HTML5属性或表单类型，自动获得验证规则）

* 以下列举了所有支持的验证类型：
    - email
    - max
    - maxlength
    - min
    - minlength
    - number
    - pattern
    - required
    - url
    - date
    - datetimelocal
    - time
    - week
    - month
* 验证样式
>AngularJS会在元素上自动添加如下样式
    - ng-invalid: 验证失败
    - ng-valid: 验证通过
    - ng-valid-[key]: 由$setValidity添加的所有验证通过的值
    - ng-invalid-[key]: 由$setValidity添加的所有验证失败的值
    - ng-pristine: 控件为初始状态
    - ng-dirty: 控件输入值已变更
    - ng-touched: 控件已失去焦点
    - ng-untouched: 控件未失去焦点
    - ng-pending: 任何为满足$asyncValidators的情况
* 内建的状态值
    - $pristine：初始化状态
    - $dirty：内容已变更
    - $valid：验证通过
    - $invalid：验证失败
    - $submitted：已提交
    - $error：表单验证信息，验证不通过时返回相应信息。

* 注意事项：
    1. 在form上加了一个novalidate，用来禁止掉浏览器默认的验证行为，因为ng已经对HTML5的几种表单新特性做了兼容处理。
    2. 表单元素必须有ng-model和name属性，否则无法触发验证
    3. 在css中分别定义.ng-pristine、.ng-dirty、.ng-valid、.ng-invalid这四种样式，ng会根据相应的状态自动加上样式。


###表单指令
* from,input,input[checkbox],input[email],input[number],input[radio],input[text],input[url],select,textarea都是angular增强后的指令
* ng-minlength
* ng-maxlength
* ng-pattern

###事件
* ng-focus
* ng-blur
* ng-change
* ng-checked
* ng-value
* ng-submit


##依赖注入
>依赖注入（Dependency Injection，简称DI）是一种软件设计模式

###创建可被注入的服务
>什么时服务：服务是一个函数或对象，是对一些常用功能的封装，定义后可在你的AngularJS应用中随意使用，AngularJS内建了30多个服务（如$http,$filter等）。同样也可以创建自定义服务

* Provider服务（$provide）
>$provide服务负责告诉Angular如何创造一个新的可注入的东西：即服务(service)。你需要使用$provide中的provider方法来定义一个provider

    **如何获取$provide服务：**
    ```
    var app = angular.module('myApp',[]);
    app.config(function($provide){
        $provide.provider('mySev',function(){
            this.$get = function() {
                var factory = {};  
                factory.multiply = function(a, b) {
                    return a * b; 
                }
                return factory;
            };
        })
    })
    ```

* provider
需要给当前对象定义$get函数，并且$get函数必须有返回值，注入服务时得到的就是$get函数返回的值（如上面的案例）
* factory
provider的简化版本，等于provider中的$get函数（相当于省略$get函数的定义），注入服务时得到的时此函数的返回值
* service
provider的简化版本，注入服务时得到当前对象（函数中的this）
* value
一般用于定义返回的值永远相同的服务
* constant
常量设置，一般用于全局变量的定义，与value类似，但constant能在config阶段被注入

*由于定义一个新的provider是如此的常用，AngularJS在模块对象上直接暴露了provider方法，以此来减少代码的输入量，因此我们可以这样写代码*
```
var app = angular.module('myApp',[]);
app.provider('mySev',function(){});
app.factory('mySev',function(){});
app.service('mySev',function(){});
```

###能被注入的函数
* 控制器定义函数
* 过滤器定义函数
* 指令定义函数
* provider中的$get方法（也就是factory函数）
* config阶段
`注意的是在config阶段，只有provider和constant能被注入（例外:$provide和$injector)`
* run阶段
`注射器加载完所有模块时，run方法执行一次 `

>由于constant和value总是返回一个静态值，它们不会通过注入器被调用，因此你不能在其中注入任何东西。


###依赖注入的应用
* 注入器（$injector）
* 模块依赖

* 注入服务

* angular全局变量



##自定义指令（Directive）

###angular指令类型
1. 元素指令（Element）
2. 属性指令（Attribute）
3. 类指令（Class）
4. 注释指令（Comment）

>推荐使用元素和属性的方式创建指令
1. 当需要创建带有自己模板的指令时，使用元素名称的方式（E）创建指令。
2. 当需要为已有的html标签增加功能时，使用属性的方式（A）创建指令

###指令创建方法
在模块下执行directive方法自定义一个指令，方法可返回一个对象或一个函数
```
var app = angular.module('myApp',[]);
app.directive('arHello', function() {
    return {
        restrict: 'E',
        template: '<h1>Hello world</h1>',
        replace: true
    };
});
```

**参数**

* 参数1：指令名称
     指令名称使用驼峰命名法（如:ngHover），但使用时需要写成`<ng-hover></ng-hover>`
* 参数2：执行函数
     函数可以注入各种服务，函数返回一个指令对象


**指令对象属性：**

* template(String/Function)：模板属性
* templateUrl(String/Function):模板文件路径
* replace(Boolean)：是否用模板替换指令标签
* restrict(String)：指令类型，
    - E: Element
    - A: Attribute(默认)
    - C: Class
    - M: Comment
* link
>link函数主要用于操作dom元素,给dom元素绑定事件和监听。link函数的执行时机为angular编译此模板之后

    ```
    link:function(scope,element,attrs,rootScope){
        //注意：link只会在指令编译完成后执行一次
        /*
            scope:当前directive的作用域，是否独立由scope参数决定
            element:指令元素，当replace为true时，element表示模板中最外层元素（模板中只能有一个根元素）
            attrs:指令中的属性集合
            rootScope:父级控制器，必须写上require属性后才起作用,否则为undefined
         */
    }
    ```
    - 指令与控制器之间的交互
    
* controller (String/Function)定义指令控制器
    - String：指定已经存在的控制器名称
    - Function
    ```
    directive('myDirective', function() {
        restrict: 'A',
        controller:function($scope, $element, $attrs, $transclude) {
            //...
        }
    });
    ```

* require
设置require后，把得到的**控制器（不是scope）**赋值给link方法的第四个参数，默认查找本指令所在元素中的其他控制器，如果找不到，则抛出错误
```
directive('myDirective', function() {
    require: '^ngController',
    controller:function(scope, element, attrs, someCtrl) {
        //...
    }
});
```
    - ^ 向父元素查找控制器
    - ? 如果找不到控制器，不抛出错误

>控制器可以暴露一个API，而link可以通过require与其他的指令控制器交互
所以如果要开放出一个API给其他指令用就写在controller中，否则写在link中

* scope(Boolean/Object)：描述指令作用域与父级作用域的关系
    - false: 使用父作用域作为自己的作用域（默认）
    - true: 从父作用域继承并创建一个自己的作用域。
    - object: 隔离作用域，与父作用域隔离，并指定可以从父作用域访问的变量
    
* transclude (Boolean)：嵌入，把指令中的内容（innerHTML）嵌入模板中带ng-transclude指令的标签内
* priority (Number)：指令优先级，值越大优先级越高，默认为0。
    - 在同一元素上声明了多个指令时，根据优先级决定哪个先被调用。 
    - 如果priority相同，则按声明顺序调用。
    `PS: ng-repeat是所有内置指令中优先级最高的。`
* terminal (Boolean)：是否停止当前元素上比该指令优先级低的指令。 
`PS: 但是相同的优先级还是会执行。`




##路由
>AngularJS可以实现多视图的单页Web应用（SPA）,通过 # + 标记 帮助我们区分不同的逻辑页面并将不同的页面绑定到对应的控制器上

[理解url中的#]

###ngRoute模块
angular路由依赖ngRoute模块,所以实现路由的前提是依赖ngRoute（此模块已分离成单独的文件angular-route.js），利用ngRoute实现路由的步骤如下：
1. 引入angular-route.js。
2. 依赖ngRoute模块
```
var app = angular.module('myApp',['ngRoute']);
```
3. 使用 ngView 指令
```
<div ng-view></div>
```
4. 利用$routeProvider配置路由规则
```
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/',{template:'首页'})
        .when('/list',{template:'列表页'})
        .when('/goods',{template:'商品详情页'})

        //不符合路由规则是自动跳转到首页
        .otherwise({redirectTo:'/'});
}]);
```

通过$routeProvider的when(path,object) & otherwise(object)函数按顺序定义所有路由，函数包含两个参数:
    - 第一个参数是 URL 或者 URL 正则规则。
    - 第二个参数是路由配置对象，属性如下。
``` 
    template(string): 模板字符串,如果我们只需要在 ng-view 中插入简单的 HTML 内容，则使用该参数
    templateUrl(string): 模板路径,
    controller(string/function/array):为当前模板指定控制器 ,
    controllerAs(string):为controller指定别名,
    redirectTo(string/function):重定向的地址,
```

###单页面应用

---
*MVC*

* Model(模型)：处理数据和业务逻辑
* View(视图)：以友好的方式向用户展示数据
* Controler(控制器)：组织调度相应的处理模型

*Angular应用运行过程*

AngularJS分两个阶段运行你的应用 – config阶段和run阶段。config阶段是你设置任何的provider的阶段。它也是你设置任何的指令，控制器，过滤器以及其它东西的阶段。在run阶段，AngularJS会编译你的DOM并启动你的应用。

