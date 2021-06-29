import { Menu } from "./models/menu/menu";
import { WorldProp } from "./models/worldProp";

import { CallbackManager } from "./managers/callbacks";
import { MenuManager } from "./managers/menu";
import { PropManager } from "./managers/props";
import { PoliceManager } from "./managers/police/main";
import { TrafficManager } from "./managers/police/traffic";
import { TalkingManager } from "./managers/talking";
import { HospitalManager } from "./managers/hospital";
import { JailManager } from "./managers/police/jail";

import { Doors, Windows, Bones } from "./enums/vehicle";
import { Props } from "./enums/props";
import { Events } from "../shared/enums/events";
import Config from "../configs/client.json";
import * as Utils from "./utils";
import { World, Game, Vehicle, Model, Control, WeaponHash, Entity, VehicleSeat, Vector3, Camera, Font } from "fivem-js";

const sadotProps = {
  ["Flagger Paddle"]: "prop_flagger_sign_01",
  ["Scene Lights"]: "prop_worklight_03b",
  ["Large Striped Cone"]: "prop_roadcone01a",
  ["Large Cone"]: "prop_roadcone01c",
  ["Medium Striped Cone"]: "prop_roadcone02a",
  ["Medium Cone"]: "prop_roadcone02c",
  ["Delineator"]: "prop_mp_cone_04",
  ["Road Work Flag"]: "prop_consign_flag_01",
  ["Work Crew Flag"]: "prop_consign_flag_21",
  ["Utility Work Flag"]: "prop_consign_flag_18",
  ["Shoulder Work Flag"]: "prop_consign_flag_19",
  ["Right Lane Closed Flag"]: "prop_consign_flag_02",
  ["Left Lane Closed Flag"]: "prop_consign_flag_03",
  ["Right Lane Ends Flag"]: "prop_consign_flag_04",
  ["Left Lane Ends Flag"]: "prop_consign_flag_05",
  ["Keep Left Flag"]: "prop_consign_flag_13",
  ["Keep Right Flag"]: "prop_consign_flag_14",
  ["Flagger Ahead Flag"]: "prop_consign_flag_08",
  ["Flagger Symbol Flag"]: "prop_consign_flag_06",
  ["Prepare to Stop Flag"]: "prop_consign_flag_07",
  ["Road Closed Ahead Flag"]: "prop_consign_flag_10",
  ["Road Closed Flag"]: "prop_consign_flag_09",
  ["Detour Ahead Flag"]: "prop_consign_flag_25",
  ["Detour Left/Right Flag"]: "prop_consign_flag_26",
  ["Detour Left Flag"]: "prop_consign_flag_27",
  ["Detour Right Flag"]: "prop_consign_flag_28",
  ["Detour Straight Flag"]: "prop_consign_flag_29",
  ["Traffic Incident Flag"]: "prop_consign_flag_11",
  ["Emergency Scene Flag"]: "prop_consign_flag_22",
  ["Road Flooded Flag"]: "prop_consign_flag_15",
  ["Fire Activity Flag"]: "prop_consign_flag_16",
  ["Tow Truck Flag"]: "prop_consign_flag_17",
  ["Check Point Flag"]: "prop_consign_flag_12",
  ["Pilot Car Flag"]: "prop_consign_flag_23",
  ["Fines Doubled Flag"]: "prop_consign_flag_24",
  ["Mower Ahead Flag"]: "prop_consign_flag_20",
  ["Slow Flag"]: "prop_consign_flag_30",
  ["Stop Flag"]: "prop_consign_flag_stop",
  ["Custom Flag"]: "prop_consign_flag_custom",
  ["Road Work Barrier"]: "prop_barrier_sign_01",
  ["Work Crew Barrier"]: "prop_barrier_sign_21",
  ["Utility Work Barrier"]: "prop_barrier_sign_18",
  ["Shoulder Work Barrier"]: "prop_barrier_sign_19",
  ["Right Lane Closed Barrier"]: "prop_barrier_sign_02",
  ["Left Lane Closed Barrier"]: "prop_barrier_sign_03",
  ["Right Lane Ends Barrier"]: "prop_barrier_sign_04",
  ["Left Lane Ends Barrier"]: "prop_barrier_sign_05",
  ["Keep Left Barrier"]: "prop_barrier_sign_13",
  ["Keep Right Barrier"]: "prop_barrier_sign_14", 
  ["Flagger Ahead Barrier"]: "prop_barrier_sign_08",
  ["Flagger Symbol Barrier"]: "prop_barrier_sign_06",
  ["Prepare to Stop Barrier"]: "prop_barrier_sign_07",
  ["Road Closed Ahead Barrier"]: "prop_barrier_sign_10",
  ["Road Closed Barrier"]: "prop_barrier_sign_09",
  ["Detour Ahead Barrier"]: "prop_barrier_sign_25",
  ["Detour Arrow Barricade"]: "prop_barrier_sign_detour",
  ["Detour Left/Right Barrier"]: "prop_barrier_sign_26",
  ["Detour Left Barrier"]: "prop_barrier_sign_27",
  ["Detour Right Barrier"]: "prop_barrier_sign_28",
  ["Detour Straight Barrier"]: "prop_barrier_sign_29",
  ["Traffic Incident Barrier"]: "prop_barrier_sign_11",
  ["Emergency Scene Barrier"]: "prop_barrier_sign_22",
  ["Road Flooded Barrier"]: "prop_barrier_sign_15",
  ["Fire Activity Barrier"]: "prop_barrier_sign_16",
  ["Tow Truck Barrier"]: "prop_barrier_sign_17",
  ["Check Point Barrier"]: "prop_barrier_sign_12",
  ["Pilot Car Barrier"]: "prop_barrier_sign_23",
  ["Fines Doubled Barrier"]: "prop_barrier_sign_24",
  ["Mower Ahead Barrier"]: "prop_barrier_sign_20",
  ["Slow Barrier"]: "prop_barrier_sign_30",
  ["Custom Barrier"]: "prop_barrier_sign_custom",
  ["Stop Barrier"]: "prop_barrier_sign_stop",
  ["Police Barricade"]: "prop_barrier_work05",
  ["Striped Barricade"]: "prop_barrier_work06a",
  ["Road Work Barricade"]: "prop_barrier_work06b",
  ["Street Closed Barricade"]: "prop_barrier_work06c",
  ["Sidewalk Closed Barricade"]: "prop_barrier_work06d",
  ["Road Barrel w/ Base"]: "prop_barrier_wat_03a",
  ["Road Barrel"]: "prop_barrier_wat_03b",
  ["Small Barricade"]: "prop_barrier_work01a",
  ["Small Barricade w/ Light"]: "prop_barrier_work02a",
  ["Road Work Type-III Barricade"]: "prop_barrier_work04a",
  ["Type-III Barricade (Left)"]: "prop_barrier_work04b",
  ["Type-III Barricade (Right)"]: "prop_barrier_work04br",
  ["Type-III Barricade (Left w/ lights)"]: "prop_barrier_work04c",
  ["Type-III Barricade (Right w/ lights)"]: "prop_barrier_work04cr",
  ["Type-III Road Closed (Left)"]: "prop_barrier_work04dx",
  ["Type-III Road Closed (Right)"]: "prop_barrier_work04drx",
  ["Type-III Road Closed (Left w/ lights)"]: "prop_barrier_work04d",
  ["Type-III Road Closed (Right w/ light)"]: "prop_barrier_work04dr",
  ["Type-III Detour (Left)"]: "prop_barrier_work04ex",
  ["Type-III Detour (Right)"]: "prop_barrier_work04erx",
  ["Type-III Detour (Left w/ lights)"]: "prop_barrier_work04e",
  ["Type-III Detour (Right w/ lights)"]: "prop_barrier_work04er",
  ["Left Arrow Board"]: "prop_trafficdiv_01",
  ["Right Arrow Board"]: "prop_trafficdiv_02"
}

