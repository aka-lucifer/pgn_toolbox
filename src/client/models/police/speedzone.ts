import { Blip, Vector3, World } from "fivem-js";

let createdSpeedZones = 0;

export class Speedzone {
  public blip: Blip;
  private position: Vector3;
  private radius: number;
  private speed: number;
  private street: string;
  private zone: number;

  constructor(position: Vector3, radius: number, speed: number, street: string) {
    createdSpeedZones++;
    this.position = position;
    this.radius = radius;
    this.speed = speed;
    this.street = street;
    this.blip = World.createBlip(this.position, this.radius);
    SetRadiusBlipEdge(this.blip.Handle, true);
    this.blip.Name = `Speedzone - ${createdSpeedZones}`;
    this.zone = AddRoadNodeSpeedZone(this.position.x, this.position.y, this.position.z, this.radius, this.speed, false);
  }

  // Get Requests
  public get Position(): Vector3 {
    return this.position;
  }
}