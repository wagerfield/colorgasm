(function(window) {

  var COLORS = {};

  function addColorPalette(id, base, core, west, east) {
    COLORS[id] = {base:base, core:core, west:west, east:east};
  }

  addColorPalette('main',
    '#1E1A31', // Base
    '#FFFFFF', // Core
  [
    '#6B2A64',
    '#B14B77',
    '#E2687C',
    '#F98A75',
    '#FFB46B',
    '#FFE193'
  ],[
    '#4C4690',
    '#4D64B0',
    '#518CBE',
    '#5BAFCD',
    '#72D4E2',
    '#B9F7F5'
  ]);

  Sketch.create({

    setup: function() {
      this.container = document.getElementById('container');
      this.container.style.backgroundColor = COLORS.main.base;
      this.reset();
    },

    reset: function() {
      this.wave = [];
    },

    update: function() {
    },

    draw: function() {
    }

  });

})(window);
