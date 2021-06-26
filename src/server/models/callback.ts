import { createUUID } from "../utils";

export class ServerCallback {
  private name: string;
  private returnName: string;
  private callback: CallableFunction;

  constructor(name: string, callback: CallableFunction) {
    this.name = name;
    this.returnName = createUUID();
    this.callback = callback;
    onNet(`PGNMenu:ServerCallback:Return:${this.returnName}`, this.callback.bind(this));
  }

  public Fire(sources: string[], data?: any): void {
    sources.forEach(source => {
      emitNet("PGNMenu:ClientCallback:Call", source, this.name, data, this.returnName);
    });
  }
}