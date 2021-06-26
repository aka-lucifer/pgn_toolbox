export class CallbackManager {

  clientCallbacks: Record<string, CallableFunction> = {}

  constructor() {
    onNet("PGNMenu:ClientCallback:Call", this.EVENT_CallClientCallback.bind(this));
  }

  public RegisterNetCallback(name: string, cb: CallableFunction): void {
    if (this.clientCallbacks[name]) { return; }
    this.clientCallbacks[name] = cb;
  }

  private EVENT_CallClientCallback(name: string, data: any[], returnName: string): void {
    this.clientCallbacks[name](data, (returnData: any[]) => {
      emitNet(`PGNMenu:ClientCallback:Return:${returnName}`, returnData);
    })
  }

}