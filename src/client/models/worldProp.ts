import { Model, Prop, Vector3, World } from "fivem-js";
import { Props } from "../enums/props";

export class WorldProp {
  public handle: number;
  public type: Props;
  public model: Model;
  public position: Vector3;
  public data: Prop;

  constructor(type: Props, model: Model, position: Vector3) {
    this.type = type;
    this.model = model;
    this.position = position;
  }

  public async Create(): Promise<void> {
    this.data = await World.createProp(this.model, this.position, false, true);
    this.handle = this.data.Handle;
  }
}