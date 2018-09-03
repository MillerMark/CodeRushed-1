var LocalStorage = (function () {
    function LocalStorage() {
    }
    LocalStorage.prototype.replacer = function (key, value) {
        if (key == "img")
            return undefined;
        else
            return value;
    };
    LocalStorage.prototype.save = function (designSession) {
        var sessionData = JSON.stringify(designSession, this.replacer);
        window.localStorage.setItem('designSession', sessionData);
    };
    LocalStorage.prototype.load = function () {
        var sessionData = window.localStorage.getItem('designSession');
        var designSession = new DesignSession(JSON.parse(sessionData));
        designSession.loaded();
        return designSession;
    };
    return LocalStorage;
}());
//# sourceMappingURL=LocalStorage.js.map