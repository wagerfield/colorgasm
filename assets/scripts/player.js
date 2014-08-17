(function(window, globalID) {

  //----------------------------------------
  //
  // PLAYER
  //
  //----------------------------------------

  var Player = function(type) {
    this.type = /audio|video/.test(type) ? type : 'audio';
    this.domElement = document.createElement(this.type);
    this.paused = this.domElement.paused;
    this.volume = this.domElement.volume;
    this.muted = this.domElement.muted;
    this.__update = this.__update.bind(this);
    this.__onEvent = this.__onEvent.bind(this);
    this.__event = new PlayerEvent(this.type);
    this.__addEventListeners();
    this.__update();
  };

  window[globalID] = Player;

  //----------------------------------------
  // PLAYER PRIVATE API
  //----------------------------------------

  Player.prototype.__addEventListeners = function() {
    for (var i = PlayerEvent.EVENTS.length - 1; i >= 0; i--) {
      this.domElement.addEventListener(PlayerEvent.EVENTS[i], this.__onEvent);
    }
  };

  Player.prototype.__removeEventListeners = function() {
    for (var i = PlayerEvent.EVENTS.length - 1; i >= 0; i--) {
      this.domElement.removeEventListener(PlayerEvent.EVENTS[i], this.__onEvent);
    }
  };

  Player.prototype.__dispatch = function(type) {
    this.__event.schema.type = type;
    for (var key in this.__event.schema) {
      this.__event.schema[key] = this[key];
    }
    this.dispatchEvent(this.__event.schema);
  };

  Player.prototype.__update = function() {

    // Set buffer values
    var buffer = this.domElement.buffered;
    this.bufferStart = buffer.length ? buffer.start(0) : 0;
    this.bufferEnd = buffer.length ? buffer.end(0) : 0;

    // Derive change states
    var ready = !isNaN(this.domElement.duration);
    var timeChanged = this.currentTime !== this.domElement.currentTime;
    if (ready && timeChanged) {

      // Set video model progress values
      this.currentTime = this.domElement.currentTime;
      this.progress = this.domElement.currentTime / this.domElement.duration;

      // Dispatch update event
      this.__dispatch(PlayerEvent.TIME_UPDATE);
    }

    // Request animation frame
    this.__raf = requestAnimationFrame(this.__update);
  };

  Player.prototype.__onEvent = function(event) {
    switch(event.type) {
      case PlayerEvent.LOADED_META_DATA:
        if (this.type === 'video') {
          this.width = this.domElement.videoWidth;
          this.height = this.domElement.videoHeight;
        }
        this.duration = this.domElement.duration;
        this.playbackRate = this.domElement.playbackRate;
        this.defaultPlaybackRate = this.domElement.defaultPlaybackRate;
        break;
      case PlayerEvent.PAUSE:
      case PlayerEvent.PLAYING:
        this.paused = this.domElement.paused;
        break;
      case PlayerEvent.VOLUME_CHANGE:
        this.volume = this.domElement.volume;
        this.muted = this.domElement.muted;
        break;
    }
    this.__dispatch(event.type);
  };

  //----------------------------------------
  // PLAYER PUBLIC API
  //----------------------------------------

  Player.prototype.destroy = function() {
    this.__removeEventListeners();
    this.__event = null;
    this.domElement = null;
  };

  Player.prototype.load = function(fileURL) {
    if(fileURL && this.fileURL !== fileURL) {
      this.fileURL = this.domElement.src = fileURL;
      this.fileType = this.getFileExtension(fileURL);
      this.domElement.load();
    }
  };

  Player.prototype.play = function() {
    this.domElement.play();
  };

  Player.prototype.pause = function() {
    this.domElement.pause();
  };

  Player.prototype.stop = function() {
    this.pause();
    this.seek(0);
  };

  Player.prototype.restart = function() {
    this.seek(0);
    this.play();
  };

  Player.prototype.seek = function(time) {
    this.domElement.currentTime = time;
  };

  Player.prototype.scrub = function(ratio) {
    this.seek(this.domElement.duration * ratio);
  };

  Player.prototype.loop = function(value) {
    this.domElement.loop = value;
  };

  Player.prototype.volume = function(value) {
    this.domElement.volume = value;
  };

  Player.prototype.mute = function(value) {
    this.domElement.muted = value;
  };

  Player.prototype.togglePlayback = function() {
    this[this.domElement.paused ? 'play' : 'pause']();
  };

  Player.prototype.toggleLoop = function() {
    this.loop(!this.domElement.hasAttribute('loop'));
  };

  Player.prototype.toggleSound = function() {
    this.mute(!this.domElement.muted);
  };

  Player.prototype.getFileExtension = function(fileURL) {
    var match = fileURL.match(/\.(\w+)$/);
    return match ? match[1] : null;
  };

  //----------------------------------------
  //
  // PLAYER EVENT
  //
  //----------------------------------------

  var PlayerEvent = function(type) {
    this.type = null;
    this.fileURL = null;
    this.fileType = null;
    this.playbackRate = null;
    this.defaultPlaybackRate = null;
    this.bufferStart = null;
    this.bufferEnd = null;
    this.paused = null;
    this.currentTime = null;
    this.duration = null;
    this.progress = null;
    this.volume = null;
    this.muted = null;
    if (type === 'video') {
      this.width = null;
      this.height = null;
    }
    this.schema = {};

    // Build schema
    var OMIT = ['schema'];
    for (var key in this) {
      if (typeof this[key] !== 'function' && OMIT.indexOf(key) === -1) {
        this.schema[key] = this[key];
      }
    }
  };

  window[globalID + 'Event'] = PlayerEvent;

  //----------------------------------------
  // PLAYER EVENT CONSTANTS
  //----------------------------------------

  PlayerEvent.EVENTS = [
    PlayerEvent.ABORT            = 'abort',
    PlayerEvent.CAN_PLAY         = 'canplay',
    PlayerEvent.CAN_PLAY_THROUGH = 'canplaythrough',
    PlayerEvent.DURATION_CHANGE  = 'durationchange',
    PlayerEvent.EMPTIED          = 'emptied',
    PlayerEvent.ENDED            = 'ended',
    PlayerEvent.ERROR            = 'error',
    PlayerEvent.LOADED_DATA      = 'loadeddata',
    PlayerEvent.LOADED_META_DATA = 'loadedmetadata',
    PlayerEvent.LOAD_START       = 'loadstart',
    PlayerEvent.PAUSE            = 'pause',
    PlayerEvent.PLAY             = 'play',
    PlayerEvent.PLAYING          = 'playing',
    PlayerEvent.PROGRESS         = 'progress',
    PlayerEvent.RATE_CHANGE      = 'ratechange',
    PlayerEvent.RESIZE           = 'resize',
    PlayerEvent.SEEKED           = 'seeked',
    PlayerEvent.SEEKING          = 'seeking',
    PlayerEvent.STALLED          = 'stalled',
    PlayerEvent.SUSPEND          = 'suspend',
    PlayerEvent.TIME_UPDATE      = 'timeupdate',
    PlayerEvent.VOLUME_CHANGE    = 'volumechange',
    PlayerEvent.WAITING          = 'waiting'
  ];

  //----------------------------------------
  // PLAYER EVENT PUBLIC API
  //----------------------------------------

  Player.prototype.set = function(object) {
    for (var key in this.schema) {
      if (object[key]) {
        this[key] = this.schema[key] = object[key];
      }
    }
  };

  Player.prototype.get = function() {
    return this.schema;
  };

})(window, 'Player');
