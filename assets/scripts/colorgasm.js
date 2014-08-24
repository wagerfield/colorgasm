(function(window, globalID) {

  //----------------------------------------
  // Vector
  //----------------------------------------

  var Vector = {
    create: function(x, y) {
      return {x:x||0, y:y||0};
    },
    id: function(target) {
      target.x = 0;
      target.y = 0;
    },
    copy: function(target, a) {
      target.x = a.x;
      target.y = a.y;
    },
    sub: function(target, a, b) {
      target.x = a.x - b.x;
      target.y = a.y - b.y;
    },
    add: function(target, a, b) {
      target.x = a.x + b.x;
      target.y = a.y + b.y;
    }
  };



  //----------------------------------------
  // Cord
  //----------------------------------------

  var Cord = function(thickness, width, aOffset, bOffset) {
    this.thickness = thickness || 1;
    this.width = width || 10;
    this.aOffset = aOffset || 0;
    this.bOffset = bOffset || 0;
    this.a = Vector.create();
    this.b = Vector.create();
    this.z = Vector.create();
  };
  Cord.prototype = {
    draw: function(context) {
      // context.beginPath();
      // Vector.sub(this.z, this.b, this.a);
      // Vector.rotate(this.z, HALF_PI);
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
      return this.palettes[id] = {base:base, core:core, west:west, east:east};
    },
    getColorPalette: function(id) {
      return this.palettes[id];
    }
  };



  //----------------------------------------
  // Sketch
  //----------------------------------------

  Sketch.create({

    container: document.getElementById('stage'),

    setup: function() {
      this.deck = new Deck();
      this.mouse.cord = new Cord();
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
      this.deck.pinRadius = Math.round(this.deck.radius * 0.05);
    },

    update: function() {
      this.mouse.cord.a.x = this.deck.x;
      this.mouse.cord.a.y = this.deck.y;
      this.mouse.cord.b.x = this.mouse.x;
      this.mouse.cord.b.y = this.mouse.y;
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
