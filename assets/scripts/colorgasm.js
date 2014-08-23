(function(window, globalID) {

  AudioContext = window.AudioContext || window.webkitAudioContext;

  var CLIENT_ID = 'f818fec91d8b3d04dab7e76dbb18d091';
  var TRACKS = [
    'https://soundcloud.com/bearded-man-recordings/lost-frequencies-are-you-with-me-1',
    'https://soundcloud.com/callanalexander/cln-better-than-feki-remix',
    'https://soundcloud.com/maddecent/no-prayers'
  ];

  var player = new MediaPlayer();
  var container = document.getElementById('container');
  var stage = document.getElementById('stage');

  var audio = {};
  audio.context = new AudioContext();
  audio.analyser = audio.context.createAnalyser();
  audio.analyser.fftSize = 256;

  // audio.source = audio.context.createMediaElementSource(player.element);
  audio.destination = audio.context.destination;

  // audio.source.connect(audio.analyser);
  // audio.analyser.connect(audio.destination);

  window.addEventListener('load', initialize);

  function initialize() {

    window[globalID] = audio;

    // Initialize components
    FastClick.attach(document.body);
    SC.initialize({client_id: CLIENT_ID});

    // Add event listeners
    stage.addEventListener('touchmove', onInteractionEvent);
    stage.addEventListener('mousedown', onInteractionEvent);
    stage.addEventListener('mouseup', onInteractionEvent);
    stage.addEventListener('click', onInteractionEvent);

    for (var i = MediaPlayerEvent.EVENTS.length - 1; i >= 0; i--) {
      player.addEventListener(MediaPlayerEvent.EVENTS[i], onMediaPlayerEvent);
    }

    // Call internal methods
    // resolveURL(TRACKS[2]);
    loadAudio('assets/sounds/no-prayers.mp3');
  }

  function resolveURL(url) {
    SC.get('/resolve', {url:url}, onURLResolved);
  }

  function buildURL(url) {
    return url + '?client_id=' + CLIENT_ID;
  }

  function loadAudio(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      audio.context.decodeAudioData(request.response, function(buffer) {
        audio.buffers = {
          forward: buffer,
          reverse: reverseAudioBuffer(buffer)
        };
        console.log('decoded:', buffer);
        play(0, true);
      }, function() {
        console.log('ERROR!');
      });
    };
    request.send();
  }

  function streamAudio(url) {
    player.load(url);
  }

  function reverseAudioBuffer(buffer) {
    var clone = cloneAudioBuffer(buffer);
    for (var i = 0, c = clone.numberOfChannels; i < c; i++) {
      Array.prototype.reverse.call(clone.getChannelData(i));
    }
    return clone;
  }

  function cloneAudioBuffer(buffer) {
    var clone = audio.context.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
    for (var i = 0, c = buffer.numberOfChannels; i < c; i++) {
      var bufferData = buffer.getChannelData(i),
          cloneData = clone.getChannelData(i);
      cloneData.set(bufferData, 0);
    }
    return clone;
  }

  function play(time, reverse) {
    console.log('play', time, audio);

    stop();
    audio.source = audio.context.createBufferSource();
    audio.source.buffer = reverse ? audio.buffers.reverse : audio.buffers.forward;
    audio.source.connect(audio.destination);
    audio.source.start(time);
  }

  function stop() {
    if (audio.source) {
      audio.source.stop();
      console.log('stop', audio);
    }
  }

  //----------------------------------------
  // CALLBACKS
  //----------------------------------------

  function onURLResolved(data) {
    switch(data.kind) {
      case 'track':
        if (data.downloadable) {
          loadAudio(buildURL(data.download_url));
        } else if (data.streamable) {
          streamAudio(buildURL(data.stream_url));
        }
        break;
      case 'playlist':
        break;
    }
  }

  function onInteractionEvent(event) {
    switch(event.type) {
      case 'touchmove':
        event.preventDefault();
        break;
      case 'mousedown':
        break;
      case 'mouseup':
        break;
      case 'click':
        // player.togglePlayback();
        break;
    }
  }

  function onMediaPlayerEvent(event) {
    switch(event.type) {
      case MediaPlayerEvent.PLAY:
        break;
      case MediaPlayerEvent.PAUSE:
        break;
    }
  }

  //----------------------------------------
  // SKETCH
  //----------------------------------------

  Sketch.create({

    container: stage,
    // retina: window.devicePixelRatio > 1,

    setup: function() {
      this.mouse.down = {x:0, y:0};
      this.mouse.delta = {x:0, y:0};
    },

    update: function() {
      this.mouse.delta.x = this.mouse.x - this.mouse.down.x;
      this.mouse.delta.y = this.mouse.y - this.mouse.down.y;
    },

    draw: function() {
      if (this.dragging) {
        this.beginPath();
        this.moveTo(this.mx, this.my);
        this.lineTo(this.mouse.x, this.my);
        this.lineTo(this.mouse.x, this.mouse.y);
        this.strokeStyle = '#D22';
        this.lineWidth = 2;
        this.stroke();
      }
    },

    mousedown: function() {
      this.dragging = true;
      this.mouse.down.x = this.mouse.x;
      this.mouse.down.y = this.mouse.y;
    },

    mouseup: function() {
      this.dragging = false;
    }

  });











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

})(window, 'Colorgasm');
