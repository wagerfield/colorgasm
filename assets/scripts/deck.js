(function(window, globalID) {

  var Deck = function(rpm, radius, mass) {

    // 12" === 30cm === 0.3m
    this.radius = radius || 0.3;
    this.rpm = rpm || 100/3;

    // Touch Vectors
    this.touch = Vector.create();
    this.touch.radius = Vector.create();
    this.touch.force = Vector.create();
    this.touch.store = Vector.create();
    this.touch.delta = Vector.create();
    this.touch.cord = new Cord(0);

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
    MTM: 1 / 60 / 1000,
    setPosition: function(x, y) {
      this.x = x;
      this.y = y;
    },
    setSize: function(pin, rim) {
      Vector.set(this.pin, this.pinRadius = pin, 0);
      Vector.set(this.rim, this.rimRadius = rim, 0);
      this.touch.cord.radius = this.pinRadius;
    },
    setMass: function(mass) {
      this.inverseMass = 1.0 / (this.mass = mass);
    },
    target: function(value, time) {
    },
    update: function(delta, mouse) {
      this.torque = 0;
      if (mouse.down) {

        // Deck center > mouse
        Vector.subtract(this.touch, mouse, this);

        // Clamp to deck rim radius
        Vector.clamp(this.touch, this.touch, this.pinRadius, this.rimRadius);

        // Calculate delta
        Vector.subtract(this.touch.delta, this.touch, this.touch.store);

        // Store touch
        Vector.copy(this.touch.store, this.touch);

        // Calculate touch length
        this.touch.length = Vector.length(this.touch);

        // Calculate touch scalar
        this.touch.scalar = this.touch.length / this.rimRadius;

        // Calculate delta length
        this.touch.delta.length = Vector.length(this.touch.delta);

        // Calculate delta scalar
        this.touch.delta.scalar = 1;

        // Scale radius vector
        Vector.normalise(this.touch.radius, this.touch, this.touch.scalar);

        // Scale force vector
        Vector.normalise(this.touch.force, this.touch.delta, this.touch.delta.scalar);

        // Calculate torque
        this.torque += Vector.cross(this.touch.radius, this.touch.force) * 0.0001;

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
      Vector.subtract(this.touch, mouse, this);
      Vector.copy(this.touch.store, this.touch);
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
      // Touch
      Vector.copy(this.touch.cord.a, this);
      Vector.add(this.touch.cord.b, this, this.touch);
    }
  };

  window[globalID] = Deck;

})(window, 'Deck');
