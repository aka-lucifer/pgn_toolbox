import { Game } from "fivem-js";
import { Client } from "../../client";
import * as Utils from "../../utils";

export class DamageManager {
    private client: Client;
    private engine: number;
    private body: number;
    private tyres: any[] = [];
    private windows: any[] = [];
    public lastStats: Record<string, any> = {};
    private repairAuthorized: boolean;
    public processTick: number;

    constructor(client: Client) {
        this.client = client;
        this.repairAuthorized = false;
        
        this.processTick = setTick(async() => {
            const currVeh = Game.Player.Character.CurrentVehicle;
            if (currVeh && currVeh.exists) {
                this.engine = currVeh.EngineHealth;
                this.body = currVeh.BodyHealth;

                for (let i = 0; i < 6; i++) {
                    // console.log(`Tyre [${i}]: Semi - ${IsVehicleTyreBurst(currVeh.Handle, i, false)} | Full: ${IsVehicleTyreBurst(currVeh.Handle, i, true)}`);
                    let newState = null;

                    if (IsVehicleTyreBurst(currVeh.Handle, i, true)) {
                        newState = "POPPED";
                    } else if (IsVehicleTyreBurst(currVeh.Handle, i, false)) {
                        newState = "PIERCED";
                    } else {
                        newState = "INTACT"
                    }
                    
                    const tyreIndex = this.tyres.findIndex(tyre => tyre.id == i);

                    if (tyreIndex == -1) {
                        this.tyres.push({
                            id: i,
                            state: newState
                        });
                    } else {
                        if (this.tyres[tyreIndex].state != newState) {
                            this.tyres[tyreIndex].state = newState;
                        }
                    }
                }
                // for (let i = 0; i < 10; i++) {
                //     if (IsVehicleWindowIntact(currVeh.Handle, i)) {
                //         this.stats.windows[i].intact = true;
                //     } else {
                //         this.stats.windows[i].intact = false;
                //     }
                // }

                // console.log(`Engine: ${this.engine} | Body: ${this.body} | Tyres: ${JSON.stringify(this.tyres)}`);
                if (Object.keys(this.lastStats).length <= 0) {
                    this.lastStats.engine = this.engine;
                    this.lastStats.body = this.body;
                    this.lastStats.tyres = this.tyres;
                    // console.log("DEFINED!");
                } else {
                    if (this.repairAuthorized) {
                        // this.lastStats = {
                        //     engine: this.engine,
                        //     body: this.body,
                        //     tyres: this.tyres
                        // }
                        // // console.log("Repair is authorized");
                        // this.repairAuthorized = false;
                    } else {
                        // someone is repairing without perm
                        if (this.body > this.lastStats.body || this.engine > this.lastStats.engine || !await this.TyresMatch(this.tyres, this.lastStats.tyres)) {
                            console.log("Damage values are different, reapplying!");
                            currVeh.EngineHealth = this.lastStats.engine;
                            currVeh.BodyHealth = this.lastStats.body;
                            // this.lastStats.tyres.forEach(element => {
                            //     console.log(element);
                            //     if (element.state == "POPPED") {
                            //         SetVehicleTyreBurst(currVeh.Handle, element.id, true, 1000);
                            //     } else if (element.state == "PIERCED") {
                            //         SetVehicleTyreBurst(currVeh.Handle, element.id, false, 500);
                            //     }
                            // })
                            this.engine = this.lastStats.engine;
                            this.body = this.lastStats.body;
                        } else {
                            for (let i = 0; i < 6; i++) {
                                console.log(`[${i}]: ${this.tyres[i].state} | ${this.lastStats.tyres[i].state}`)
                                // if (this.tyres[i].state != this.lastStats.tyres[i].state) {
                                    // console.log(`NO MATCH ON ${i}`);
                                // } else {
                                    // console.log(`MATCH ON ${i}`);
                                // }
                            }
                            // console.log(`B4 - ${this.lastStats.tyres[0].state} | Match: ${await this.TyresMatch(this.tyres, this.lastStats.tyres)}`);
                            // setTimeout(() => {
                            //     this.lastStats = {
                            //         engine: this.engine,
                            //         body: this.body,
                            //         tyres: this.tyres
                            //     }
                            //     console.log(`AFTER - ${this.lastStats.tyres[0].state}`);
                            // }, 500);
                            // this.lastStats.tyres = this.tyres;
                            // console.log(this.lastStats.tyres[0]);
                        }
                    }
                }
            }

            await Utils.Delay(1000);
        })

        RegisterCommand("repair", () => {
            const currVeh = Game.Player.Character.CurrentVehicle;
            if (currVeh && currVeh.exists) {
                currVeh.repair();
                // this.repairAuthorized = true;
            }
        }, false);
    }

    // Methods
    private async TyresMatch(array1: any, array2: any): Promise<boolean> {
        let results = 0;
        let doneChecking = false;

        array1.forEach(function(element1, index) {
            array2.forEach(function(element2, index2) {
                if (index == index2) {
                    if (element1.id == element2.id && element1.state == element2.state) {
                        results++;
                    }
                }
            });

            if (index == (array1.length - 1)) {
                doneChecking = true;
            }
        });

        while (!doneChecking) {
            await Utils.Delay(0);
        }
        
        if (results == array1.length) {
            return true;
        }
        
        return false;
    }
}