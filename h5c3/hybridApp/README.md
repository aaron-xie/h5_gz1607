[TOC]
#day16-20 HybridApp

##nodejs环境安装
* 安装nodejs
* 安装npm


##java环境安装和配置
####jdk&jre安装
安装JDK选择安装目录，安装过程中会出现两次安装提示。第一次是安装jdk，第二次是安装 jre。建议两个都安装在同一个java文件夹中的不同文件夹中。(不能都安装在java文件夹的根目录下，jdk和jre安装在同一文件夹会出错)。

####配置环境变量
安装完JDK后配置环境变量：

1. 计算机 → 属性 → 高级系统设置 → 高级 → 环境变量
2. 系统变量 → 新建JAVA_HOME变量
变量值填写jdk的安装目录(如：C:\Program Files\Java\jdk1.8.0_111)
3. 系统变量 → 寻找Path变量 → 编辑
在变量值最后输入%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin;(注意原来Path的变量值末尾有没有;号，如果没有，先输入;号再输入上面的代码)
4. 系统变量 → 新建CLASSPATH变量
变量值填写.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar(注意最前面有一点)。系统变量配置完毕
5. 检验是否配置成功运行cmd输入
```
java -version
或
javac
```

##安装Android SDK
>SDK(Software Development Kit)： 软件开发工具的集合。在Android中，它为开发者提供了库文件以及其他开发所用到的工具。

####安装android studio
>安装android studio后会自动安装android SDK

####调试
* 模拟器
    比较慢，不推荐
* 真机调试
    1. 手机连接电脑，打开USB调试模式，具体：“设置”->“应用程序”->“开发”->“USB调试”。
    2. 安装驱动，建议下载豌豆荚获取360手机管家，它会帮你正确安装你的手机驱动。
    3. 直接运行你要测试的程序

##cordova安装与调试
Cordova是一个用基于HTML、CSS和JavaScript的，用于创建跨平台移动应用程序的快速开发平台。它使开发者能够利用iPhone、Android、Palm、Symbian、WP7、Bada和Blackberry等智能手机的核心功能——包括地理定位、加速器、联系人、声音和振动等，此外Cordova拥有丰富的插件，可以调用。

* 安装cordova
```
npm install cordova -g
```
PS：查看是否安装成功cordova -v

* 创建App
```
cordova create CordovaProject com.ar.myapp CordovaApp
```
    - CordovaProject 是创建应用程序的目录名。
    - com.ar.myapp 是默认的反向域名值(类似Java包的命名)。如果可能使用自己的域名的值
    - CordovaApp 是应用程序的标题

* 添加平台
```
cordova platform add android
```
    - cordova platform add wp8
    - cordova platform add blackberry10

* 删除平台
```
cordova platform rm android
```

* 构建和运行
```
cordova build android
```

* 其他功能
* 查看所有已经安装的插件：cordova plugin ls
* 更新插件：cordova plugin update


###cordova插件
* 拍照
    - 添加功能
    ```
    cordova plugin add cordova-plugin-camera
    ```
    - js调用
    ```
    navigator.camera.getPicture(success, error, cameraOption)
    ```
    - cameraOption API
    - quality: n => 定义保存图片的质量，取值范围为[0,100]，100表示质量最高
    - sourcetype
        + camera.picturesourcetype.PHOTOLIBRARY | 0 => 打开照片库
        + camera.picturesourcetype.CAMERA | 1 => 打开摄像头(defalut)
        + camera.picturesourcetype.SAVEDPHOTOALBUM | 2 => 打开保存相册
    - destinationType
        + Camera.DestinationType.DATA_URL | 0 => 返回base64编码字符串
        + Camera.DestinationType.FILE_URI | 1 => 返回图像文件URI
        + Camera.DestinationType.NATIVE_URI | 2 => 返回图像本地URI
    - allowEdit: true|false
    设置在选择图片进行操作之前是否对其进行简单的编辑（Android系统会忽略此属性）
    - encodingType
        + Camera.EncodingType.JPEG | 0
        + Camera.EncodingType.PNG | 1
    - targetWidth =>用于定义缩放图片的宽度，以像素为单位。必须和targetHeight配合使用
    - targetHeight =>  用于定义缩放图片的高度，以像素为单位。必须和targetWidth 配合使用
    - saveToPhotoAlbum: true|false => 用于决定是否在捕捉图片之后放入相册
    - mediaType
        + Camera.MediaType.PICTURE  | 0 => 只允许选择照片
        + Camera.MediaType.VIDEO  | 1 => 只允许选择视频
        + Camera.MediaType.ALLMEDIA   | 2 => 允许选择所有媒体类型
    - cameraDirection
        + Camera.CameraDirection.FRONT | 0 => 前置摄像头
        + Camera.CameraDirection.BACK | 1 => 后置摄像头
        + Camera.CameraDirection.ALLMEDIA | 2 

