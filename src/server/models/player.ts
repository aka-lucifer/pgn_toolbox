import { Events } from "../../shared/enums/events";

export class Player {
    private handle: string;
    private name: string;
    private ping: number;
    private identifiers: Record<string, string>;

    constructor(playerHandle: string) {
        this.handle = playerHandle;
        this.name = GetPlayerName(this.handle);
        this.identifiers = this.GetAllIdentifiers(this.handle.toString());
        this.ping = GetPlayerPing(this.handle);
    }

    // Get Requests
    public get GetHandle(): string {
      return this.handle
    }

    public get Name(): string {
      return this.name
    }

    public get Ping(): number {
      return this.ping
    }

    public get Identifiers(): Record<string, string> {
      return this.identifiers;
    }

    // Methods
    public RefreshPing(): void {
        this.ping = GetPlayerPing(this.handle);
    }

    public async GetIdentifier(type : string): Promise<string> {
      const identifiers : string[] = [];
      const identifierAmount = GetNumPlayerIdentifiers(this.handle.toString());
      for (let a = 0; a < identifierAmount; a++) {
        identifiers[a] = GetPlayerIdentifier(this.handle.toString(), a);
      }
  
      for (let b = 0; b < identifiers.length; b++) {
        if (identifiers[b].includes(type)) {
          // return identifiers[b];
          return identifiers[b];
        }
      }
  
      return "Unknown";
    }
  
    public GetAllIdentifiers(handle: string): Record<string, string>{
      const identifiers: Record<string, string> = {};
      const identCount = GetNumPlayerIdentifiers(handle);
      for (let a = 0; a < identCount; a++) {
        const value = GetPlayerIdentifier(handle, a);
        const index = value.substr(0, value.indexOf(":"));
        identifiers[index] = value
      }
      return identifiers;
    }

    public async TriggerEvent(eventName: Events, ...args: any[]): Promise<void> {
      return emitNet(eventName, this.handle, ...args);
    }
}