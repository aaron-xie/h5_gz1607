[TOC]
#angularjs


##简介
AngularJS诞生于2009年，由Misko Hevery 等人创建（后为Google所收购），是一个为动态WEB应用设计的结构框架。简称ng，为克服HTML在构建应用上的不足而设计。它通过**扩展HTML的语法**，让你能更清楚、简洁地构建你的应用组件。它的创新点在于，利用*数据绑定* 和 *依赖注入*，它使你不用再写大量的代码了。这些全都是通过浏览器端的Javascript实现，这也使得它能够完美地和任何服务器端技术结合。有了这一类框架就可以轻松构建 SPA 应用程序
>SPA: Single Page Application

**AngularJS的特点**

* MVC
* 模块化
* 双向数据绑定和依赖注入
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

##控制器Controller
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



---
*MVC*

* Model(模型)：处理数据和业务逻辑
* View(视图)：以友好的方式向用户展示数据
* Controler(控制器)：组织调度相应的处理模型

