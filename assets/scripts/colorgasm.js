(function(window, globalID) {

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

    // retina: window.devicePixelRatio > 1,
    container: document.getElementById('stage'),

    setup: function() {
      this.deck = new Deck();
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
      this.deck.setSize(10, radius);

      // Reset mouse
      this.mouse.down = false;
      this.draw();
    },

    update: function() {
      this.deck.update(this.dt, this.mouse);
    },

    draw: function() {

      // DECK
      this.strokeStyle = this.palette.west[4];
      this.deck.draw(this);

      // MOUSE
      if (this.mouse.down) {
        this.strokeStyle = this.palette.east[2];
        this.deck.touch.cord.draw(this);
      }
    },

    mousedown: function() {
      this.container.classList.add('grabbing');
      this.deck.mousedown(this.mouse);
      this.mouse.down = true;
    },

    mouseup: function() {
      this.container.classList.remove('grabbing');
      this.deck.mouseup(this.mouse);
      this.mouse.down = false;
    },

    hit: function(x, y, hx, hy, hw, hh) {
      return x >= hx && x <= hx + hw && y >= hy && y <= hy + hh;
    }

  });

})(window, 'Colorgasm');
