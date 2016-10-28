//全局js
(function(window) {
    window.apiOrigin = 'http://119.29.120.204:5000';
    /*
     * 1.  正式环境： 'http://119.29.120.204:5000';
     * 2.  测试环境： //'http://182.254.185.224:5000';
     */

    Date.prototype.format = function(partten) {
        if (partten == null || partten == '') {
            partten = 'y-m-d';
        }
        var y = this.getFullYear();
        var m = this.getMonth() + 1;
        var d = this.getDate();
        var r = partten.replace(/y+/gi, y);
        r = r.replace(/m+/gi, (m < 10 ? "0" : "") + m);
        r = r.replace(/d+/gi, (d < 10 ? "0" : "") + d);
        return r;
    }

    function popup(opt) {
        var _randomNum = parseInt(100000 * Math.random());
        $(opt.pageContainer).append('<div class="arpopup" id="pop_' + _randomNum + '"/>');
        var $popup = $('#pop_' + _randomNum);
        var html_content = '<div class="content">' + opt.content + '</div>';
        html_content += '<footer>';

        if (opt.buttons) {
            opt.buttons.forEach(function(btn, idx) {
                html_content += '<button class="' + btn.class + '">' + btn.text + '</button>';
                $popup.on('click.button', btn.class, function() {
                    btn.handle && btn.handle($popup);
                    return false;
                })
            });
        }
        html_content += '</footer>';
        $popup.append(html_content).popup({
                transition: 'fade',
                overlayTheme: 'b',
                afterclose: opt.afterClose,
                afteropen: function() {
                    if (opt.autoClose) {
                        setTimeout(function() {
                            $popup.popup('close');
                        }, opt.autoClose);
                    }
                    opt.afterOpen === 'function' && opt.afterOpen();
                }
            }).popup('open')
            .on('click.close', '.btn-close', function() {
                $popup.popup('close');
                return false;
            });
    }

    // 全局变更, 放置一些共用函数
    var globalPage = {};
    globalPage.toUnicode = function(txt) {
            return escape(txt).replace(/%/g, '\\');
        }
        //全局弹窗
    globalPage.popup = popup;

    //search page
    globalPage['search'] = {
        CarSelect: CarSelect

    }

    //list page
    globalPage['list'] = {


    }

    //sidebar page
    globalPage['sidebar'] = {


    }

    //compare page
    globalPage['compare'] = {


    }

    /*选择车辆功能*/
    function CarSelect(postData) {
        var $carModelInput = $('#carModel');
        var $carModelWrap = $carModelInput.parent();
        //添加容器
        $carModelInput.after('<div class="car-model" style="display:none;"/>');
        //分步查找
        var $pop_searchCarModel = $('#pop_searchCarModel');
        var $btn_searchCarModel = $('#btn_searchCarModel');
        var _requestURL_carModel = 'http://cx.baoxian.com/filter';
        /*
         * 1.  正式环境：  'http://cx.baoxian.com/filter';
         * 2.  测试环境： 'http://182.254.185.224:9002/filter';;
         */
        var stepTxt = '品牌,车系,排气量,年款,品牌型号与价格'.split(',');
        $pop_searchCarModel.popup({
            corners: false,
            shadow: false,
            positionTo: 'window',
            tolerance: '0 0'
        }).on('popupbeforeposition', function() {
            $(this).closest('.ui-popup-container').css({
                width: $(window).width(),
                top: 0,
                left: 0
            });
            $(this).find('.brand-content').css({
                height: $(window).height() - 48
            });
        }).on('click', '.index-toolbar a', function() {
            var indexLetter = $(this).attr('href').replace('#', '');
            $('#brandList').find('li[data-index=' + indexLetter + ']')[0].scrollIntoView();
            return false;
        }).on('click', '.toolbar h4 a', function() { /*回退按钮*/
            var $self = $(this);
            var step = $self.attr('data-step');
            if (step == 0) return false;
            var $models = $pop_searchCarModel.find('section');
            var $currentModel = $models.filter('.active');
            var _currentURL = $currentModel.data('url');
            var _preURL = _currentURL.replace(/\/[^\/]+?\/$/, ''); ///一汽奥迪/一汽奥迪A4/1.781/
            $self.attr('data-step', step - 1).text(stepTxt[step - 1]);
            var $cacheModels = $models.filter('[data-url="' + _preURL + '/"]');
            //加判断，如果没有就请求否则获取本地的缓存
            if ($cacheModels.length > 0) {
                $currentModel.removeClass('active');
                $cacheModels.addClass('active');
            } else {
                $.mobile.loading('show');
                $.ajax({
                    url: _requestURL_carModel + _preURL,
                    dataType: 'jsonp'
                }).then(function(res) {
                    $.mobile.loading('hide');
                    var _html = '<section data-url="' + _preURL + '/" class="active">\n' + '<ul class="cart-step-list">\n';
                    if (step == 1) {
                        var brandList = GetCarSelectPanelByCarModels(res);
                        $currentModel.removeClass('active').after(brandList);
                    } else {
                        res.forEach(function(item, idx) {
                            var txt = item,
                                val = item;
                            if ($.type(item) == 'object') {
                                if (item.id) {
                                    val = item.id;
                                    txt = '<p>' + item.standardName + '<span>' + item.remark + '</span></p><p class="price">￥' + item.taxPrice + '</p>';
                                } else {
                                    txt = item.text;
                                    val = item.value;
                                }

                            }
                            _html += '<li><a href="#" data-request="' + val + '">' + txt + '</a></li>';
                        });
                        _html += '</ul>';
                        _html += '</section>';
                        //$currentModel.nextAll('section').remove();
                        $currentModel.removeClass('active').after(_html);
                        //$currentTitle.find('h4 a').attr('data-step', idx + 1).text(stepTxt[idx + 1]);
                    }
                });
            }
            return false;
        }).on('click', 'a.btn-close', function() {
            $pop_searchCarModel.popup('close');
            return false;
        }).on('click', 'a[data-request]', function() { /*请求子列表*/
            var keyword = $(this).data('request');
            var $currentModel = $(this).closest('section');
            var $models = $pop_searchCarModel.find('section');
            var $currentTitle = $pop_searchCarModel.find('.toolbar');
            var _currentURL = $currentModel.data('url');
            var idx = _currentURL.split('/').length - 2;
            var lastIdx = $currentTitle.data('step');
            var _keywordURL = _currentURL + keyword;
            var $cacheModel = $models.filter('[data-url="' + _keywordURL + '/"]'); //是否存在缓存
            if (idx == lastIdx) {
                $carModelInput.val($(this).text()).hide().next('.car-model').html($(this).html()).show();
                $carModelWrap.removeClass('field-error');
                postData['id'] = keyword;
                sessionStorage.setItem('selectedCarItem', keyword); //选择的车型,供后面调用
                sessionStorage.setItem('carItemUrl', _currentURL);
                $pop_searchCarModel.popup('close');
                return false;
            }
            if ($cacheModel[0]) {
                $currentModel.removeClass('active');
                $cacheModel.addClass('active');
                $currentTitle.find('h4 a').attr('data-step', idx + 1).text(stepTxt[idx + 1]);
                return false;
            }
            $.mobile.loading('show');
            $.ajax({
                url: _requestURL_carModel + _keywordURL,
                dataType: 'jsonp'
            }).then(function(res) {
                $.mobile.loading('hide');
                if (idx == lastIdx - 1) {
                    postData['carItems'] = res;
                    sessionStorage.setItem('carItems', JSON.stringify(res));
                    //sessionStorage.setItem('carItemUrl', _keywordURL)
                }
                //var resType = Object.prototype.toString.call(res);
                var _html = '<section data-url="' + _keywordURL + '/" class="active">\n' + '<ul class="cart-step-list">\n';
                res.forEach(function(item, idx) {
                    var txt = item,
                        val = item;
                    if ($.type(item) == 'object') {
                        if (item.id) {
                            val = item.id;
                            txt = '<p>' + item.standardName + '<span>' + item.remark + '</span></p><p class="price">￥' + item.taxPrice + '</p>';
                        } else {
                            txt = item.text;
                            val = item.value;
                        }

                    }
                    _html += '<li><a href="#" data-request="' + val + '">' + txt + '</a></li>';
                });
                _html += '</ul>';
                _html += '</section>';
                //$currentModel.nextAll('section').remove();
                $currentModel.removeClass('active').after(_html);
                $currentTitle.find('h4 a').attr('data-step', idx + 1).text(stepTxt[idx + 1]);
            });
            return false;
        });
        $carModelWrap.on('click', function() {
            var $models = $pop_searchCarModel.find('section');
            if ($models[0]) {
                var len = $models.length;
                $pop_searchCarModel.popup('open');
                return false;
            }
            $.mobile.loading('show');
            $.ajax({
                url: _requestURL_carModel,
                dataType: 'jsonp',
                timeout: 5000
            }).then(function(res) {
                //sessionStorage['carModels'] = JSON.stringify(res);
                $.mobile.loading('hide');
                var divCarContainer = '<div class="brand-content">';
                var html_toolbar = '<div class="toolbar" data-step="' + (stepTxt.length - 1) + '"><h4><a href="#" data-step="0">' + stepTxt[0] + '</a></h4><a href="#" class="btn-close"></a></div>';
                //加载车辆品牌列表
                divCarContainer += GetCarSelectPanelByCarModels(res);
                divCarContainer += "</div>";

                $pop_searchCarModel.html(html_toolbar + divCarContainer);
                $pop_searchCarModel.popup('open');
            }, function(xhr, status, error) {
                $.mobile.loading('hide');
                $pop_searchCarModel.popup('close');
            });
            return false;
        });

        ///根据车辆模型数据组装section标签
        function GetCarSelectPanelByCarModels(carModels) {
            var html_indexList = '<div class="index-toolbar">';
            var html_cartList = '<ul class="cart-step-list">';
            $.each(carModels, function(name, arr) {
                html_indexList += '<a href="#' + name + '">' + name + '</a>';
                html_cartList += '<li data-index="' + name + '"><span>' + name + '</span>';
                arr.forEach(function(brand, idx) {
                    html_cartList += '<a href="#" data-request="' + brand + '">' + brand + '</a>';
                });
                html_cartList += '</li>';
            });
            html_cartList += '</ul>';
            html_indexList += '</div>';

            var html_brand_section = '<section id="brandList" data-url="/" class="active"><h4>按拼音字母查找</h4>' + html_indexList + html_cartList + '</section>';
            return html_brand_section;
        }
    }

    window.globalPage = globalPage;

})(window)

$(function() {
    $(document).on('click', function(e) {
        var $ths = $(e.target);
        if ($ths.hasClass('btn-close')) {
            $ths.closest('.ui-tips').hide();
            return false;
        }
    });
    $.fn.serializeJson = function(filter) {
        var serializeObj = {};
        $(this.serializeArray()).each(function() {
            if (!filter || !filter(this.value)) {
                serializeObj[this.name] = this.value;
            }
        });
        return serializeObj;
    };
});

/*====================
    搜索页面
======================*/
$(document).on('click.fanhua', function() {
        //全局页面点击事件
        $("#pop_fliter").hide();
    })
    .on("mobileinit", function() {
        //debugger

    }).on("pagebeforechange", function() {
        // debugger

    }).on("pagechange", function() {
        // debugger

    }).on("pagebeforeload", function() {
        // debugger

    }).on("pageload", function() {
        // debugger

    })


