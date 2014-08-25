(function(window, globalID) {

  window[globalID] = {
    create: function(x, y) {
      return {x:x||0, y:y||0};
    },
    identity: function(target) {
      target.x = 0;
      target.y = 0;
      return target;
    },
    copy: function(target, a) {
      target.x = a.x;
      target.y = a.y;
      return target;
    },
    set: function(target, x, y) {
      target.x = x;
      target.y = y;
      return target;
    },
    subtract: function(target, a, b) {
      target.x = a.x - b.x;
      target.y = a.y - b.y;
      return target;
    },
    add: function(target, a, b) {
      target.x = a.x + b.x;
      target.y = a.y + b.y;
      return target;
    },
    scale: function(target, a, s) {
      target.x = a.x * s;
      target.y = a.y * s;
      return target;
    },
    min: function(target, a, length) {
      if (this.length(a) < length) {
        this.normalise(target, a, length);
      } else {
        this.copy(target, a);
      }
      return target;
    },
    max: function(target, a, length) {
      if (this.length(a) > length) {
        this.normalise(target, a, length);
      } else {
        this.copy(target, a);
      }
      return target;
    },
    clamp: function(target, a, min, max) {
      var length = this.length(a);
      if (length < min) {
        this.normalise(target, a, min);
      } else if (length > max) {
        this.normalise(target, a, max);
      } else {
        this.copy(target, a);
      }
      return target;
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
    },
    cross: function(a, b) {
      return a.x * b.y - a.y * b.x;
    },
    dot: function (a, b) {
      return a.x * b.x + a.y * b.y;
    }
  };

})(window, 'Vector');
