var pixelsPerMeter = 200;

class Physics {
	constructor() {
		
  }

  static metersToPixels(meters: number) {
    return meters * pixelsPerMeter;
  }

  // All time units will be in seconds...
  // All distance units will be in meters...
  static getDisplacement(initialVelocity: number, time: number, acceleration: number) {
    return initialVelocity * time + acceleration * time * time / 2;
  }

  static getFinalVelocity(initialVelocity: number, time: number, acceleration: number) {
    return initialVelocity + acceleration * time;
  }
}