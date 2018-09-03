var Character = (function () {
    function Character(name, torsoFileName, obj) {
        this.x = 300;
        this.y = 240;
        this.torso = new Actor(this.x, this.y, torsoFileName);
        this.name = name;
        this.scale = 1.0;
        this.loadFromDto(obj);
    }
    Character.prototype.loadFromDto = function (obj) {
        for (var prop in obj)
            if (prop != 'torso')
                this[prop] = obj[prop];
        for (var prop in obj)
            if (prop == 'torso')
                this.torso = new Actor(this.x, this.y, obj[prop].svgFile, obj[prop]);
    };
    Character.prototype.loaded = function () {
        console.log('just loaded character: ' + this.name);
    };
    Character.prototype.saving = function () {
        console.log('saving character: ' + this.name);
    };
    Character.prototype.draw = function (ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-this.x, -this.y);
        this.torso.draw(ctx);
        ctx.restore();
    };
    return Character;
}());
//# sourceMappingURL=Character.js.map