.on('pagebeforecreate', '#searchPage', function() {
    // debugger

}).on('pagecreate', '#searchPage', function() {
    // debugger
    //进入下一页面传递的参数
    var postData = {};

    /*==================
        车型选择
    ====================*/
    globalPage.search.CarSelect(postData);

    /*==================
        城市定位
    ====================*/
    var $addressInput = $('#address').closest('.ui-input-text');
    var _currentCity;

    //从微信获取城市
    var _autoCity = '',
        _autoCityID = '';
    var _baiduAPI = 'http://api.map.baidu.com/geocoder/v2/?ak=i7h7GCkoXrYtPmetBTq5I3dN&location='; //i6TvV9i6UOh9X5EecG9aYLgU

    function getCity(url, coords) {
        $.ajax({
            url: url + coords.latitude + ',' + coords.longitude + '&output=json',
            dataType: 'jsonp'
        }).then(function(data) {
            _autoCity = data.result.addressComponent.city;
            $addressInput.after('<span class="current-add">' + _autoCity + '<small>(自动定位)</small></span>');
        });
        return _autoCity;
    }

    if (!_autoCity) {
        //geolocation获取城市地址
        var locationError = function(error) {
            switch (error.code) {
                case error.TIMEOUT:
                    console.log("A timeout occured! Please try again!");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.log('We can\'t detect your location. Sorry!');
                    break;
                case error.PERMISSION_DENIED:
                    console.log('Please allow geolocation access for this to work.');
                    break;
                case error.UNKNOWN_ERROR:
                    console.log('An unknown error occured!');
                    break;
            }
            _autoCity = '自动获取失败';
        }
        var locationSuccess = function(position) {
            var coords = position.coords;
            if (position.address != undefined) {
                var country = position.address.country;
                var province = position.address.region;
                var city = position.address.city;
                _autoCity = city;
            } else {
                _autoCity = getCity(_baiduAPI, coords);
            }
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {
                // 指示浏览器获取高精度的位置，默认为false
                enableHighAcuracy: true,
                // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
                timeout: 30000,
                // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
                maximumAge: 3000
            });
        } else {
            alert("Your browser does not support Geolocation!");
            _autoCity = '抱歉，您的浏览器不支持自动获取功能'
        }
    }


    var $pop_cityList = $('#pop_cityList');
    $pop_cityList.popup('option', {
        corners: false,
        shadow: false,
        positionTo: 'window',
        tolerance: '0 0'
    }).on('popupbeforeposition', function(event, opts) {
        $(this).closest('.ui-popup-container').css({
            width: $(window).width(),
            top: 0,
            left: 0
        });
        $(this).find('.city-wrap').css({
            height: $(window).height() - 48
        });
    }).on('click', '.index-toolbar a', function() {
        var indexLetter = $(this).attr('href').replace('#', '');
        $pop_cityList.find('li[data-index=' + indexLetter + ']')[0].scrollIntoView();
        return false;
    }).on('click', 'a.btn-close', function() {
        $pop_cityList.popup('close');
        return false;
    });
    $('#address').on('focus', function() {
        $pop_cityList.popup('open');

        //请求城市列表
        $.ajax({
            url: '../assets/region.json',
            type: 'get',
            dataType: 'json'
        }).then(function(data) {
            if (!data.regions || !data.regions.length) return false;
            var html_autoCity = '<section class="auto-city"><h4>自动定位</h4><ul><li><a href="#" data-id="' + _autoCityID + '">' + _autoCity + '</a></li></ul></section>';
            var html_hotCity = '<section class="hot-city"><h4>热门城市</h4><ul><li>';
            var html_cityListWrap = '<section class="letter-city"><h4>按拼音字母查询</h4>';
            var html_indexToolbar = '<div class="index-toolbar">';
            var html_cityList = '<ul>';

            //临时存放A-Z对应城市列表
            var indexCityList = {};
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function(key, idx) {
                indexCityList[key] = '';
            });

            data['regions'].forEach(function(province, idx) {
                if (province['municipality'] || province['special']) {
                    initCity(province);
                    return;
                }
                if (!province.regions || !province.regions.length) {
                    return;
                }
                province['regions'].forEach(function(city, i) {
                    initCity(city);
                });
            });
            $.each(indexCityList, function(key, val) {
                if (val == '') return true;
                html_indexToolbar += '<a href="#' + key + '">' + key + '</a>';
                html_cityList += '<li data-index="' + key + '"><span>' + key + '</span>' + val + '</li>';
            });
            html_hotCity += '</li></ul></section>';
            html_indexToolbar += '</div>';
            html_cityList += '</ul>';
            html_cityListWrap += html_indexToolbar + html_cityList + '</section>';

            //写入html
            $('#city_wrap').html((_autoCityID ? html_autoCity : '') + html_hotCity + html_cityListWrap);

            //初始化城市列表
            function initCity(city) {
                var item = '<a href="#" data-id="' + city.id + '">' + city.name + '</a>';
                var firstLetter = city.pinyin.charAt(0).toUpperCase();
                indexCityList[firstLetter] += item;
                if (city['hot']) {
                    html_hotCity += '<a href="#" data-id="' + city.id + '">' + city.name.replace('市', '') + '</a>';
                }
                //为自动获取城市名匹配对应城市id
                if (_autoCity && _autoCity == city.name) {
                    _autoCityID = city.id;
                    $('#address').attr('data-cityid', _autoCityID);
                    postData['cityid'] = cityID;
                }
            }
        });
    });
    $('#city_wrap').on('click', 'a[data-id]', function() {
        var cityID = $(this).attr('data-id');
        if (!cityID) return false;
        $('#address').val($(this).text()).attr('data-cityid', cityID);
        postData['cityid'] = cityID;
        $addressInput.removeClass('field-error').next('.current-add').remove();
        $pop_cityList.popup('close');
        return false;
    });
}).on("pageinit", "#searchPage", function(event, data) {
    // debugger
    $('#btn_search').on('click', function() {
        var $city = $('#address');
        var cityID = $city.attr('data-cityid') || '440100';
        var isValid = true;
        if ($city.val() == "" || !cityID) {
            $city.parent().addClass('field-error');
            isValid = false;
        }
        if ($('#carModel').val() == "") {
            $('#carModel').parent().addClass('field-error');
            isValid = false;
        }
        if (isValid) {
            cityID = cityID.substr(0, 2) + '0000'; //默认传省份代码(临时)
            sessionStorage.setItem("cityid", cityID);
            $($.mobile.pageContainer).pagecontainer("change", "search_result.html", {
                changeHash: false
            });
            return false;
        } else {
            globalPage.popup({
                pageContainer: '#searchPage',
                content: '请先完善页面信息',
                buttons: [{
                    class: 'btn-close',
                    text: '我知道了'
                }]
            });
        }
    });
}).on("pagebeforeshow", "#searchPage", function() {
    // debugger

}).on("pageshow", "#searchPage", function() {
    // debugger

}).on("pagebeforehide", "#searchPage", function() {
    // debugger

}).on("pagehide", "#searchPage", function() {
    // debugger

})

/*====================
    搜索结果页
======================*/
.on('pagebeforecreate', '#searchResultPage', function(event, data) {
    // debugger

}).on("pagebeforeshow", "#searchResultPage", function() {
    // debugger

}).on("pageshow", "#searchResultPage", function() {
    // debugger
    //根据地区获取供应商列表
    var cityID = sessionStorage.getItem('cityid');
    $.ajax({
        url: apiOrigin + '/prv/q?region=' + cityID,
        dataType: 'json'
    }).then(function(providers) {
        if (!providers || !providers.length) {
            globalPage.popup({
                pageContainer: '#searchResultPage',
                content: '没有匹配的供应商',
                buttons: [{
                    class: 'btn-close',
                    text: '我知道了'
                }],
                afterClose: function() {
                    $.mobile.navigate("#searchPage");
                }
            });
            return false;
        }

        //建立单方延迟对象
        var enquiryDone = $.Deferred();
        $('#allQty').countTo({
            to: 30,
            speed: 500
        });
        $('#resultQty').text(providers.length).countTo({
            to: providers.length,
            onComplete: function() {
                $.when(enquiryDone.promise()).done(function() {
                    $($.mobile.pageContainer).pagecontainer("change", "list.html");
                });
            }
        });

        //保存供应商列表
        sessionStorage.setItem('providers', JSON.stringify(providers));

        //创建多方
        var mqRequestPath = apiOrigin + '/quote/mq';
        $.ajax({
            url: mqRequestPath,
            type: 'post',
            data: {
                'uid': 'qunabao'
            }
        }).then(function(mqid) {
            // debugger;

            //保存多方id到本地
            sessionStorage.setItem('mqid', mqid);

            //取得更新会话
            var mqPath = mqRequestPath + '/' + mqid;
            var sessionPath = mqPath + '/alter';
            $.ajax({
                url: sessionPath,
                type: 'post',
                dataType: 'json'
            }).then(function(updateSession) {

                var updatePath = sessionPath + '/' + updateSession.param;

                //更新供应商
                var _postData_providers = [];
                providers.forEach(function(prov, idx) {
                    var _provider = {
                        "buyWay": {
                            "idx": 3,
                            "name": "地面销售"
                        },
                        'pid': prov['prvId'],
                        "verInfo": prov['verInfo'],
                        "relateRule": prov['products'][0]['relateRule'],
                        "insComId": prov['comId'],
                    };
                    _postData_providers.push(_provider);
                });

                //更新车信息
                var carItems = JSON.parse(sessionStorage.getItem('carItems'));
                var selectedCarItem = sessionStorage.getItem('selectedCarItem');
                var _postData_carInfo;
                carItems.forEach(function(item, idx) {
                    if (item['id'] == selectedCarItem) {
                        _postData_carInfo = {
                            // "firstRegDate": "2012-06-08 00:00:00.000",
                            // "engineNum": "8C51120578",
                            // "isTransferCar": false,
                            // "plateNum": "浙BW219H",
                            // "carBrandName": "五菱荣光",
                            // "vin": "LZWACAGA3C7108363",
                            // "misc": {

                            // },
                            "taxPrice": item['taxPrice'],
                            // "useProps": {
                            //     "idx": 1,
                            //     "name": "家庭自用"
                            // },
                            // "userType": {
                            //     "idx": 1,
                            //     "name": "个人用车"
                            // },
                            "displacement": item['displacement']
                        }
                    }
                });

                //更新投保地区
                var _postData_area = {
                    city: sessionStorage.getItem('cityid'),
                    province: sessionStorage.getItem('cityid')
                };

                $.when(
                    $.ajax({
                        url: updatePath + '/dealOffer/carInfo',
                        type: 'PUT',
                        data: JSON.stringify(_postData_carInfo)
                    }),
                    // $.ajax({
                    //     url: updatePath + '/supplys',
                    //     type: 'PUT',
                    //     data: JSON.stringify(_postData_providers)
                    // }),
                    $.ajax({
                        url: updatePath + '/dealOffer/insArea',
                        type: 'PUT',
                        data: JSON.stringify(_postData_area)
                    })
                ).done(function(res) {
                    //更新提交(更新完毕)
                    $.ajax({
                        url: updatePath,
                        type: 'POST'
                    }).done(function(res) {
                        var successHandle = function(res) {
                            //获取单方报价列表
                            $.ajax({
                                url: mqPath + '/latest/vehicleEnquirys',
                                type: 'GET',
                                dataType: 'json'
                            }).done(function(sqidList) {
                                // debugger

                                //完成取回单方
                                enquiryDone.resolve();

                                //保存供应商对应单方id
                                var providerToSqid = {};
                                $.each(sqidList, function(sqid, providerId) {
                                    providerToSqid[providerId] = sqid;
                                });

                                //保存单方id与供应商id的对应关系
                                sessionStorage.setItem('providerToSqid', JSON.stringify(providerToSqid));

                                //$.mobile.changePage("list.html");
                                // $($.mobile.pageContainer).pagecontainer("change", "list.html");
                            });
                        }

                        var erroHander = function(res) {
                            if (res.status == 409) {
                                submitCalPrice();
                            };
                        }

                        //开始提交算价
                        var submitCalPrice = function() {
                            $.ajax({
                                    url: mqPath + '/action/submit',
                                    type: 'POST'
                                })
                                .done(successHandle)
                                .fail(erroHander);
                        }
                        submitCalPrice();
                    });
                });
            });
        });
    }, function(error) {

    });
}).on("pagebeforehide", "#searchResultPage", function() {
    // debugger

}).on("pagehide", "#searchResultPage", function() {
    // debugger

})

