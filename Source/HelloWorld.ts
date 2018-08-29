interface ITypescriptTestingService {

  HelloWorld(name: any): void
}
class TypescriptTestingService implements ITypescriptTestingService {

  public HelloWorld(name: any): void {

    alert("Hello " + name);
  }
}