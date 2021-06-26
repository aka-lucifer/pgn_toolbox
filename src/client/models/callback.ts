import { createUUID } from "../utils";

export class ClientCallback {
  private name: string;
  private returnName: string;
  private callback: CallableFunction;

  constructor(name: string, callback: CallableFunction) {
    this.name = name;
    this.returnName = createUUID();
    this.callback = callback;
    onNet(`PGNMenu:ClientCallback:Return:${this.returnName}`, this.callback.bind(this));
  }

  public Fire(data?: any): void {
    emitNet("PGNMenu:ServerCallback:Call", this.name, data, this.returnName);
  }
}