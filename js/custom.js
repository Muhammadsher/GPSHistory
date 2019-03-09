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

        $('#overlay').show();

        if (window.playback && window.playback.isPlaying()) {
            // before requesting new data stop running trackers 
            $("#play-controller").trigger('click');
        }

        getDbData(getParametres());

    });

    $("#export").click(function(event) {
        $('#overlay').show();
        $.ajax({
            url: 'http://192.168.1.249/api/gh/history/export',
            type: 'POST',
            dataType: 'JSON',
            data: JSON.stringify(getParametres()),
            success: function(data) {
                console.log(data);
                window.dbData = data;
                exportPDF();
                $('#overlay').hide();
            },
            error: function(xhr) {
                console.log(xhr);
                $('#overlay').hide();
            }
        });

    });

});

function getSelectedDevices() {
    var deviceIds = [];
    $('input[type=checkbox]:checked').each(function(index, el) {
        if ((el.id.match(/_/g) || []).length == 2) {
            var lastslashindex = el.id.lastIndexOf('_');
            var result = el.id.substring(lastslashindex + 1);
            deviceIds.push(result);
        }
    });
    return deviceIds;
}

function getParametres() {
    var deviceIds = getSelectedDevices();

    var from = $('#from-date').val();
    var to = $('#to-date').val();

    var json = {
        date: {
            start: from,
            end: to
        },
        devices: deviceIds
    }

    return json;
}

function getDbData(json) {
    $.ajax({
        url: 'http://192.168.1.249/api/gh/history/devices',
        type: 'POST',
        dataType: 'JSON',
        data: JSON.stringify(json),
        success: function(data) {
            if (data.length > 0) {
                $('#infoText').hide();
                if (window.playback == undefined) {
                    initPlayback(data, json.date.start, json.date.end);
                } else {
                    window.playback.setData(data);
                }

                var i = 0;
                window.map.eachLayer(function(layer) {
                    if (layer._icon) {
                        layer.setIcon(L.AwesomeMarkers.icon({
                            prefix: "flaticon",
                            icon: data[i].device_icon.icon_name,
                            iconColor: data[i].device_icon.icon_color,
                            markerColor: data[i].device_icon.marker_color
                        }));
                        i++;
                    }
                });

            } else {
                $('#infoText').html("Ma'lumot yo'q");
                $('#infoText').show();
                setTimeout(function() {
                    $('#infoText').html("Timeline");
                }, 5000);
            }
            $('#overlay').hide();
        },
        error: function(xhr) {
            console.log(xhr);
            $('#overlay').show();
        }
    });

}

function exportPDF() {
    var name = $("#from-date").val().substring(0, 10) + ' ' + $("#to-date").val().substring(0, 10);
    var funcStr = 'header-footer';
    var doc = PDF[funcStr]();

    doc.setProperties({
        title: 'Ҳисобот'
    });
    doc.save(name);
}


function initPlayback(data, from, to) {
    // Get start/end times
    var startTime = new Date(from);
    var endTime = new Date(to);

    // Create a DataSet with data
    var timelineData = new vis.DataSet([{ start: startTime, end: endTime, content: 'UzTracking' }]);

    // Set timeline options
    var timelineOptions = {
        "width": "100%",
        "height": "130px",
        "style": "box",
        "axisOnTop": true,
        "showCustomTime": true
    };

    var timeline;

    if ($('#visualization div').hasClass("timeline")) {
        $('#visualization').empty();
    }

    // Setup timeline
    timeline = new vis.Timeline(document.getElementById('visualization'), timelineData, timelineOptions);

    // Set custom time marker (blue)
    timeline.setCustomTime(startTime);


    // =====================================================
    // =============== Playback ============================
    // =====================================================

    /*var greenIcon = L.icon({
        iconUrl: 'images/markers-2x.png',
        shadowUrl: 'images/markers-2x.png',

        iconSize:     [38, 95], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });*/

    // Playback options
    var playbackOptions = {

        playControl: true,
        //dateControl: true,

        // layer and marker options
        layer: {
            pointToLayer: function(featureData, latlng) {
                var result = {};
                if (featureData && featureData.properties && featureData.properties.path_option) {
                    result = featureData.properties.path_option;
                }

                if (!result.radius) {
                    result.radius = 5;
                }

                return new L.CircleMarker(latlng, result);
            },
            style: function(featureData) {
                return {
                    "color": featureData.properties.path_option.color,
                    "opacity": 1,
                }
            }
        },

        marker: {
            getPopup: function(featureData) {
                var result = '';
                if (featureData && featureData.properties && featureData.name) {
                    result = featureData.name;
                }

                return result;
            }
        },
        popups: true

    };

    // Initialize playback
    var playback = new L.Playback(window.map, null, onPlaybackTimeChange, playbackOptions);

    playback.setData(data);

    window.playback = playback;

    //playback.addData(blueMountain);
    /*console.log(demoTracks);
    console.log(blueMountain);*/


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