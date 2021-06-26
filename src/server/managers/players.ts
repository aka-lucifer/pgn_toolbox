import { Server } from "../server";
import { Player } from "../models/player";

export class PlayerManager {
  public server: Server;
  private connectedPlayers: any[] = [];
  
  constructor(server: Server) {
    this.server = server;
  }

  // Get Requests
  public get GetPlayers(): Player[] {
    return this.connectedPlayers;
  }

  // Methods
  public Add(player: Player): number {
    const addedData = this.connectedPlayers.push(player);
    return addedData;
  }

  public async GetPlayer(playerHandle: string): Promise<Player> {
    const playerIndex = this.connectedPlayers.findIndex(player => player.GetHandle == playerHandle);
    if (playerIndex != -1) {
      return this.connectedPlayers[playerIndex];
    }
  }

  public async Remove(playerHandle: string): Promise<boolean> {
    const playerIndex = this.connectedPlayers.findIndex(player => player.GetHandle == playerHandle);
    if (playerIndex != -1) {
      this.connectedPlayers.splice(playerIndex, 1);
      return true;
    }

    return false;
  }
}