(function(window, globalID) {

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

  window[globalID] = Cord;

})(window, 'Cord');
