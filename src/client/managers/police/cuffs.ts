import { PoliceManager } from "./main";
import * as Utils from "../../utils";
import { Roles } from "../../../shared/enums/police";
import { Events } from "../../../shared/enums/events";
import { World, Game, Model, Vector3, Ped, Entity, Bone } from "fivem-js";

export class CuffsManager {
  private policeManager: PoliceManager;
  private animDict: string;
  private copAnim: string;
  private perpAnim: string;
  private sceneSoundTime: number;
  private sceneStopTime: number;
  private handcuffProp: number;
  private isCuffed: boolean;
  private cuffTick: number;
  
  constructor(policeManager: PoliceManager) {
    this.policeManager = policeManager;
    this.animDict = "rcmpaparazzo_3";
    this.copAnim = "poppy_arrest_cop";
    this.perpAnim = "poppy_arrest_popm";
    this.sceneSoundTime = 0.635;
    this.sceneStopTime = 0.64;

    DecorRegister("IS_CUFFED", 2);
    DecorSetBool(Game.PlayerPed.Handle, "IS_CUFFED", false);
    this.isCuffed = DecorGetBool(Game.PlayerPed.Handle, "IS_CUFFED");
    
    onNet(Events.startCuffing, async(role: Roles, criminalsId: number = -1) => {
      const myPed = Game.PlayerPed;
      const criminalsPed = new Ped(GetPlayerPed(GetPlayerFromServerId(criminalsId)));
    
      if (!HasAnimDictLoaded(this.animDict)) {
        RequestAnimDict(this.animDict);
        while (!HasAnimDictLoaded(this.animDict)) {
          await Utils.Delay(0);
        }
      }
      
      if (!IsEntityPlayingAnim(myPed.Handle, this.animDict, this.copAnim, 3)) {
    
        if (role == Roles.Police) {
          const perpAnimPosition = criminalsPed.Position;
          if (!this.IsStartPositionInRange(perpAnimPosition)) return;

          if (criminalsPed && !criminalsPed.exists) {
            Utils.Inform(`Event: ${Events.startCuffing}`, "Criminal ped doesn't exist!");
            return;
          }
          
          const myAnimPosition = GetOffsetFromEntityInWorldCoords(criminalsPed.Handle, 0.15, -0.3, 0.0);
          const myAnimRotation = this.GetBackAnimRotation(Roles.Police, myPed.Rotation, criminalsPed.Heading);
    
          await this.AtPedPosition(myPed, criminalsPed, new Vector3(myAnimPosition[0], myAnimPosition[1], myAnimPosition[2]), myAnimRotation.z);
          TaskPlayAnimAdvanced(myPed.Handle, this.animDict, this.copAnim, myAnimPosition[0], myAnimPosition[1], myAnimPosition[2], myAnimRotation.x, myAnimRotation.y, myAnimRotation.z, 8.0, -8.0, 3800, 262152, 0.6, 2, 0);
          await this.WaitForFinish(myPed.Handle, Roles.Police);
          ClearPedTasks(myPed.Handle);
        } else {
          const perpAnimPosition = myPed.Position;
          const perpAnimRotation = this.GetBackAnimRotation(Roles.Criminal, myPed.Rotation, myPed.Heading);
          TaskPlayAnimAdvanced(myPed.Handle, this.animDict, this.perpAnim, perpAnimPosition.x, perpAnimPosition.y, perpAnimPosition.z, perpAnimRotation.x, perpAnimRotation.y, perpAnimRotation.z, 8.0, -8.0, 3800, 262152, 0.6, 2, 0);
          await this.WaitForFinish(myPed.Handle, Roles.Criminal);
    
          if (!HasAnimDictLoaded("mp_arresting")) {
            RequestAnimDict("mp_arresting");
            while (!HasAnimDictLoaded("mp_arresting")) {
              await Utils.Delay(0);
            }
          }

          ClearPedTasks(myPed.Handle);
          SetCurrentPedWeapon(Game.PlayerPed.Handle, GetHashKey("WEAPON_UNARMED"), true);
          await this.UpdateData(true);
          TaskPlayAnim(myPed.Handle, "mp_arresting", "idle", 8.0, -8.0, -1, 49, 0, false, false, false);
          if (this.cuffTick == undefined) {
            this.cuffTick = setTick(() => {
              DisableControlAction(0, 24, true); // Attack
              DisableControlAction(0, 257, true); // Attack 2
              DisableControlAction(0, 25, true); // Aim
              DisableControlAction(0, 263, true); // Melee Attack 1
              DisableControlAction(0, 45, true); // Reload
              DisableControlAction(0, 22, true); // Jump
              DisableControlAction(0, 44, true); // Cover
              DisableControlAction(0, 37, true); // Select Weapon
              DisableControlAction(0, 23, true); // Also 'enter'?
              DisableControlAction(0, 288,  true); // Disable phone
              DisableControlAction(0, 289, true); // Inventory
              DisableControlAction(0, 0, true); // Disable changing view
              DisableControlAction(0, 26, true); // Disable looking behind
              DisableControlAction(0, 73, true); // Disable clearing animation
              DisableControlAction(2, 199, true); // Disable pause screen
              DisableControlAction(0, 59, true); // Disable steering in vehicle
              DisableControlAction(0, 71, true); // Disable driving forward in vehicle
              DisableControlAction(0, 72, true); // Disable reversing in vehicle
              DisableControlAction(2, 36, true); // Disable going stealth
              DisableControlAction(0, 47, true);  // Disable weapon
              DisableControlAction(0, 264, true); // Disable melee
              DisableControlAction(0, 257, true); // Disable melee
              DisableControlAction(0, 140, true); // Disable melee
              DisableControlAction(0, 141, true); // Disable melee
              DisableControlAction(0, 142, true); // Disable melee
              DisableControlAction(0, 143, true); // Disable melee
              DisableControlAction(0, 75, true);  // Disable exit vehicle
              DisableControlAction(27, 75, true); // Disable exit vehicle
              DisableControlAction(0, 68, true); // Vehicle Aim 2
              DisableControlAction(0, 69, true); // Vehicle Shoot
              DisableControlAction(0, 70, true); // Vehicle Aim 2
              DisableControlAction(0, 346, true);
              DisableControlAction(0, 347, true);
              DisableControlAction(0, 91, true);
              DisableControlAction(0, 92, true);

              if (!IsEntityPlayingAnim(Game.PlayerPed.Handle, "mp_arresting", "idle", 3)) {
                TaskPlayAnim(Game.PlayerPed.Handle, "mp_arresting", "idle", 8.0, -8, -1, 49, 0, false, false, false);

                if (!IsEntityAttachedToEntity(this.handcuffProp, Game.PlayerPed.Handle)) {
                  this.HandcuffPed(Game.PlayerPed.Handle);
                }
              }
            })
          }
        }
      }
    });

    onNet(Events.getUncuffed, async(role: Roles, criminalsId: number = -1) => {
      const myPed = Game.PlayerPed;
      
      if (!HasAnimDictLoaded("mp_arresting")) {
        RequestAnimDict("mp_arresting");
        while (!HasAnimDictLoaded("mp_arresting")) {
          await Utils.Delay(0);
        }
      }

      if (role == Roles.Police) {
        emitNet(Events.grabPlayer);
        TaskPlayAnim(myPed.Handle, "mp_arresting", "a_uncuff", 8.0, -8, -1, 49, 0, false, false, false);
        await Utils.Delay(2000);
        ClearPedTasks(myPed.Handle);
        emitNet(Events.grabPlayer);
      } else {
        console.log("RUN ME!");
        if (this.isCuffed) {
          await Utils.Delay(2000);
          const myPed = Game.PlayerPed;
          if (this.cuffTick != undefined) {
            clearTick(this.cuffTick);
            this.cuffTick = undefined;
          }
  
          if (policeManager.cuffsManager.Handcuffs) {
            Entity.fromHandle(policeManager.cuffsManager.Handcuffs).delete();
            policeManager.cuffsManager.Handcuffs = null;
          }
          await this.UpdateData(false);
          ClearPedTasks(myPed.Handle);
        }
      }
    });

    RegisterCommand("cuff", async() => {
      const myPed = Game.PlayerPed;
      if (!HasAnimDictLoaded("mp_arresting")) {
        RequestAnimDict("mp_arresting");
        while (!HasAnimDictLoaded("mp_arresting")) {
          await Utils.Delay(10);
        }
      }

      ClearPedTasks(myPed.Handle);
      SetCurrentPedWeapon(Game.PlayerPed.Handle, GetHashKey("WEAPON_UNARMED"), true);
      await this.UpdateData(true);
      TaskPlayAnim(myPed.Handle, "mp_arresting", "idle", 8.0, -8.0, -1, 49, 0, false, false, false);
      this.HandcuffPed(myPed.Handle);
      this.cuffTick = setTick(() => {
        DisableControlAction(0, 24, true); // Attack
			  DisableControlAction(0, 257, true); // Attack 2
			  DisableControlAction(0, 25, true); // Aim
			  DisableControlAction(0, 263, true); // Melee Attack 1
			  DisableControlAction(0, 45, true); // Reload
			  DisableControlAction(0, 22, true); // Jump
			  DisableControlAction(0, 44, true); // Cover
			  DisableControlAction(0, 37, true); // Select Weapon
			  DisableControlAction(0, 23, true); // Also 'enter'?
			  DisableControlAction(0, 288,  true); // Disable phone
			  DisableControlAction(0, 289, true); // Inventory
			  DisableControlAction(0, 0, true); // Disable changing view
			  DisableControlAction(0, 26, true); // Disable looking behind
			  DisableControlAction(0, 73, true); // Disable clearing animation
			  DisableControlAction(2, 199, true); // Disable pause screen
			  DisableControlAction(0, 59, true); // Disable steering in vehicle
			  DisableControlAction(0, 71, true); // Disable driving forward in vehicle
			  DisableControlAction(0, 72, true); // Disable reversing in vehicle
			  DisableControlAction(2, 36, true); // Disable going stealth
			  DisableControlAction(0, 47, true);  // Disable weapon
			  DisableControlAction(0, 264, true); // Disable melee
			  DisableControlAction(0, 257, true); // Disable melee
			  DisableControlAction(0, 140, true); // Disable melee
			  DisableControlAction(0, 141, true); // Disable melee
			  DisableControlAction(0, 142, true); // Disable melee
			  DisableControlAction(0, 143, true); // Disable melee
			  DisableControlAction(0, 75, true);  // Disable exit vehicle
			  DisableControlAction(27, 75, true); // Disable exit vehicle
        DisableControlAction(0, 68, true); // Vehicle Aim 2
			  DisableControlAction(0, 69, true); // Vehicle Shoot
        DisableControlAction(0, 70, true); // Vehicle Aim 2
        DisableControlAction(0, 346, true);
        DisableControlAction(0, 347, true);
        DisableControlAction(0, 91, true);
        DisableControlAction(0, 92, true);

        if (!IsEntityPlayingAnim(Game.PlayerPed.Handle, "mp_arresting", "idle", 3)) {
          TaskPlayAnim(Game.PlayerPed.Handle, "mp_arresting", "idle", 8.0, -8, -1, 49, 0, false, false, false);

          if (!IsEntityAttachedToEntity(this.handcuffProp, Game.PlayerPed.Handle)) {
            this.HandcuffPed(Game.PlayerPed.Handle);
          }
        }
      })
    }, false)

    RegisterCommand("uncuff", async() => {
      if (this.Cuffed) {
        const myPed = Game.PlayerPed;
        if (this.cuffTick != undefined) {
          clearTick(this.cuffTick);
          this.cuffTick = undefined;
        }

        if (policeManager.cuffsManager.Handcuffs) {
          Entity.fromHandle(policeManager.cuffsManager.Handcuffs).delete();
          policeManager.cuffsManager.Handcuffs = null;
        }
        await this.UpdateData(false);
        ClearPedTasks(myPed.Handle);
      }
    }, false);
  }

