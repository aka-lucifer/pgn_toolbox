import { Events } from "../../../shared/enums/events";
import { TeleportState } from "../../enums/police/jail";
import { policeManager } from "../../client";
import * as Utils from "../../utils";
import { Game, Vector3 } from "fivem-js";

export class JailManager {
  private startTime: Date;
  private jailTime: number;
  private jailReason: string;
  private mainTick: number = -1;
  private detectTick: number = -1;

  constructor() {
    // Events
    onNet(Events.getJailed, async(time: number, reason: string) => {
      this.startTime = new Date();
      this.jailTime = time;
      this.jailReason = reason;

      await this.Teleport(TeleportState.In);

      this.mainTick = setTick(async() => {
        const newTime = new Date();
        const timeServed = parseInt(((newTime.getTime() - this.startTime.getTime()) / 1000).toFixed(0));
        console.log(`Time - ${timeServed} | ${this.jailTime}`);

        if (timeServed % 7 == 0 && timeServed != this.jailTime && timeServed > 0) { // If current time served is a multiple of five and not equal to the total jail time.
          console.log("is a seven!");
          emit("chat:addMessage", {
              color: [86, 96, 252],
              args: ["Judge", `Time remaining ^*^3${((this.jailTime - timeServed) / 10).toFixed(0)} ^r^0month/s^r^0!`]
          });
        }
        
        if (timeServed >= this.jailTime) {
          console.log("FIN!");
          await this.Teleport(TeleportState.Out);
          clearTick(this.mainTick);
          clearTick(this.detectTick);
          this.mainTick = -1;
          this.detectTick = -1;
          console.log("SET!");
        }
        
        await Utils.Delay(1000);
      })

      this.detectTick = setTick(async () => {
        if (Game.PlayerPed.isInAnyVehicle()) {
          Game.PlayerPed.CurrentVehicle.delete();
        }

        if (Utils.Dist(Game.PlayerPed.Position, new Vector3(1700.6312, 2595.6076, 45.560173), true) >= 250.0) {
          await this.Teleport(TeleportState.Reset);
        }

        if (GetSelectedPedWeapon(Game.PlayerPed.Handle) != GetHashKey("WEAPON_UNARMED")) {
          RemoveAllPedWeapons(Game.PlayerPed.Handle, false);
          SetCurrentPedWeapon(Game.PlayerPed.Handle, GetHashKey("WEAPON_UNARMED"), true);
        }
      });
    });
  }

  // Methods
  private async Teleport(state: TeleportState): Promise<void> {
    if (state == TeleportState.In) {
      Game.PlayerPed.Position = new Vector3(1654.7847, 2607.0598, 45.564857);
      Game.PlayerPed.Heading = 90.770767;
      if (policeManager.cuffsManager.Cuffed) {
        console.log(`Debug: You're cuffed, removing your handscuffs!`);
        await policeManager.cuffsManager.UpdateData(false);
        console.log("removed!");
      }
    } else if (state == TeleportState.Out) {
      Game.PlayerPed.Position = new Vector3(1848.1823, 2585.7985, 45.672008);
      Game.PlayerPed.Heading = 269.22885;
      emit("chat:addMessage", {
          color: [86, 96, 252],
          args: ["Judge", `Enjoy your freedom, remember to follow the law.`]
      });
    } else if (state == TeleportState.Reset) {
      Game.PlayerPed.Position = new Vector3(1654.7847, 2607.0598, 45.564857);
      Game.PlayerPed.Heading = 90.770767;
      emit("chat:addMessage", {
          color: [86, 96, 252],
          args: ["Judge", `Escape is inpossible!`]
      });
    }
  }
}