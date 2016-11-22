[TOC]

#Ionic

##简介
>ionic是一个强大的HTML5应用程序开发框架(HTML5 Hybrid Mobile App Framework)。可以帮助您使用Web技术，比如HTML、CSS和Javascript构建接近原生体验的移动应用程序。
* 基于angular
* Sass
* Cordova
支持平台：IOS6+ / Android4.1+


##ionic 安装

* 下载
    - 官网：http://ionicframework.com/docs/overview/#download
    - github：https://github.com/driftyco/ionic/tree/1.x


* 命令行
>基于nodejs、npm、cordova，所以在安装ionic之前先确定你已安装以上工具

    ```
    npm install -g ionic
    ```


##创建ionic项目
###命令行
    1. 使用ionic官方提供的现成的应用程序模板，或一个空白的项目创建一个ionic应用：
    ```
    ionic start myApp tabs
    ```

    2. 添加android平台
    ```
    ionic platform add android
    ionic build android
    ionic emulate android
    ```

###Ionic Lab
>Ionic Lab 是桌面版的开发环境，为开发者提供了一个更简单的方法来开始，编译，运行，和模拟运行Ionic的应用程序。

下载地址：http://lab.ionic.io/


###纯手工创建ionic应用
>ionic 创建 APP 使用 HTML、CSS 和 Javascript 来构建，

1. 创建一个 www 目录，并在目录下创建 index.html 文件
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Todo</title>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <link href="lib/ionic/css/ionic.css" rel="stylesheet">
    <script src="lib/ionic/js/ionic.bundle.js"></script>
    <script src="cordova.js"></script>
  </head>
  <body>
  </body>
</html>
```

    **引入文件列表:**

    + ionic.css: Ionic CSS 文件
    + ionic.bundle.js: 该文件已经包含了Ionic核心JS、AngularJS、Ionic的AngularJS扩展，如果你需要引入其他 Angular 模块，可以从 lib/js/angular 目录中调用。
    + cordova.js：是在使用Cordova创建的APP中包含的文件，打包后才可用，所以在开发过程中显示 404 是正常的。