* 震动
    - 添加功能
    ```
    cordova plugin add cordova-plugin-vibration
    ```
    - js调用
    ```
    //navigator.vibrate(pattern|time);
    //使用 time 参数。 此参数用于设置的振动的持续时间。 以下代码效果：设备会三秒钟震动一次
    navigator.vibrate(3000);

    //使用 pattern参数为一个数组。此数组要求设备振动一秒钟，然后等待一秒钟，然后再重复上述过程。
    var pattern = [1000, 1000, 1000, 1000];
    navigator.vibrate(pattern);
    ```


**其他常用cordova插件**

1. Console（调试控制台）：cordova-plugin-console
让程序可以在控制台中打印输出日志。

2. Connection（网络连接）：cordova-plugin-network-information
用来判断网络连接类型（2G、3G、4G、Wifi、无连接等）

3. Device（设备）：cordova-plugin-device
获取一些设备信息。

4. Hardware Nofifications（硬件消息提醒）：cordova-plugin-vibration
让设备蜂鸣或振动。

5. Visual Notification（可视化消息提醒）：cordova-plugin-dialogs
不同于js的alert()、confirm()和prompt()方法是同步的。Cordova的alert()、confirm()和prompt()方法是异步的，并且对显示内容有更大的控制权限。

6. Battery（电池）：cordova-plugin-battery-status
可以获取电池状态信息。

7. Accelerometer(加速计)：cordova-plugin-device-motion
让应用在三维空间(使用笛卡尔三维坐标系统)中决定设备方向。

8. Compass(指南针)：cordova-plugin-device-orientation
可以让开发者读取移动设备的朝向。

9. Geolocation(地理定位)：cordova-plugin-geolocation
让应用判断设备的物理位置。

10. Camera(相机)：cordova-plugin-camera
用相机获取图像。

11. Media Capture （媒体捕获）：cordova-plugin-media-capture
与Camera API相比，不仅能获取图像，还可以录视频或者录音。

12. Globalization(全球化)：cordova-plugin-globalization
允许应用查询操作系统的当前设置，判断用户使用的语言。

13. Contacts（联系人）：cordova-plugin-contacts
读取联系人列表并在应用中使用联系人数据，或使用应用数据向联系人列表中写新的联系人。

14. Media（播放/记录媒体文件）：cordova-plugin-media
让应用能记录或播放媒体文件。用它可以在手机后台播放音频文件或玩桌面视频游戏。

15. InAppBrowser（内置浏览器）：cordova-plugin-inappbrowser
允许在在单独的窗口中加载网页。例如要向应用用户展示其他网页。当然可以很容易地在应用中加载网页内容并管理，但有时候需要不同的用户体验，InAppBrowser加载网页内容，应用用户可以更方便的直接返回到主应用。

16. Splashscreen（闪屏）：cordova-plugin-splashscreen
用来在Cordova应用启动时显示自定义的闪屏。

17. exitApp（退出应用）：cordova-plugin-exitapp
让 Android 或者 Windows Phone 8 上的APP关闭退出（iOS系统不支持）。

18. barcodeScanner（条形码/二维码扫描）：cordova-plugin-barcodescanner
不仅可以通过摄像头识别二维码/条形码，还能生成二维码。

19. file（文件访问操作类）：cordova-plugin-file
提供对设备上的文件进行读取和写入的功能支持。

20. fileTransfer（文件传输）：cordova-plugin-file-transfer
实现文件上传、下载及共享等功能。

##微信开发



