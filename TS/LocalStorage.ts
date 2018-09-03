class LocalStorage {
	constructor() {
		
  }

  replacer(key, value) {
    if (key == "img")
      return undefined;
    else
      return value;
  }

  save(designSession: DesignSession) {
    var sessionData = JSON.stringify(designSession, this.replacer);
    window.localStorage.setItem('designSession', sessionData);
  }

  load(): DesignSession {
    var sessionData = window.localStorage.getItem('designSession');
    var designSession = new DesignSession(JSON.parse(sessionData));
    designSession.loaded();
    return designSession;
  }
}