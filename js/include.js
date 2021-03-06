(function() {
	var scripts = [
		"jquery-src.js",
		"jquery-ui.js",
		"leaflet-src.js",
		"leaflet.awesome-markers.js",
		"leaflet.label.js",
		"leaflet-realtime.js",
		"moment.js",
		"bootstrap.js",
		"bootstrap-datetimepicker.js",
		"map.js",
		"vis.min.js",
		/*"playback/Util.js",*/
		/*"playback/MoveableMarker.js",*/
		/*"playback/Track.js",*/
		/*"playback/TrackController.js",*/
		/*"playback/Clock.js",*/
		/*"playback/TracksLayer.js",*/
		/*"playback/Control.js",*/
		"playback/leafletPlayback.js",
		"jspdf.min.js",
		"jspdf.plugin.autotable.js",
		"PDF.js",
		/*"demoTracks.js",*/
		"worker.js",
		"custom.js"
	];
	
	var styles = [
		"jquery-ui.css",
		"leaflet.css",
		"leaflet.awesome-markers.css",
		"leaflet.label.css",
		"bootstrap.css",
		"bootstrap-datetimepicker.css",
		"flaticon.css",
		"fizmasoft.css",
		"vis.min.css"
	];

	for (var d = 0; d < styles.length; d++)
		document.writeln("<link rel=\"stylesheet\" type=\"text/css\" href='style/" + styles[d] + "'/>");

	for (var i = 0; i < scripts.length; i++)
		document.writeln("<script type=\"text/javascript\" src='js/" + scripts[i] + "'></script>");	
})();