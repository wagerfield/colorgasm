(function(window, globalID) {

  //----------------------------------------
  // Vector
  //----------------------------------------

  var Vector = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  };
  Vector.prototype = {
    id: function() {
      this.x = 0;
      this.y = 0;
    }
  };
  Vector.polar = function(angle, length, x, y) {
    return [x + length * Math.cos(angle), y + length * Math.sin(angle)];
  };



  //----------------------------------------
  // Deck
  //----------------------------------------

  var Deck = function(rpm) {
    this.ts = 1 / 1000 / 60;
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
      this.colorgasm = new Colorgasm();
      this.colorgasm.setColorPalette('main',
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
      this.setColorPalette(this.colorgasm.getColorPalette('main'));
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
      // if (this.dragging) {
      //   this.deck.mx = this.mouse.x - this.deck.x;
      //   this.deck.my = this.mouse.y - this.deck.y;
      //   var delta = Math.atan2(this.deck.my, this.deck.mx) - this.mouse.down.angle;
      //   this.deck.rotation = this.mouse.down.rotation + delta;
      // } else {
      //   this.deck.rotation += this.dt * this.ts * this.deck.rpm * TWO_PI;
      // }
    },

    draw: function() {

      // DECK
      this.strokeStyle = this.palette.west[4];
      this.deck.draw(this);

      // MOUSE
      if (this.dragging) {
        this.strokeStyle = this.palette.west[2];
        this.beginPath();
        this.moveTo(this.deck.x, this.deck.y);
        this.lineTo(this.mouse.x, this.mouse.y);
        this.stroke();
      }
    },

    mousedown: function() {
      this.dragging = true;

      // this.deck.mx = this.mouse.x - this.deck.x;
      // this.deck.my = this.mouse.y - this.deck.y;

      // this.mouse.down.x = this.mouse.x;
      // this.mouse.down.y = this.mouse.y;
      // this.mouse.down.rotation = this.deck.rotation;
      // this.mouse.down.angle = Math.atan2(this.deck.my, this.deck.mx);
      // this.mouse.down.minX = Math.min(this.mouse.x, this.width - this.mouse.x);
      // this.mouse.down.minY = Math.min(this.mouse.y, this.height - this.mouse.y);
      // this.mouse.down.maxX = this.width - this.mouse.down.minX;
      // this.mouse.down.maxY = this.height - this.mouse.down.minY;
    },

    mouseup: function() {
      this.dragging = false;
    }

  });

})(window, 'Colorgasm');