export class Client {
  private debug: boolean;
  public damageProcessor: boolean;
  public players: any[] = [];
  public usingInput: boolean;
  private initialSpawn: boolean;

  // Civilian Data
  private handsData: Record<string, any> = {};
  private kidnapData: Record<string, any> = {};
  
  // Vehicle Data
  private vehicle: Vehicle;
  private openedWindows: any[] = [];

  // Prop Data
  private propTick: number;
  private spikeAmount: number = 1;

  // Speedzone Data
  private radius: number = 25;
  private speed: number = 0;
  
  // Shield Data
  private shieldData: Record<string, any> = {};

  // Jail Data
  private jailID: number;
  private jailTime: number;
  private jailReason: string;

  constructor() {
    this.debug = Config.debug;
    this.damageProcessor = Config.repairDisabler;
    this.usingInput = false;
    this.initialSpawn = true;

    // Events
    on(Events.resourceStart, this.EVENT_Restart.bind(this));
    on(Events.resourceStop, this.EVENT_Unload.bind(this));

    onNet(Events.syncPlayers, this.EVENT_Sync.bind(this));
    onNet(Events.updateProps, this.EVENT_UpdateProps.bind(this));

    onNet(Events.setKidnapped, this.EVENT_Kidnap);
    onNet(Events.showNotification, this.EVENT_Notification);
    onNet(Events.recieveAdvert, this.EVENT_Advert);

    // Menu Handler
    RegisterKeyMapping("+-open_pgn_menu", "Opens the PGN Interaction Menu", "keyboard", "f5");

    RegisterCommand("+handsup", async() => {if (!IsPedInAnyVehicle(Game.PlayerPed.Handle, false)) { await this.ToggleHands() } }, false);
    RegisterKeyMapping("+handsup", "Toggles your characters hands up", "keyboard", "H")

    RegisterCommand("+-open_pgn_menu", async() => {
      this.vehicle = Game.Player.Character.CurrentVehicle;
      const menu = new Menu("Im a fat cunt and my name is tyler", GetCurrentResourceName(), "middle-right");
    
      // Police Submenu
      const policeMenu = menu.Submenu("Police");

      // Police Actions
      const policeActions = policeMenu.Submenu("Actions");

      policeActions.Button("Cuff Player", () => {
        emitNet(Events.cuffPlayer);
      });

      policeActions.Button("Uncuff Player", () => {
        emitNet(Events.uncuffPlayer);
      });

      policeActions.Button("Grab Player", () => {
        emitNet(Events.grabPlayer);
      });

      policeActions.Button("Seat Player", async() => {
        await policeManager.interactionsManager.SeatPlayer();
      });

      policeActions.Button("Unseat Player", async() => {
        await policeManager.interactionsManager.UnseatPlayer();
      });

      policeActions.Button("Jail Player", async() => {
        this.jailID = parseInt(await Utils.KeyboardInput("Server ID", 4));
        if (this.jailID && this.jailID > 0) {
          if (this.Debugging) console.log(`Player ID: ${GetPlayerFromServerId(this.jailID)}`);
          if (GetPlayerFromServerId(this.jailID) > 0) {
            this.jailTime = parseInt(await Utils.KeyboardInput("Seconds", 10));
            if (this.jailTime && this.jailTime > 0) {
              this.jailReason = await Utils.KeyboardInput("Reason", 250);
              if (this.jailReason.length <= 0) this.jailReason = "NONE";
              Utils.showNotification(this.jailReason != "NONE" ? `Jailing ~y~${GetPlayerName(GetPlayerFromServerId(this.jailID))} ~w~for ~y~${this.jailReason}~w~, for ~y~${(this.jailTime / 10).toFixed(0)} ~w~months.` : `Jailing ~y~${GetPlayerName(GetPlayerFromServerId(this.jailID))} ~w~for ~y~${(this.jailTime / 10).toFixed(0)} ~w~months.`);
              emitNet(Events.jailPlayer, this.jailID, this.jailTime, this.jailReason);
            } else {
              Utils.showNotification("~r~You didn't enter a valid jail time!");
            }
          } else {
            Utils.showNotification(`~r~There is no player online with the server ID - ${this.jailID}!`);
          }
        } else {
          Utils.showNotification("~r~You didn't enter a valid server ID!");
        }
      });

      // Police Props
      const policeProps = policeMenu.Submenu("Props");

      // SPIKE STRIPS
      const spikeMenu = policeProps.Submenu("Spikestrips");
      spikeMenu.List("How Many?", [1, 2, 3, 4, 5, 6], (itemIndex, selectedItem) => {
        this.spikeAmount = selectedItem;
      });

      spikeMenu.Button("Spawn", async() => {
        await this.CreateProp(Props.Spikestrip, new Model("P_ld_stinger_s"), this.spikeAmount);
      });

      // CONES
      const cones = policeProps.List("Cone", ["Medium Cone", "Medium Cone (Plain)", "Small Cone", "Small Cone (Plain)", "Stick Cone"], (itemIndex, selectedItem) => {
        let item;
        switch (itemIndex) {
          case 0: 
            item = "prop_roadcone01a";
            break;
          case 1: 
            item = "prop_roadcone01c";
            break;
          case 2: 
            item = "prop_roadcone02a";
            break;
          case 3: 
            item = "prop_roadcone02c";
            break;
          case 4: 
            item = "prop_barprop_mp_cone_04rier_work06c";
            break;
        }

        this.CreateProp(Props.Cone, new Model(item), 1);
      });

      // BARRIERS
      const barriers = policeProps.List("Barrier", ["Emergency Scene", "Do Not Cross (Blue)", "Striped (Orange | White)", "[Lights] Striped"], (itemIndex, selectedItem) => {
        let item;
        switch (itemIndex) {
          case 0: 
            item = "prop_barrier_sign_22";
            break;
          case 1: 
            item = "prop_barrier_work05";
            break;
          case 2: 
            item = "prop_barrier_work06a";
            break;
          case 3: 
            item = "prop_barrier_work06c";
            break;
        }

        this.CreateProp(Props.Barrier, new Model(item), 1);
      });
      
      policeProps.Checkbox("Shield", this.shieldData.created || false, async(newState) => {
        this.shieldData.created = newState;

        if (this.shieldData.created) {
          // if (!HasAnimDictLoaded("combat@gestures@gang@pistol_1h@beckon")) {
          //   Utils.loadAnimation("combat@gestures@gang@pistol_1h@beckon");
          // }
          RequestAnimDict('combat@gestures@gang@pistol_1h@beckon')
          while (!HasAnimDictLoaded('combat@gestures@gang@pistol_1h@beckon')) {
            await Utils.Delay(100)
          }

          TaskPlayAnim(Game.PlayerPed.Handle, 'combat@gestures@gang@pistol_1h@beckon', '0', 8.0, -8.0, -1, (2 + 16 + 32), 0.0, false, false, false);
          const shield = new Model("prop_ballistic_shield");
          shield.request(5000);

          this.shieldData.prop = await World.createProp(shield, Game.PlayerPed.Position, false, false);
          this.shieldData.prop.IsPersistent = true;
          this.shieldData.prop.IsInvincible = true;
          AttachEntityToEntity(this.shieldData.prop.Handle, Game.PlayerPed.Handle, GetEntityBoneIndexByName(Game.PlayerPed.Handle, 'IK_L_Hand'), 0.0, -0.05, -0.10, -30.0, 180.0, 40.0, false, false, true, false, 0, true);
          SetWeaponAnimationOverride(Game.PlayerPed.Handle, 'Gang1H')

          if (HasPedGotWeapon(Game.PlayerPed.Handle, GetHashKey("WEAPON_COMBATPISTOL"), false)) {
            SetCurrentPedWeapon(Game.PlayerPed.Handle, GetHashKey("WEAPON_COMBATPISTOL"), true);
          } else {
            const [bool, maxWeapAmmo] = GetMaxAmmo(Game.PlayerPed.Handle, WeaponHash.CombatPistol);
            Game.PlayerPed.giveWeapon(WeaponHash.CombatPistol, maxWeapAmmo, false, true);
          }

          SetEnableHandcuffs(Game.PlayerPed.Handle, true);
        } else {
          clearTick(this.shieldData.tick);
          this.shieldData.prop.delete();
          ClearPedTasks(Game.PlayerPed.Handle);
          SetWeaponAnimationOverride(Game.PlayerPed.Handle, "Default");
          SetEnableHandcuffs(Game.PlayerPed.Handle, false);
        }
      });

      // Police Speedzones
      const policeZones = policeMenu.Submenu("Speedzones");
      policeZones.List("Radius", [25, 50, 75, 100, 125, 150, 175, 200], (itemIndex, selectedItem) => {
        this.radius = selectedItem;
      });
      
      policeZones.List("Speed", [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50], (itemIndex, selectedItem) => {
        this.speed = selectedItem;
      });

      policeZones.Button("Create Speedzone", () => {
        const myPos = Game.PlayerPed.Position;
        const streets = GetStreetNameAtCoord(myPos.x, myPos.y, myPos.z);
        const street = GetStreetNameFromHashKey(streets[0]);
        const crossing = GetStreetNameFromHashKey(streets[1]);
        if (this.Debugging) console.log(`Streets | [Street - ${streets[0]}]: ${street} | [Crossing - ${streets[1]}]: ${crossing}`);
        emitNet(Events.createSpeedzone, myPos, this.radius, this.speed, street, crossing);
      });

      policeZones.Button("Delete Nearest Speedzone", async() => {
        const nearest = await trafficManager.Nearest(Game.PlayerPed.Position);
        // const speedzonePos = nearest.position;
        // Utils.showNotification(`Deleting Speedzone at ~b~Vector3(${speedzonePos.x.toFixed(2)}, ${speedzonePos.y.toFixed(2)}, ${speedzonePos.z.toFixed(2)})~w~.`);
        emitNet(Events.deleteSpeedzone, nearest);
      });

      // Fire Submenu
      const fireMenu = menu.Submenu("Fire/EMS");
      
      // Fire Actions
      fireMenu.Button("Grab Player", () => {
        emitNet(Events.grabPlayer);
      });

      fireMenu.Button("Seat Player", async() => {
        await policeManager.interactionsManager.SeatPlayer();
      });

      fireMenu.Button("Unseat Player", async() => {
        await policeManager.interactionsManager.UnseatPlayer();
      });

      fireMenu.Button("Hospitalize Player", async() => {
        const serverID = await Utils.KeyboardInput("Enter Server ID", 10);
        const playerIndex = this.players.findIndex(player => player.handle == serverID);
        if (playerIndex != -1) {
          Utils.showNotification(`~y~Player Found: ~w~${this.players[playerIndex].name}`);
          emitNet(Events.startHospitalize, playerIndex);
        } else {
          Utils.showNotification(`~r~No player found with ID (${serverID})!`);
        }
      })

      // Civ Submenu
      const civMenu = menu.Submenu("Civilian");

      // Civ Actions
      const civActions = civMenu.Submenu("Actions")
      
      const handsUp = civActions.Checkbox("Hands Up", this.handsData.state ? this.handsData.state == "START_HANDS" || this.handsData.state == "HANDS_UP" : false, async(newState) => {
        await this.ToggleHands();
      })
      
      civActions.Checkbox("Kneel With Hands", this.handsData.state ? this.handsData.state == "START_KNEELING" || this.handsData.state == "KNEELING" : false, async(newState) => {
        if (!IsPedInAnyVehicle(Game.Player.Character.Handle, false)) {
          if (!HasAnimDictLoaded("random@arrests")) {
            Utils.loadAnimation("random@arrests");
          }
      
          if (!HasAnimDictLoaded("random@arrests@busted")) {
            Utils.loadAnimation("random@arrests@busted");
          }

          if (this.handsData.state == "HANDS_UP") {
            menuManager.UpdateState(handsUp, false);
            StopAnimTask(Game.PlayerPed.Handle, "rcmminute2", "arrest_walk", 1.0);
            clearTick(this.handsData.tick);
            this.handsData.state = "DOWN";
          }

          if (this.handsData.state == null || this.handsData.state == "DOWN" && !IsEntityPlayingAnim(Game.PlayerPed.Handle, "random@arrests", "kneeling_arrest_idle", 3)) {
            this.handsData.state = "START_KNEELING";
            TaskPlayAnim(Game.PlayerPed.Handle, "random@arrests", "idle_2_hands_up", 8.0, 1.0, -1, 2, 0, false, false, false);
            await Utils.Delay(4000);
            TaskPlayAnim(Game.PlayerPed.Handle, "random@arrests", "kneeling_arrest_idle", 8.0, 1.0, -1, 2, 0, false, false, false);
            this.handsData.state = "KNEELING"

            this.handsData.tick = setTick(() => {
              if (this.vehicle && this.vehicle.exists) {
                DisableControlAction(0, 24, true); // Attack
                DisableControlAction(0, 257, true); // Attack 2
                DisableControlAction(0, 71, true); // accelerate
                DisableControlAction(0, 72, true); // brake/reverse
                DisableControlAction(0, 74, true); // headlight
                DisableControlAction(0, 63, true); // steer l
                DisableControlAction(0, 64, true); // steer r
                DisableControlAction(0, 59, true); // steer r
                DisableControlAction(0, 278, true); // steer r
                DisableControlAction(0, 279, true); // steer r
                DisableControlAction(0, 68, true); // driveby aim
                DisableControlAction(0, 69, true); // driveby fire_flames
                DisableControlAction(0, 76, true); // handbrake
                DisableControlAction(0, 102, true); // handbrake		
                DisableControlAction(0, 81, true); // RadioNext
                DisableControlAction(0, 82, true); // RadioPrevious
                DisableControlAction(0, 83, true); // RadioPCNext
                DisableControlAction(0, 84, true); // RadioPCPrevious
                DisableControlAction(0, 85, true); // RadioWheel 
                DisableControlAction(0, 86, true); // horn
                DisableControlAction(0, 106, true); // mouse drive
                DisableControlAction(0, 102, true); // veh jump
              } else {
                DisableControlAction(0, 24, true); // Attack
                DisableControlAction(0, 257, true); // Attack 2
                DisableControlAction(0, 22, true); // jump
                DisableControlAction(0, 24, true); // fire_flames
                DisableControlAction(0, 25, true); // aim
                DisableControlAction(0, 36, true); // stealth
                DisableControlAction(0, 45, true); // reload
                DisableControlAction(0, 47, true); // det grenade
                DisableControlAction(0, 140, true); // melee lt
                DisableControlAction(0, 141, true); // melee hvy
                DisableControlAction(0, 143, true); // melee dodge
                DisableControlAction(0, 142, true); // idk
              }
            })
          } else {
            this.handsData.state = "STOP_KNEELING"
            TaskPlayAnim(Game.PlayerPed.Handle, "random@arrests@busted", "exit", 8.0, 1.0, -1, 2, 0, false, false, false);
            await Utils.Delay(3000);
            TaskPlayAnim(Game.PlayerPed.Handle, "random@arrests", "kneeling_arrest_get_up", 8.0, 1.0, -1, 128, 0, false, false, false);
            this.handsData.state = "DOWN"
            clearTick(this.handsData.tick);
          }
        } else {
          Utils.showNotification("~r~You can't do this inside a vehicle!");
        }
      })

      civActions.Button("Drop Weapon", async() => {
        const ped = Game.Player.Character;
        const currWeapon = GetSelectedPedWeapon(ped.Handle);
        if (currWeapon != GetHashKey("WEAPON_UNARMED")) {
          Utils.loadAnimation("pickup_object");
          TaskPlayAnim(ped.Handle, "pickup_object", "pickup_low", 8.0, -8, 1500, 49, 0, false, false, false);

          await Utils.Delay(1000)
          ClearPedTasksImmediately(ped.Handle);

          if (this.handsData.state) {
            TaskPlayAnim(Game.Player.Character.Handle, "rcmminute2", "arrest_walk", 2.0, 1.0, -1, 49, 1.0, false, false, false);
          }
          
          SetPedDropsInventoryWeapon(ped.Handle, currWeapon, 0.0, 2.5, 0.0, GetAmmoInPedWeapon(ped.Handle, currWeapon));
          ped.giveWeapon(WeaponHash.Unarmed, 0, false, true); // Makes them unarmed
        } else {
          Utils.showNotification("~r~You don't have a weapon equiped!");
        }
      })

      civActions.Button("Kidnap Player", () => {
        emitNet(Events.kidnapPlayer);
      })

      const civAdverts = civMenu.Submenu("Adverts");
      Config.adverts.forEach(element => {
        civAdverts.Button(element.name, async() => {
          const advertText = await Utils.KeyboardInput("Advert Text", 280);
          if (advertText.length > 0) {
            emitNet(Events.sendAdvert, element.name, advertText, element.dictionary, element.file);
          } else {
            Utils.showNotification("~r~You haven't entered a message on your advert!");
          }
        })
      });

      const sadotMenu = civMenu.Submenu("SADOT");
      sadotMenu.List("Prop", ["Flagger Paddle", "Scene Lights", "Large Striped Cone", "Large Cone", "Medium Striped Cone", "Medium Cone", "Delineator", "Road Work Flag", "Work Crew Flag", "Utility Work Flag", "Shoulder Work Flag", "Right Lane Closed Flag", "Left Lane Closed Flag", "Right Lane Ends Flag", "Left Lane Ends Flag", "Keep Left Flag", "Keep Right Flag", "Flagger Ahead Flag", "Flagger Symbol Flag", "Prepare to Stop Flag", "Road Closed Ahead Flag", "Road Closed Flag", "Detour Ahead Flag", "Detour Left/Right Flag", "Detour Left Flag", "Detour Right Flag", "Detour Straight Flag", "Traffic Incident Flag", "Emergency Scene Flag", "Road Flooded Flag", "Fire Activity Flag", "Tow Truck Flag", "Check Point Flag", "Pilot Car Flag", "Fines Doubled Flag", "Mower Ahead Flag", "Slow Flag", "Stop Flag", "Custom Flag", "Road Work Barrier", "Work Crew Barrier", "Utility Work Barrier", "Shoulder Work Barrier", "Right Lane Closed Barrier", "Left Lane Closed Barrier", "Right Lane Ends Barrier", "Left Lane Ends Barrier", "Keep Left Barrier", "Keep Right Barrier", "Flagger Ahead Barrier", "Flagger Symbol Barrier", "Prepare to Stop Barrier", "Road Closed Ahead Barrier", "Road Closed Barrier", "Detour Ahead Barrier", "Detour Arrow Barricade", "Detour Left/Right Barrier", "Detour Left Barrier", "Detour Right Barrier", "Detour Straight Barrier", "Traffic Incident Barrier", "Emergency Scene Barrier", "Road Flooded Barrier", "Fire Activity Barrier", "Tow Truck Barrier", "Check Point Barrier", "Pilot Car Barrier", "Fines Doubled Barrier", "Mower Ahead Barrier", "Slow Barrier", "Custom Barrier", "Stop Barrier", "Police Barricade", "Striped Barricade", "Road Work Barricade", "Street Closed Barricade", "Sidewalk Closed Barricade", "Road Barrel w/ Base", "Road Barrel", "Small Barricade", "Small Barricade w/ Light", "Road Work Type-III Barricade", "Type-III Barricade (Left)", "Type-III Barricade (Right)", "Type-III Barricade (Left w/ lights)", "Type-III Barricade (Right w/ lights)", "Type-III Road Closed (Left)", "Type-III Road Closed (Right)", "Type-III Road Closed (Left w/ lights)", "Type-III Road Closed (Right w/ light)", "Type-III Detour (Left)", "Type-III Detour (Right)", "Type-III Detour (Left w/ lights)", "Type-III Detour (Right w/ lights)", "Left Arrow Board", "Right Arrow Board"], (itemIndex, selectedItem) => {
        if (this.Debugging) console.log(`SADOT Prop - [${itemIndex}]: ${selectedItem} | ${sadotProps[selectedItem]}`)
        if (sadotProps[selectedItem]) {
          this.CreateProp(Props.SADOT, new Model(sadotProps[selectedItem]), 1);
        } else {
          Utils.Error("SADOT Props", "Prop model not found!");
        }
      });

      // Vehicle Submenu
      if (this.vehicle && this.vehicle.exists) {
        const vehMenu = menu.Submenu("Vehicle")
        vehMenu.Checkbox("Toggle Engine", this.vehicle && this.vehicle.exists ? this.vehicle.IsEngineRunning : false, (newState) => {
          if (this.vehicle && this.vehicle.exists) {
            SetVehicleEngineOn(this.vehicle.Handle, newState, false, true);
          }
        })

        // Doors
        if (this.Debugging) console.log(`Door Amount: ${GetNumberOfVehicleDoors(this.vehicle.Handle)}`);
        if (GetNumberOfVehicleDoors(this.vehicle.Handle) <= 8) { // If the vehicle has 4 doors or less (6 is hood / trunk)
          const frontLeftDoor = GetEntityBoneIndexByName(this.vehicle.Handle, Bones.DriverDoor);
          const frontRightDoor = GetEntityBoneIndexByName(this.vehicle.Handle, Bones.PassengerDoor);
          const rearLeftDoor = GetEntityBoneIndexByName(this.vehicle.Handle, Bones.LeftRearDoor);
          const rearRightDoor = GetEntityBoneIndexByName(this.vehicle.Handle, Bones.RightRearDoor);
  
          if (this.Debugging) console.log(`Doors: ${GetNumberOfVehicleDoors(this.vehicle.Handle)} | ${frontLeftDoor} | ${frontRightDoor} | ${rearLeftDoor} | ${rearRightDoor}`);
  
          if (frontLeftDoor != -1 && frontRightDoor != -1) {
            if (this.Debugging) console.log("HAS FRONT DOORS!");
            if (rearLeftDoor != -1 && rearRightDoor != -1) {
              if (this.Debugging) console.log("HAS READ DOORS!");
              vehMenu.List("Door", ["Front Left", "Front Right", "Rear Left", "Rear Right", "Boot", "Bonnet"], (itemIndex) => {
                if (itemIndex == 0) {
                  this.ToggleDoor(Doors.Driver)
                } else if (itemIndex == 1) {
                  this.ToggleDoor(Doors.Passenger);
                } else if (itemIndex == 2) {
                  this.ToggleDoor(Doors.RearLeft);
                } else if (itemIndex == 3) {
                  this.ToggleDoor(Doors.RearRight);
                } else if (itemIndex == 4) {
                  this.ToggleDoor(Doors.Trunk);
                } else if (itemIndex == 5) {
                  this.ToggleDoor(Doors.Hood);
                }
              })
            } else {
              vehMenu.List("Door", ["Front Left", "Front Right", "Boot", "Bonnet"], (itemIndex) => {
                if (itemIndex == 0) {
                  this.ToggleDoor(Doors.Driver)
                } else if (itemIndex == 1) {
                  this.ToggleDoor(Doors.Passenger);
                } else if (itemIndex == 2) {
                  this.ToggleDoor(Doors.Trunk);
                } else if (itemIndex == 3) {
                  this.ToggleDoor(Doors.Hood);
                }
              })
            }
          }
        }

        // Seats
        const vehSeats = [];
        for (let i = -1; i < (GetVehicleModelNumberOfSeats(this.vehicle.Model.Hash)) - 1; i++) {
          if (this.Debugging) console.log(`Seat Index: ${i}`);
          vehSeats.push(i);
        }
        
        if (vehSeats.length > 6) {
          vehMenu.List("Seat", ["Driver", "Passenger", "Rear Left", "Right Right", "Seat 5", "Seat 6", "Seat 7", "Seat 8", "Seat 9"], (itemIndex, selectedItem) => {
            if (itemIndex == 0) {
              this.SwapSeat(VehicleSeat.Driver);
            } else if (itemIndex == 1) {
              this.SwapSeat(VehicleSeat.Passenger);
            } else if (itemIndex == 2) {
              this.SwapSeat(VehicleSeat.LeftRear);
            } else if (itemIndex == 3) {
              this.SwapSeat(VehicleSeat.RightRear);
            } else if (itemIndex == 4) {
              this.SwapSeat(VehicleSeat.ExtraSeat1);
            } else if (itemIndex == 5) {
              this.SwapSeat(VehicleSeat.ExtraSeat2);
            } else if (itemIndex == 6) {
              this.SwapSeat(VehicleSeat.ExtraSeat3);
            } else if (itemIndex == 7) {
              this.SwapSeat(VehicleSeat.ExtraSeat4);
            } else if (itemIndex == 8) {
              this.SwapSeat(VehicleSeat.ExtraSeat5);
            }
          })
        } else if (vehSeats.length > 4 && vehSeats.length <= 6) {
          vehMenu.List("Seat", ["Driver", "Passenger", "Rear Left", "Right Right", "Seat 5", "Seat 6"], (itemIndex, selectedItem) => {
            if (itemIndex == 0) {
              this.SwapSeat(VehicleSeat.Driver);
            } else if (itemIndex == 1) {
              this.SwapSeat(VehicleSeat.Passenger);
            } else if (itemIndex == 2) {
              this.SwapSeat(VehicleSeat.LeftRear);
            } else if (itemIndex == 3) {
              this.SwapSeat(VehicleSeat.RightRear);
            } else if (itemIndex == 4) {
              this.SwapSeat(VehicleSeat.ExtraSeat1);
            } else if (itemIndex == 5) {
              this.SwapSeat(VehicleSeat.ExtraSeat2);
            }
          })
        } else if (vehSeats.length <= 4) { 
          vehMenu.List("Seat", ["Driver", "Passenger", "Rear Left", "Right Right"], (itemIndex, selectedItem) => {
            if (itemIndex == 0) {
              this.SwapSeat(VehicleSeat.Driver);
            } else if (itemIndex == 1) {
              this.SwapSeat(VehicleSeat.Passenger);
            } else if (itemIndex == 2) {
              this.SwapSeat(VehicleSeat.LeftRear);
            } else if (itemIndex == 3) {
              this.SwapSeat(VehicleSeat.RightRear);
            }
          })
        } 

        // Windows
        const frontLeftWindow = GetEntityBoneIndexByName(this.vehicle.Handle, Bones.DriverWindow);
        const frontRightWindow = GetEntityBoneIndexByName(this.vehicle.Handle, Bones.PassengerWindow);
        const rearLeftWindow = GetEntityBoneIndexByName(this.vehicle.Handle, Bones.LeftRearWindow);
        const rearRightWindow = GetEntityBoneIndexByName(this.vehicle.Handle, Bones.RightRearWindow);
        
        if (frontLeftWindow != -1 && frontRightWindow != -1) {
          if (rearLeftWindow != -1 && rearRightWindow != -1) {
            vehMenu.List("Window", ["Front Left", "Front Right", "Rear Left", "Rear Right"], (itemIndex) => {
              if (itemIndex == 0) {
                this.ToggleWindow(Windows.Driver)
              } else if (itemIndex == 1) {
                this.ToggleWindow(Windows.Passenger);
              } else if (itemIndex == 2) {
                this.ToggleWindow(Windows.RearLeft);
              } else if (itemIndex == 3) {
                this.ToggleWindow(Windows.RearRight);
              }
            })
          } else {
            if (rearLeftWindow != -1 && rearRightWindow != -1) {
              vehMenu.List("Window",["Front Left", "Front Right"], (itemIndex) => {
                if (itemIndex == 0) {
                  this.ToggleWindow(Windows.Driver)
                } else if (itemIndex == 1) {
                  this.ToggleWindow(Windows.Passenger);
                }
              })
            }
          }
        }

        vehMenu.Button("Repair Vehicle", () => {
          this.vehicle.repair();
          Utils.showNotification("~g~Vehicle Repaired.");
        });

        vehMenu.Button("Clean Vehicle", () => {
          this.vehicle.DirtLevel = 0.0;
          Utils.showNotification("~g~Vehicle Cleaned.");
        });

        vehMenu.Button("Delete Vehicle", () => {
          this.vehicle.delete();
          Utils.showNotification("~g~Vehicle Deleted.");
        });
      }
    
      menu.Open();
    }, false);
  }