  // Get Requests
  public get Cuffed(): boolean {
    return this.isCuffed;
  }

  public get Handcuffs(): number {
    return this.handcuffProp;
  }

  // Set Requests
  public set Handcuffs(newValue: number) {
    this.handcuffProp = newValue;
  }

  // Methods
  private async AtPedPosition(ped1: Ped, ped2: Ped, position: Vector3, heading: number): Promise<boolean> {
    TaskGoStraightToCoord(ped1.Handle, position.x, position.y, position.z, 1.0, 25000, heading, 1);
    while (Utils.Dist(ped1.Position, ped2.Position, false) > 0.9) {
      console.log("not close enough")
      await Utils.Delay(10);
    }

    console.log("close enough");

    return true
  }
  
  private GetBackAnimRotation(role: Roles, coords: Vector3, heading: number): Vector3 {
    if (role == Roles.Police) {
      return new Vector3(coords.x, coords.y, heading + 0.53);
    } else {
      return new Vector3(coords.x, coords.y, coords.z + -38.8);
    }
  }

  private IsStartPositionInRange(startPos: Vector3): boolean {
    const distanceToStartPos = Game.Player.Character.Position.distanceSquared(startPos);
    if( distanceToStartPos < 10.0 ) return true;

    Utils.Inform("IsStartPositionInRange Method", `Destination for scene unusually far: ${distanceToStartPos}`);
    return false;
  }

