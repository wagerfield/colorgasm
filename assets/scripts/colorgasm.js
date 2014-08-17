(function(window) {

  var CLIENT_ID = 'f818fec91d8b3d04dab7e76dbb18d091';

  var audio = new Audio();
  var playButton = document.getElementById('play');
  var pauseButton = document.getElementById('pause');

  window.addEventListener('load', initialize);

  function initialize() {
    console.dir(audio);

    // Initialize components
    FastClick.attach(document.body);
    SC.initialize({client_id: CLIENT_ID});

    // Add event listeners
    playButton.addEventListener('click', _.bind(onPlayButtonClick));
    pauseButton.addEventListener('click', _.bind(onPauseButtonClick));

    // Call internal methods
    resolveURL('https://soundcloud.com/maddecent/no-prayers');
  }

  function resolveURL(url) {
    SC.get('/resolve', {url:url}, onURLResolved);
  }

  function buildURL(url) {
    return url + '?client_id=' + CLIENT_ID;
  }

  function setAudioSource(url) {
    console.log('setAudioSource:', url);
    audio.src = url;
  }

  //----------------------------------------
  // CALLBACKS
  //----------------------------------------

  function onURLResolved(data) {
    switch(data.kind) {
      case 'track':
        setAudioSource(buildURL(data.stream_url));
        break;
      case 'playlist':
        break;
    }
  }

  function onPlayButtonClick(event) {
    audio.play();
  }

  function onPauseButtonClick(event) {
    audio.pause();
  }









  // var COLORGASM = window.COLORGASM = function() {
  //   palettes = {};
  // };

  // COLORGASM.WEST = 0;
  // COLORGASM.EAST = 1;

  // COLORGASM.prototype = {
  //   addColorPalette: function(id, base, core, west, east) {
  //     this.palettes[id] = {base:base, core:core, west:west, east:east};
  //   },
  //   resolveSoundCloudURL: function(url) {
  //   }
  // };

  // addColorPalette('main',
  //   '#1E1A31', // Base
  //   '#FFFFFF', // Core
  // [
  //   '#FFE193',
  //   '#FFB46B',
  //   '#F98A75',
  //   '#E2687C',
  //   '#B14B77',
  //   '#6B2A64'
  // ],[
  //   '#B9F7F5',
  //   '#72D4E2',
  //   '#5BAFCD',
  //   '#518CBE',
  //   '#4D64B0',
  //   '#4C4690'
  // ]);

  // 'https://soundcloud.com/maddecent/no-prayers'

  // var context = new webkitAudioContext(),
  //     audio = new Audio(),
  //     source,
  //     url = 'http://api.soundcloud.com/tracks/39769021/stream' +
  //           '?client_id=YOUR_CLIENT_ID';

  // audio.src = url;
  // document.body.appendChild(audio);
  // audio.style.position = 'fixed';
  // audio.style.top = '50%';
  // audio.style.left = 0;
  // audio.style.zIndex = 1;
  // audio.play();
  // source = context.createMediaElementSource(audio);
  // source.connect(context.destination);
  // source.mediaElement.play();

  // http://api.soundcloud.com/tracks/39769021/stream?client_id=f818fec91d8b3d04dab7e76dbb18d091

  // Sketch.create({

  //   interval: 1,
  //   container: document.getElementById('container'),

  //   setup: function() {

  //     // Behaviours
  //     this.smooth = true;
  //     this.speed = 3;
  //     this.frequency = 20;
  //     this.jitter = 0.15;
  //     this.lubricity = 0.01;
  //     this.elasticity = 0.95;
  //     this.offset = this.frequency * this.speed;
  //     this.core = 0.1;
  //     this.edge = 0.6;

  //     // Controls
  //     this.gui = new dat.GUI();
  //     this.gui.add(this, 'smooth');
  //     this.gui.add(this, 'speed', 0.5, 10);
  //     this.gui.add(this, 'frequency', 1, 120);
  //     this.gui.add(this, 'jitter', 0, 1);
  //     this.gui.add(this, 'lubricity', 0, 0.2);
  //     this.gui.add(this, 'elasticity', 0, 1);
  //     this.gui.add(this, 'offset', -100, 100);
  //     this.gui.add(this, 'core', 0, 1);
  //     this.gui.add(this, 'edge', 0, 1);

  //     // Setup
  //     this.setColorPalette(COLORS.main);
  //     this.reset();
  //   },

  //   setColorPalette: function(palette) {
  //     if (this.palette !== palette) {
  //       this.palette = palette;
  //       this.container.style.backgroundColor = palette.base;
  //     }
  //   },

  //   reset: function() {
  //     this.path = [];
  //     this.spline = [];
  //     this.wave = [{t:0, a:0, v:0, p:0, x:0, y:0}];
  //     this.counter = 0;
  //     this.time = 0;
  //   },

  //   resize: function() {
  //     this.center = Math.round(this.width * 0.5);
  //   },

  //   update: function() {
  //     if (++this.counter >= this.frequency) {
  //       var sign = Math.random() > 0.5 ? 1 : -1;
  //       var oldPoint = this.wave[this.wave.length-1];
  //       var newPoint = {t:this.time, a:oldPoint.a, v:0, p:0};
  //       newPoint.a += Math.random() * sign * this.jitter;
  //       newPoint.a = Math.max(newPoint.a, 0);
  //       newPoint.a = Math.min(newPoint.a, 1);
  //       this.wave.push(newPoint);
  //       if (this.wave.length > this.height) {
  //         this.wave.shift();
  //       }
  //       this.counter = 0;
  //     }
  //     this.updateWave();
  //     this.updateSpline();
  //     this.time++;
  //   },

  //   updateWave: function() {
  //     _.each(this.wave, function(point) {
  //       point.p = point.p * this.elasticity + (point.a - point.v) * this.lubricity;
  //       point.v += point.p;
  //       point.v = Math.max(0, point.v);
  //       point.v = Math.min(1, point.v);
  //       point.x = this.center * point.v;
  //       point.y = this.height + this.offset - (this.time - point.t) * this.speed;
  //     }, this);
  //   },

  //   updateSpline: function() {
  //     var points = _.flatten(_.map(this.wave, function(point) {
  //       return [point.x, point.y];
  //     }));
  //     this.spline = this.catmullRom(points, 0);
  //   },

  //   draw: function() {
  //     var i, l, RANGE = this.edge - this.core;
  //     for (i = l = this.palette.east.length; i > 0; i--) {
  //       this.drawWave(WEST, this.core + RANGE * i / l, this.palette.west[i-1]);
  //     }
  //     for (i = l = this.palette.east.length; i > 0; i--) {
  //       this.drawWave(EAST, this.core + RANGE * i / l, this.palette.east[i-1]);
  //     }
  //     this.drawWave(WEST, this.core, this.palette.core);
  //     this.drawWave(EAST, this.core, this.palette.core);
  //   },

  //   drawWave: function(mode, scale, color) {
  //     var x = 0;
  //     this.save();
  //     this.beginPath();
  //     this.rect(mode ? this.center : 0, 0, this.center, this.height);
  //     this.clip();
  //     this.beginPath();
  //     this.translate(this.center, 0);
  //     this.moveTo(0, _.first(this.wave).y);
  //     if (this.smooth && this.spline.length) {
  //       _.each(this.spline, function(point) {
  //         this.bezierCurveTo.apply(this, _.map(point, function(value, index) {
  //           return index % 2 ? value : (mode ? value : -value) * scale;
  //         }, this));
  //       }, this);
  //     } else {
  //       _.each(this.wave, function(point) {
  //         x = mode ? point.x : -point.x;
  //         this.lineTo(x * scale, point.y);
  //       }, this);
  //     }
  //     this.lineTo(0, _.last(this.wave).y);
  //     this.closePath();
  //     this.fillStyle = color;
  //     this.fill();
  //     this.restore();
  //   },

  //   catmullRom: function(points, tension) {
  //     if (points.length < 6) return [];
  //     var spline = [];
  //     for (var i = 0, l = points.length; l - 2 * !tension > i; i += 2) {
  //       var p = [
  //         {x:points[i-2], y:points[i-1]},
  //         {x:points[i+0], y:points[i+1]},
  //         {x:points[i+2], y:points[i+3]},
  //         {x:points[i+4], y:points[i+5]}
  //       ];
  //       if (tension) {
  //         if (!i) {
  //           p[0] = {x:points[l-2], y:points[l-1]};
  //         } else if (i === l-4) {
  //           p[3] = {x:points[0], y:points[1]};
  //         } else if (i === l-2) {
  //           p[2] = {x:points[0], y:points[1]};
  //           p[3] = {x:points[2], y:points[3]};
  //         }
  //       } else {
  //         if (i === l-4) {
  //           p[3] = p[2];
  //         } else if (!i) {
  //           p[0] = {x:points[i], y:points[i+1]};
  //         }
  //       }
  //       spline.push([
  //         (-p[0].x + 6 * p[1].x + p[2].x) / 6,
  //         (-p[0].y + 6 * p[1].y + p[2].y) / 6,
  //         ( p[1].x + 6 * p[2].x - p[3].x) / 6,
  //         ( p[1].y + 6 * p[2].y - p[3].y) / 6,
  //           p[2].x,
  //           p[2].y
  //       ]);
  //     }
  //     return spline;
  //   }

  // });

})(window);