  // EVENTS
  private EVENT_Restart(resourceName: string): void {
    if (GetCurrentResourceName() == resourceName) {
      if (this.initialSpawn) {
        emitNet(Events.playerLoaded);
        this.initialSpawn = false;
        return;
      }
    }
  }

  private EVENT_Unload(resourceName: string): void {
    if (GetCurrentResourceName() == resourceName) {
      if (this.kidnapData.object != null) {
        this.kidnapData.object.delete();
      }

      if (policeManager.cuffsManager.Cuffed) {
        ClearPedTasks(Game.PlayerPed.Handle);
      }

      if (policeManager.cuffsManager.Handcuffs && Entity.fromHandle(policeManager.cuffsManager.Handcuffs).exists) {
        Entity.fromHandle(policeManager.cuffsManager.Handcuffs).delete();
        policeManager.cuffsManager.Handcuffs = 1;
      }
    }
  }

  private EVENT_Sync(connectedPlayers: any[]): void {
    if (this.Debugging) console.log(`Syncing Players: [${connectedPlayers.length}]: ${JSON.stringify(connectedPlayers)}`);
    this.players = connectedPlayers;
  }

  private EVENT_UpdateProps(worldProps: WorldProp[]) {
    if (this.Debugging) console.log(`Updating Props: ${JSON.stringify(worldProps)}`);

    if (worldProps != null) {
      propManager.SetProps = worldProps;

      if (propManager.GetProps.length > 0) {
        if (this.propTick == -1 || this.propTick == null) {
          this.propTick = setTick(async() => {
            propManager.GetProps.forEach(prop => {
              if (Utils.Dist(Game.PlayerPed.Position, prop.position, true) <= 2.0) {
                Utils.DisplayHelp("Press ~INPUT_CONTEXT~ to pickup");
                if (IsControlJustPressed(0, Control.Pickup)) {
                  propManager.Pickup(prop.data.handle);
                }
              }
            })
          })
        }
      } else {
        if (this.propTick != -1) {
          clearTick(this.propTick);
          this.propTick = -1;
        }
      }
    }
  }

