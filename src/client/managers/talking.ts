import { Game, Ped, Vector3 } from "fivem-js";
import { Client } from "../client";
import * as Utils from "../utils";

const talkingGamertags: Record<number, any> = {};

export class TalkingManager {
  private client: Client;
  public tick: number;

  constructor(client: Client) {
    this.client = client;
    this.tick = setTick(async() => {
      await Utils.Delay(750); // Maybe change to 500
      const ped = Game.PlayerPed;
      // console.log(this.client.players);
      this.client.players.forEach(element => {
        const player = GetPlayerFromServerId(element.handle);
        if (NetworkIsPlayerActive(player)) {
          // console.log(`player active ${element.name}!`);
          const ped2 = new Ped(GetPlayerPed(player));
          if (ped.Handle != ped2.Handle) {
            // console.log(`players ped ${element.name} is not the same!`);
            if (Utils.Dist(ped.Position, ped2.Position, false) < 15 && HasEntityClearLosToEntity(ped.Handle, ped2.Handle, 17)) {
              // console.log(`Within dist of ${element.name}`);
              talkingGamertags[player] = CreateFakeMpGamerTag(ped2.Handle, "", false, false, "", 0)
              // SetMpGamerTagVisibility(talkingGamertags[player], 12, true)
              // SetMpGamerTagAlpha(talkingGamertags[player], 12, 255)
              if (NetworkIsPlayerTalking(player)) {
                // console.log(`${element.name} is talking!`);
                SetMpGamerTagVisibility(talkingGamertags[player], 12, true)
                SetMpGamerTagAlpha(talkingGamertags[player], 12, 255)
              } else {
                // console.log(`${element.name} is not talking!`);
                SetMpGamerTagVisibility(talkingGamertags[player], 12, false)
              }
            }
          }
        }
      })
    })
  }
}