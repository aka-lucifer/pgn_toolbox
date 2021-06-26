export class CallbackManager {
  serverCallbacks: Record<string, CallableFunction> = {}

  constructor() {
    onNet("PGNMenu:ServerCallback:Call", this.EVENT_CallServerCallback.bind(this));
  }

  public RegisterNetCallback(name: string, cb: CallableFunction): void {
    if (this.serverCallbacks[name]) { return; }
    this.serverCallbacks[name] = cb;
  }

  private EVENT_CallServerCallback(name: string, data: any[], returnName: string): void {
    this.serverCallbacks[name](data, (returnData: any[]) => {
      emitNet(`PGNMenu:ServerCallback:Return:${returnName}`, source, returnData);
    });
  }

}