  private async EVENT_Kidnap(kidnapping: boolean): Promise<void> {
    if (kidnapping) {
      if (this.kidnapData.object == null) {
        this.kidnapData.object = await World.createProp(new Model("prop_cs_sack_01"), Game.Player.Character.Position, true, true);
        AttachEntityToEntity(this.kidnapData.object.Handle, Game.Player.Character.Handle, GetPedBoneIndex(Game.Player.Character.Handle, 39317), 0.1, 0.0, 0.005, 270.0, 180.0, 75.0, false, false, false, false, 0, true);
        SendNuiMessage(JSON.stringify({
          type: "become_kidnapped",
          data: {
            toggle: true
          }
        }))

        this.kidnapData.status = true;

        this.kidnapData.tick = setTick(() => {
          if (this.kidnapData.status) {
            DisableControlAction(0, Control.FrontendPause, true);
            DisableControlAction(0, Control.FrontendPauseAlternate, true);
          } else {
            clearTick(this.kidnapData.tick);
          }
        })
      }
    } else {
      if (this.kidnapData != null) {
        this.kidnapData.object.delete();
        this.kidnapData.object = null;
        this.kidnapData.status = false;
        SendNuiMessage(JSON.stringify({
          type: "become_kidnapped",
          data: {
            toggle: false
          }
        }))
      }
    }
  }

