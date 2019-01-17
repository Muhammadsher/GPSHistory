$(function() {
    // Get start/end times
    var startTime = new Date(demoTracks[0].properties.time[0]);
    var endTime = new Date(demoTracks[0].properties.time[demoTracks[0].properties.time.length - 1]);

    // Create a DataSet with data
    var timelineData = new vis.DataSet([{ start: startTime, end: endTime, content: 'Demo GPS Tracks' }]);

    // Set timeline options
    var timelineOptions = {
        "width": "100%",
        "height": "130px",
        "style": "box",
        "axisOnTop": true,
        "showCustomTime": true
    };

    // Setup timeline
    var timeline = new vis.Timeline(document.getElementById('visualization'), timelineData, timelineOptions);

    // Set custom time marker (blue)
    timeline.setCustomTime(startTime);

    // Setup leaflet map
    var map, fsconfig, defView = [39.6724, 66.9555],
        defZoom = 13,
        defBounds = [
            [39.80036, 67.28508],
            [39.54429, 66.62590]
        ];

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
        }
    });

    // =====================================================
    // =============== Playback ============================
    // =====================================================

    // Playback options
    var playbackOptions = {

        playControl: true,
        //dateControl: true,

        // layer and marker options
        layer: {
            pointToLayer: function(featureData, latlng) {
                var result = {};

                if (featureData && featureData.properties && featureData.properties.path_options) {
                    result = featureData.properties.path_options;
                }

                if (!result.radius) {
                    result.radius = 5;
                }

                return new L.CircleMarker(latlng, result);
            }
        },

        marker: {
            getPopup: function(featureData) {
                var result = '';

                if (featureData && featureData.properties && featureData.properties.title) {
                    result = featureData.properties.title;
                }

                return result;
            }
        }

    };

    // Initialize playback
    var playback = new L.Playback(map, null, onPlaybackTimeChange, playbackOptions);

    playback.setData(demoTracks);
    playback.addData(blueMountain);

    // Uncomment to test data reset;
    //playback.setData(blueMountain);    

    // Set timeline time change event, so cursor is set after moving custom time (blue)
    timeline.on('timechange', onCustomTimeChange);

    // A callback so timeline is set after changing playback time
    function onPlaybackTimeChange(ms) {
        timeline.setCustomTime(new Date(ms));
    };

    // 
    function onCustomTimeChange(properties) {
        if (!playback.isPlaying()) {
            playback.setCursor(properties.time.getTime());
        }
    }

    $('.trackes').click(function(event) {
        $('.leaflet-control-layers-selector').trigger('click');
        if ($('.trackes').html() == 'GPS Tracks - hide') {
            $('.trackes').html('GPS Tracks - show');
        }else{
            $('.trackes').html('GPS Tracks - hide');
        }
    });
});