(function(window, globalID) {

  var Deck = function(rpm, radius, mass) {

    // 12" === 30cm === 0.3m (0.15m radius)
    this.radius = radius || 0.15;
    this.rpm = rpm || 100/3;

    this.i = Vector.create();

    // Touch Vectors
    this.touch = Vector.create();
    this.touch.radius = Vector.create();
    this.touch.store = Vector.create();
    this.touch.delta = Vector.create();
    this.touch.cord = new Cord(0);

    // Sizing Vectors
    this.rim = Vector.create();
    this.pin = Vector.create();
    this.cord = new Cord(0);

    // Modifiers
    this.rotation = 0;
    this.speed = 0;
    this.on = false;

    // Physics
    this.lubricity = 1;
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

      // Reset torque
      this.torque = 0;

      // Scratch velocity
      if (mouse.down) {

        // Set lubricity
        this.lubricity = 1.00;

        // Deck center > mouse
        Vector.subtract(this.touch, mouse, this);

        // Clamp to deck rim radius
        Vector.clamp(this.touch, this.touch, this.pinRadius, this.rimRadius);

        // Calculate touch length
        this.touch.length = Vector.length(this.touch);

        // Calculate touch scalar
        this.touch.scalar = this.touch.length / this.rimRadius;

        // Calculate touch circumference  (C = 2πr)
        this.touch.circumference = this.touch.length * Math.PI2;

        // Scale store length to touch length
        Vector.normalise(this.touch.store, this.touch.store, this.touch.length);

        // Calculate delta
        Vector.subtract(this.touch.delta, this.touch, this.touch.store);

        // Calculate radius
        Vector.normalise(this.touch.radius, this.touch, this.touch.scalar);

        // Store touch
        Vector.copy(this.touch.store, this.touch);

        // Calculate touch torque
        this.touch.torque = Vector.cross(this.touch.radius, this.touch.delta);

        // Calculate velocity
        this.velocity = this.touch.torque / this.touch.circumference;

      } else {

        // Motor torque
        if (this.on) {

          // Set lubricity
          this.lubricity = 1.00;

        // Friction torque
        } else {

          // Set lubricity
          this.lubricity = 0.95;
        }
      }

      // Integrate motion
      this.torque *= this.inverseMass;
      this.velocity += this.torque * delta;
      this.velocity *= this.lubricity;
      this.rotation += this.velocity * TWO_PI;

      // Calculate speed
      this.speed = 0;
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