/*====================
    列表页面
======================*/
.on('pageinit', '#listPage', function() {
    //初始化页面组件
    // $('#btn_showSidebar').button({
    //    theme:'f',
    //    icon:'arrow-left',
    //    inline:true,
    //    direction:'reverse'
    // });

    //$($.mobile.pageContainer).pagecontainer("load", "sidebar.html");
    // $('#btn_showSidebar').on('click', function() {
    //     $($.mobile.pageContainer).pagecontainer("change", "#sidebarPage");
    //     return false;
    // });

    $("#btn_closeInstruction").on('click', function() {
        $("#list_collapsible").css({
            opacity: 0
        }).slideUp(300);
    });

    //展示过滤菜单
    var $popFilter = $("#pop_fliter");
    $("#btn_filter").on('click', function() {
        $popFilter.toggle();
        return false;
    });

    //过滤功能
    $("#pop_fliter").on('click', 'li', function() {
        //$("#pop_fliter").hide();
    });

    function initList(data) {
        if (!data || !data.length) return '';

        //显示供应商数量
        $('.result-status').find('b').text(providers.length);

        //render html
        var html_providers = "";
        data.forEach(function(item, idx) {
            html_providers += '<li class="loading' + (item.level ? ' recommend' : '') + '" data-providerid="' + item.prvId + '">';
            html_providers += '<a href="compare.html" rel="external">';
            html_providers += item['name'];
            html_providers += '</a>';
            html_providers += '<div class="ui-li-aside">';
            html_providers += '<span class="glyphicon glyphicon-refresh"></span>';
            html_providers += '<span class="price"><span></span></span>';
            html_providers += '</div>';
            html_providers += '</li>';
        });
        return html_providers;
    }

    //取报价
    var requestTimes = {};

    function getPrice(url, sqid) {
        $.ajax({
            url: url + '/latest',
            type: 'GET',
            dataType: 'json'
        }).done(function handlePrice(res) {
            //报价数据处理
            var $currentLi = $('#providerList').find('>li[data-providerid=' + res.providerId + ']');
            if (res.state.idx == 5) {
                //更新列表报价
                var html_price = parseInt(res.misc.minDiscountPremium) + (res.misc.minDiscountPremium != res.misc.discountPremium ? '-<span>' + parseInt(res.misc.discountPremium) + '</span>' : '');
                $currentLi.removeClass('loading').find('.price').html(html_price);

                //保存供应商报价
                var providerPrice = JSON.parse(sessionStorage.getItem('providerPrice')) || {};
                providerPrice[res.providerId] = html_price;
                sessionStorage.setItem('providerPrice', JSON.stringify(providerPrice));
            } else if (res.state.idx == 10) {
                //超时显示手支刷新按钮
                $currentLi.removeClass('loading').addClass('no-result');
            } else if (res.state.idx == 3) {
                var reqUrl = sqRequestPath + '/' + providerToSqid[res.providerId];
                //3次以内每3秒发一次请求
                if (requestTimes[sqid] <= 3) {
                    setTimeout(function() {
                        getPrice(reqUrl, sqid)
                    }, 5000);
                } else if (requestTimes[sqid] > 3 && requestTimes[sqid] < 6) {
                    //3次到6次每10秒发一次请求，6次以后停止请求
                    setTimeout(function() {
                        getPrice(reqUrl, sqid)
                    }, 10000);
                }
                requestTimes[sqid]++;
            } else if (res.state.idx == 4) {
                //需修改报价资料
                globalPage.popup({
                    pageContainer: '#listPage',
                    content: res.state.name,
                    autoClose: 2000
                });
            } else if (res.state.idx == 2) {
                var reqUrl = sqRequestPath + '/' + providerToSqid[res.providerId];
                setTimeout(function() {
                    getPrice(reqUrl, sqid)
                }, 5000);
            }
        });
    }

    var providers = JSON.parse(sessionStorage.getItem('providers'));
    var providerToSqid = JSON.parse(sessionStorage.getItem('providerToSqid'));

    //单方报价url
    var sqRequestPath = apiOrigin + '/quote/sq';

    $("#providerList")

    //更新html
    .html(initList(providers))

    //刷新列表
    .listview('refresh')

    //绑定点击事件
    .on('click', 'li', function(e) {
        var $self = $(this);
        if ($self.hasClass('loading') || $self.hasClass('no-result')) {
            return false;
        }
        var providerid = $(this).attr('data-providerid');
        var sqid = JSON.parse(sessionStorage.getItem('providerToSqid'))[providerid];
        var reqUrl = sqRequestPath + '/' + sqid;

        if ($(e.target).is('.glyphicon-refresh')) {
            $self.addClass('loading');
            getPrice(reqUrl, sqid);
            return false;
        }

        //储存当前选择供应商
        sessionStorage.setItem('selectedProvider', providerid);
    });

    //更新报价
    if (providerToSqid) {
        $.each(providerToSqid, function(providerid, sqid) {
            var reqUrl = sqRequestPath + '/' + sqid;
            requestTimes[sqid] = 1;
            getPrice(reqUrl, sqid);
        });
    }
    //更新报价精准度
    var progress = sessionStorage['offerProgress'];
    progress = progress < 34 ? 1 : progress < 100 ? 2 : 3;
    $('.accuracy1').addClass('accuracy' + progress);
})

