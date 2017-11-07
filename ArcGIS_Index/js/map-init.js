/**
 * Created by Administrator on 2016/12/22.
 */

var mapView={
    map:null,
    overviewMap:null,
    basemapGallery:null,
    basemapGallery_switch:false,
    overviewMap_switch:false,
    navToolbar:null,
    stroke:null,
    searchStroke:null,
    editTool:null,
    baiduLayer:null,
    tdFeatureLayer:null,
    heatMapLayer:null,
    handleLayer:null,
    annotateLayer:null,
    findResultsLayer:null,
    identifyResultsLayer:null,
    queryResultsLayer:null,
    featureLayer:null,
    dynamicLayer:null,
    wkid:4326,
    lods:[
        {"level" : 0, "resolution" : 0.010986328125, "scale" : 4617149.97766929},
        {"level" : 1, "resolution" : 0.0054931640625, "scale" : 2308574.98883465},
        {"level" : 2, "resolution" : 0.00274658203125, "scale" : 1154287.49441732},
        {"level" : 3, "resolution" : 0.001373291015625, "scale" : 577143.747208662},
        {"level" : 4, "resolution" : 0.0006866455078125, "scale" : 288571.873604331}
    ],
    buildBaseMap:function(esriBasemaps){
        //配置basemaps，相当于定义一个全局变量并为其赋值只是变量在定义是要求必须是esriBasemap下的
        //这里的esriBasemaps就相当于在Jquery闭包中定义全局变量必须是$.变量
        esriBasemaps.BaseMap = {
            //配置basemaps的图层集
            baseMapLayers : [{
                url : "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
            }],
            //配置basemaps的缩略图地址
            thumbnailUrl : "http://servername.fqdn.suffix/images/thumbnail_2014-11-25_61051.png",
            //配置basemaps的标题
            title : "背景图层"
        };
    },
    initMap:function(Map,Extent){
        var initExtent=new Extent({
            "xmin":-124.71,
            "ymin":31.89,
            "xmax":-113.97,
            "ymax":42.63,
            "spatialReference":{"wkid":mapView.wkid}
        });
        mapView.map= new Map("map-view", {
            //加载basemap
            basemap : "BaseMap",
            //basemap : "gray",
            //center : [-111.879655861, 40.571338776], // long, lat
            //lods:mapView.lods,
            extent: initExtent,
            zoom : 4,
            sliderStyle : "small",
            logo:false
        });
    },
    initOverviewMap:function(OverviewMap){
        mapView.map.on('load', function() {//地图加载时开启鹰眼
            mapView.overviewMap = new OverviewMap({//初始化鹰眼对象
                map : mapView.map,
                attachTo : "bottom-right",
                logo:false
            });
            mapView.overviewMap.startup();//开启鹰眼
            if(mapView.overviewMap_switch){
                mapView.openOverviewMap();
                mapView.overviewMap_switch=false;
            }else{
                mapView.colseOverviewMap();
                mapView.overviewMap_switch=true;
            }
        });
        mapView.map.on('basemap-change', function() {//地图加载时开启鹰眼
            mapView.overviewMap.destroy();//销毁之前创建的overviewMap
            mapView.overviewMap = new OverviewMap({//初始化鹰眼对象
                map : mapView.map,
                attachTo : "bottom-right",
                logo:false
            });
            mapView.overviewMap.startup();//开启鹰眼
            if(mapView.overviewMap_switch){//初始化开启或关闭鹰眼
                mapView.openOverviewMap();
                mapView.overviewMap_switch=false;
            }else{
                mapView.colseOverviewMap();
                mapView.overviewMap_switch=true;
            }
        });
    },
    openOverviewMap:function(){
        mapView.overviewMap.show();//展示鹰眼
    },
    colseOverviewMap:function(){
        mapView.overviewMap.hide();//隐藏鹰眼
    },
    buildHandleLayer:function(GraphicsLayer){
        mapView.handleLayer=new GraphicsLayer({id:"handleLayer"});
        mapView.map.addLayer(mapView.handleLayer);
    },
    buildAnnotateLayer:function(GraphicsLayer){
        mapView.annotateLayer=new GraphicsLayer({id:"annotateLayer"});
        mapView.map.addLayer(mapView.annotateLayer);
    },
    addPointOnMap:function(point,SimpleMarkerSymbol,attributes,InfoTemplate,Graphic){//地图初始化时加载点
        var simpleMarkerSymbol = new SimpleMarkerSymbol();//点的显示样式
        var infoTemplate = new InfoTemplate("数据表", "${*}");
        var graphic = new Graphic(point,simpleMarkerSymbol,attributes,infoTemplate);//创建Graphic对象
        mapView.map.on('load', function() {//地图初始化是加载点到操作图层或者map自带的graphic图层
            mapView.handleLayer.add(graphic);
            //mapView.map.graphics.add(graphic);
        });
    },
    addLineOnMap:function(line,SimpleLineSymbol,attributes,InfoTemplate,Graphic){//地图初始化时加载线
        var simpleLineSymbol = new SimpleLineSymbol();//线的显示样式
        var infoTemplate = new InfoTemplate("数据表", "${*}");
        var graphic = new Graphic(line,simpleLineSymbol,attributes,infoTemplate);//创建Graphic对象
        mapView.map.on('load', function() {//地图初始化是加载点到操作图层或者map自带的graphic图层
            mapView.handleLayer.add(graphic);
            //mapView.map.graphics.add(graphic);
        });
    },
    addPolygonOnMap:function(line,SimpleFillSymbol,attributes,InfoTemplate,Graphic){//地图初始化时加载面
        var simpleFillSymbol = new SimpleFillSymbol();//面的显示样式
        var infoTemplate = new InfoTemplate("数据表", "${*}");
        var graphic = new Graphic(line,simpleFillSymbol,attributes,infoTemplate);//创建Graphic对象
        mapView.map.on('load', function() {//地图初始化是加载点到操作图层或者map自带的graphic图层
            mapView.handleLayer.add(graphic);
            //mapView.map.graphics.add(graphic);
        });
    },
    addTextOnMap:function(point,TextSymbol,attributes,InfoTemplate,Graphic){//地图初始化时加载点
        var textSym = new TextSymbol("Hello World");//点的显示样式
        var infoTemplate = new InfoTemplate("数据表", "${*}");
        var graphic = new Graphic(point,textSym,attributes,infoTemplate);//创建Graphic对象
        mapView.map.on('load', function() {//地图初始化是加载点到操作图层或者map自带的graphic图层
            mapView.annotateLayer.add(graphic);
            //mapView.map.graphics.add(graphic);
        });
    },
    initToolBar:function(Navigation,BasemapGallery){//初始化工具栏
        mapView.initBasemapGallery(BasemapGallery);//初始化底图切换工具
        if(mapView.basemapGallery_switch){//设置底图切换工具默认是否显示
            if($('.map-basemapGallery').hasClass('basemapGallery-active')){//显示底图切换工具
                $('.map-basemapGallery').removeClass('basemapGallery-active');
            }
            mapView.basemapGallery_switch=false;
        }else{//不显示底图切换工具
            if(!$('.map-basemapGallery').hasClass('basemapGallery-active')){
                $('.map-basemapGallery').addClass('basemapGallery-active');
            }
            mapView.basemapGallery_switch=true;
        }
        mapView.map.on('load', function() {
            mapView.navToolbar=new Navigation(mapView.map);//地图初始化时创建小工具Navigation对象
            $('.map-toolbar span').click(function(){//开启工具栏工具
                var name=$(this).attr("data-name");
                switch (name) {
                    case 'basemapGallery'://开启关闭底图切换工具
                        if(mapView.basemapGallery_switch){
                            if($('.map-basemapGallery').hasClass('basemapGallery-active')){
                                $('.map-basemapGallery').removeClass('basemapGallery-active');
                            }
                            mapView.basemapGallery_switch=false;
                        }else{
                            if(!$('.map-basemapGallery').hasClass('basemapGallery-active')){
                                $('.map-basemapGallery').addClass('basemapGallery-active');
                            }
                            mapView.basemapGallery_switch=true;
                        }
                        break;
                    case 'zoomfull'://开启全图工具
                        mapView.navToolbar.zoomToFullExtent();
                        break;
                    case 'pan'://开启漫游工具
                        mapView.map.enablePan();
                        mapView.navToolbar.activate(Navigation.PAN);
                        break;
                    case 'overview'://开启关闭鹰眼工具
                        if(mapView.overviewMap_switch){
                            mapView.openOverviewMap();
                            mapView.overviewMap_switch=false;
                        }else{
                            mapView.colseOverviewMap();
                            mapView.overviewMap_switch=true;
                        }
                        break;
                    case 'zoomprev'://开启前一视图工具
                        mapView.navToolbar.zoomToPrevExtent();
                        break;
                    case 'zoomnext'://开启下一视图工具
                        mapView.navToolbar.zoomToNextExtent();
                        break;
                    case 'zoomin'://开启框选放大工具
                        mapView.navToolbar.activate(Navigation.ZOOM_IN);
                        break;
                    case 'zoomout'://开启框选缩小工具
                        mapView.navToolbar.activate(Navigation.ZOOM_OUT);
                        break;
                    case 'xysearch'://开启坐标查询小工具
                        layer.open({
                            type: 1,
                            title: '坐标查询',
                            shadeClose: true,
                            skin: 'layui-layer-rim',
                            area: ['500px', '240px'],
                            content:$('#map-xysearch')
                        });
                        break;
                    case 'toolbox'://开启工具箱
                        layer.open({
                            type: 1,
                            title: '工具箱',
                            shadeClose: true,
                            skin: 'layui-layer-rim',
                            area: ['135px', '500px'],
                            content:$('#map-toolbox')
                        });
                        $('body div[times]').removeClass("layui-layer-shade");
                        $('.layui-layer-page').css({
                            left:0,
                            top:'100px'
                        });
                        break;
                    case 'extend'://ArcGIS扩展功能
                        layer.open({
                            type: 1,
                            title: '扩展功能',
                            shadeClose: true,
                            skin: 'layui-layer-rim',
                            area: ['135px', '200px'],
                            content:$('#map-extendbox')
                        });
                        $('body div[times]').removeClass("layui-layer-shade");
                        $('.layui-layer-page').css({
                            left:0,
                            top:'100px'
                        });
                        break;
                    case 'search'://查询面板
                        layer.open({
                            type: 1,
                            title: '查询',
                            shadeClose: true,
                            skin: 'layui-layer-rim',
                            area: ['135px', '500px'],
                            content:$('#map-searchbox')
                        });
                        $('body div[times]').removeClass("layui-layer-shade");
                        $('.layui-layer-page').css({
                            left:0,
                            top:'100px'
                        });
                        break;
                    case 'layers'://查询面板
                        var ids=mapView.map.layerIds;
                        var ids1=mapView.map.basemapLayerIds;
                        var ids2=mapView.map.graphicsLayerIds;
                         alert(JSON.stringify(mapView.map.getLayer(ids[1])));
                        break;
                }
            });
        });
    },
    XYSearch:function(Point,PictureMarkerSymbol,Graphic){//坐标查询
        $('#search').click(function(){
            var X= $('#X').val().replace(/(^\s*)|(\s*$)/g,"");
            var Y= $('#Y').val().replace(/(^\s*)|(\s*$)/g,"");
            if(X!=null&&Y!=null&&typeof(X)!='undefined'&&typeof(Y)!='undefined'&&X!=''&&Y!=''){
                if(!isNaN(X)){
                    var point=new Point({"x": X, "y": Y, "spatialReference": {"wkid":mapView.wkid } });
                    var pictureMarkerSymbol = new PictureMarkerSymbol('image/position.jpg', 51, 51);
                    var graphic = new Graphic(point,pictureMarkerSymbol);//创建Graphic对象
                    mapView.map.centerAt(point);
                    mapView.map.graphics.add(graphic);
                    $('#X').val("");
                    $('#Y').val("");
                    layer.closeAll("page");
                }else{
                    layer.alert("不是正确的坐标！",{
                        icon: 2
                    });
                }
            }else{
                layer.alert('没有输入坐标！',{
                    icon: 2
                });
            }
        });
        $('#trash').click(function(){
            mapView.map.graphics.clear();
            $('#X').val("");
            $('#Y').val("");
        });
    },
    initBasemapGallery:function(BasemapGallery) {//初始化底图切换工具
        mapView.basemapGallery = new BasemapGallery({
            showArcGISBasemaps: true,
            map: mapView.map
        }, "basemapGallery");
        mapView.basemapGallery.startup();

        mapView.basemapGallery.on("error", function(msg) {
            console.log("basemap gallery error:  ", msg);
        });
    },
    initToolBox:function(Draw,Edit,SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol,Graphic) {//初始化工具箱
        mapView.map.on('load', function() {
            mapView.stroke = new Draw(mapView.map,{showToolTips:true});//得到画笔对象
            mapView.editTool = new Edit(mapView.map);//得到画笔对象
            $('.map-toolbox span').click(function(){//激活画笔状态即设置画笔画图符号
                var strokeStyle=$(this).attr("data-name").toUpperCase().replace(/(^\s*)|(\s*$)/g,"");
                switch (strokeStyle) {
                    case "CLEAR":
                        mapView.handleLayer.clear();
                        break;
                    case "EDIT":
                        mapView.map.hideZoomSlider();
                        mapView.handleLayer.on("click", function(evt) {
                            mapView.editTool.activate(Edit.EDIT_TEXT|Edit.EDIT_VERTICES|Edit.MOVE|Edit.ROTATE|Edit.SCALE, evt.graphic);
                        });
                        break;
                    case "SAVE":
                        mapView.editTool.deactivate();
                        mapView.map.showZoomSlider();
                        break;
                    default:
                        mapView.stroke.activate(Draw[strokeStyle]);
                        mapView.map.hideZoomSlider();
                        break;
                }
            });
            mapView.stroke.on("draw-end", function (evt) {//画完地图渲染
                mapView.stroke.deactivate();
                mapView.map.showZoomSlider();
                var symbol=null;
                switch (evt.geometry.type) {
                    case "point":
                    case "multipoint":
                        symbol = new SimpleMarkerSymbol();
                        break;
                    case "polyline":
                        symbol = new SimpleLineSymbol();
                        break;
                    default:
                        symbol = new SimpleFillSymbol();
                        break;
                }
                var graphic = new Graphic(evt.geometry, symbol);
                mapView.handleLayer.add(graphic);
            });
        });
    },
    extendModules:function (Point,BaiduLayer,TDFeatureLayer,HeatMapLayer,CustomInfoWindow,domConstruct,DD3Layer) {//扩展功能
        $('.map-extendbox span').click(function(){
            var moduleName=$(this).attr("data-name").replace(/(^\s*)|(\s*$)/g,"");
            switch (moduleName) {
                case "baidu"://加载百度地图
                    mapView.baiduLayer=new BaiduLayer();
                    mapView.map.addLayer(mapView.baiduLayer);
                    break;
                case "window"://绘制定制窗口
                    var infoWindow = new CustomInfoWindow({
                        domNode: domConstruct.create('div', null, document.getElementById('map-view'))
                    });
                    infoWindow.setMap(mapView.map);
                    infoWindow.align = "Center";
                    var radius =95 ;
                    var point=new Point({"x": -120.65, "y": 46.53, "spatialReference": {"wkid":mapView.wkid } });
                    var styleStr = "width:" + radius + "px;height:" + radius + "px";
                    var customDiv = domConstruct.create("div", { id: 'customDiv', style: styleStr }, document.getElementById('map-view'));
                    infoWindow.setContent(customDiv);
                    infoWindow.__mcoords = point;
                    infoWindow.show(mapView.map.toScreen(point));
                    break;
                case "3D"://加载3D图层
                     mapView.tdFeatureLayer = new TDFeatureLayer('http://maps.ci.charlotte.nc.us/ArcGIS/rest/services/SS/UptownBuildings/MapServer/0', {
                         'heightAttribute': 'hgt'
                     });
                     mapView.map.addLayer(mapView.tdFeatureLayer);
                    break;
                case "D3":
                    break;
                default:
                    break;
            }
        });
    },
    initSearchPanel:function (Draw,ArcGISDynamicMapServiceLayer,FeatureLayer,SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol,GraphicsLayer,Graphic,FindParameters,FindTask,IdentifyParameters,IdentifyTask,Query,QueryTask,SimpleRenderer,geometryEngine,InfoTemplate,Color) {//初始化查询面板
        mapView.dynamicLayer =new ArcGISDynamicMapServiceLayer("https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer",{
            opacity:1.0,
            id:"handleLayer"
        });
        mapView.map.addLayer(mapView.dynamicLayer);//显示查询图层信息

       /* var infoTemplate = new InfoTemplate("数据表", "${*}");
        mapView.featureLayer = new FeatureLayer("https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/5",{
            id:'search_featureLayer',
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: infoTemplate,
            outFields: ["*"]
        });
        var defaultSymbol = new SimpleFillSymbol().setStyle(SimpleFillSymbol.STYLE_NULL);
        var renderer = new SimpleRenderer(defaultSymbol);
        mapView.featureLayer.setRenderer(renderer);
        mapView.map.addLayer(mapView.featureLayer);*/

        mapView.findResultsLayer=new GraphicsLayer({id:"findResultsLayer"});
        mapView.map.addLayer(mapView.findResultsLayer);//FindTask结果显示图层
        mapView.identifyResultsLayer=new GraphicsLayer({id:"identifyResultsLayer"});
        mapView.map.addLayer(mapView.identifyResultsLayer);//IdentifyTask结果显示图层
        mapView.queryResultsLayer=new GraphicsLayer({id:"queryResultsLayer"});
        mapView.map.addLayer(mapView.queryResultsLayer);//QueryTask结果显示图层

        mapView.searchStroke = new Draw(mapView.map);//得到画笔对象
        $('.map-searchbox span').click(function(){
            var searchName=$(this).attr("data-name").toUpperCase().replace(/(^\s*)|(\s*$)/g,"");
            switch (searchName) {
                case "ATTRIBUTE_SEARCH"://FindTask属性查询
                    layer.open({
                        type: 1,
                        title: '属性查询',
                        shadeClose: true,
                        skin: 'layui-layer-rim',
                        area: ['500px', '200px'],
                        content:$('#map-searchpanel')
                    });
                    $('body div[times]').removeClass("layui-layer-shade");
                    break;
                case "SPATIAL_SEARCH"://IdentifyTask空空间查询
                    var pointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,255,0, 0.3]), 10), new Color([0,255,0,1]));
                    var buffSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color([255,128,0,1]), 3), new Color([255,128,0,0.15]));

                    var identifyParameters=new IdentifyParameters();
                    identifyParameters.tolerance = 10;//容差范围
                    identifyParameters.returnGeometry = true;//是否返回图形
                    identifyParameters.layerIds = [0,1,2,3,4,5];//查询图层
                    identifyParameters.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;//设置查询的图层
                    identifyParameters.width = mapView.map.width; //查询范围
                    identifyParameters.height = mapView.map.height; //查询范围
                    var identifyTask=new IdentifyTask("https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer");
                    mapView.map.on("click",function (event){
                        mapView.identifyResultsLayer.clear();
                        var point = event.mapPoint;
                        var ptGraphic = new Graphic(point, pointSymbol);
                        var buffer = geometryEngine.geodesicBuffer(point, 10, "miles");
                        var bufferGraphic = new Graphic(buffer, buffSymbol);
                        mapView.identifyResultsLayer.add(ptGraphic);
                        mapView.identifyResultsLayer.add(bufferGraphic);

                        identifyParameters.geometry = event.mapPoint;
                        identifyParameters.mapExtent = mapView.map.extent;
                        identifyTask.execute(identifyParameters,function(identifyResults){
                            mapView.identifyResultsLayer.setInfoTemplate(new InfoTemplate("${NAME}","${*}"));
                            var symbol= new SimpleFillSymbol().setColor([150,150,150,0.5]);
                            for(var i=0;i<identifyResults.length;i++){
                                var identifyResult=identifyResults[i];
                                mapView.identifyResultsLayer.add(identifyResult.feature.setSymbol(symbol));
                            }
                        },function(error){
                            alert(error);
                        });
                    });
                    break;
                case "ATTRIBUTE_QUERY_SEARCH"://QueryTask属性查询
                    layer.open({
                        type: 1,
                        title: '属性查询',
                        shadeClose: true,
                        skin: 'layui-layer-rim',
                        area: ['500px', '200px'],
                        content:$('#map-searchpanel1')
                    });
                    $('body div[times]').removeClass("layui-layer-shade");
                    break;
                case "SPATIAL_QUERY_SEARCH"://QueryTask空空间查询
                    var pointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,255,0, 0.3]), 10), new Color([0,255,0,1]));
                    var buffSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT, new Color([255,128,0,1]), 3), new Color([255,128,0,0.15]));

                    var queryParams = new Query();
                    queryParams.distance = 10;  // Return all block groups within one mile of the point
                    queryParams.units = "miles";
                    queryParams.outFields = ["*"];
                    queryParams.returnGeometry = true;

                    var queryTask = new QueryTask("https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/5");
                    mapView.map.on("click",function (event){
                        mapView.queryResultsLayer.clear();
                        var point = event.mapPoint;
                        var ptGraphic = new Graphic(point, pointSymbol);
                        var buffer = geometryEngine.geodesicBuffer(point, 10, "miles");
                        var bufferGraphic = new Graphic(buffer, buffSymbol);
                        mapView.queryResultsLayer.add(ptGraphic);
                        mapView.queryResultsLayer.add(bufferGraphic);

                        queryParams.geometry = event.mapPoint;
                        queryTask.execute(queryParams, function(featureSet){
                            mapView.queryResultsLayer.setInfoTemplate(new InfoTemplate("${NAME}","${*}"));
                            var symbol= new SimpleFillSymbol().setColor([150,150,150,0.5]);
                            for(var i=0;i<(featureSet.features).length;i++){
                                var feature=(featureSet.features)[i];
                                mapView.queryResultsLayer.add(feature.setSymbol(symbol));
                            }
                        });
                    });
                    break;
                default:
                    mapView.searchStroke.activate(Draw[searchName]);//通过绘制图形查询
                    mapView.map.hideZoomSlider();
                    break;
            }
        });
        mapView.map.on('load',function(){
           /* esri.config.defaults.io.proxyUrl= "http://localhost/proxy.ashx";//设置代理
            esri.config.defaults.io.alwaysUseProxy= false;*/

            var identifyParameters=new IdentifyParameters();
            identifyParameters.tolerance = 10;//容差范围
            identifyParameters.returnGeometry = true;//是否返回图形
            identifyParameters.layerIds = [5];//查询图层
            identifyParameters.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;//设置查询的图层
            identifyParameters.width = mapView.map.width; //查询范围
            identifyParameters.height = mapView.map.height; //查询范围
            identifyParameters.mapExtent = mapView.map.extent;
            var identifyTask=new IdentifyTask("https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer");
            mapView.searchStroke.on("draw-end", function (evt) {//画完地图渲染
                mapView.identifyResultsLayer.clear();
                mapView.searchStroke.deactivate();
                mapView.map.showZoomSlider();
                var symbol=null;
                switch (evt.geometry.type) {
                    case "point":
                    case "multipoint":
                        symbol = new SimpleMarkerSymbol();
                        break;
                    case "polyline":
                        symbol = new SimpleLineSymbol();
                        break;
                    default:
                        symbol = new SimpleFillSymbol();
                        break;
                }
                var graphic = new Graphic(evt.geometry, symbol);
                mapView.identifyResultsLayer.add(graphic);

                identifyParameters.geometry = evt.geometry;
                identifyTask.execute(identifyParameters,function(identifyResults){
                    mapView.identifyResultsLayer.setInfoTemplate(new InfoTemplate("${NAME}","${*}"));
                    var symbol= new SimpleFillSymbol().setColor([150,150,150,0.5]);
                    for(var i=0;i<identifyResults.length;i++){
                        var identifyResult=identifyResults[i];
                        mapView.identifyResultsLayer.add(identifyResult.feature.setSymbol(symbol));
                    }
                },function(error){
                    alert(error);
                });

            });
        });

        $('#panel_search').click(function(){
            var stateName= $('#stateName').val().replace(/(^\s*)|(\s*$)/g,"");
            if(stateName!=null&&typeof(stateName)!='undefined'){
                mapView.findResultsLayer.clear();
                var find = new FindTask("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/");
                var params = new FindParameters();
                params.layerIds = [2];
                params.returnGeometry = true;
                params.searchFields = ["STATE_NAME","STATE_FIPS"];
                params.searchText =stateName;
                find.execute(params, function(findResults){
                    mapView.findResultsLayer.setInfoTemplate(new InfoTemplate("${STATE_NAME}","${*}"));
                    var symbol= new SimpleFillSymbol().setColor([150,150,150,0.5]);
                    for(var i=0;i<findResults.length;i++){
                        var findResult=findResults[i];
                        mapView.findResultsLayer.add(findResult.feature.setSymbol(symbol));
                    }
                });
            }
        });
        $('#panel_trash').click(function(){
            mapView.findResultsLayer.clear();
            $('#stateName').val("");
        });
        $('#panel_search1').click(function(){
            var stateName= $('#stateName1').val().replace(/(^\s*)|(\s*$)/g,"");
            if(stateName!=null&&typeof(stateName)!='undefined'){
                var queryTask = new QueryTask("https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/5");
                var query = new Query();
                query.where = "STATE_NAME   ='"+stateName+"'";
                query.outSpatialReference = {wkid:mapView.wkid};
                query.returnGeometry = true;
                query.outFields = ["*"];
                queryTask.execute(query, function(featureSet){
                    mapView.queryResultsLayer.clear();
                    mapView.queryResultsLayer.setInfoTemplate(new InfoTemplate("${NAME}","${*}"));
                    var symbol= new SimpleFillSymbol().setColor([150,150,150,0.5]);
                    for(var i=0;i<(featureSet.features).length;i++){
                        var feature=(featureSet.features)[i];
                        mapView.queryResultsLayer.add(feature.setSymbol(symbol));
                    }
                });
                queryTask.executeForCount(query,function(count){
                   // alert(count);
                });
            }
        });
        $('#panel_trash1').click(function(){
            mapView.queryResultsLayer.clear();
            $('#stateName').val("");
        });
    }
}