  private EVENT_Notification(notificationMessage: string, flashNotification: boolean = false, saveToBrief: boolean = false, hudColorIndex: number = 0): void {
    Utils.showNotification(notificationMessage, flashNotification, saveToBrief, hudColorIndex);
  }

  private EVENT_Advert(header: string, advert: string, dictionary: string, file: string): void {
    Utils.advertNotification(header, advert, dictionary, file);
  }

  // Getters
  public get Debugging(): boolean {
    return this.debug;
  }
  public get Typing(): boolean {
    return this.usingInput;
  }

  public get Spawned(): boolean {
    return this.initialSpawn;
  }

  // Methods
  private SwapSeat(seatId: number): void {
    if (IsVehicleSeatFree(this.vehicle.Handle, seatId)) {
      TaskWarpPedIntoVehicle(Game.PlayerPed.Handle, this.vehicle.Handle, seatId);
    } else {
      Utils.showNotification("~r~This seat is occupied!");
    }
  }

  private ToggleDoor(doorId: number): void {
    const open = GetVehicleDoorAngleRatio(this.vehicle.Handle, doorId) > 0 ? true : false;
    if (this.Debugging) console.log(`Door Direction: ${open.toString()}`);
    if (open) {
      SetVehicleDoorShut(this.vehicle.Handle, doorId, false);
    } else {
      SetVehicleDoorOpen(this.vehicle.Handle, doorId, false, false);
    }
  }

