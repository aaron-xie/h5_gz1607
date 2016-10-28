$(document).on("mobileinit", function() {
    //页面跳转方式
    $.mobile.defaultPageTransition = 'slide';
    $.ajaxSetup({
        headers: {
            'x-user-id': 'qunabao'
        }
    });
})
