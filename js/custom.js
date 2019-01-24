$(function() {
    $('.trackes').click(function(event) {
        $('.leaflet-control-layers-selector').trigger('click');
        if ($('.trackes').find('i').hasClass('flaticon-eye-closed')) {
            $('.trackes').find('i').removeClass('flaticon-eye-closed');
            $('.trackes').find('i').addClass('flaticon-eye');
        } else {
            $('.trackes').find('i').removeClass('flaticon-eye');
            $('.trackes').find('i').addClass('flaticon-eye-closed');
        }
    });

    var todayM = new Date(new Date().setHours(0, 0, 0, 0));
    var todayE = new Date(new Date().setHours(23, 59, 59, 59));

    $('#from-date').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        defaultDate: todayM
    });

    $('#to-date').datetimepicker({
        useCurrent: false,
        format: 'YYYY-MM-DD HH:mm:ss',
        defaultDate: todayE
    });

    $("#from-date").on("dp.change", function(e) {
        $('#to-date').data("DateTimePicker").minDate(e.date);
    });

    $("#to-date").on("dp.change", function(e) {
        $('#from-date').data("DateTimePicker").maxDate(e.date);
    });

    $('#search').click(function(event) {
	    var deviceIds = [];
	    $('input[type=checkbox]:checked:visible').each(function(index, el) {
	    	if ((el.id.match(/_/g) || []).length == 2) {
		        var lastslashindex = el.id.lastIndexOf('_');
		        var result= el.id.substring(lastslashindex  + 1);
		        deviceIds.push(result);
	    	}
	    });

	    var from = $('#from-date').val();
	    var to = $('#to-date').val();
	    $('#infoText').hide();
	    initPlayback();
	});

});

function initPlayback() {
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
    var playback = new L.Playback(window.map, null, onPlaybackTimeChange, playbackOptions);

    playback.setData(demoTracks);
    playback.addData(blueMountain);
    console.log(demoTracks);
    console.log(blueMountain);

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
}