$(function() {
    initMap();
    initAccordion();
});

function initAccordion() {
    $.ajax({
        url: 'http://192.168.1.249/api/gh/history/devices',
        type: 'GET',
        dataType: 'JSON',
        success: function(data) {
            var accordion_table = "";
            var header = "";
            var counter = 0;
            for (var i = 0; i < data.length; i++) {
                accordion_table += "<td><label class='containerChBox'><input type='checkbox' id='ch_" + data[i].gid + "_" + data[i].uid + "'><span class='checkmark'></span></label></td>";
                accordion_table += "<td>" + data[i].display_name + "</td>";
                accordion_table += "<td>" + data[i].limit_speed + "</td>";
                accordion_table += "<td  onclick='changeZoom("+data[i].uid+")'><i class='flaticon flaticon-eye'></i></td></tr>";

                if (data.length - 1 == i) {
                    header = getAccardionHeader(data[i].gid, data[i].gname);
                    header += accordion_table + "</tbody></table>";
                    $('#accordion').append(header);
                    $('.' + data[i].gid).html($(".tb_" + data[i].gname + " tr").length);
                    $(".tb_" + data[i].gname + " tr:odd").addClass('odd_table');
                    accordion_table = "";
                } else if (data[i].gid != data[i + 1].gid) {
                    header = getAccardionHeader(data[i].gid, data[i].gname);
                    header += accordion_table + "</tbody></table>";
                    $('#accordion').append(header);
                    $('.' + data[i].gid).html($(".tb_" + data[i].gname + " tr").length);
                    $(".tb_" + data[i].gname + " tr:odd").addClass('odd_table');
                    accordion_table = "";
                }

            }

            $("#accordion").accordion({ collapsible: true, active: false });
            $('input[type=checkbox]').on('change', function(e) {
                if ($(this).is(':checked')) {
                    $("[id^=" + this.id + "_]").prop('checked', true);
                } else {
                    $("[id^=" + this.id + "_]").prop('checked', false);
                }
            });

            $('.menu_search').keyup(function(event) {
                if (event.keyCode === 27 || $(this).find('input').val() == "") {
                    $(this).find('input').val("");
                    $(this).next().find('tr').show();
                    $(this).next().find('tr').removeClass('odd_table');
                    $(this).next().find('tr:gt(0):odd').addClass('odd_table');
                } else {
                    $(this).next().find('tr').show();
                    search(this);
                }
            });

        },
        error: function(xhr) {
            console.log(xhr);
        }
    });

}

function getAccardionHeader(gid, gname) {
    var header = "<h3 id='fs_" + gid + "'><a href='#'>" + gname + "</a><u class='" + gid + "'></u></h3>";
    header += "<div class='scroll'><div class='menu_search'><i class='flaticon-search'></i><input type='text' placeholder='Қидирув...'></div><table class='accordion_table'><thead><tr><th><label class='containerChBox'><input type='checkbox' id='ch_" + gid + "'><span class='checkmark'></span></label></th><th>Чақирув</th><th>Speed</th><th></th></tr></thead><tbody class='tb_" + gname + "'>";
    return header;
}

function search(that) {
    var input = $(that).find('input').val().toUpperCase();
    $(that).next().find('tr').removeClass('odd_table');
    $(that).next().find('tr td:nth-child(2)').each(function(index, el) {
        if (el.innerHTML.toUpperCase().indexOf(input) == -1) {
            $(el).parent().hide();
        }
    });
    $(that).next().find('tr:gt(0):visible:odd').addClass('odd_table');
}

function initMap() {
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
    }).on("playback:end", function() {
        $('#play-controller').trigger('click');
    });
    window.map = map;
}

function changeZoom(device_id) {
    alert(device_id);
    /*var map = window.m;
    map.eachLayer(function(layer) {
        if (layer.popupContent == device_name) {
            if ($(".checkbox:checked").length + 1 == $(".checkbox").length) {
                $(".checkbox_main").prop('checked', true);
            }
            $("." + device_id + "-id").show();
            $("#" + device_id).prop('checked', true);
            layer.openPopup();
            map.setView(layer._latlng, 17);
        }
    });*/
}