/*============
    Side bar
==============*/
.on("pagecreate", "#sidebarPage", function() {
        var providers = JSON.parse(sessionStorage.getItem('providers'));
        var html_lastCompany = '';
        if (providers) {
            providers.forEach(function(provider, idx) {
                html_lastCompany += '<option value="' + provider.comId + '">' + provider.name + '</option>';
            });
            $('#lastComCode,#lastComCode2').append(html_lastCompany);
        }

        //指定默认初登日期为当前日期
        $('#firstRegDate').val((new Date()).format('y-m-d'));
        $('#effectiveDate').val(new Date((Date.parse(new Date()) + 3600 * 24 * 1000)).format('y-m-d'));
        //指定驾驶人
        var driversData = [{
            name: 'birthday',
            type: 'date',
            text: '出生日期',
            placeholder: '年/月/日'
        }, {
            name: 'gender',
            type: 'select',
            text: '性别',
            option: [{
                text: '男',
                value: '1:male',
                selected: true
            }, {
                text: '女',
                value: '2:female'
            }],
        }, {
            name: 'drivingLicenceType',
            type: 'select',
            text: '驾照类型',
            option: [{
                text: 'A',
                value: '1'
            }, {
                text: 'B',
                value: '2'
            }, {
                text: 'C',
                value: '3'
            }, {
                text: 'D',
                value: '4'
            }, {
                text: 'E',
                value: '5'
            }, {
                text: 'F',
                value: '6'
            }, {
                text: 'H',
                value: '7'
            }, {
                text: 'K',
                value: '8'
            }, {
                text: 'J',
                value: '9'
            }, {
                text: 'M',
                value: '10'
            }, {
                text: 'N',
                value: '11'
            }, {
                text: 'P',
                value: '12'
            }, {
                text: 'Q',
                value: '13'
            }, {
                text: 'A1',
                value: '14'
            }, {
                text: 'A2',
                value: '15'
            }, {
                text: 'A3',
                value: '16'
            }, {
                text: 'B1',
                value: '17'
            }, {
                text: 'B2',
                value: '18'
            }, {
                text: 'C1',
                value: '19',
                selected: true
            }, {
                text: 'C2',
                value: '20'
            }, {
                text: 'C3',
                value: '21'
            }, {
                text: 'C4',
                value: '22'
            }]
        }, {
            name: 'licensedDate',
            type: 'date',
            text: '发证日期',
            placeholder: '年/月/日'
        }];
        var $driverContainer = $('#driverList');
        var $driverList = $driverContainer.find('>ul');

        function initField(field) {
            var html_field = '';
            if (field.type == 'select') {
                html_field += '<select name="' + field.name + '">';
                field.option.forEach(function(data, idx) {
                    html_field += '<option value="' + data.value + '"' + (data.selected ? 'selected' : '') + '>' + data.text + '</option>';
                });
                html_field += '</select>';
            } else {
                html_field += '<input type="' + field.type + '" name="' + field.name + '" placeholder="' + field.placeholder + '" />';
            }
            return html_field;
        }
        var html_defaultDriver = '<li><h4>驾驶人<span>(1)</span><a href="#" class="btn-remove glyphicon glyphicon-trash" title="删除驾驶人"></a></h4>\n' +
            '<form>\n';
        driversData.forEach(function(field, idx) {
            html_defaultDriver += '<div class="ui-field-contain">\n' +
                '<label for="' + field.name + '">' + field.text + '</label>\n' +
                initField(field) + '\n' +
                '</div>'
        });
        html_defaultDriver += '</form>\n' +
            '</li>';

        $('#isSpecifyDriver1').on('click', function() {
            $driverContainer.show();
            if ($driverList.html() == '') {
                $driverList.append(html_defaultDriver);
                $driverList.find('select').selectmenu();
                $driverList.find('input').textinput();
            }
        });
        $('#isSpecifyDriver2').on('click', function() {
            $driverContainer.hide();
        });
        $driverContainer.on('click', '#btn_addDriver', function() {
            var driverLen = $driverList.find('>li').length;
            if (driverLen >= 3) {
                globalPage.popup({
                    pageContainer: '#sidebarPage',
                    content: '最多只能添加3个驾驶人',
                    autoClose: '2000'
                });
                return false;
            }
            $driverList.append(html_defaultDriver);
            var $currentDriver = $driverList.find('>li').eq(driverLen);
            $currentDriver.find('h4 > span').text('(' + (driverLen + 1) + ')');
            $currentDriver.find('select').selectmenu();
            $currentDriver.find('input').textinput();
        }).on('click', '.btn-remove', function() {
            $(this).closest('li').remove();
            return false;
        });
    })
    .on("pageinit", "#sidebarPage", function() {
        var $tabs = $('#js_sidebar_head_tabs > li');
        var len = $tabs.length;
        var $numbers = $('.steps-wrap li');
        var $processBar = $('.progress-bar > .bar');
        var $btnNext = $('.btn-next');



        /**
         * [改变tab状态函数]
         * @index  {当前tab索引}
         */
        function changeStatus(index) {
            $btnNext.find('a').text(index == len - 1 ? '刷新价格' : '下一步');
            $numbers.removeClass('checked').eq(index).addClass('checked');
            //$processBar.css('width', 25 * (index + 1) + '%').next().find('span').text(25 * (index + 1));
        }

        $btnNext.bind('click', function() {
            var $current = $tabs.filter('.ui-tabs-active');
            var index = $current.prevAll('li').length;
            if (index == len - 1) { /*最后一步，刷新价格*/
                var mqRequestPath = apiOrigin + '/quote/mq';
                var mqid = sessionStorage.getItem('mqid');

                var mqPath = mqRequestPath + '/' + mqid;
                var sessionPath = mqPath + '/alter';

                var _postData_carInfo = GetPostCarData();
                var _postData_insurance = GetPostInsuranceData();

                //取得更新会话
                $.ajax({
                    url: sessionPath,
                    type: 'post',
                    dataType: 'json'
                }).then(function(updateSession) {
                    var submitPath = sessionPath + '/' + updateSession.param;
                    var updatePath = submitPath + '/dealOffer';
                    $.when(
                        //更新车辆信息
                        $.ajax({
                            url: updatePath + '/carInfo',
                            type: 'PUT',
                            data: JSON.stringify(_postData_carInfo)
                        }),
                        //更新保险信息
                        $.ajax({
                            url: updatePath + '/suite/items',
                            type: 'PUT',
                            data: JSON.stringify(_postData_insurance)
                        }),
                        UpdateOtherInfo(updatePath)
                    ).done(function(res) {
                        //更新提交(更新完毕)
                        $.ajax({
                            url: mqPath + "/alter/" + updateSession.param,
                            type: 'POST'
                        }).done(function(res) {
                            var successHandle = function(res) {
                                //获取单方报价列表
                                $.ajax({
                                    url: mqPath + '/latest/vehicleEnquirys',
                                    type: 'GET',
                                    dataType: 'json'
                                }).done(function(sqidList) {
                                    //保存供应商对应单方id
                                    var providerToSqid = {};
                                    $.each(sqidList, function(sqid, providerId) {
                                        providerToSqid[providerId] = sqid;
                                    });

                                    //保存单方id与供应商id的对应关系
                                    sessionStorage.setItem('providerToSqid', JSON.stringify(providerToSqid));

                                    //$.mobile.changePage("list.html");
                                    $($.mobile.pageContainer).pagecontainer("change", "list.html");
                                });
                            }

                            var erroHander = function(res) {
                                if (res.status == 409) {
                                    submitCalPrice();
                                };
                            }

                            //开始提交算价
                            var submitCalPrice = function() {
                                $.ajax({
                                    url: mqPath + '/action/submit',
                                    type: 'POST'
                                }).done(successHandle).fail(erroHander);
                            }
                            submitCalPrice();
                        });

                    });
                });
                return false;
            }

            $tabs.eq(index + 1).find('a').click();
            changeStatus(index + 1);
            return false;

            //获取要更新的车辆信息
            function GetPostCarData() {
                var _postData_carInfo;
                var carItems = JSON.parse(sessionStorage.getItem('carItems'));
                var selectedCarItem = sessionStorage.getItem('selectedCarItem');
                carItems.forEach(function(item, idx) {
                    if (item['id'] == selectedCarItem) {
                        _postData_carInfo = {
                            "firstRegDate": $("#firstRegDate").val(),
                            // "engineNum": "8C51120578",
                            "isTransferCar": !!$("input[type=radio]:checked").val(),
                            // "plateNum": "浙BW219H",
                            // "carBrandName": "五菱荣光",
                            // "vin": "LZWACAGA3C7108363",
                            // "misc": {

                            // },
                            "taxPrice": item['taxPrice'],
                            // "useProps": {
                            //     "idx": 1,
                            //     "name": "家庭自用"
                            // },
                            // "userType": {
                            //     "idx": 1,
                            //     "name": "个人用车"
                            // },
                            "displacement": item['displacement']
                        }
                    }
                });
                if (!_postData_carInfo['firstRegDate']) {
                    delete _postData_carInfo['firstRegDate'];
                }
                return _postData_carInfo;
            }

            //获取要更新的保险数据
            function GetPostInsuranceData() {
                //预定义保险数据(基本保险，高性价保险，全面保险)
                var preDefineInsuranceData = {
                    baseGuard: {
                        ThirdPartyIns: {
                            amount: 300000.0,
                            ecode: "ThirdPartyIns",
                            selIdx: 1
                        },
                        NcfThirdPartyIns: {
                            amount: -1,
                            ecode: "NcfThirdPartyIns",
                            selIdx: 1
                        },
                        VehicleCompulsoryIns: {
                            amount: -1,
                            ecode: "VehicleCompulsoryIns",
                            selIdx: 1
                        }
                    },
                    hightGuard: {
                        VehicleDemageIns: {
                            amount: -1,
                            ecode: "VehicleDemageIns",
                            selIdx: 1
                        },
                        ThirdPartyIns: {
                            amount: 500000.0,
                            ecode: "ThirdPartyIns",
                            selIdx: 6
                        },
                        TheftIns: {
                            amount: -1,
                            ecode: "TheftIns",
                            selIdx: 1
                        },
                        DriverIns: {
                            amount: 10000.0,
                            ecode: "DriverIns",
                            selIdx: 2
                        },
                        PassengerIns: {
                            amount: 10000.0,
                            ecode: "PassengerIns",
                            selIdx: 2
                        },
                        GlassIns: {
                            amount: -1,
                            ecode: "GlassIns",
                            selIdx: 1
                        },
                        VehicleCompulsoryIns: {
                            amount: -1,
                            ecode: "VehicleCompulsoryIns",
                            selIdx: 1
                        },
                        NcfVehicleDemageIns: {
                            amount: -1,
                            ecode: "NcfVehicleDemageIns",
                            selIdx: 1
                        },
                        NcfThirdPartyIns: {
                            amount: -1,
                            ecode: "NcfThirdPartyIns",
                            selIdx: 1
                        },
                        NcfTheftIns: {
                            amount: -1,
                            ecode: "NcfTheftIns",
                            selIdx: 1
                        },
                        NcfDriverIns: {
                            amount: -1,
                            ecode: "NcfDriverIns",
                            selIdx: 1
                        },
                        NcfPassengerIns: {
                            amount: -1,
                            ecode: "NcfPassengerIns",
                            selIdx: 1
                        }

                    },
                    fullGuard: {

                        VehicleDemageIns: {
                            amount: -1,
                            ecode: "VehicleDemageIns",
                            selIdx: 1
                        },
                        ThirdPartyIns: {
                            amount: 1000000.0,
                            ecode: "ThirdPartyIns",
                            selIdx: 7
                        },
                        TheftIns: {
                            amount: -1,
                            ecode: "TheftIns",
                            selIdx: 1
                        },
                        DriverIns: {
                            amount: 10000.0,
                            ecode: "DriverIns",
                            selIdx: 2
                        },
                        PassengerIns: {
                            amount: 10000.0,
                            ecode: "PassengerIns",
                            selIdx: 2
                        },
                        GlassIns: {
                            amount: -1,
                            ecode: "GlassIns",
                            selIdx: 1
                        },
                        CombustionIns: {
                            amount: -1,
                            ecode: "CombustionIns",
                            selIdx: 1
                        },
                        ScratchIns: {
                            amount: 5000,
                            ecode: "ScratchIns",
                            selIdx: 2
                        },
                        WadingIns: {
                            amount: -1,
                            ecode: "WadingIns",
                            selIdx: 1
                        },
                        SpecifyingPlantCla: {
                            amount: -1,
                            ecode: "SpecifyingPlantCla",
                            selIdx: 1
                        },
                        VehicleCompulsoryIns: {
                            amount: -1,
                            ecode: "VehicleCompulsoryIns",
                            selIdx: 1
                        },
                        NcfVehicleDemageIns: {
                            amount: -1,
                            ecode: "NcfVehicleDemageIns",
                            selIdx: 1
                        },
                        NcfThirdPartyIns: {
                            amount: -1,
                            ecode: "NcfThirdPartyIns",
                            selIdx: 1
                        },
                        NcfTheftIns: {
                            amount: -1,
                            ecode: "NcfTheftIns",
                            selIdx: 1
                        },
                        NcfDriverIns: {
                            amount: -1,
                            ecode: "NcfDriverIns",
                            selIdx: 1
                        },
                        NcfPassengerIns: {
                            amount: -1,
                            ecode: "NcfPassengerIns",
                            selIdx: 1
                        },
                        NcfCombustionIns: {
                            amount: -1,
                            ecode: "NcfCombustionIns",
                            selIdx: 1
                        },
                        NcfScratchIns: {
                            amount: -1,
                            ecode: "NcfScratchIns",
                            selIdx: 1
                        },
                        NcfWadingIns: {
                            amount: -1,
                            ecode: "NcfWadingIns",
                            selIdx: 1
                        }
                    },
                    customerGuard: {
                        item: {}
                    } //自定义的数据
                };
                var selectedInsurance = $(".project-list a[class*=ui-icon-check]", $("#sidebarPage")).closest('div[data-guard]').data('guard')
                if (selectedInsurance) {
                    //自定义的保险
                    if (selectedInsurance === 'customerGuard') {
                        var formData = $("#customerInsurance").serializeJson();
                        var splitItemData;
                        for (var key in formData) {
                            if (key === "VehicleDemageInsAmount" || key === "VehicleDemageIns") {
                                if (key === "VehicleDemageIns") {
                                    splitItemData = formData[key].split(":");
                                    preDefineInsuranceData['customerGuard']['item'][key] = {
                                        amount: splitItemData[0] === "1" ? formData["VehicleDemageInsAmount"] || -1 : -1,
                                        ecode: key,
                                        selIdx: splitItemData[0]
                                    };
                                }
                                continue;
                            }
                            //处理有:隔开的数据
                            if (/:/.test(formData[key])) {
                                //过滤值为-1的数据
                                if (/:-1$/.test(formData[key]) == false) {
                                    splitItemData = formData[key].split(":");
                                    preDefineInsuranceData['customerGuard'][key] = {
                                        amount: splitItemData[1],
                                        ecode: key,
                                        selIdx: splitItemData[0]
                                    };
                                }
                            } else {
                                preDefineInsuranceData['customerGuard'][key] = {
                                    amount: formData[key] === "on" ? -1 : formData[key],
                                    ecode: key,
                                    selIdx: 1
                                };
                            }
                        }
                    }
                    return preDefineInsuranceData[selectedInsurance];
                } else {
                    console.error("获取选中的保险选项失败.");
                }
            }

            //更新保险起期
            function UpdateOtherInfo(updatePath) {
                //更新交强险和商业险 生效日期
                function UpdateBizEffectiveAndEffectiveData() {
                    var df = $.Deferred();
                    var effectiveData = $("#effectiveDate").val();
                    if (!effectiveData) {
                        var dtNow = new Date();
                        effectiveData = dtNow.getFullYear() + "-" + (dtNow.getMonth() + 1) + '-' + (dtNow.getDate() + 1);
                    }
                    effectiveData = effectiveData + " 00:00:00.000" //add
                    $.when(
                        $.ajax({
                            url: updatePath + '/bizEffectiveDate',
                            type: 'PUT',
                            data: '"' + effectiveData + '"'
                        }),
                        $.ajax({
                            url: updatePath + '/efcEffectiveDate',
                            type: 'PUT',
                            data: '"' + effectiveData + '"'
                        })
                    ).done(function(res) {
                        df.resolve();
                    });
                    return df.promise();
                }

                //更新上年保险公司ID
                function UpdateLastComCode() {
                    var df = $.Deferred();
                    var lastComCode = $("#lastComCode").val();
                    $.ajax({
                        url: updatePath + '/lastComCode',
                        type: 'PUT',
                        data: '"' + lastComCode + '"',
                        success: function() {
                            df.resolve();
                        }
                    });

                    return df.promise();
                }

                //更新商业理赔次数
                function UpdateBizClaimsCount() {
                    var df = $.Deferred();
                    var bizClaimsCount = $("#bizClaimsCount").val();
                    $.ajax({
                        url: updatePath + '/bizClaimsCount',
                        type: 'PUT',
                        data: bizClaimsCount,
                        success: function() {
                            df.resolve();
                        }
                    });
                    return df.promise();
                }

                //更新交强理赔次数
                function UpdateEfcClaimsCount() {
                    var df = $.Deferred();
                    var efcClaimsCount = $("#efcClaimsCount").val();
                    $.ajax({
                        url: updatePath + '/efcClaimsCount',
                        type: 'PUT',
                        data: efcClaimsCount,
                        success: function() {
                            df.resolve();
                        }
                    });
                    return df.promise();
                }

                //更新指定驾驶员列表
                function UpdateDrivers() {
                    var df = $.Deferred();
                    if ($('#isSpecifyDriver1')[0].checked) {
                        var driversDatas = [];
                        var currentYear = new Date().getFullYear();
                        $('#driverList').find('ul>li').each(function() {
                            var $self = $(this);
                            var licensedDate = $self.find('input[name=licensedDate]').val();
                            var $drivingLicenceType = $self.find('select[name=drivingLicenceType]');
                            var gender = $self.find('select[name=gender]').val().split(':');
                            var driverData = {
                                "birthday": $self.find('input[name=birthday]').val(),
                                "drivingLicenceType": {
                                    "idx": $drivingLicenceType.val(),
                                    "name": $drivingLicenceType.find('option:selected').text()
                                },
                                "drivingAge": currentYear - (new Date(licensedDate).getFullYear()),
                                "licensedDate": licensedDate,
                                "gender": {
                                    "idx": gender[0],
                                    "name": gender[1]
                                }
                            };
                            driversDatas.push(driverData);
                        });
                        $.ajax({
                            url: updatePath + '/drivers',
                            type: 'PUT',
                            data: JSON.stringify(driversDatas),
                            success: function() {
                                df.resolve();
                            }
                        });
                    } else {
                        df.resolve();
                    }

                    return df.promise();
                }

                //执行更新操作，返回promise对象
                var dfUpateOther = $.Deferred();
                $.when(
                    //UpdateBizEffectiveDate(),
                    //UpdateEffectiveData(),
                    UpdateBizEffectiveAndEffectiveData(),
                    UpdateLastComCode(),
                    UpdateBizClaimsCount(),
                    UpdateEfcClaimsCount(),
                    UpdateDrivers()
                ).done(function() {
                    dfUpateOther.resolve();
                });
                return dfUpateOther.promise();
            }

        });

        $tabs.bind('click', function() {
            var index = $(this).prevAll('li').length;
            changeStatus(index)
            return false;
        });
        $numbers.bind('click', function() {
            var index = $(this).prevAll('li').length;
            $tabs.eq(index).find('a').click();
            changeStatus(index)
            return false;
        });
        //Step 1
        $('#searhStep1').find('footer a').bind('click', function() {
            var targetId = this.href;
            $('#searhStep1').hide();
            $('#searhStep2').show();
            return false;
        });

        //Step 2
        var $pop_customProject = $('#pop_customProject');
        $pop_customProject.popup('option', {
            corners: false,
            shadow: false,
            positionTo: 'window',
            tolerance: '0 0'
        }).on('popupbeforeposition', function(event, opts) {
            $(this).closest('.ui-popup-container').css({
                width: $(window).width(),
                top: 0,
                left: 0
            });
            $(this).find('.custom-content').css({
                height: $(window).height() - 48
            });
        }).on('click', '.btn-close', function() {
            $pop_customProject.popup('close');
            return false;
        })
        $('.btn-custom-set').on('click', function() {
            $pop_customProject.popup('open');
            return false;
        });
        $("#customProject .ui-collapsible-heading .ui-btn").on('click', function() {
            $pop_customProject.popup('open');
            // return false;
        });

        //商业险详情
        //显示险种说明
        var insuranceDesc = {
            VehicleDemageIns: {
                rate: 95,
                title: '一种发生保险事故时，赔偿自己车辆损失的险种。',
                description: '所有车主。特别是3年以内新车、新手或者女性车主、中高级车辆。',
                cases: [{
                    img: '../images/cases/u45_normal.png',
                    title: '车主撞到停车场墙柱'
                }, {
                    img: '../images/cases/u4_normal.png',
                    title: '车辆被刮蹭找不到肇事者'
                }, {
                    img: '../images/cases/u6_normal.png',
                    title: '被大风吹倒的树木砸中'
                }, {
                    img: '../images/cases/u8_normal.png',
                    title: '撞到别人的车'
                }]
            },
            ThirdPartyIns: {
                rate: 99,
                title: '赔偿他人财产和人身伤亡的险种。',
                description: '所有车主。撞到豪车伤不起，撞到人更是可能赔个全家荡产，必买险种。',
                cases: [{
                    img: '../images/cases/u2_normal.png',
                    title: '撞到别人的车'
                }, {
                    img: '../images/cases/u10_normal.png',
                    title: '撞到行人'
                }]
            },
            TheftIns: {
                rate: 40,
                title: '赔偿全车被盗、被抢后造成的全车或者部分损失。',
                description: '无固定车库，一般停在露天停车场<br>经常在外出差，无固定停车地点<br>车辆停放区域治安不好',
                cases: [{
                    img: '../images/cases/u12_normal.png',
                    title: '停驶在室外被盗'
                }, {
                    img: '../images/cases/u25_normal.png',
                    title: '夜间行车被抢劫'
                }]
            },
            DriverIns: {
                rate: 72,
                title: '赔偿本车驾驶员伤亡费用的险种。',
                description: '新手，经常开车或者经常借车给别人开，建议购买。',
                cases: [{
                    img: '../images/cases/u14_normal.png',
                    title: '下雨车辆侧翻，司机被划伤'
                }, {
                    img: '../images/cases/u16_normal.png',
                    title: '严重撞车造成司机死亡'
                }]
            },
            PassengerIns: {
                rate: 63,
                title: '赔偿本车乘客（非驾驶员）伤亡费用的险种。',
                description: '经常开车带上家人或朋友，希望家人朋友的人身安全得到有效保障，建议购买。',
                cases: [{
                    img: '../images/cases/u18_normal.png',
                    title: '捎朋友回家，出事，朋友受伤'
                }, {
                    img: '../images/cases/u47_normal.png',
                    title: '带家人出游出事，家人被划伤'
                }]
            },
            GlassIns: {
                rate: 41,
                title: '赔偿挡风玻璃和车窗单独破碎的损失。（不含车灯车镜）<br>注：车损险是不保玻璃、车窗单独破碎的损失的。',
                description: '经常走高速公路<br>经常停在露天停车场<br>车辆停放区域治安不好<br>',
                cases: [{
                    img: '../images/cases/u31_normal.png',
                    title: '高速路上被飞石击碎车窗'
                }, {
                    img: '../images/cases/u33_normal.png',
                    title: '被高空坠物砸坏挡风玻璃'
                }]
            },
            CombustionIns: {
                rate: 30,
                title: '赔偿因本车自身原因起火造成的损失。',
                description: '适合车主：<br>车辆使用超过3年或者行驶超过3万公里，或夏季高温地区，推荐购买。',
                cases: [{
                    img: '../images/cases/u35_normal.png',
                    title: '10年老车，线路老化起火'
                }, {
                    img: '../images/cases/u37_normal.png',
                    title: '高温地区，在停放时自燃'
                }]
            },
            ScratchIns: {
                rate: 10,
                title: '负责赔偿无碰撞痕迹的车身表面油漆单独划伤。<br>注：有碰撞痕迹属车损险赔偿范围。',
                description: '适用于新车及新手。<br>注：细小的划痕通常可以通过美容进行处理。<br>若进行索赔可能会对第二年的保费产生影响，建议酌情购买。',
                cases: [{
                    img: '../images/cases/u39_normal.png',
                    title: '停在室外，被人恶意用小刀或螺丝钉划伤车身。'
                }]
            },
            WadingIns: {
                rate: '',
                title: '又名发动机损失险，因遭水淹或因涉水行驶造成发动机损坏的赔偿。',
                description: '经常暴雨、内涝，以及城市排水不好的地区，强烈推荐购买。',
                cases: [{
                    img: '../images/cases/u41_normal.png',
                    title: '夏季暴雨，停车场被淹，车辆被泡水。'
                }, {
                    img: '../images/cases/u43_normal.png',
                    title: '从积水的道路上行驶，发动机进水熄火。'
                }]
            }
        };

        function initInsuranceDesc(name) {
            if (!insuranceDesc[name]) return '';
            var html = '<div class="insurance-desc" id="desc_' + name + '">\n' +
                '<div class="rec"></div>\n' +
                '<header>\n' +
                '<span class="nun">' + insuranceDesc[name].rate + '%</span>购买率\n' +
                '</header>\n' +
                '<div class="content">\n' +
                '<div class="title">' + insuranceDesc[name].title + '</div>\n' +
                '<div class="desc">' + insuranceDesc[name].description + '</div>\n' +
                '<h4>典型案例</h4>\n' +
                '<div class="gallery">\n' +
                '<ul class="slider">\n';
            insuranceDesc[name].cases.forEach(function(Case, idx) {
                html += '<li><img src="' + Case.img + '" /><p class="title">' + Case.title + '</p></li>';
            });
            html += '</ul>\n' +
                '<div class="glyphicon glyphicon-menu-left"></div><div class="glyphicon glyphicon-menu-right"></div>\n' +
                '</div></div></div>';
            return html;
        }
        $('#pop_customProject .glyphicon-question-sign').on('click', function() {
            var $currentFiled = $(this).closest('.ui-field-contain');
            var fieldName = $currentFiled.find('>label').attr('for');
            if (!insuranceDesc[fieldName]) return false;
            if (!$currentFiled.next().is('.insurance-desc')) {
                $currentFiled.after(initInsuranceDesc(fieldName));
                var $wrapContainer = $('#desc_' + fieldName);
                var mySwiper = Swipe($wrapContainer.find('.gallery')[0], {});
                $wrapContainer.on('click', '.glyphicon-menu-left', mySwiper.prev).on('click', '.glyphicon-menu-right', mySwiper.next);
            } else {
                $currentFiled.next('.insurance-desc').slideToggle();
            }
            return false;
        });


        $("#VehicleDemageIns").bind('change', function() {
            var $that = $(this);
            if ($that.val() === "1:-1") {
                $("#VehicleDemageInsAmount").prop('disabled', false);
                //$("#VehicleDemageInsAmount").closest('div.sub-field').show();
            } else {
                //$("#VehicleDemageInsAmount").closest('div.sub-field').hide();
                $("#VehicleDemageInsAmount").prop('disabled', true).val('');
            }
        }).triggerHandler('change');
    })
    .on("pageshow", "#sidebarPage", function() {
        var postData = {};
        globalPage.search.CarSelect(postData);

        var divToolBar = '<div class="toolbar" data-step="4"><h4><a href="#" data-step="4">车系</a></h4><a href="#" class="btn-close"></a></div>';
        var carItemUrl = sessionStorage.getItem('carItemUrl');
        var carItems = JSON.parse(sessionStorage.getItem('carItems'));
        var selectedCarItem = sessionStorage.getItem('selectedCarItem');
        var $carModelInput = $("#carModel");
        var divBrandContentContainer = '<div class="brand-content">' +
            '<section data-url="' + carItemUrl + '" class="active" >' +
            '<ul class="cart-step-list">';
        carItems.forEach(function(item) {
            divBrandContentContainer += '<li><a href="#" data-request="' + item.id + '"><p>' + item.standardName + '<span>' + item.remark + '</span></p><p class="price">￥' + item.price + '</p></a></li>';
            if (item.id == selectedCarItem) {
                //设置carModel的值
                $carModelInput.val(item.id).hide().next('.car-model').html('<p>' + item.standardName + '<span>' + item.remark + '</span></p><p class="price">￥' + item.price + '</p>').show();
            }
        });
        divBrandContentContainer += '</ul>' +
            '</section>' +
            '</div>';

        //设置缓存项section
        $("#pop_searchCarModel").html(divToolBar + divBrandContentContainer);

        //设置页面默认值
        //var tomorrow = new Date(Date.now() + 3600 * 24 * 1000);
        //$("#effectiveDate").val(tomorrow.getFullYear()+"/"+(tomorrow.getMonth()+1)+"/"+tomorrow.getDate());
        $('#effectiveDate').val(new Date(Date.now() + 3600 * 24 * 1000).format('y-m-d'));

        function CalcProgress() {
            $(".cardunder").bind('change', function(e) {
                CalcFormElementProgress();
            });

            ////保险的选择
            //$("div[data-guard]").on('click.calcProgress', function (e) {
            //  console.log(e.target);
            //  CalcFormElementProgress();
            //});

            document.getElementById('cardGuaranteeTab').addEventListener('click', function(e) {
                if ($(e.target).closest('h5.ui-collapsible-heading')[0]) {
                    setTimeout(CalcFormElementProgress, 1);
                }
            }, true);

            CalcFormElementProgress();

            function CalcFormElementProgress() {
                var totalProgress = 0;

                var idProgress = {
                    carModel: 10,
                    firstRegDate: 15,
                    effectiveDate: 5,
                    lastComCode: 10,
                    bizClaimsCount: 15,
                    efcClaimsCount: 15
                };
                for (var id in idProgress) {
                    //有id的表单元素change判断
                    if (!!$("#" + id).val()) { //如果有有效值
                        totalProgress += idProgress[id];
                    }
                }

                //两个单选按钮的计算
                var nameProgress = {
                    isTransferCar: 10,
                    isSpecifyDriver: 5
                }
                for (var id in nameProgress) {
                    if ($(":radio[name='" + id + "']:checked").val() != undefined) {
                        totalProgress += nameProgress[id];
                    }
                }
                //加上保险的10%
                totalProgress += $("#cardGuaranteeTab").has('.ui-icon-check')[0] ? 10 : 0;
                //加上区域的5%
                totalProgress += 5;

                sessionStorage['offerProgress'] = totalProgress;
                $('.progress-bar > .bar').css('width', totalProgress + '%').next().find('span').text(totalProgress);
            }
        }

        CalcProgress();
    });


