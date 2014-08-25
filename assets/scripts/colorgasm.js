(function(window, globalID) {

  //----------------------------------------
  // Cord
  //----------------------------------------

  var Cord = function(radius) {
    this.radius = typeof radius === 'number' ? radius : 10;
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
      if (this.radius > 0) {
        this.drawFoot(context, this.a);
        this.drawFoot(context, this.b);
      }
    }
  };



  //----------------------------------------
  // Deck
  //----------------------------------------

  var Deck = function(rpm, radius, mass) {
    // 12" === 30cm === 0.3m
    this.radius = radius || 0.3;
    this.rpm = rpm || 100/3;

    // Touch Vectors
    this.touch = Vector.create();
    this.touch.old = Vector.create();
    this.touch.force = Vector.create();

    // Sizing Vectors
    this.rim = Vector.create();
    this.pin = Vector.create();
    this.cord = new Cord(0);

    // Modifiers
    this.rotation = 0;
    this.on = false;

    // Physics
    this.velocity = 0;
    this.torque = 0;

    // Setup
    this.setMass(mass || 1);
    this.setPosition(0, 0);
    this.setSize(5, 100);
  };
  Deck.prototype = {
    // MILLISECOND > MINUTE
    MTM: 1 / 60 / 1000,
    setPosition: function(x, y) {
      this.x = x;
      this.y = y;
    },
    setSize: function(pin, rim) {
      Vector.set(this.pin, this.pinRadius = pin, 0);
      Vector.set(this.rim, this.rimRadius = rim, 0);
    },
    setMass: function(mass) {
      this.inverseMass = 1.0 / (this.mass = mass);
    },
    target: function(value, time) {
    },
    update: function(delta, mouse) {
      this.torque = 0;
      if (mouse.down) {

        // normalise to physical radius


        // Deck center > mouse
        Vector.subtract(this.touch, mouse, this);

        // Clamp to deck rim radius
        Vector.max(this.touch, this.touch, this.rimRadius);

        // Normalise to physical radius
        // Vector.max(this.touch, this.touch, this.rimRadius);


        // Vector.normalise(this.touch, this.touch, this);


        // Vector.subtract(this.touch.force, this.touch.old, this.touch);


        // this.torque += Vector.cross(this.touch.force, this.touch.old) * 0.0000001;

        // Vector.copy(this.touch.old, this.touch);
      } else {
        if (this.on) {
          // this.target(0, 2);
        } else {
          // this.target(0, 2);
        }
      }
      this.torque *= this.inverseMass;
      this.velocity += this.torque * delta;
      this.rotation += this.velocity * TWO_PI;
    },
    store: function(mouse) {
      // Vector.subtract(this.touch, mouse, this);
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
      Vector.rotate(this.cord.a, this.pin, this.rotation);
      Vector.rotate(this.cord.b, this.rim, this.rotation);
      Vector.add(this.cord.a, this, this.cord.a);
      Vector.add(this.cord.b, this, this.cord.b);
      this.cord.draw(context);
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
      this.setupGUI();
    },

    setupGUI: function() {
      this.gui = new dat.GUI();
      this.deck.folder = this.gui.addFolder('Deck');
      this.deck.folder.open();
      this.deck.folder.add(this.deck, 'on');
      this.deck.folder.add(this.deck, 'rpm', 10, 80);
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

      // Resize and position deck
      var radius = Math.round(Math.min(this.centerX, this.centerY) * 0.7);
      this.deck.setPosition(this.centerX, this.centerY);
      this.deck.setSize(Math.round(radius * 0.05), radius);

      // Resize mouse cord
      this.mouse.cord.radius = this.deck.pinRadius;
      this.mouse.down = false;
      this.draw();
    },

    update: function() {
      Vector.copy(this.mouse.cord.a, this.deck);
      Vector.copy(this.mouse.cord.b, this.mouse);
      this.deck.update(this.dt, this.mouse);
    },

    draw: function() {

      // DECK
      this.strokeStyle = this.palette.west[4];
      this.deck.draw(this);

      // MOUSE
      if (this.mouse.down) {
        this.strokeStyle = this.palette.west[2];
        this.mouse.cord.draw(this);
      }
    },

    mousedown: function() {
      this.container.classList.add('grabbing');
      this.deck.store(this.mouse);
      this.mouse.down = true;
    },

    mouseup: function() {
      this.container.classList.remove('grabbing');
      this.mouse.down = false;
    },

    hit: function(x, y, hx, hy, hw, hh) {
      return x >= hx && x <= hx + hw && y >= hy && y <= hy + hh;
    }

  });

})(window, 'Colorgasm');