  private ToggleWindow(windowId: number): void {
    let foundIndex = this.openedWindows.findIndex(foundWindow => foundWindow.windowId == windowId);
    if (foundIndex == -1) {
      this.openedWindows.push({
        windowId: windowId,
        open: false
      });
      foundIndex = this.openedWindows.length - 1;
      
    } else {
      this.openedWindows[foundIndex].open = !this.openedWindows[foundIndex].open;
    }

    if (this.openedWindows[foundIndex].open) {
      RollUpWindow(this.vehicle.Handle, windowId);
    } else {
      RollDownWindow(this.vehicle.Handle, windowId);
    }
  }

  private async CreateProp(type: Props, model: Model, amount: number): Promise<void> {
    if (type == Props.Spikestrip) {
      await Utils.loadAnimation("weapons@projectile@");

      const duration = GetAnimDuration("weapons@projectile@", "drop_underhand");
      TaskPlayAnim(Game.PlayerPed.Handle, "weapons@projectile@", "drop_underhand", 8.0, 4.0, duration, 0, -8.0, true, true, true);

      await Utils.Delay(duration);

      let lastProp;
      let lastSpawn = GetOffsetFromEntityInWorldCoords(Game.PlayerPed.Handle, 0.0, 2.0, 0.0);

      for (let i = 0; i < amount; i++) {
        const prop = await propManager.New(type, model, new Vector3(lastSpawn[0], lastSpawn[1], lastSpawn[2]));
        if (lastProp == null || lastProp == undefined) {
          prop.data.Heading = Game.PlayerPed.Heading;
        } else {
          prop.data.Heading = lastProp.Heading;
        }

        prop.data.placeOnGround();
        FreezeEntityPosition(prop.data.Handle, true);
        
        await Utils.loadAnimation("p_ld_stinger_s");

        PlayEntityAnim(prop.data.Handle, "p_stinger_s_deploy", "p_ld_stinger_s", 1.0, false, false, false, 0.0, 0);
        lastProp = prop.data;
        lastSpawn = GetOffsetFromEntityInWorldCoords(prop.data.Handle, 0.0, 4.0, 0.0);
        await Utils.Delay(700);
      }
      
      emitNet(Events.syncProps, propManager.GetProps);
    } else if (type == Props.Cone) {
      await Utils.loadAnimation("pickup_object");
      TaskPlayAnim(Game.PlayerPed.Handle, "pickup_object", "pickup_low", 8.0, -8, 1500, 49, 0, false, false, false);
      await Utils.Delay(600);

      const pos = GetOffsetFromEntityInWorldCoords(Game.PlayerPed.Handle, 0.0, 1.0, 0.0);
      const prop = await propManager.New(type, model, new Vector3(pos[0], pos[1], pos[2]));

      prop.data.placeOnGround();
      FreezeEntityPosition(prop.data.Handle, true);
      prop.data.IsInvincible = true;
      
      emitNet(Events.syncProps, propManager.GetProps);
    } else if (type == Props.Barrier) {
      const pos = GetOffsetFromEntityInWorldCoords(Game.PlayerPed.Handle, 0.0, 1.0, 0.0);

      const prop = await propManager.New(type, model, new Vector3(pos[0], pos[1], pos[2]));

      prop.data.placeOnGround();
      FreezeEntityPosition(prop.data.Handle, true);
      prop.data.IsInvincible = true;
      
      emitNet(Events.syncProps, propManager.GetProps);
    } else if (type == Props.SADOT) {
      const pos = GetOffsetFromEntityInWorldCoords(Game.PlayerPed.Handle, 0.0, 1.0, 0.0);

      const prop = await propManager.New(type, model, new Vector3(pos[0], pos[1], pos[2]));

      prop.data.placeOnGround();
      FreezeEntityPosition(prop.data.Handle, true);
      prop.data.IsInvincible = true;
      
      emitNet(Events.syncProps, propManager.GetProps);
    }
  }

