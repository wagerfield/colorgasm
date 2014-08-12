(function(window) {

  var COLORS = [];

  function addColorPalette(id, base, core, west, east) {
    var palette = {
      base: base,
      core: core,
      east: east,
      west: west
    };
  }

  addColorPalette('#1E1A31', '#FFFFFF', [
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
      this.container.style.backgroundColor = COLOURS
    },

    update: function() {
    },

    draw: function() {
      this.fillStyle = 'red';
      this.fillRect(0, 0, this.width, this.height);
    }

  });

})(window);