  private async WaitForFinish(handle: number, role: Roles): Promise<void> {
    const sceneStartTime = 0.6;
    const anim = role == Roles.Police ? this.copAnim : this.perpAnim;
    let currentSceneTime = sceneStartTime;
    let hasCuffEventOccurred = false;
  
    try {
      while (currentSceneTime < this.sceneStopTime) {
        currentSceneTime = GetEntityAnimCurrentTime(handle, this.animDict, anim);
        // console.log(`Curr: ${currentSceneTime} | Stop Scene: ${this.sceneStopTime}`);
        if (!hasCuffEventOccurred && currentSceneTime >= this.sceneSoundTime) {
          console.log(`Role: ${role} | ${Roles.Police} | ${Roles.Criminal}`);
          if (role == Roles.Police) {
            console.log("play sound!");
            // TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 0.2, "", 0.25);
          } else {
            TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 10.0, "handcuffsPutOn", 1.0);
            console.log(`Handcuff handle (${handle})`);
            this.HandcuffPed(handle);
          }
  
          hasCuffEventOccurred = true;
        }
  
        await Utils.Delay(10);
      }
    } catch(error) {
      Utils.Inform("WaitForFinish Method", error.toString());
    }
  }

  private async HandcuffPed(handle: number): Promise<void> {
    console.log(this.handcuffProp);
    console.log(this.handcuffProp == null);
    if (this.handcuffProp == null || Entity.fromHandle(this.handcuffProp) && !Entity.fromHandle(this.handcuffProp).exists) {
      console.log("handcuff person!");
      if (this.handcuffProp) Entity.fromHandle(this.handcuffProp).delete();
      this.handcuffProp = await this.CreateHandCuffs(handle, "p_cs_cuffs_02_s");
      this.AttachHandCuffsToPerp(this.handcuffProp, handle);
    }
  }
  
  private async CreateHandCuffs(playerHandle: number, propName: string): Promise<number> {
    try {
      const model = new Model(propName);
      model.request(250);
  
      if (!model.IsInCdImage || !model.IsValid) return -1;
  
      while (!model.IsLoaded) await Utils.Delay(10);
  
      const ped = new Ped(playerHandle);
  
      if (!ped.exists()) return -1;
  
      const offsetPosition = ped.getOffsetPosition(new Vector3(0.0, 0.0, 0.0));
      const attachPosition = GetPedBoneCoords(playerHandle, Bone.SKEL_R_Hand, offsetPosition.x, offsetPosition.y, offsetPosition.z);
  
      const prop = await World.createProp(model, new Vector3(attachPosition[0], attachPosition[1], attachPosition[2]), false, false);
      model.markAsNoLongerNeeded();
      return prop.Handle;
    } catch (error) {
      Utils.Inform("WaitForFinish Method", error.toString());
      return -1;
    }
  }
  
  private AttachHandCuffsToPerp(cuffsHandler: number, perpHandle: number): void {
    const xPos = 0.01;
    const yPos = 0.075;
    const zPos = 0;
    const xRot = 10;
    const yRot = 45;
    const zRot = 80;
    AttachEntityToEntity(cuffsHandler, perpHandle, GetPedBoneIndex(perpHandle, Bone.SKEL_R_Hand), xPos, yPos, zPos, xRot, yRot, zRot, true,true, false, true, 1, true);
  }

  public async UpdateData(newState: boolean): Promise<void> {
    this.isCuffed = newState;
    DecorSetBool(Game.PlayerPed.Handle, "IS_CUFFED", newState);
    if (!newState) {
      if (this.handcuffProp) Entity.fromHandle(this.handcuffProp).delete();
    }
    console.log(`Cuffed Decor Now: ${DecorGetBool(Game.PlayerPed.Handle, "IS_CUFFED")} | ${this.isCuffed}`);
  }
}