  private async ToggleHands(): Promise<void> {
    if (this.handsData.state != "START_KNEELING" && this.handsData.state != "KNEELING") {
      if (this.handsData.state == "DOWN" || this.handsData.state == null) {
        this.handsData.state = "START_HANDS";
        // Game.Player.Character.giveWeapon(WeaponHash.Unarmed, 0, false, true); // Makes them unarmed
        await Utils.loadAnimation("rcmminute2");

        TaskPlayAnim(Game.Player.Character.Handle, "rcmminute2", "arrest_walk", 2.0, 1.0, -1, 49, 1.0, false, false, false);
        this.handsData.state = "HANDS_UP";

        this.handsData.tick = setTick(() => {
          if (this.handsData.state == "HANDS_UP" && !IsEntityPlayingAnim(Game.Player.Character.Handle, "rcmminute2", "arrest_walk", 3) || this.handsData.state == "KNEELING" && !IsEntityPlayingAnim(Game.PlayerPed.Handle, "random@arrests", "kneeling_arrest_idle", 3)) { // Handles removing hands up disable controls, if you hands are no longer up.
            ClearPedTasks(Game.PlayerPed.Handle);
            this.handsData.state = "DOWN";
            clearTick(this.handsData.tick);
          }

          if (this.vehicle && this.vehicle.exists) {
            DisableControlAction(0, 24, true); // Attack
            DisableControlAction(0, 257, true); // Attack 2
            DisableControlAction(0, 71, true); // accelerate
            DisableControlAction(0, 72, true); // brake/reverse
            DisableControlAction(0, 74, true); // headlight
            DisableControlAction(0, 63, true); // steer l
            DisableControlAction(0, 64, true); // steer r
            DisableControlAction(0, 59, true); // steer r
            DisableControlAction(0, 278, true); // steer r
            DisableControlAction(0, 279, true); // steer r
            DisableControlAction(0, 68, true); // driveby aim
            DisableControlAction(0, 69, true); // driveby fire_flames
            DisableControlAction(0, 76, true); // handbrake
            DisableControlAction(0, 102, true); // handbrake		
            DisableControlAction(0, 81, true); // RadioNext
            DisableControlAction(0, 82, true); // RadioPrevious
            DisableControlAction(0, 83, true); // RadioPCNext
            DisableControlAction(0, 84, true); // RadioPCPrevious
            DisableControlAction(0, 85, true); // RadioWheel 
            DisableControlAction(0, 86, true); // horn
            DisableControlAction(0, 106, true); // mouse drive
            DisableControlAction(0, 102, true); // veh jump
          } else {
            DisableControlAction(0, 24, true); // Attack
            DisableControlAction(0, 257, true); // Attack 2
            DisableControlAction(0, 22, true); // jump
            DisableControlAction(0, 24, true); // fire_flames
            DisableControlAction(0, 25, true); // aim
            DisableControlAction(0, 36, true); // stealth
            DisableControlAction(0, 45, true); // reload
            DisableControlAction(0, 47, true); // det grenade
            DisableControlAction(0, 140, true); // melee lt
            DisableControlAction(0, 141, true); // melee hvy
            DisableControlAction(0, 143, true); // melee dodge
            DisableControlAction(0, 142, true); // idk
          }
        })
      } else {
        StopAnimTask(Game.Player.Character.Handle, "rcmminute2", "arrest_walk", 1.0);
        this.handsData.state = "DOWN"
        clearTick(this.handsData.tick);
      }
    } else {
      Utils.showNotification("~r~You can't put your hands up, whilst kneeling down!");
    }
  }
}

export const client = new Client();
const callbackManager = new CallbackManager();
export const menuManager = new MenuManager(client);
const talkingManager = new TalkingManager(client);
const propManager = new PropManager(client);
export const policeManager = new PoliceManager(client);
const trafficManager = new TrafficManager(client);
const hospitalManager = new HospitalManager();
const jailManager = new JailManager();