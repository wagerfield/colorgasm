(function(window, globalID) {

  //----------------------------------------
  // Vector
  //----------------------------------------

  var Vector = {
    create: function(x, y) {
      return {x:x||0, y:y||0};
    },
    identity: function(target) {
      target.x = 0;
      target.y = 0;
    },
    copy: function(target, a) {
      target.x = a.x;
      target.y = a.y;
    },
    subtract: function(target, a, b) {
      target.x = a.x - b.x;
      target.y = a.y - b.y;
    },
    add: function(target, a, b) {
      target.x = a.x + b.x;
      target.y = a.y + b.y;
    },
    scale: function(target, a, s) {
      target.x = a.x * s;
      target.y = a.y * s;
    },
    squaredLength: function(vector) {
      var x = vector.x;
      var y = vector.y;
      return x*x + y*y;
    },
    length: function(vector) {
      return Math.sqrt(this.squaredLength(vector));
    },
    normalise: function(target, a, opt_length) {
      opt_length = opt_length || 1;
      var l = this.squaredLength(a);
      if (l > 0) {
        l = opt_length / Math.sqrt(l);
        this.scale(target, a, l);
      } else {
        this.identity(target);
      }
      return target;
    },
    rotate: function(target, a, angle) {
      if (angle === 0) {
        return this.copy(target, a);
      } else {
        var s = Math.sin(angle);
        var c = Math.cos(angle);
        var x = (a.x * c) - (a.y * s);
        var y = (a.x * s) + (a.y * c);
        target.x = x;
        target.y = y;
        return target;
      }
    }
  };



  //----------------------------------------
  // Cord
  //----------------------------------------

  var Cord = function(radius, aOffset, bOffset) {
    this.aOffset = aOffset || 0;
    this.bOffset = bOffset || 0;
    this.radius = radius || 10;
    this._a = Vector.create();
    this._b = Vector.create();
    this.a = Vector.create();
    this.b = Vector.create();
  };
  Cord.prototype = {
    drawFoot: function(context, anchor) {
      context.beginPath();
      Vector.subtract(this._a, this.b, this.a);
      Vector.rotate(this._a, this._a, HALF_PI);
      Vector.normalise(this._a, this._a, this.radius);
      Vector.subtract(this._b, anchor, this._a);
      context.moveTo(this._b.x, this._b.y);
      Vector.add(this._b, this._a, anchor);
      context.lineTo(this._b.x, this._b.y);
      context.stroke();
    },
    draw: function(context) {
      context.beginPath();
      context.moveTo(this.a.x, this.a.y);
      context.lineTo(this.b.x, this.b.y);
      context.stroke();
      this.drawFoot(context, this.a);
      this.drawFoot(context, this.b);
    }
  };



  //----------------------------------------
  // Deck
  //----------------------------------------

  var Deck = function(rpm) {
    this.mtm = 1 / 1000 / 60;
    this.rpm = rpm || 33;
    this.rimRadius = 0;
    this.pinRadius = 0;
    this.rotation = 0;
    this.x = 0;
    this.y = 0;
  };
  Deck.prototype = {
    update: function(time) {
    },
    draw: function(context) {
      // Rim
      context.beginPath();
      context.arc(this.x, this.y, this.rimRadius, 0, TWO_PI, false);
      context.stroke();
      // Pin
      context.beginPath();
      context.arc(this.x, this.y, this.pinRadius, 0, TWO_PI, false);
      context.stroke();
      // Cord
      // context.beginPath();
      // context.moveTo.apply(this, this.polar(this.deck.rotation, this.deck.pin, this.deck.x, this.deck.y));
      // context.lineTo.apply(this, this.polar(this.deck.rotation, this.deck.radius * 1, this.deck.x, this.deck.y));
      // context.stroke();
    }
  };



  //----------------------------------------
  // Colorgasm
  //----------------------------------------

  var Colorgasm = function() {
    this.palettes = {};
  };
  Colorgasm.prototype = {
    setColorPalette: function(id, base, core, west, east) {
      this.palettes[id] = {base:base, core:core, west:west, east:east};
      return this.palettes[id];
    },
    getColorPalette: function(id) {
      return this.palettes[id];
    }
  };



  //----------------------------------------
  // Sketch
  //----------------------------------------

  window[globalID] = Sketch.create({

    container: document.getElementById('stage'),

    setup: function() {
      this.deck = new Deck();
      this.mouse.cord = new Cord(20);
      this.colorgasm = new Colorgasm();
      this.setColorPalette(this.colorgasm.setColorPalette('main',
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
      ]));
    },

    setColorPalette: function(palette) {
      if (this.palette !== palette) {
        this.palette = palette;
        this.container.style.backgroundColor = palette.base;
      }
    },

    resize: function() {
      this.centerX = Math.round(this.width * 0.5);
      this.centerY = Math.round(this.height * 0.5);

      // Position and resize deck
      this.deck.x = this.centerX;
      this.deck.y = this.centerY;
      this.deck.rimRadius = Math.round(Math.min(this.centerX, this.centerY) * 0.7);
      this.deck.pinRadius = Math.round(this.deck.rimRadius * 0.05);
      this.draw();
    },

    update: function() {
      Vector.copy(this.mouse.cord.a, this.deck);
      Vector.copy(this.mouse.cord.b, this.mouse);
    },

    draw: function() {

      // DECK
      this.strokeStyle = this.palette.west[4];
      this.deck.draw(this);

      // MOUSE
      if (this.dragging) {
        this.strokeStyle = this.palette.west[2];
        this.mouse.cord.draw(this);
      }
    },

    mousedown: function() {
      this.dragging = true;
    },

    mouseup: function() {
      this.dragging = false;
    },

    hit: function(x, y, hx, hy, hw, hh) {
      return x >= hx && x <= hx + hw && y >= hy && y <= hy + hh;
    }

  });

})(window, 'Colorgasm');
