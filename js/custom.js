$(function() {
    $('.trackes').click(function(event) {
        $('.leaflet-control-layers-selector').trigger('click');
        if ($('.trackes').find('i').hasClass('flaticon-eye-closed')) {
            $('.trackes').find('i').removeClass('flaticon-eye-closed');
            $('.trackes').find('i').addClass('flaticon-eye');
            $('.trackes').addClass('activeBtn');
        } else {
            $('.trackes').find('i').removeClass('flaticon-eye');
            $('.trackes').find('i').addClass('flaticon-eye-closed');
            $('.trackes').removeClass('activeBtn');
        }
    });

    $('#1x,#2x,#3x').click(function(event) {
        $('#1x,#2x,#3x').removeClass('activeBtnx');
        $("#"+event.target.id).addClass('activeBtnx');
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
        $("#export").addClass('activeBtn');
        $('#overlay').show();
        $.ajax({
            url: 'lib/history/export',
            type: 'POST',
            dataType: 'JSON',
            data: JSON.stringify(getParametres()),
            success: function(data) {
                window.dbData = data;
                exportPDF();
                $('#overlay').hide();
            },
            error: function(xhr) {
                console.log(xhr);
                $('#overlay').hide();
                $("#export").removeClass('activeBtn');
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
        url: 'lib/history/devices',
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
                        layer._marker_id = "m-"+data[i].device_id; // unique id for each marker
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
    $("#export").removeClass('activeBtn');
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
        "showCustomTime": true,
        "showCurrentTime": false
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
                    "opacity": 1
                }
            },
            bindLabel: function(featureData) {
                return featureData.name
            },
            labels: true
        },

        marker: {
            getPopup: function(featureData) {
                var data = '<table class="fsPopup" style="width:300px;">';
                data += '<tr><td colspan="3">' + featureData.name + ' [' + featureData.prop.gname + ']' + '</td></tr>';
                data += '<tr><td width="160px" class="keys">Позывной:&nbsp;</td><td colspan="2">' + featureData.name + '</td></tr>';
                data += '<tr><td width="160px" class="keys">Группа:&nbsp;</td><td colspan="2">' + featureData.prop.gname + '</td></tr>';
                data += '<tr><td width="160px" class="keys">Серийный номер:&nbsp;</td><td colspan="2">' + featureData.prop.device_key + '</td></tr>';
                /*if ('12' != 'ablsoft') data += '<tr><td width="160px" class="keys">Батарея:&nbsp;</td><td colspan="2">' + 5 + '%</td></tr>';
                data += '<tr><td width="160px" class="keys">Скорость:&nbsp;</td><td colspan="2">' + 5 + ' км/ч</td></tr>';*/
                data += '<tr><td width="160px" class="keys">Последнее обновление:&nbsp;</td><td colspan="2">' + featureData.prop.life_time + '</td></tr>';
                data += '<tr><td width="160px" class="keys">Описание:&nbsp;</td><td colspan="2">' + featureData.prop.description + '</td></tr>';
                data += '</table>';

                return data;
            }
        },
        getLabel: function(featureData) {
            return featureData.name
        },
        popups: true,
        labels: true

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