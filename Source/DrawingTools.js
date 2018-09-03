var DrawingTools = (function () {
    function DrawingTools() {
    }
    DrawingTools.drawCrossHair = function (ctx, x, y, length, color, message) {
        var crossHairHeight = length;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(x, y - crossHairHeight);
        ctx.lineTo(x, y + crossHairHeight);
        ctx.moveTo(x - crossHairHeight, y);
        ctx.lineTo(x + crossHairHeight, y);
        ctx.stroke();
        if (message) {
            var margin = 5;
            var textX = x + margin;
            var textY = y - margin;
            ctx.font = "18px Arial";
            ctx.fillStyle = "#000";
            ctx.fillText(message, textX, textY);
            ctx.fillStyle = "#fff";
            ctx.fillText(message, textX - 1, textY - 1);
        }
    };
    return DrawingTools;
}());
//# sourceMappingURL=DrawingTools.js.map