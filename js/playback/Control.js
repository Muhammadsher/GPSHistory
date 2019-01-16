L.Playback = L.Playback || {};

L.Playback.DateControl = L.Control.extend({
    options : {
        position : 'bottomleft',
        dateFormatFn: L.Playback.Util.DateStr,
        timeFormatFn: L.Playback.Util.TimeStr
    },

    initialize : function (playback, options) {
        L.setOptions(this, options);
        this.playback = playback;
    },

    onAdd : function (map) {
        this._container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control-layers-expanded');

        var self = this;
        var playback = this.playback;
        var time = playback.getTime();
        var datetime = L.DomUtil.create('div', 'datetimeControl', this._container);

        // date time
        this._date = L.DomUtil.create('p', '', datetime);
        this._time = L.DomUtil.create('p', '', datetime);

        this._date.innerHTML = this.options.dateFormatFn(time);
        this._time.innerHTML = this.options.timeFormatFn(time);

        // setup callback
        playback.addCallback(function (ms) {
            self._date.innerHTML = self.options.dateFormatFn(ms);
            self._time.innerHTML = self.options.timeFormatFn(ms);
        });

        return this._container;
    }
});

L.Playback.PlayControl = L.Control.extend({
    options : {
        position : 'topleft'
    },


    initialize : function (playback) {
        this.playback = playback;
      },

    onAdd : function (map) {
        this._bigContainer = L.DomUtil.create('div');
        this._container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control-layers-expanded not-expanding', this._bigContainer);
        this.container1= L.DomUtil.create('div', 'leaflet-control-layers leaflet-control-layers-expanded muslim', this._bigContainer);
        var self = this;
        var playback = this.playback;
        playback.setSpeed(100);

        var playControl = L.DomUtil.create('div', 'playControl', this._container);
        var speedControl = L.DomUtil.create('div', 'speedControl', this.container1);
        
        this._speed = L.DomUtil.create('div', 'speed', speedControl);

        this._speed.innerHTML = '<img class="play_button hoverable" src="fonts/next.svg" id="buttonn"></img> <label class="speed_label"> <span id="1x" value="10">1x</span> <span id="2x">2x</span> <span id="3x">3x</span>  </label';
        this._speed.title="Increase speed";
     
        this._button = L.DomUtil.create('button', '', playControl);
        this._button.innerHTML = '<img class="play_button" src="fonts/play.svg"></img>';
        this._button.title="Play";

        var stop = L.DomEvent.stopPropagation;
        function change(){
            var x=document.getElementById('1x');
            var y=document.getElementById('2x');
            var z=document.getElementById('3x');
            
            L.DomEvent.on(x, 'click',changeSpeed1x);
            L.DomEvent.on(y, 'click',changeSpeed2x);
            L.DomEvent.on(z, 'click',changeSpeed3x);  
        }
        function changeSpeed1x(){
           window.pl.setTickLng(500); 
           self._button.innerHTML = '<img class="play_button" src="fonts/pause.svg"></img>';
           self._button.title="Pause";
        }
         function changeSpeed2x(){
           window.pl.setTickLng(1000);
           self._button.innerHTML = '<img class="play_button" src="fonts/pause.svg"></img>';
           self._button.title="Pause";
        }
         function changeSpeed3x(){
           window.pl.setTickLng(2000); 
           self._button.innerHTML = '<img class="play_button" src="fonts/pause.svg"></img>';
           self._button.title="Pause";
        }
  
        L.DomEvent
    
        .on(this._speed, 'mouseenter', change)
        .on(this._button, 'click', stop)
        .on(this._button, 'mousedown', stop)
        .on(this._button, 'dblclick', stop)
        .on(this._button, 'click', L.DomEvent.preventDefault)
        .on(this._button, 'click', play, this);
        
        function play(){
            if (playback.isPlaying()) {
                playback.stop();
                self._button.innerHTML = '<img class="play_button" src="fonts/play.svg"></img>';
                self._button.title="Play";
            }
            else {
                playback.start();
                self._button.innerHTML = '<img class="play_button" src="fonts/pause.svg"></img>';
                self._button.title="Pause";
            }   
                      
        }


        return this._bigContainer;
    }
});    
    

    
L.Playback.SliderControl = L.Control.extend({
    options : {
        position : 'bottomleft'
    },

    initialize : function (playback) {
        this.playback = playback;
    },

    onAdd : function (map) {
        this._container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control-layers-expanded');

        var self = this;
        var playback = this.playback;

        // slider
        this._slider = L.DomUtil.create('input', 'slider', this._container);
        this._slider.type = 'range';
        this._slider.min = playback.getStartTime();
        this._slider.max = playback.getEndTime();
        this._slider.value = playback.getTime();

        var stop = L.DomEvent.stopPropagation;

        L.DomEvent
        .on(this._slider, 'click', stop)
        .on(this._slider, 'mousedown', stop)
        .on(this._slider, 'dblclick', stop)
        .on(this._slider, 'click', L.DomEvent.preventDefault)
        //.on(this._slider, 'mousemove', L.DomEvent.preventDefault)
        .on(this._slider, 'change', onSliderChange, this)
        .on(this._slider, 'mousemove', onSliderChange, this);           


        function onSliderChange(e) {
            var val = Number(e.target.value);
            playback.setCursor(val);
        }

        playback.addCallback(function (ms) {
            self._slider.value = ms;
        });
        
        
        map.on('playback:add_tracks', function() {
            self._slider.min = playback.getStartTime();
            self._slider.max = playback.getEndTime();
            self._slider.value = playback.getTime();
        });

        return this._container;
    }
});  
