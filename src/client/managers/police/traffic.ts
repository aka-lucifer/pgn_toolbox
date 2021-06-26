import { Blip, Vector3 } from "fivem-js";
import * as Utils from "../../utils";
import { Events } from "../../../shared/enums/events";
import { Client } from "../../client";
import { Speedzone } from "../../models/police/speedzone"

export class TrafficManager {
  private client: Client;
  private speedzones: Speedzone[] = [];

  constructor(client: Client) {
    this.client = client;

    // Events
    onNet(Events.startSpeedzone, this.EVENT_Speedzone.bind(this));
    onNet(Events.removeSpeedzone, this.EVENT_Remove.bind(this));
  }

  // Get Requests
  public get Speedzones(): Speedzone[] {
    return this.speedzones;
  }

  // Methods
  public async Nearest(position: Vector3): Promise<Speedzone> {
    let closest;
    let closestDistance = 1000;
    let justStarted = true;

    this.speedzones.forEach(speedzone => {
      const dist = Utils.Dist(position, speedzone.Position, true);

      if (justStarted) {
        closest = speedzone;
        closestDistance = dist;
        justStarted = false
      }

      if (dist < closestDistance) {
        closest = speedzone;
        closestDistance = dist;
      }
    });

    if (this.client.Debugging) console.log(`Speedzone Data - Entry: ${JSON.stringify(closest)} | Dist: ${closestDistance}`);

    return closest;
  }

  // EVENTS
  private EVENT_Speedzone(position: Vector3, radius: number, speed: number, street: string): void {
    this.speedzones.push(new Speedzone(position, radius, speed, street));
  }

  private EVENT_Remove(speedzone: Record<string, any>): void {
    console.log(`Position: ${JSON.stringify(speedzone.position)}`);
    const index = this.speedzones.findIndex(speedzoneData => speedzoneData.Position.x == speedzone.position.x && speedzoneData.Position.y == speedzone.position.y && speedzoneData.Position.z == speedzone.position.z);
    console.log(`Index: ${index}`);
    if (index != -1) {
      console.log(`Found Match: ${JSON.stringify(this.speedzones[index])}`);
      this.speedzones[index].blip.delete();
      this.speedzones.splice(index, 1);
    }

    if (this.client.Debugging) console.log(`After Removed Speedzones: ${JSON.stringify(this.speedzones)}`);
  }
}