Math.PIH = Math.PI / 2;
Math.PI2 = Math.PI * 2;
Math.PIR = Math.PI / 180;
Math.PID = 180 / Math.PI;
Math.rtd = function(radians) {
  return radians * Math.PID;
};
Math.dtr = function(degrees) {
  return degrees * Math.PIR;
};