/*Back compare.js*/

$(document).on("pageinit", "#comparePage", function() {
    /*Back 20150422 改成从sesessionStorage取供应商列表数据
    $.ajax({ //Back 模拟API 根据供应商id获取顶部列表信息
        url: '../assets/provider.json',
        data: '',
        async: false,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            ds = data;
            for (var i = 0; i < ds.length; i++) {
                strtoplist += '<li value="' + ds[i]["prvId"] + '" class="swiper-slide">' + ds[i]["name"] + '<a class="comparebtn"></a></li>'; //Back 供应商顶部信息
            }
        }
    });
    */

    var providers = JSON.parse(sessionStorage.getItem("providers"));
    var providerToSqid = JSON.parse(sessionStorage.getItem("providerToSqid"));
    var selectedProvider = sessionStorage.getItem("selectedProvider");
    var price = JSON.parse(sessionStorage.getItem('providerPrice'));
    var cityid = sessionStorage.getItem("cityid");
    var areosuitlist;

    //生成头部列表
    Api_Get_Toplist(price, selectedProvider);
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        touchRatio: 0.3,
        freeMode: true,
        spaceBetween: 20
    });

    $.ajax({ //Back 20150423 根据cityid获取地区保险配置
        url: apiOrigin + '/prv/suite/' + cityid,
        async: false,
        type: 'get',
        dataType: 'json',
        success: function(data) {
            areosuitlist = data;
        }
    });
    var ds = [];
    for (var i in providerToSqid) {
        $.ajax({ //Back 20150423 获取单方报价保险列表
            url: apiOrigin + '/quote/sq/' + providerToSqid[i] + '/latest',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function(data) {
                ds.push(data);
            }
        });
    }


    function Api_Get_Toplist(availableProviders, selected) {
        var html_toplist = html_first = _temp = '';
        for (providerid in availableProviders) {
            $.each(providers, function(idx, provider) {
                _temp = '<li data-prvid="' + provider["prvId"] + '" class="swiper-slide">' + provider["name"] + '<a class="comparebtn"></a></li>';
                if (selected == provider["prvId"]) {
                    html_first = _temp;
                    return true;
                } else if (providerid == provider["prvId"]) {
                    html_toplist += _temp;
                    return false;
                }
            });
        }
        $(".toplist").html(html_first + html_toplist);
    }


    var product_leftid, product_rightid; //Back 对比左边供应商id、对比右边供应商id
    product_leftid = selectedProvider; //Back 初始选择的保险id
    compare_init(product_leftid); //Back 根据id初始化加载页面时选中的toplist li
    $('#searhStep1').find('footer a').bind('click', function() {
        var targetId = this.href;
        $('#searhStep1').hide();
        $('#searhStep2').show();
        return false;
    });

    $('#searhStep2').find('footer a').bind('click', function() {
        var targetId = this.href;
        $('#searhStep2').hide();
        $('#searhStep3').show();
        return false;
    });
    $('#searhStep3').find('footer a').bind('click', function() {
        var targetId = this.href;
        $('#searhStep3').hide();
        $('#searhStep4').show();
        return false;
    });

    $(".toplist").on('click', '>li', function() {
        var choosenum = $(".toplist li.choose").length; //Back 选中的条目
        if ($(this).hasClass("choose")) {
            if (choosenum == 2) //Back 已经存在2个比较,取消当前选中
            {
                if (product_leftid == $(this).data("prvid")) {
                    product_leftid = product_rightid; //Back 对边左边为剩下的id
                }
                $(this).removeClass("choose");
                Remove_Class_half();
                Set_compare_header(1);
                Set_tapone(1);
                Set_taptwo(1);
                Set_tapthree(1);
            }
            //alert($(this).index());
        } else {
            if (choosenum < 2) //Back 比较的条目不能大于2
            {
                $(this).addClass("choose");
                product_rightid = $(this).data("prvid"); //Back 设置选中的对比保险id
                //alert($(this).val());
                Set_compare_header(2);
                Set_tapone(2);
                Set_taptwo(2);
                Set_tapthree(2);
                Set_Class_half();
            }
        }
    });

    function two_close(product_id) {
        Remove_Class_half();
        if (product_id == product_leftid) //Back点击header删除按钮选择另一个id初始化
        {
            product_leftid = product_rightid;
            compare_init(product_rightid);
        } else if (product_id == product_rightid) {
            compare_init(product_leftid);
        }

    }

    function compare_init(product_id) {
        $(".toplist li").removeClass("choose");
        for (var i = 0; i < $(".toplist li").length; i++) {
            if ($(".toplist li").eq(i).data('prvid') == product_id) {
                $(".toplist li").eq(i).addClass("choose");
            }
        }
        //product_id;               //Back 需要初始化的保险id
        Set_compare_header(1);
        Set_tapone(1);
        Set_taptwo(1);
        Set_tapthree(1);
    }

    function Set_Class_half() //Back 设置对比class
        {
            $("#tap_one").addClass("half");
            $("#tap_two").addClass("half");
            $("#tap_three").addClass("half");
            $(".compare_header").addClass("half");
        }

    function Remove_Class_half() //Back 设置对比class
        {
            $("#tap_one").removeClass("half");
            $("#tap_two").removeClass("half");
            $("#tap_three").removeClass("half");
            $(".compare_header").removeClass("half");
        }

    function Get_compare_header(backsign) {
        var str = "";
        str += '<div class="compare_header">';
        if (backsign == null || backsign == "") {
            str += '<a class="close_btn ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right" href="list.html" rel="external"></a>';
            /*Back 20150422 改成从sessionStorage 中provider取数据
            $.ajax({ //Back 模拟API 根据供应商id获取header信息
                url: '../assets/provider.json',
                data: '',
                async: false,
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    ds = data;
                    for (var i = 0; i < ds.length; i++) {
                        if (product_leftid == ds[i]["prvId"]) {
                            str += '<div class="compare_header_title">' + ds[i]["name"] + '</div>'; //Back 应为供应商名称
                            str += '<div class="compare_header_price">￥' + ds[i]["fullName"] + '</div>'; //Back 应为供应商显示在header的价钱
                            str += '<div class="compare_header_btn">';
                            str += '<a href="#searhStep2" data-role="button" class="btn-buy">购买</a>';
                            str += '</div>';
                            str += '<div class="compare_header_star"></div>';
                            str += '</div>';
                        }
                    }
                }
            });
            */

            for (var i in providers) {
                if (product_leftid == providers[i]["prvId"]) {
                    str += '<div class="compare_header_title">' + providers[i]["name"] + '</div>';
                    str += '<div class="compare_header_price">￥' + price[selectedProvider] + '</div>'; //Back 20150422 question 价钱从哪里取回来
                    str += '<div class="compare_header_btn">';
                    str += '<a href="#" data-role="button" class="btn-buy">购买</a>';
                    str += '</div>';
                    str += '<div class="compare_header_star"></div>';
                    str += '</div>';
                }
            }

        } else {
            if (backsign == 1) {
                str += '<a class="close_btn ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right two_close_btn" id=' + product_leftid + ' "></a>';
                /*Back 20150422 改成从sessionStorage 中provider取数据
                $.ajax({ //Back 模拟API 根据供应商id获取header信息
                    url: '../assets/provider.json',
                    data: '',
                    async: false,
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        ds = data;
                        for (var i = 0; i < ds.length; i++) {
                            if (product_leftid == ds[i]["prvId"]) {
                                str += '<div class="compare_header_title">' + ds[i]["name"] + '</div>'; //Back 应为供应商名称
                                str += '<div class="compare_header_price">￥' + ds[i]["fullName"] + '</div>'; //Back 应为供应商显示在header的价钱
                                str += '<div class="compare_header_btn">';
                                str += '<a href="#searhStep2" data-role="button" class="btn-buy">购买</a>';
                                str += '</div>';
                                str += '<div class="compare_header_star"></div>';
                                str += '</div>';
                            }
                        }
                    }
                });
                */

                for (var i in providers) {
                    if (product_leftid == providers[i]["prvId"]) {
                        str += '<div class="compare_header_title">' + providers[i]["name"] + '</div>';
                        str += '<div class="compare_header_price">￥' + price[providers[i]["prvId"]] + '</div>'; //Back 20150422 question 价钱从哪里取回来
                        str += '<div class="compare_header_btn">';
                        str += '<a href="#" data-role="button" class="btn-buy">购买</a>';
                        str += '</div>';
                        str += '<div class="compare_header_star"></div>';
                        str += '</div>';
                    }
                }

            } else if (backsign == 2) {
                str += '<a class="close_btn ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right two_close_btn" id=' + product_rightid + ' "></a>';
                /*Back 20150422 改成从sessionStorage 中provider取数据
                $.ajax({ //Back 模拟API 根据供应商id获取header信息
                    url: '../assets/provider.json',
                    data: '',
                    async: false,
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        ds = data;
                        for (var i = 0; i < ds.length; i++) {
                            if (product_rightid == ds[i]["prvId"]) {
                                str += '<div class="compare_header_title">' + ds[i]["name"] + '</div>'; //Back 应为供应商名称
                                str += '<div class="compare_header_price">￥' + ds[i]["fullName"] + '</div>'; //Back 应为供应商显示在header的价钱
                                str += '<div class="compare_header_btn">';
                                str += '<a href="#searhStep2" data-role="button" class="btn-buy">购买</a>';
                                str += '</div>';
                                str += '<div class="compare_header_star"></div>';
                                str += '</div>';
                            }
                        }
                    }
                });
                */
                for (var i in providers) {
                    if (product_rightid == providers[i]["prvId"]) {
                        str += '<div class="compare_header_title">' + providers[i]["name"] + '</div>';
                        str += '<div class="compare_header_price">￥' + price[providers[i]["prvId"]] + '</div>'; //Back 20150422 question 价钱从哪里取回来
                        str += '<div class="compare_header_btn">';
                        str += '<a href="#" data-role="button" class="btn-buy">购买</a>';
                        str += '</div>';
                        str += '<div class="compare_header_star"></div>';
                        str += '</div>';
                    }
                }
            }
        }
        return str;
    }

    function Set_compare_header(length) {
        var str = "";
        for (var i = 0; i < length; i++) {
            if (length == 1) {
                str += Get_compare_header(); //Back 只有1个header是关闭按钮跳转到list页面
            } else {
                str += Get_compare_header(i + 1);
            }
        }
        $("#compare_header_list").html(str);
        $('.btn-buy').button({
            corners: false,
            inline: true,
            shadow: false
        });
        $(".two_close_btn").click(function() {
            two_close($(this).attr('id')); //Back 绑定关闭事件
        });
        $(".compare_header_btn .btn-buy").click(function() {
            // $("#popSearch").popup("open");
            return false;
        })
    }

    /*
    function Get_tapone(index) {
        var str = "";
        str += '<div class="li-control">';
        str += '<ul id="listview_tapone_' + index + '" data-role="listview" data-inset="true" data-shadow="false">';
        str += Create_tapone_list_divider('车辆损失险');
        str += Create_tapone_li('269820（保额)', '3956.21（保费）');
        str += Create_tapone_list_divider('第三者责任险');
        str += Create_tapone_li('50万（保额）', '416.21（保费）', 1);
        str += Create_tapone_list_divider('全车盗抢险');
        str += Create_tapone_li('投保', '1216.56（保费）');
        str += Create_tapone_list_divider('司机责任险');
        str += Create_tapone_li('1万（保额）', '416.21（保费）', 1);
        str += Create_tapone_list_divider('交强险');
        str += Create_tapone_li('投保', '850.00（保费）');
        str += Create_tapone_list_divider('车船税');
        str += Create_tapone_li('代缴', '548.00（保费）');
        str += '</ul>';
        str += '</div>';
        return str;
    }

    function Set_tapone(length) {
        var str = "";
        for (var i = 0; i < length; i++) {
            str += Get_tapone(i);
        }
        $("#tap_one").html(str);
        for (var i = 0; i < length; i++)
            $("#listview_tapone_" + i + "").listview();
    }
    */
    function Get_tapone(index) {
        var str = "";

        str += '<div class="li-control">';
        str += '<ul id="listview_tapone" data-role="listview" data-inset="true" data-shadow="false">';
        /*Back 20150423 注释模拟数据
        $.ajax({ //Back 模拟API 根据供应商id获取单方报价列表
            url: '../assets/compare.json',
            data: '',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function(data) {
                ds = data;
            }
        });
        */


        //console.log(ds);
        /*Back 20150423 注释模拟数据
        if (index != 1) //Back 如果对比大于1
        {
            var left_part_index, right_part_index;
            var equallist = new Array();
            for (var i = 0; i < ds.length; i++) {
                if (product_leftid == ds[i]["providerId"]) {
                    left_part_index = i;
                }
                if (product_rightid == ds[i]["providerId"]) {
                    right_part_index = i;
                }
            }

            for (var j = 0; j < ds[left_part_index]["suite"].length; j++) {
                str += '<p class="ui-body lihead">' + ds[left_part_index]["suite"][j]["items"][0]["caption"] + '</p>'; //Back 现在选用"商业险配置items字段index为0的保障项目名称"
                str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">'
                str += '<div>';
                str += '<p>' + ds[left_part_index]["suite"][j]["discountPrice"] + '（保额）</p>'; //Back 现在选用"商业险配置折后价"
                str += '<p>' + ds[left_part_index]["suite"][j]["charge"] + '（保费）</p>'; //Back 现在选用"商业险配置总保费"
                str += '</div>';
                for (var i = 0; i < ds[right_part_index]["suite"].length; i++) //Back 遍历右边相同的ecode进行对比
                {
                    if (ds[left_part_index]["suite"][j]["items"][0]["ecode"] == ds[right_part_index]["suite"][i]["items"][0]["ecode"]) {
                        equallist.push(ds[right_part_index]["suite"][i]["items"][0]["ecode"]);
                        str += '<div>';
                        str += '<p>' + ds[right_part_index]["suite"][i]["discountPrice"] + '（保额）</p>'; //Back 现在选用"商业险配置折后价"
                        str += '<p>' + ds[right_part_index]["suite"][i]["charge"] + '（保费）</p>'; //Back 现在选用"商业险配置总保费"
                        str += '</div>';
                    }
                }
                str += '</div>';
            }

            for (var i = 0; i < ds[right_part_index]["suite"].length; i++) {
                var insign = 0; //Back 多少个ecode相同标识位
                for (var k in equallist) {
                    if (equallist[k] == ds[right_part_index]["suite"][i]["items"][0]["ecode"]) {
                        insign++;
                    }
                }
                if (insign == 0) //Back 对比左边没有的险种右边继续显示
                {
                    str += '<p class="ui-body lihead">' + ds[right_part_index]["suite"][i]["items"][0]["caption"] + '</p>'; //Back 现在选用"商业险配置items字段index为0的保障项目名称"
                    str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">'
                    str += '<div>';
                    str += '<p></p>';
                    str += '<p></p>';
                    str += '</div>';
                    str += '<div>';
                    str += '<p>' + ds[right_part_index]["suite"][i]["discountPrice"] + '（保额）</p>'; //Back 现在选用"商业险配置折后价"
                    str += '<p>' + ds[right_part_index]["suite"][i]["charge"] + '（保费）</p>'; //Back 现在选用"商业险配置总保费"
                    str += '</div>';
                    str += '</div>';
                }
            }
        } else {
            for (var i = 0; i < ds.length; i++) {
                if (product_leftid == ds[i]["providerId"]) {
                    for (var j = 0; j < ds[i]["suite"].length; j++) {
                        str += '<p class="ui-body lihead">' + ds[i]["suite"][j]["items"][0]["caption"] + '</p>'; //Back 现在选用"商业险配置items字段index为0的保障项目名称"
                        str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">'
                        str += '<div>';
                        str += '<p>' + ds[i]["suite"][j]["discountPrice"] + '（保额）</p>'; //Back 现在选用"商业险配置折后价"
                        str += '<p>' + ds[i]["suite"][j]["charge"] + '（保费）</p>'; //Back 现在选用"商业险配置总保费"
                        str += '</div>';
                        str += '</div>';
                    }
                }
            }
        }
        str += '</ul>';
        str += '</div>';
        return str;
        */

        if (index != 1) //Back 如果对比大于1
        {
            var left_part_index, right_part_index;
            var equallist = new Array();
            for (var i = 0; i < ds.length; i++) {
                if (product_leftid == ds[i]["providerId"]) {
                    left_part_index = i;
                }
                if (product_rightid == ds[i]["providerId"]) {
                    right_part_index = i;
                }
            }

            var left_part_item = ds[left_part_index]["dealOffer"]["suite"]["items"];
            var right_part_item = ds[right_part_index]["dealOffer"]["suite"]["items"];

            for (var k in left_part_item) {
                for (var j in areosuitlist["items"]) {
                    if (k == j) {
                        str += '<p class="ui-body lihead">' + areosuitlist["items"][j]["caption"] + '</p>';
                        str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">'
                        str += '<div>';
                        if (left_part_item[k]["amount"] == '-1') {
                            str += '<p>投保</p>';
                        } else {
                            str += '<p>' + left_part_item[k]["amount"] + '（保额）</p>';
                        }

                        str += '</div>';
                        for (var i in right_part_item) //Back 遍历右边相同的ecode进行对比
                        {
                            if (left_part_item[k]["ecode"] == right_part_item[i]["ecode"]) {
                                equallist.push(right_part_item[i]["ecode"]);
                                str += '<div>';
                                if (right_part_item[i]["amount"] == '-1') {
                                    str += '<p>投保</p>';
                                } else {
                                    str += '<p>' + right_part_item[i]["amount"] + '（保额）</p>';
                                }
                                str += '</div>';
                            }
                        }
                        str += '</div>';
                    }
                }
            }

            for (var i in right_part_item) {
                var insign = 0; //Back 多少个ecode相同标识位
                for (var k in equallist) {
                    if (equallist[k] == right_part_item[i]["ecode"]) {
                        insign++;
                    }
                }
                if (insign == 0) //Back 对比左边没有的险种右边继续显示
                {

                    for (var h in areosuitlist["items"]) {
                        if (h == i) {
                            str += '<p class="ui-body lihead">' + areosuitlist["items"][i]["caption"] + '</p>';
                        }
                    }
                    str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">'
                    str += '<div>';
                    str += '<p></p>';
                    str += '<p></p>';
                    str += '</div>';
                    str += '<div>';
                    if (right_part_item[i]["amount"] == '-1') {
                        str += '<p>投保</p>';
                    } else {
                        sstr += '<p>' + right_part_item[i]["amount"] + '（保额）</p>';
                    }
                    str += '<p></p>';
                    str += '</div>';
                    str += '</div>';
                }
            }
        } else {
            for (var i = 0; i < ds.length; i++) {
                if (product_leftid == ds[i]["providerId"]) {
                    var left_part_item = ds[i]["dealOffer"]["suite"]["items"];
                    for (var k in ds[i]["dealOffer"]["suite"]["items"]) {
                        for (var j in areosuitlist["items"]) {
                            if (k == j) {
                                str += '<p class="ui-body lihead">' + areosuitlist["items"][j]["caption"] + '</p>';
                                str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">'
                                str += '<div>';
                                if (left_part_item[k]["amount"] == '-1') {
                                    str += '<p>投保</p>';
                                } else {
                                    str += '<p>' + left_part_item[k]["amount"] + '（保额）</p>';
                                }
                                //Back 20150423 保费不显示 str += '<p>' + ds[i]["dealOffer"]["suite"][j]["charge"] + '（保费）</p>'; 
                                str += '</div>';
                                str += '</div>';
                            }
                        }
                    }
                }
            }
        }

        str += '</ul>';
        str += '</div>';
        return str;
    }

    function Set_tapone(length) {
        $("#tap_one").html(Get_tapone(length));
    }

    /*
       function Get_taptwo(index) {
           var str = "";
           str += '<div class="li-control">';
           str += '<ul  id="listview_taptwo_' + index + '" data-role="listview" data-inset="true" data-divider-theme="a" data-shadow="false" data-icon="false">';
           str += Create_taptwo_title('理赔特色服务');
           str += Create_taptwo_li('报案到赔款，3天到账', 1);
           str += Create_taptwo_li('结案支付，即时到账', 1);
           str += Create_taptwo_li('人伤案件，安心理赔', 1);
           str += Create_taptwo_li('上门代收理赔资料', 1);
           str += Create_taptwo_li('个人VIP客户简易理赔服务', 1);
           str += Create_taptwo_title('理赔流程');
           str += Create_taptwo_li('车损理赔流程', 1);
           str += Create_taptwo_li('车损快速赔款', 1);
           str += Create_taptwo_li('人伤理赔流程', 1);
           str += Create_taptwo_title('理赔网点');
           str += Create_taptwo_li('客户门店', 1);
           str += '<li>';
           str += '<a href="#glist3" data-rel="popup" class="li-popup">客户门店<span class="text-small">广东广州地区共 <span class="text-red">16</span> 个网点</span></a>';
           str += '</li>';
           str += '<li>';
           str += '<a class="li-popup">合作修理厂<span class="text-small">广东 广州地区共 <span class="text-red">26</span> 个 <span class="text-red">奥迪</span> 修理厂</span></a>';
           str += '</li>';

           str += '</ul>';
           str += '</div>';
           return str;
       }

       function Set_taptwo(length) {
           var str = "";
           for (var i = 0; i < length; i++) {
               str += Get_taptwo(i);
           }
           $("#tap_two").html(str);
           for (var i = 0; i < length; i++) {
               $("#listview_taptwo_" + i + "").listview();
           }
       }
       */
    /*
    function Create_tapone_list_divider(text_0) {
        var str = "";
        //Back 20150410 newui
        //str += '<li data-role="list-divider" class="lihead">' + text_0 + '</li>';
        //
        str+='<p class="ui-body lihead">' + text_0 + '</p>';
        return str;
    }
    */
    /*
       function Create_tapone_li(text_0, text_1, circle) //circle标志是否低价，传0或1即可
           { 
            var str = "";
            //Back 20150410 newui
               //str += '<li>';
               //str += '<div>';
               //str += '<p>' + text_0 + '</p>';
               //str += '</div>';
               //str += '<div>';
               //str += '<span class="text-green">' + text_1 + '</span>';
               //if (circle != null && circle != "") {
               //    str += '<span class="circle">低</span>';
               //}
               //str += '</div>';
               //str += '</li>';
               //return str;
               //

              str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">';
              str += '<p>' + text_0 + '</p>';
              str += '<p>' + text_1 + '</p>';
              str += '</div>';
              return str;
              
           }

       function Create_taptwo_title(text_0) {
           var str = "";
           str += '<li data-role="list-divider" style="text-align: center">' + text_0 + '</li>';
           return str;
       }

       function Create_taptwo_li(text_0, popup_id) {
           var str = "";
           str += '<li><a href="#taptwo_popup_' + popup_id + '" data-rel="popup" class="li-popup">' + text_0 + '<span class="text-small">详细></span></a></li>';
           return str;
       }
       */

    function Get_taptwo(index) {
        var str = "";
        str += '<div class="li-control">';
        str += '<ul id="listview_taptwo" data-role="listview" data-inset="true" data-shadow="false">';
        /*Back 注释模拟数据
        $.ajax({ //Back 模拟API 根据供应商id获取单方报价列表
            url: '../assets/provider.json',
            data: '',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function(data) {
                ds = data;
            }
        });
        */
        if (index != 1) //Back 如果对比大于1
        {
            var left_part_index, right_part_index;
            var equallist = new Array();
            for (var i = 0; i < providers.length; i++) {
                if (product_leftid == providers[i]["prvId"]) {
                    left_part_index = i;
                }
                if (product_rightid == providers[i]["prvId"]) {
                    right_part_index = i;
                }
            }
            $.each(providers[left_part_index]["products"], function(n, products) {
                //console.log(products)
                $.each(products["servicesList"], function(j, services) {
                    str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">'
                    str += '<div>';
                    /*Back 20150424 code为什么相同？真实数据是否相同？先采用title  
                     str += '<p><a data-prvid="' + providers[left_part_index]["prvId"] + '" data-productscode="' + products["code"] + '" data-servicecode="' + services["code"] + '" class="servicespopup" data-role="button" href="#servicespopup">' + services["title"] + '</a></p>'; //Back 供应商服务title
                     */
                    str += '<p><a data-prvid="' + providers[left_part_index]["prvId"] + '" data-productscode="' + products["code"] + '" data-servicecode="' + services["title"] + '" class="servicespopup" data-role="button" href="#servicespopup">' + services["title"] + '</a></p>'; //Back 供应商服务title
                    str += '</div>';
                    $.each(providers[right_part_index]["products"], function(k, products_r) {
                        $.each(products_r["servicesList"], function(k, services_r) {
                            /*Back 20150424 code为什么相同？真实数据是否相同？先采用title
                            if (services["code"] == services_r["code"]) {
                                equallist.push(services_r["code"]);
                                str += '<div>';
                                str += '<p><a data-prvid="' + providers[right_part_index]["prvId"] + '" data-productscode="' + products_r["code"] + '" data-servicecode="' + services_r["code"] + '" class="servicespopup" data-role="button" href="#servicespopup">' + services_r["title"] + '</a></p>'; //Back 供应商服务title
                                str += '</div>';
                            }
                            */
                            if (services["title"] == services_r["title"]) {
                                equallist.push(services_r["title"]);
                                str += '<div>';
                                /*Back 20150424 code为什么相同？真实数据是否相同？先采用title  
                                str += '<p><a data-prvid="' + providers[right_part_index]["prvId"] + '" data-productscode="' + products_r["code"] + '" data-servicecode="' + services_r["code"] + '" class="servicespopup" data-role="button" href="#servicespopup">' + services_r["title"] + '</a></p>'; //Back 供应商服务title
                                */
                                str += '<p><a data-prvid="' + providers[right_part_index]["prvId"] + '" data-productscode="' + products_r["code"] + '" data-servicecode="' + services_r["title"] + '" class="servicespopup" data-role="button" href="#servicespopup">' + services_r["title"] + '</a></p>'; //Back 供应商服务title
                                str += '</div>';
                            }
                        });
                    });
                    str += '</div>';
                });
            });
            $.each(providers[right_part_index]["products"], function(n, product_r) {
                $.each(product_r["servicesList"], function(i, services_r) {
                    var insign = 0; //Back 多少个ecode相同标识位
                    for (var k in equallist) {
                        /*Back 20150424 code为什么相同？真实数据是否相同？先采用title
                        if (equallist[k] == services_r["code"]) {
                            insign++;
                        }
                        */
                        if (equallist[k] == services_r["title"]) {
                            insign++;
                        }
                    }
                    if (insign == 0) //Back 对比左边没有的险种右边继续显示
                    {
                        str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">'
                        str += '<div>';
                        str += '<p></p>';
                        str += '</div>';
                        str += '<div>';
                        /*Back 20150424 code为什么相同？真实数据是否相同？先采用title 
                        str += '<p><a data-prvid="' + providers[right_part_index]["prvId"] + '" data-productscode="' + product_r["code"] + '" data-servicecode="' + services_r["code"] + '" class="servicespopup" data-role="button" href="#servicespopup">' + services_r["title"] + '</a></p>'; //Back 供应商服务title
                        */

                        str += '<p><a data-prvid="' + providers[right_part_index]["prvId"] + '" data-productscode="' + product_r["code"] + '" data-servicecode="' + services_r["title"] + '" class="servicespopup" data-role="button" href="#servicespopup">' + services_r["title"] + '</a></p>'; //Back 供应商服务title
                        str += '</div>';
                        str += '</div>';
                    }

                });
            });
            /*Back 已经加入product列表遍历并已改写成each循环，上文
           for(var j=0;j<ds[left_part_index]["products"][0]["services"].length;j++)
            {
                str+='<div class="ui-body ui-body-a ui-corner-all text-center liitem">'
                str+='<div>';
                str+='<p><a data-prvid="'+ds[left_part_index]["prvId"]+'" data-productscode="'+ds[left_part_index]["products"][0]["code"]+'" data-servicecode="'+ds[left_part_index]["products"][0]["services"][j]["code"]+'" class="servicespopup" data-role="button" href="#servicespopup">'+ds[left_part_index]["products"][0]["services"][j]["title"]+'</a></p>';   //Back 供应商服务title
                str+='</div>';
                for(var i=0;i<ds[right_part_index]["products"][0]["services"].length;i++)//Back 遍历右边相同的code进行对比
                {
                    if(ds[left_part_index]["products"][0]["services"][j]["code"]==ds[right_part_index]["products"][0]["services"][i]["code"])
                    {
                        equallist.push(ds[right_part_index]["products"][0]["services"][i]["code"]);
                        str+='<div>';
                        str+='<p><a data-prvid="'+ds[right_part_index]["prvId"]+'" data-productscode="'+ds[right_part_index]["products"][0]["code"]+'" data-servicecode="'+ds[right_part_index]["products"][0]["services"][j]["code"]+'" class="servicespopup" data-role="button" href="#servicespopup">'+ds[right_part_index]["products"][0]["services"][i]["title"]+'</a></p>';   //Back 供应商服务title
                        str+='</div>';
                    }
                }
                str+='</div>';
            }

           for(var i=0;i<ds[right_part_index]["products"][0]["services"].length;i++)
           {
                var insign=0;//Back 多少个ecode相同标识位
                for(var k in equallist)
                {
                    if(equallist[k]==ds[right_part_index]["products"][0]["services"][i]["code"])
                    {
                        insign++;
                    }
                }
                if(insign==0)//Back 对比左边没有的险种右边继续显示
                {
                    str+='<div class="ui-body ui-body-a ui-corner-all text-center liitem">'
                    str+='<div>';
                    str+='<p></p>';
                    str+='</div>';
                    str+='<div>';
                    str+='<p><a data-prvid="'+ds[right_part_index]["prvId"]+'" data-productscode="'+ds[right_part_index]["products"][0]["code"]+'" data-servicecode="'+ds[right_part_index]["products"][0]["services"][i]["code"]+'" class="servicespopup" data-role="button" href="#servicespopup">'+ds[right_part_index]["products"][0]["services"][i]["title"]+'</a></p>'; //Back 供应商服务title
                    str+='</div>';
                    str+='</div>';
                }   
           }
           */
        } else {
            /*Back 已经加入product列表遍历并已改写成each循环，下文
                        for(var i=0;i<ds.length;i++)
                        {
                            if(product_leftid==ds[i]["prvId"])
                            {
                                for(var j=0;j<ds[i]["products"][0]["services"].length;j++)
                                {
                                    str+='<div class="ui-body ui-body-a ui-corner-all text-center liitem">';
                                    str+='<div>';
                                    str+='<p><a data-prvid="'+ds[i]["prvId"]+'" data-productscode="'+ds[i]["products"][0]["code"]+'" data-servicecode="'+ds[i]["products"][0]["services"][j]["code"]+'" class="servicespopup" data-role="button" href="#servicespopup">'+ds[i]["products"][0]["services"][j]["title"]+'</a></p>'; //Back 供应商服务title
                                    str+='</div>';
                                    str+='</div>';
                                }
                            }
                        }
                        */
            for (var i = 0; i < providers.length; i++) {
                if (product_leftid == providers[i]["prvId"]) {
                    $.each(providers[i]["products"], function(j, product) {
                        $.each(product["servicesList"], function(k, service) {
                            str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">';
                            str += '<div>';
                            /*Back 20150424 code为什么相同？真实数据是否相同？先采用title 
                            str += '<p><a data-prvid="' + providers[i]["prvId"] + '" data-productscode="' + product["code"] + '" data-servicecode="' + service["code"] + '" class="servicespopup" data-role="button" href="#servicespopup">' + service["title"] + '</a></p>'; //Back 供应商服务title
                            */
                            str += '<p><a data-prvid="' + providers[i]["prvId"] + '" data-productscode="' + product["code"] + '" data-servicecode="' + service["title"] + '" class="servicespopup" data-role="button" href="#servicespopup">' + service["title"] + '</a></p>'; //Back 供应商服务title
                            str += '</div>';
                            str += '</div>';
                        });
                    });
                }
            }



        }
        str += '</ul>';
        str += '</div>';
        return str;
    }

    function Set_taptwo(length) {
        $("#tap_two").html(Get_taptwo(length));
        tap_two_popupbind();
    }

    function tap_two_popupbind() //Back 服务popup绑定事件，尝试delegate但是绑定失败
        {
            //Back 服务详细绑定数据
            $(".servicespopup").click(function() {
                var prvid = $(this).data("prvid");
                var productscode = $(this).data("productscode");
                var servicecode = $(this).data("servicecode");
                /*Back 注释模拟数据
        $.ajax({ //Back 模拟API 根据供应商id与产品code与服务code获取服务详细
            url: '../assets/provider.json',
            data: '',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                    ds_service_popup = data;
                //$("#servicespopup .servicespopup_title").text($(this).data("servicecode"));
            }
        });
            */
                $.each(providers, function(n, provider) {
                    //console.log(provider.prvId)
                    if (provider.prvId == prvid) //Back 找到id相等的供应商
                    {
                        $.each(provider.products, function(j, products) {
                            if (products.code == productscode) //Back 找到code相等的products
                            {
                                $.each(products.servicesList, function(k, services) {
                                    //console.log(services)
                                    /*Back 20150424 code为什么相同？真实数据是否相同？先采用title
                                    if (services.code == servicecode) //Back 找到services
                                    {
                                        //console.log(services);
                                        $("#servicespopup_title").text(services.title);
                                        var str = "";
                                        $.each(services.serviceInfoList, function(m, detail) {
                                            str += '<h4>' + detail["title"] + '</h4>';
                                            str += '<p>' + detail["detail"] + '</p>';
                                        });
                                        $("#servicespopup .content").html(str);
                                    }
                                    */
                                    if (services.title == servicecode) //Back 找到services
                                    {
                                        //console.log(services);
                                        $("#servicespopup_title").text(services.title);
                                        var str = "";
                                        $.each(services.serviceInfoList, function(m, detail) {
                                            str += '<h4>' + detail["title"] + '</h4>';
                                            str += '<p>' + detail["detail"] + '</p>';
                                        });
                                        $("#servicespopup .content").html(str);
                                    }

                                });
                            }
                        });
                    }
                });

                $("#servicespopup").popup("open");
                return false;
            });
        }

    function Get_tapthree(index) {
        /*Back 注释模拟数据
        var str = "";
        var ds = "";
        str += '<div class="li-control">';
        str += '<ul id="listview_tapthree" data-role="listview" data-inset="true" data-shadow="false">';
        $.ajax({ //Back 模拟API 根据供应商id获取单方报价列表
            url: '../assets/provider.json',
            data: '',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function(data) {
                ds = data;
            }
        });
        if (index != 1) //Back 如果对比大于1
        {
            var left_part_index, right_part_index;
            var equallist = new Array();
            for (var i = 0; i < ds.length; i++) {
                if (product_leftid == ds[i]["prvId"]) {
                    left_part_index = i;
                }
                if (product_rightid == ds[i]["prvId"]) {
                    right_part_index = i;
                }
            }
            $.each(ds[left_part_index]["products"], function(n, products) {
                $.each(products["gifts"], function(j, gifts) {
                    str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">'
                    str += '<div>';
                    str += '<p><a data-prvid="' + ds[left_part_index]["prvId"] + '" data-productscode="' + products["code"] + '" data-giftsindex="' + j + '" class="giftspopup" data-role="button" href="#giftspopup">' + gifts["title"] + '</a></p>'; //Back 供应商赠品title
                    str += '</div>';
                    $.each(ds[right_part_index]["products"], function(k, products_r) {
                        $.each(products_r["gifts"], function(k, gifts_r) {
                            if (gifts["title"] == gifts_r["title"]) {
                                equallist.push(gifts_r["title"]);
                                str += '<div>';
                                str += '<p><a data-prvid="' + ds[right_part_index]["prvId"] + '" data-productscode="' + products_r["code"] + '" data-giftsindex="' + k + '" class="giftspopup" data-role="button" href="#giftspopup">' + gifts_r["title"] + '</a></p>'; //Back 供应商赠品title
                                str += '</div>';
                            }
                        });
                    });
                    str += '</div>';
                });
            });
            $.each(ds[right_part_index]["products"], function(n, product_r) {
                $.each(product_r["gifts"], function(i, gifts_r) {
                    var insign = 0; //Back 多少个ecode相同标识位
                    for (var k in equallist) {
                        if (equallist[k] == gifts_r["title"]) {
                            insign++;
                        }
                    }
                    if (insign == 0) //Back 对比左边没有的险种右边继续显示
                    {
                        str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">'
                        str += '<div>';
                        str += '<p></p>';
                        str += '</div>';
                        str += '<div>';
                        str += '<p><a data-prvid="' + ds[right_part_index]["prvId"] + '" data-productscode="' + product_r["code"] + '" data-giftsindex="' + i + '" class="giftspopup" data-role="button" href="#giftspopup">' + gifts_r["title"] + '</a></p>'; //Back 供应商赠品title
                        str += '</div>';
                        str += '</div>';
                    }

                });
            });
        } else {
            for (var i = 0; i < ds.length; i++) {
                if (product_leftid == ds[i]["prvId"]) {
                    $.each(ds[i]["products"], function (j, product) {
                        $.each(product["gifts"], function (k, gifts) {
                            str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">';
                            str += '<div>';
                            str += '<p><a data-prvid="' + ds[i]["prvId"] + '" data-productscode="' + product["code"] + '" data-giftsindex="' + k + '" class="giftspopup" data-role="button" href="#giftspopup">' + gifts["title"] + '</a></p>'; //Back 供应商赠品title
                            str += '</div>';
                            str += '</div>';
                        });
                    });
                }
            }



        }
        str += '</ul>';
        str += '</div>';
        return str;
        */

        var str = "";
        str += '<div class="li-control">';
        str += '<ul id="listview_tapthree" data-role="listview" data-inset="true" data-shadow="false">';

        if (index != 1) //Back 如果对比大于1
        {
            var left_part_index, right_part_index;
            var equallist = new Array();
            for (var i = 0; i < providers.length; i++) {
                if (product_leftid == providers[i]["prvId"]) {
                    left_part_index = i;
                }
                if (product_rightid == providers[i]["prvId"]) {
                    right_part_index = i;
                }
            }
            $.each(providers[left_part_index]["products"], function(n, products) {
                //console.log(products)
                $.each(products["gifts"], function(j, gifts) {
                    str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">'
                    str += '<div>';
                    str += '<p><a data-giftsindex="' + j + '" data-prvid="' + providers[left_part_index]["prvId"] + '" data-productscode="' + products["code"] + '" data-giftscode="' + gifts["code"] + '" class="giftspopup" data-role="button" href="#giftspopup">' + (gifts["title"] ? gifts["title"] : '') + '</a></p>'; //Back 供应商服务title
                    str += '</div>';
                    $.each(providers[right_part_index]["products"], function(k, products_r) {
                        $.each(products_r["gifts"], function(k, gifts_r) {
                            if (gifts["code"] == gifts_r["code"]) {
                                equallist.push(gifts_r["code"]);
                                str += '<div>';
                                str += '<p><a data-giftsindex="' + k + '" data-prvid="' + providers[right_part_index]["prvId"] + '" data-productscode="' + products_r["code"] + '" data-giftscode="' + gifts_r["code"] + '" class="giftspopup" data-role="button" href="#giftspopup">' + (gifts_r["title"] ? gifts_r["title"] : '') + '</a></p>'; //Back 供应商服务title
                                str += '</div>';
                            }
                        });
                    });
                    str += '</div>';
                });
            });
            $.each(providers[right_part_index]["products"], function(n, product_r) {
                $.each(product_r["gifts"], function(i, gifts_r) {
                    var insign = 0; //Back 多少个ecode相同标识位
                    for (var k in equallist) {
                        if (equallist[k] == gifts_r["code"]) {
                            insign++;
                        }
                    }
                    if (insign == 0) //Back 对比左边没有的险种右边继续显示
                    {
                        str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">'
                        str += '<div>';
                        str += '<p></p>';
                        str += '</div>';
                        str += '<div>';
                        str += '<p><a data-giftsindex="' + i + '" data-prvid="' + providers[right_part_index]["prvId"] + '" data-productscode="' + product_r["code"] + '" data-giftcode="' + gifts_r["code"] + '" class="giftspopup" data-role="button" href="#giftspopup">' + (gifts_r["title"] ? gifts_r["title"] : '') + '</a></p>'; //Back 供应商服务title
                        str += '</div>';
                        str += '</div>';
                    }

                });
            });
        } else {

            for (var i = 0; i < providers.length; i++) {
                if (product_leftid == providers[i]["prvId"]) {
                    $.each(providers[i]["products"], function(j, product) {
                        $.each(product["gifts"], function(k, gift) {
                            str += '<div class="ui-body ui-body-a ui-corner-all text-center liitem">';
                            str += '<div>';
                            str += '<p><a  data-giftsindex="' + i + '" data-prvid="' + providers[i]["prvId"] + '" data-productscode="' + product["code"] + '" data-giftcode="' + gift["code"] + '" class="giftspopup" data-role="button" href="#giftspopup">' + (gift["title"] ? gift["title"] : '') + '</a></p>'; //Back 供应商服务title
                            str += '</div>';
                            str += '</div>';
                        });
                    });
                }
            }



        }
        str += '</ul>';
        str += '</div>';
        return str;

    }

    function Set_tapthree(length) {
        $("#tap_three").html(Get_tapthree(length));
        tap_three_popupbind();
    }

    function tap_three_popupbind() //Back 赠品popup绑定事件
        {
            //Back 服务详细绑定数据
            $(".giftspopup").click(function() {
                var prvid = $(this).data("prvid");
                var productscode = $(this).data("productscode");
                var giftsindex = $(this).data("giftsindex");
                /*注释模拟数据
                $.ajax({ //Back 模拟API 根据供应商id与产品code获取赠品详细
                    url: '../assets/provider.json',
                    data: '',
                    async: false,
                    type: 'get',
                    dataType: 'json',
                    success: function(data) {
                        ds = data;
                    }
                });
                */
                $.each(providers, function(n, provider) {
                    if (provider.prvId == prvid) //Back 找到id相等的供应商
                    {
                        $.each(provider.products, function(j, products) {
                            if (products.code == productscode) //Back 找到code相等的products
                            {
                                $.each(products.gifts, function(k, gifts) {
                                    if (giftsindex == k) {
                                        $("#giftspopup_title").text(gifts.title);
                                        var str = "";
                                        str += '<h4>' + gifts["title"] + '</h4>';
                                        str += '<p>' + gifts["detail"] + '</p>';
                                        $("#giftspopup .content").html(str);
                                    }
                                });
                            }
                        });
                    }
                });

                $("#giftspopup").popup("open");
                return false;
            });
        }




    $(function() {
        $(".compare_header_btn .btn").click(function() {
            $("#popSearch").popup("open");
            return false;
        });
        tap_two_popupbind();
        tap_three_popupbind();
    })
});
