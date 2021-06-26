import { Prop, Vector3, Model, World } from "fivem-js";
import { Client } from "../client";
import { WorldProp } from "../models/worldProp";
import { Props } from "../enums/props";
import { Events } from "../../shared/enums/events";
import * as Utils from "../utils";

export class PropManager {
  private client: Client;
  private spawnedProps: WorldProp[] = [];

  constructor (client: Client) {
    this.client = client;
  }

  // Get Requests
  public get GetProps(): any[] {
    return this.spawnedProps;
  }

  public set SetProps(newProps: WorldProp[]) {
    this.spawnedProps = newProps;
  }

  // Methods
  public async New(type: Props, model: Model, position: Vector3): Promise<WorldProp> {
    const propData = new WorldProp(type, model, position);
    const createdProp = await propData.Create();
    this.spawnedProps.push(propData);
    return propData;
  }

  public Find(propHandle: number): any {
    const propIndex = this.spawnedProps.findIndex(prop => prop.data.Handle == propHandle);
    if (propIndex != -1) {
      return this.spawnedProps[propIndex];
    }
  }

  public async Pickup(propHandle: number): Promise<boolean> {
    const propIndex = this.spawnedProps.findIndex(prop => prop.handle == propHandle);
    if (propIndex != -1) {
      new Prop(this.spawnedProps[propIndex].handle).delete();
      Utils.showNotification("~r~Deleted prop!")
      this.spawnedProps.splice(propIndex, 1);
      emitNet(Events.syncProps, this.GetProps);
      return true;
    }

    return false;
  }
}