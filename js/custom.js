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
	    $('input[type=checkbox]:checked').each(function(index, el) {
	    	if ((el.id.match(/_/g) || []).length == 2) {
		        var lastslashindex = el.id.lastIndexOf('_');
		        var result= el.id.substring(lastslashindex  + 1);
		        deviceIds.push(result);
	    	}
	    });

	    var from = $('#from-date').val();
	    var to = $('#to-date').val();

	});

});