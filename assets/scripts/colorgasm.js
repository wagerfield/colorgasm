(function(window) {

  var WEST = 0,
      EAST = 1,
      COLORS = {};

  function addColorPalette(id, base, core, west, east) {
    COLORS[id] = {base:base, core:core, west:west, east:east};
  }

  addColorPalette('main',
    '#1E1A31', // Base
    '#FFFFFF', // Core
  [
    '#FFE193',
    '#FFB46B',
    '#F98A75',
    '#E2687C',
    '#B14B77',
    '#6B2A64'
  ],[
    '#B9F7F5',
    '#72D4E2',
    '#5BAFCD',
    '#518CBE',
    '#4D64B0',
    '#4C4690'
  ]);

  Sketch.create({

    interval: 1,
    container: document.getElementById('container'),

    setup: function() {

      // Behaviours
      this.smooth = false;
      this.speed = 3;
      this.frequency = 10;
      this.jitter = 0.15;
      this.lubricity = 0.01;
      this.elasticity = 0.95;
      this.offset = this.frequency * this.speed;
      this.core = 0.1;
      this.edge = 0.6;

      // Controls
      this.gui = new dat.GUI();
      this.gui.add(this, 'smooth');
      this.gui.add(this, 'speed', 0.5, 10);
      this.gui.add(this, 'frequency', 1, 120);
      this.gui.add(this, 'jitter', 0, 1);
      this.gui.add(this, 'lubricity', 0, 0.2);
      this.gui.add(this, 'elasticity', 0, 1);
      this.gui.add(this, 'offset', -100, 100);
      this.gui.add(this, 'core', 0, 1);
      this.gui.add(this, 'edge', 0, 1);

      // Setup
      this.setColorPalette(COLORS.main);
      this.reset();
    },

    setColorPalette: function(palette) {
      if (this.palette !== palette) {
        this.palette = palette;
        this.container.style.backgroundColor = palette.base;
      }
    },

    reset: function() {
      this.path = [];
      this.spline = [];
      this.wave = [{t:0, a:0, v:0, p:0, x:0, y:0}];
      this.counter = 0;
      this.time = 0;
    },

    resize: function() {
      this.center = Math.round(this.width * 0.5);
    },

    update: function() {
      if (++this.counter >= this.frequency) {
        var sign = Math.random() > 0.5 ? 1 : -1;
        var oldPoint = this.wave[this.wave.length-1];
        var newPoint = {t:this.time, a:oldPoint.a, v:0, p:0};
        newPoint.a += Math.random() * sign * this.jitter;
        newPoint.a = Math.max(newPoint.a, 0);
        newPoint.a = Math.min(newPoint.a, 1);
        this.wave.push(newPoint);
        if (this.wave.length > this.height) {
          this.wave.shift();
        }
        this.counter = 0;
      }
      _.each(this.wave, function(point) {
        point.p = point.p * this.elasticity + (point.a - point.v) * this.lubricity;
        point.v += point.p;
        point.v = Math.max(0, point.v);
        point.v = Math.min(1, point.v);
        point.x = this.center * point.v;
        point.y = this.height + this.offset - (this.time - point.t) * this.speed;
      }, this);
      this.time++;
    },

    updateSpline: function() {
      this.spline = this.catmullRom();
    },

    draw: function() {
      var i, l, RANGE = this.edge - this.core;
      for (i = l = this.palette.east.length; i > 0; i--) {
        this.drawWave(WEST, this.core + RANGE * i / l, this.palette.west[i-1]);
      }
      for (i = l = this.palette.east.length; i > 0; i--) {
        this.drawWave(EAST, this.core + RANGE * i / l, this.palette.east[i-1]);
      }
      this.drawWave(WEST, this.core, this.palette.core);
      this.drawWave(EAST, this.core, this.palette.core);
    },

    drawWave: function(mode, scale, color) {
      var x = 0;
      this.save();
      this.beginPath();
      this.translate(this.center, 0);
      this.moveTo(0, _.first(this.wave).y);
      _.each(this.wave, function(point) {
        x = mode ? point.x : -point.x;
        this.lineTo(x * scale, point.y);
      }, this);
      this.lineTo(0, _.last(this.wave).y);
      this.closePath();
      this.restore();
      this.fillStyle = color;
      this.fill();
    },

    catmullRom: function(points, tension) {
      var d = [];
      for (var i = 0, l = points.length; l - 2 * !tension > i; i += 2) {
        var p = [
          {x:points[i-2], y:points[i-1]},
          {x:points[i+0], y:points[i+1]},
          {x:points[i+2], y:points[i+3]},
          {x:points[i+4], y:points[i+5]}
        ];
        if (tension) {
          if (!i) {
            p[0] = {x:points[l-2], y:points[l-1]};
          } else if (i === l-4) {
            p[3] = {x:points[0], y:points[1]};
          } else if (i === l-2) {
            p[2] = {x:points[0], y:points[1]};
            p[3] = {x:points[2], y:points[3]};
          }
        } else {
          if (i === l-4) {
            p[3] = p[2];
          } else if (!i) {
            p[0] = {x:points[i], y:points[i+1]};
          }
        }
        d.push([
          (-p[0].x + 6 * p[1].x + p[2].x) / 6,
          (-p[0].y + 6 * p[1].y + p[2].y) / 6,
          ( p[1].x + 6 * p[2].x - p[3].x) / 6,
          ( p[1].y + 6 * p[2].y - p[3].y) / 6,
            p[2].x,
            p[2].y
        ]);
      }
      return d;
    }

  });

})(window);