require([
        "esri/basemaps",
        "esri/map",
        "esri/SpatialReference",
        "esri/geometry/Extent",
        "esri/dijit/OverviewMap",
        "esri/layers/GraphicsLayer",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esrix/baidu/BaiduLayer",
        "esrix/3D/TDFeatureLayer",
        "esrix/heatmap/HeatMapLayer",
        "esrix/D3/D3Layer",
        "esrix/custom/CustomInfoWindow",
        "esri/geometry/Point",
        "esri/geometry/Multipoint",
        "esri/geometry/Polyline",
        "esri/geometry/Polygon",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/TextSymbol",
        "esri/graphic",
        "esri/InfoTemplate",
        "esri/tasks/FindParameters",
        "esri/tasks/FindTask",
        "esri/tasks/IdentifyParameters",
        "esri/tasks/IdentifyTask",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "esri/renderers/SimpleRenderer",
        "esri/geometry/geometryEngine",
        "esri/toolbars/navigation",
        "esri/toolbars/draw",
        "esri/toolbars/edit",
        "esri/dijit/BasemapGallery",
        "esri/Color",
        "esri/symbols/Font",
        "dojo/dom-construct",
        "dojo/parser",
        "dojo/domReady!"
    ],
    function(
        esriBasemaps,
        Map,
        SpatialReference,
        Extent,
        OverviewMap,
        GraphicsLayer,
        ArcGISDynamicMapServiceLayer,
        FeatureLayer,
        BaiduLayer,
        TDFeatureLayer,
        HeatMapLayer,
        D3Layer,
        CustomInfoWindow,
        Point,
        Multipoint,
        Polyline,
        Polygon,
        SimpleMarkerSymbol,
        PictureMarkerSymbol,
        SimpleLineSymbol,
        SimpleFillSymbol,
        TextSymbol,
        Graphic,
        InfoTemplate,
        FindParameters,
        FindTask,
        IdentifyParameters,
        IdentifyTask,
        Query,
        QueryTask,
        SimpleRenderer,
        geometryEngine,
        Navigation,
        Draw,
        Edit,
        BasemapGallery,
        Color,
        Font,
        domConstruct,
        parser
    ) {
        parser.parse();
        mapView.buildBaseMap(esriBasemaps);
        mapView.initMap(Map,Extent);
        mapView.initOverviewMap(OverviewMap);
        mapView.buildHandleLayer(GraphicsLayer);
        mapView.buildAnnotateLayer(GraphicsLayer);

        var point=new Point({"x": -122.65, "y": 45.53, "spatialReference": {"wkid":mapView.wkid } });
        mapView.addPointOnMap(point,SimpleMarkerSymbol,{'name':'赵德华','age':12},InfoTemplate,Graphic);
        var multipoint = new Multipoint({"points":[[ -122.65,45.53],[-122.56,45.51],[-122.56,45.55]],"spatialReference":{"wkid":mapView.wkid}});
        mapView.addPointOnMap(multipoint,SimpleMarkerSymbol,{'name':'赵德华','age':12},InfoTemplate,Graphic);
        var line = new Polyline({"paths":[[[-122.68,45.53], [-122.58,45.55],[-122.57,45.58],[-122.53,45.6]]],"spatialReference":{"wkid":mapView.wkid}});
        mapView.addLineOnMap(line,SimpleLineSymbol,{'name':'赵德华','age':12},InfoTemplate,Graphic);
        var polygon = new Polygon({"rings":[[[-122.63,45.52],[-122.57,45.53],[-122.52,45.50],[-122.49,45.48],[-122.64,45.49],[-122.63,45.52],[-122.63,45.52]]],"spatialReference":{"wkid":mapView.wkid}});
        mapView.addPolygonOnMap(polygon,SimpleFillSymbol,{'name':'赵德华','age':12},InfoTemplate,Graphic);
        var point=new Point({"x": -120.65, "y": 46.53, "spatialReference": {"wkid":mapView.wkid } });
        mapView.addTextOnMap(point,TextSymbol,{'name':'赵德华','age':12},InfoTemplate,Graphic);
        mapView.initToolBar(Navigation,BasemapGallery);
        mapView.XYSearch(Point,PictureMarkerSymbol,Graphic);
        mapView.initToolBox(Draw,Edit,SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol,Graphic);
        mapView.extendModules(Point,BaiduLayer,TDFeatureLayer,HeatMapLayer,CustomInfoWindow,domConstruct,D3Layer);
        mapView.initSearchPanel(Draw,ArcGISDynamicMapServiceLayer,FeatureLayer,SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol,GraphicsLayer,Graphic,FindParameters,FindTask,IdentifyParameters,IdentifyTask,Query,QueryTask,SimpleRenderer,geometryEngine,InfoTemplate,Color);
    });


