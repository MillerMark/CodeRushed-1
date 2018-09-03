var pixelsPerMeter = 200;
var Physics = (function () {
    function Physics() {
    }
    Physics.metersToPixels = function (meters) {
        return meters * pixelsPerMeter;
    };
    Physics.getDisplacement = function (initialVelocity, time, acceleration) {
        return initialVelocity * time + acceleration * time * time / 2;
    };
    Physics.getFinalVelocity = function (initialVelocity, time, acceleration) {
        return initialVelocity + acceleration * time;
    };
    return Physics;
}());
//# sourceMappingURL=Physics.js.map