import { Control, Game } from "fivem-js";
import { Events } from "../../shared/enums/events";
import * as Utils from "../utils";

export class HospitalManager {
  private hospitalData: Record<string, any> = {};

  constructor() {
    
    // Events
    onNet(Events.getHospitalized, this.EVENT_Hospitalize.bind(this));
  }

  // Events
  

  private async EVENT_Hospitalize(hospital: any[], bed: Record<string, any>): Promise<void> {
    this.hospitalData.hospital = hospital;
    this.hospitalData.bed = bed;
    
    await Utils.loadAnimation("anim@gangops@morgue@table@");

    DoScreenFadeOut(1000);
    while (!IsScreenFadedOut()) {
      await Utils.Delay(100);
    }

    await Utils.Delay(3000);

    if (IsPedDeadOrDying(Game.PlayerPed.Handle, true) || DecorGetBool(Game.PlayerPed.Handle, "PLAYER_DEAD")) {
      const pedPos = Game.PlayerPed.Position;
      NetworkResurrectLocalPlayer(pedPos.x, pedPos.y, pedPos.z, Game.PlayerPed.Heading, false, false);
      DecorSetBool(Game.PlayerPed.Handle, "PLAYER_DEAD", false);
    }

    DoScreenFadeOut(1);
    Game.PlayerPed.IsInvincible = true;

    await Utils.loadAnimation("anim@gangops@morgue@table@");

    SetEntityCoords(Game.PlayerPed.Handle, this.hospitalData.bed.x, this.hospitalData.bed.y, this.hospitalData.bed.z, false, false, false, false);
    TaskPlayAnim(Game.PlayerPed.Handle, "anim@gangops@morgue@table@", "ko_front", 8.0, 1.0, -1, 1, 0, false, false, false);

    DoScreenFadeIn(1000);
    await Utils.Delay(1000);
    FreezeEntityPosition(Game.PlayerPed.Handle, true);
    this.hospitalData.inBed = true;
    Utils.showNotification("Press ~y~E ~w~to get out of the bed");

    this.hospitalData.tick = setTick(async() => {
      if (this.hospitalData.inBed) {
        if (IsControlJustReleased(0, Control.Pickup)) {
          await Utils.loadAnimation("switch@franklin@bed");

          DoScreenFadeOut(1000);
          while (!IsScreenFadedOut()) {
            await Utils.Delay(100);
          }

          Game.PlayerPed.clearBloodDamage();
          Game.PlayerPed.IsInvincible = false;

          TaskPlayAnim(Game.PlayerPed.Handle, "switch@franklin@bed", "sleep_getup_rubeyes", 100.0, 1.0, -1, 8, -1, false, false, false);
          await Utils.Delay(1000);
          DoScreenFadeIn(1000);
          await Utils.Delay(4000);

          ClearPedTasks(Game.PlayerPed.Handle);
          FreezeEntityPosition(Game.PlayerPed.Handle, false);
          if (DecorGetBool(Game.PlayerPed.Handle, "IS_CUFFED")) {
            if (!HasAnimDictLoaded("mp_arresting")) {
              RequestAnimDict("mp_arresting");
              while (!HasAnimDictLoaded("mp_arresting")) {
                await Utils.Delay(0);
              }
            }
            TaskPlayAnim(Game.PlayerPed.Handle, "mp_arresting", "idle", 8.0, -8.0, -1, 49, 0, false, false, false);
          }

          emitNet(Events.exitBed, this.hospitalData.hospital, this.hospitalData.bed);
          clearTick(this.hospitalData.tick);
          this.hospitalData = {};
        }
      }
    });
  }
}