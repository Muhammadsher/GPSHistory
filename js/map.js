/*$(document).ready(function() {
        
    var map, fsconfig, defView = [39.6724, 66.9555],
        defZoom = 13,
        defBounds = [[39.80036, 67.28508], [39.54429, 66.62590]];

    map = L.map('map').setView(defView, defZoom).setMaxBounds(defBounds);

    fsconfig = {
        minZoom: defZoom,
        maxZoom: 18,
        attribution: '<span id="debug_url"></span> &copy; ABL-Soft&SS 2014-' + new Date().getFullYear()
    }

    //var osm = L.tileLayer('http://101.32.0.254/osm_tiles/{z}/{x}/{y}.png', fsconfig);
    //var sat = L.tileLayer('http://101.32.0.254/sat_tiles/{z}/{x}/{y}.png', fsconfig);
    var osm = L.tileLayer('http://192.168.1.252/osm_tiles/{z}/{x}/{y}.png', fsconfig);
    var sat = L.tileLayer('http://192.168.1.252/sat_tiles/{z}/{x}/{y}.png', fsconfig);
    map.addLayer(osm);

    map.on("dblclick", function(e) {
        if (e.target.getZoom() === 18) {
            /*window.iframe = F.Dialog.Show(F.Frame("./extra/fm/index.php#lat="+e.latlng.lat+"&lng="+e.latlng.lng, {width: 1098, height: 714}), "Сводка", {
                resizable: false,
                width: 1100,
                height: 768,
                draggable: false,
                modal: true
            }, true);*/
        //}
    //});
//});
//*/