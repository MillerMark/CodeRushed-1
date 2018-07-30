var pixelsPerMeter = 200;
class Physics {
	constructor() {
		
  }
  // All time units will be in seconds...
  // All distance units will be in meters...
  static getDisplacement(initialVelocity, time, acceleration) {
    return initialVelocity * time + acceleration * time * time / 2;
  }

  static convertToPixels(meters) {
    return meters * pixelsPerMeter;
  }

  static getFinalVelocity(initialVelocity, time, acceleration) {
    return initialVelocity + acceleration * time;
  }
}