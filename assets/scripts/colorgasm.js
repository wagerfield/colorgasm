(function(window) {

  var WEST = 'west',
      EAST = 'east',
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
      this.wave = [{t:0, a:0, v:0, p:0}];
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
      for (var i = this.wave.length - 1; i >= 0; i--) {
        var point = this.wave[i];
        var delta = point.a - point.v;
        point.p = point.p * this.elasticity + delta * this.lubricity;
        point.v += point.p;
      }
      this.time++;
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
      // this.drawWave(EAST, 1, this.palette.core);
    },

    drawWave: function(mode, scale, color) {
      var l = this.wave.length,
          i = this.smooth ? l - 4 : l - 1;

      if (i < 0) return;

      var t, p0, p1, p2, p3,
          o = mode === WEST ? -this.center : this.center,
          p = this.wave[i],
          x = this.center,
          y = this.height,
          s = 1.0 / 6.0,
          ox = p.x,
          oy = p.y;

      // console.log(i, l);
      this.beginPath();
      this.moveTo(x, y);
      for (i; i >= 0; i--) {
        p = this.wave[i];
        t = this.time - p.t;
        x = p.x = this.center + o * p.v * scale;
        y = p.y = this.height - t * this.speed;
        if (this.smooth) {
          p0 = this.wave[i+3];
          p1 = this.wave[i+2];
          p2 = this.wave[i+1];
          p3 = this.wave[i+0];
          this.bezierCurveTo(
            p2.x *  s + p1.x - p0.x * s,
            p2.y *  s + p1.y - p0.y * s,
            p3.x * -s + p2.x + p1.x * s,
            p3.y * -s + p2.y + p1.y * s,
            ox = p2.x,
            oy = p2.y
          );
        } else {
          this.lineTo(x, y);
        }
        if (y < 0) break;
      }
      this.lineTo(this.center, y);
      this.closePath();
      this.fillStyle = color;
      this.fill();
    }

  });

})(window);
