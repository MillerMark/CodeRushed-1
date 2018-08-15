class LocalStorage {
	constructor() {
		
  }

  save() {
    var sessionData = JSON.stringify(designSession);
    window.localStorage.setItem('designSession', sessionData);
  }

  load() {
    var sessionData = window.localStorage.getItem('designSession');
    designSession = JSON.parse(sessionData);
    refresh();
  }
}