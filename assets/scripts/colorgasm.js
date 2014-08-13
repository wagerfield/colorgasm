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
      this.wave = [0];
    },

    resize: function() {
      this.center = Math.round(this.width * 0.5);
    },

    update: function() {
      var sign = Math.random() > 0.5 ? 1 : -1;
      var value = this.wave[this.wave.length-1];
      value += Math.random() * sign * 0.08;
      value = Math.max(value, 0);
      value = Math.min(value, 1);
      this.wave.push(value);
      if (this.wave.length > this.height / 4) {
        this.wave.shift();
      }
    },

    draw: function() {
      var i, l,
          STEP = 4,
          MIN = 0.1,
          MAX = 0.8,
          RANGE = MAX - MIN;

      for (i = l = this.palette.east.length; i > 0; i--) {
        this.drawWave(WEST, MIN + RANGE * i / l, STEP, this.palette.west[i-1]);
      }
      for (i = l = this.palette.east.length; i > 0; i--) {
        this.drawWave(EAST, MIN + RANGE * i / l, STEP, this.palette.east[i-1]);
      }
      this.drawWave(WEST, MIN, STEP, this.palette.core);
      this.drawWave(EAST, MIN, STEP, this.palette.core);
    },

    drawWave: function(mode, scale, step, color) {
      var c1x, c1y, c2x, c2y;
      var i = this.wave.length - 1;
      var offset = mode === WEST ? -this.center : this.center;
      var x = Math.round(this.center + offset * scale * this.wave[i]);
      var y = this.height;
      this.beginPath();
      this.moveTo(this.center, y);
      this.lineTo(x, y);
      for (i; i >= 0; i--) {
        c1x = x;
        c1y = y - step * 0.5;
        c2x = Math.round(this.center + offset * scale * this.wave[i]);
        c2y = y - step * 0.5;
        y = y - step;
        x = c2x;
        this.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
        if (y < 0) break;
      }
      this.lineTo(this.center, y);
      this.closePath();
      this.fillStyle = color;
      this.fill();
    },

    catmullRom: function(points) {

      if (points.length < 3) return;

      var p0, p1, p2, p3,
          i6 = 1.0 / 6.0,
          ox = points[0].x,
          oy = points[0].y;

      for (var i = 3, n = points.length; i < n; i++) {

        p0 = points[i-3];
        p1 = points[i-2];
        p2 = points[i-1];
        p3 = points[i];

        this.beginPath();
        this.moveTo(ox, oy);
        this.bezierCurveTo(
          p2.x *  i6 + p1.x - p0.x * i6,
          p2.y *  i6 + p1.y - p0.y * i6,
          p3.x * -i6 + p2.x + p1.x * i6,
          p3.y * -i6 + p2.y + p1.y * i6,
          ox = p2.x,
          oy = p2.y
        );
        this.lineWidth = 1;
        this.stroke();
      }
    }

  });

})(window);
