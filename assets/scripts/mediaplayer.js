(function(window, globalID) {

  //----------------------------------------
  //
  // MEDIA PLAYER
  //
  //----------------------------------------

  var MediaPlayer = function(type, preload) {
    this.type = /audio|video/.test(type) ? type : 'audio';
    this.element = document.createElement(this.type);
    this.paused = this.element.paused;
    this.volume = this.element.volume;
    this.muted = this.element.muted;
    this.preload(preload || 'auto');
    this.__registry = {};
    this.__event = new MediaPlayerEvent(this.type);
    this.__update = this.__update.bind(this);
    this.__onEvent = this.__onEvent.bind(this);
    this.__addEventListeners();
    this.__update();
  };

  window[globalID] = MediaPlayer;

  //----------------------------------------
  // MEDIA PLAYER PRIVATE API
  //----------------------------------------

  MediaPlayer.prototype.__addEventListeners = function() {
    for (var i = MediaPlayerEvent.EVENTS.length - 1; i >= 0; i--) {
      this.element.addEventListener(MediaPlayerEvent.EVENTS[i], this.__onEvent);
    }
  };

  MediaPlayer.prototype.__removeEventListeners = function() {
    for (var i = MediaPlayerEvent.EVENTS.length - 1; i >= 0; i--) {
      this.element.removeEventListener(MediaPlayerEvent.EVENTS[i], this.__onEvent);
    }
  };

  MediaPlayer.prototype.__getListeners = function(type) {
    if (!this.__registry[type]) {
      this.__registry[type] = [];
    }
    return this.__registry[type];
  };

  MediaPlayer.prototype.__dispatchEvent = function(type) {
    for (var key in this.__event.schema) {
      this.__event.schema[key] = this[key];
    }
    this.__event.schema.target = this;
    this.__event.schema.type = type;
    var listeners = this.__getListeners(type);
    for (var i = listeners.length - 1; i >= 0; i--) {
      listeners[i].call(this, this.__event.schema);
    }
  };

  MediaPlayer.prototype.__update = function() {

    // Set buffer values
    var buffer = this.element.buffered;
    this.bufferStart = buffer.length ? buffer.start(0) : 0;
    this.bufferEnd = buffer.length ? buffer.end(0) : 0;

    // Derive change states
    var ready = !isNaN(this.element.duration);
    var timeChanged = this.currentTime !== this.element.currentTime;
    if (ready && timeChanged) {

      // Set video model progress values
      this.currentTime = this.element.currentTime;
      this.progress = this.element.currentTime / this.element.duration;

      // Dispatch update event
      this.__dispatchEvent(MediaPlayerEvent.TIME_UPDATE);
    }

    // Request animation frame
    this.__raf = requestAnimationFrame(this.__update);
  };

  MediaPlayer.prototype.__onEvent = function(event) {
    switch(event.type) {
      case MediaPlayerEvent.LOADED_META_DATA:
        if (this.type === 'video') {
          this.width = this.element.videoWidth;
          this.height = this.element.videoHeight;
        }
        this.duration = this.element.duration;
        this.playbackRate = this.element.playbackRate;
        this.defaultPlaybackRate = this.element.defaultPlaybackRate;
        break;
      case MediaPlayerEvent.PAUSE:
      case MediaPlayerEvent.PLAYING:
        this.paused = this.element.paused;
        break;
      case MediaPlayerEvent.VOLUME_CHANGE:
        this.volume = this.element.volume;
        this.muted = this.element.muted;
        break;
    }
    this.__dispatchEvent(event.type);
  };

  //----------------------------------------
  // MEDIA PLAYER PUBLIC API
  //----------------------------------------

  MediaPlayer.prototype.addEventListener = function(type, listener) {
    var listeners = this.__getListeners(type),
        index = listeners.indexOf(listener);
    if (index === -1) {
      listeners.push(listener);
    }
  };

  MediaPlayer.prototype.removeEventListener = function(type, listener) {
    var listeners = this.__getListeners(type),
        index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };

  MediaPlayer.prototype.destroy = function() {
    cancelAnimationFrame(this.__raf);
    this.__removeEventListeners();
    this.__event = null;
    this.element = null;
  };

  MediaPlayer.prototype.load = function(fileURL) {
    if(fileURL && this.fileURL !== fileURL) {
      this.fileURL = this.element.src = fileURL;
      this.fileType = this.getFileExtension(fileURL);
      this.element.load();
    }
  };

  MediaPlayer.prototype.play = function() {
    this.element.play();
  };

  MediaPlayer.prototype.pause = function() {
    this.element.pause();
  };

  MediaPlayer.prototype.stop = function() {
    this.pause();
    this.seek(0);
  };

  MediaPlayer.prototype.restart = function() {
    this.seek(0);
    this.play();
  };

  MediaPlayer.prototype.seek = function(time) {
    this.element.currentTime = time;
  };

  MediaPlayer.prototype.scrub = function(ratio) {
    this.seek(this.element.duration * ratio);
  };

  MediaPlayer.prototype.volume = function(value) {
    this.element.volume = value;
  };

  MediaPlayer.prototype.mute = function(value) {
    this.element.muted = value;
  };

  MediaPlayer.prototype.loop = function(value) {
    this.element.loop = value;
  };

  MediaPlayer.prototype.preload = function(value) {
    this.element.preload = value;
  };

  MediaPlayer.prototype.togglePlayback = function() {
    this[this.element.paused ? 'play' : 'pause']();
  };

  MediaPlayer.prototype.toggleLoop = function() {
    this.loop(!this.element.hasAttribute('loop'));
  };

  MediaPlayer.prototype.toggleSound = function() {
    this.mute(!this.element.muted);
  };

  MediaPlayer.prototype.getFileExtension = function(fileURL) {
    var match = fileURL.match(/\.(\w+)$/);
    return match ? match[1] : null;
  };

  //----------------------------------------
  //
  // MEDIA PLAYER EVENT
  //
  //----------------------------------------

  var MediaPlayerEvent = function(type) {
    this.type = null;
    this.target = null;
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

  window[globalID + 'Event'] = MediaPlayerEvent;

  //----------------------------------------
  // MEDIA PLAYER EVENT CONSTANTS
  //----------------------------------------

  MediaPlayerEvent.EVENTS = [
    MediaPlayerEvent.ABORT            = 'abort',
    MediaPlayerEvent.CAN_PLAY         = 'canplay',
    MediaPlayerEvent.CAN_PLAY_THROUGH = 'canplaythrough',
    MediaPlayerEvent.DURATION_CHANGE  = 'durationchange',
    MediaPlayerEvent.EMPTIED          = 'emptied',
    MediaPlayerEvent.ENDED            = 'ended',
    MediaPlayerEvent.ERROR            = 'error',
    MediaPlayerEvent.LOADED_DATA      = 'loadeddata',
    MediaPlayerEvent.LOADED_META_DATA = 'loadedmetadata',
    MediaPlayerEvent.LOAD_START       = 'loadstart',
    MediaPlayerEvent.PAUSE            = 'pause',
    MediaPlayerEvent.PLAY             = 'play',
    MediaPlayerEvent.PLAYING          = 'playing',
    MediaPlayerEvent.PROGRESS         = 'progress',
    MediaPlayerEvent.RATE_CHANGE      = 'ratechange',
    MediaPlayerEvent.RESIZE           = 'resize',
    MediaPlayerEvent.SEEKED           = 'seeked',
    MediaPlayerEvent.SEEKING          = 'seeking',
    MediaPlayerEvent.STALLED          = 'stalled',
    MediaPlayerEvent.SUSPEND          = 'suspend',
    MediaPlayerEvent.TIME_UPDATE      = 'timeupdate',
    MediaPlayerEvent.VOLUME_CHANGE    = 'volumechange',
    MediaPlayerEvent.WAITING          = 'waiting'
  ];

  //----------------------------------------
  // MEDIA PLAYER EVENT PUBLIC API
  //----------------------------------------

  MediaPlayerEvent.prototype.set = function(object) {
    for (var key in this.schema) {
      if (object[key]) {
        this[key] = this.schema[key] = object[key];
      }
    }
  };

  MediaPlayerEvent.prototype.get = function() {
    return this.schema;
  };

})(window, 'MediaPlayer');
