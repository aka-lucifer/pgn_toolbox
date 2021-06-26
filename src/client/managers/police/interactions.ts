import { Game, Model, Ped, Vector3, Vehicle, World } from "fivem-js";
import { Events } from "../../../shared/enums/events";
import { Delay, ClosestVehicle, showNotification, Dist } from "../../utils";
import { PoliceManager } from "./main";

export class InteractionsManager {
    private policeManager: PoliceManager;

    // Grab
    private grabbedPed: Ped;
    private grabActive: boolean;
    private grabbedBy: number;

    constructor(policeManager: PoliceManager) {
        this.policeManager = policeManager;
        DecorRegister("IsGrabbed", 2);
        this.grabActive = DecorGetBool(Game.PlayerPed.Handle, "IsGrabbed");

        // Events
        onNet(Events.setGrabbed, async(grabbersId: number = -1) => {
            const myPed = Game.PlayerPed;
            const grabbersPed = new Ped(GetPlayerPed(GetPlayerFromServerId(grabbersId)));

            if (myPed.exists && grabbersPed.exists) {
                if (myPed.IsOnFoot && grabbersPed.IsOnFoot) {
                    if (!this.grabActive) {
                        AttachEntityToEntity(myPed.Handle, grabbersPed.Handle, 11816, 0.48, 0.35, 0.0, 0.0, 0.0, 0.0, false, false, false, false, 2, false)
                        this.UpdateData(true);

                        if (DecorGetBool(Game.PlayerPed.Handle, "IsCuffed")) {
                            if (!HasAnimDictLoaded("mp_arresting")) {
                                RequestAnimDict("mp_arresting");
                                while (!HasAnimDictLoaded("mp_arresting")) {
                                    await Delay(10);
                                }
                            }
                            
                            TaskPlayAnim(myPed.Handle, "mp_arresting", "idle", 8.0, -8.0, -1, 49, 0, false, false, false);
                        }
                    } else {
                        myPed.detach();
                        this.UpdateData(false);
                    }
                } else {
                    // detach
                    myPed.detach();
                    this.UpdateData(false);
                }
            }
        })

        onNet(Events.getSeated, async(vehNetworkId: number) => {
            const vehicle = new Vehicle(NetToVeh(vehNetworkId));
            console.log(`${vehicle} | ${NetToVeh(vehNetworkId)} | ${NetworkGetEntityFromNetworkId(vehNetworkId)}`);
    
            if (vehicle.exists) {
                console.log("found veh!");
                if (Dist(Game.PlayerPed.Position, vehicle.Position, true) <= 5.0) {
                    let freeSeat = -1;
                    const vehSeats = GetVehicleMaxNumberOfPassengers(vehicle.Handle);
                    console.log(`AVAIL ${vehSeats}`);
                    if (vehSeats > 0) {
                        const seats = [];
                        for (let i = 0; i < vehSeats; i++) {
                            seats.push(i);
                        }
        
                        seats.sort((a, b) => b - a);
    
                        console.log(seats.length);
        
                        if (seats.length > 1) { // If our vehicle has more than one passenger seat
                            for (let i = 0; i < seats.length; i++) {
                                console.log(`Seat: ${seats[i]} | ${JSON.stringify(seats)}`);
                                if (IsVehicleSeatFree(vehicle.Handle, seats[i])) {
                                    freeSeat = seats[i];
                                    break;
                                }
                            }
                        } else {
                            freeSeat = 0; // Set seat to front right passenger seat
                        }
    
                        if (freeSeat > -1) {
                            const myPed = Game.PlayerPed;
                            if (this.grabActive) {
                                myPed.detach();
                                this.UpdateData(false);
                            }
                            ClearPedTasks(myPed.Handle);
                            await Delay(100);
                            TaskWarpPedIntoVehicle(myPed.Handle, vehicle.Handle, freeSeat);
                            if (DecorGetBool(Game.PlayerPed.Handle, "IsCuffed")) { // If handcuffed do the handcuff sit animation
                                if (!HasAnimDictLoaded("mp_arresting")) {
                                    RequestAnimDict("mp_arresting");
                                    while (!HasAnimDictLoaded("mp_arresting")) {
                                        await Delay(10);
                                    }
                                }
        
                                TaskPlayAnim(myPed.Handle, "mp_arresting", "idle", 8.0, -8.0, -1, 49, 0, false, false, false); // Play arrest animation in vehicle, rather than just sitting
                            }
                        } else {
                            showNotification("~r~There are no remaining seats in your vehicle!");
                        }
                    }
                }
            } else {
                console.log("no veh found report to ye daaa!");
            }
        })

        onNet(Events.getUnseated, async() => {
            const myPed = Game.PlayerPed;
            if (myPed.isInVehicle) {
                TaskLeaveVehicle(myPed.Handle, myPed.CurrentVehicle.Handle, 256);
            }
        })
    }

    // Methods
    private UpdateData(newState: boolean): void {
        this.grabActive = newState;
        DecorSetBool(Game.PlayerPed.Handle, "IsGrabbed", newState);
        console.log(`Grab Decor Now: ${DecorGetBool(Game.PlayerPed.Handle, "IsGrabbed")} | ${this.grabActive}`);
    }

    public async SeatPlayer(): Promise<void> {
        const clostVeh = await ClosestVehicle(Game.PlayerPed.Position);
        console.log(`[${clostVeh[0].NumberPlate}]: ${clostVeh[1]}`);

        if (clostVeh[1] <= 5.0) {
            console.log("found veh!");
            if (clostVeh[0].exists) {
                emitNet(Events.seatPlayer, clostVeh[0].NetworkId);
            }
        } else {
            showNotification("~r~No vehicle found!");
        }
    }

    public async UnseatPlayer(): Promise<void> {
        emitNet(Events.unseatPlayer);
    }
}