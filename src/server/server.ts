import { WebhookManager } from "./managers/webhook";
import { PlayerManager } from "./managers/players";
import { CallbackManager } from "./managers/callbacks";

import WebhookMessage from "./models/webhook/webhookMessage";
import { Player } from "./models/player";

import { Events } from "../shared/enums/events";
import { Roles } from "../shared/enums/police";

import * as Utils from "./utils";
import Config from "../configs/server.json";
import { Vector3 } from "fivem-js";

export class Server {
    private debug: boolean;
    private cuffedPlayers: any[] = [];
    private kidnappedPlayers: any[] = [];
    private readonly hospitals: any[] = [
        {type: "SANDY", location: new Vector3(1831.5374, 3680.7556, 34.271072), beds: Config.sandyBeds},
        {type: "PALETO_BAY", location: new Vector3(-253.1561, 6333.2641, 32.436359), beds: Config.paletoBeds},
        {type: "PILLBOX_UPPER", location: new Vector3(313.23764, -590.0329, 43.284053), beds: Config.pillboxBeds}
    ];

    constructor() {
        this.debug = Config.debug;
        // Events

        // DEFAULT EVENTS
        on(Events.playerJoining, this.EVENT_PlayerLoaded.bind(this));
        onNet(Events.playerLoaded, this.EVENT_PlayerLoaded.bind(this));
        on(Events.playerDropped, this.EVENT_PlayerDropped.bind(this));
        onNet(Events.syncProps, this.EVENT_SyncProps.bind(this));

        // POLICE EVENTS
        onNet(Events.cuffPlayer, this.EVENT_CuffPlayer);
        onNet(Events.uncuffPlayer, this.EVENT_UncuffPlayer);
        onNet(Events.grabPlayer, this.EVENT_GrabPlayer);
        onNet(Events.seatPlayer, this.EVENT_SeatPlayer);
        onNet(Events.unseatPlayer, this.EVENT_UnseatPlayer);
        onNet(Events.createSpeedzone, this.EVENT_Speedzone.bind(this));
        onNet(Events.deleteSpeedzone, this.EVENT_DeleteSpeedzone.bind(this));
        onNet(Events.jailPlayer, this.EVENT_Jail.bind(this));

        // FIRE EVENTS
        onNet(Events.startHospitalize, this.EVENT_Hospitalize.bind(this));
        onNet(Events.exitBed, this.EVENT_ExitBed.bind(this));

        // CIV EVENTS
        onNet(Events.sendAdvert, this.EVENT_Advert.bind(this));
        onNet(Events.kidnapPlayer, this.EVENT_Kidnap);
    }

    // Get Requests
    public get Debugging(): boolean {
        return this.debug;
    }

    // Events

    // DEFAULT EVENTS
    private EVENT_PlayerLoaded(): void {
        if (this.Debugging) {
            console.log(`Adding player on (playerLoaded) event!`);
        }
        
        playerManager.Add(new Player(source));

        if (this.Debugging) {
            console.log(`Added player on (playerLoaded) event! | ${JSON.stringify(playerManager.GetPlayers)}`);
        }
        emitNet(Events.syncPlayers, -1, playerManager.GetPlayers);
    }

    private EVENT_PlayerDropped(): void {
        const player = new Player(source);
        if (this.Debugging) {
            console.log(`Removing player on (playerDropped) event!`);
        }

        playerManager.Remove(player.GetHandle);

        if (this.Debugging) {
            console.log(`Removed player on (playerLoaded) event! | ${JSON.stringify(playerManager.GetPlayers)}`);
        }
        emitNet(Events.syncPlayers, -1, playerManager.GetPlayers);
    }

    private EVENT_SyncProps(newProps: any[]): void {
        emitNet(Events.updateProps, -1, newProps);
    }

    // POLICE EVENTS
    private async EVENT_CuffPlayer(): Promise<void> {
        const player = new Player(source);
        const closest = await Utils.closestPlayer(source);
        if (closest[0] != null) {
            const closestPlayer = new Player(closest[0]);
            const foundIndex = this.cuffedPlayers.findIndex(foundPlayer => foundPlayer == closest[0]);
            if (foundIndex != -1) {
                const done = await this.WebhookLog("Attempted Handcuffing", `**${player.Name}** tried to handcuff **${closestPlayer.Name}**, however they're already handcuffed.`, closestPlayer);
                if (done) {
                    emitNet(Events.showNotification, source, "~r~This person is already handcuffed!");
                }
            } else {
                const done = await this.WebhookLog("Handcuffing Player", `**${player.Name}** is handcuffing **${closestPlayer.Name}**.`, closestPlayer);
                if (done) {
                    this.cuffedPlayers.push(closest[0])
                    emitNet(Events.startCuffing, source, Roles.Police, closest[0]);
                    emitNet(Events.startCuffing, closest[0], Roles.Criminal);
                }
            }
        }
    }

    private async EVENT_UncuffPlayer(): Promise<void> {
        const player = new Player(source);
        const closest = await Utils.closestPlayer(source);
        if (closest[0] != null) {
            const closestPlayer = new Player(closest[0]);
            const foundIndex = this.cuffedPlayers.findIndex(foundPlayer => foundPlayer == closest[0]);
            if (foundIndex != -1) {
                const done = await this.WebhookLog("Uncuffing Player", `**${player.Name}** is uncuffing **${closestPlayer.Name}**.`, closestPlayer);
                if (done) {
                    emitNet(Events.getUncuffed, source, Roles.Police);
                    emitNet(Events.getUncuffed, closest[0], Roles.Criminal);
                }
            } else {
                const done = await this.WebhookLog("Attempted Uncuffing", `**${player.Name}** tried to uncuff **${closestPlayer.Name}**, however they aren't handcuffed.`, closestPlayer);
                if (done) {
                    emitNet(Events.showNotification, source, "~r~This person isn't handcuffed!")
                }
            }
        }
    }
    
    private async EVENT_GrabPlayer(): Promise<void> {
        const player = new Player(source);
        const closest = await Utils.closestPlayer(source);
        if (closest[0] != null) {
            const closestPlayer = new Player(closest[0]);
            const done = await this.WebhookLog("Player Grabbed", `**${player.Name}** grabbed **${closestPlayer.Name}**.`, closestPlayer);
            if (done) {
                emitNet(Events.setGrabbed, closest[0], source);
            }
        }
    }
    
    private async EVENT_SeatPlayer(vehNet: number): Promise<void> {
        if (vehNet && vehNet != -1) {
            const player = new Player(source);
            const closest = await Utils.closestPlayer(source);
            if (closest[0] != null) {
                const closestPlayer = new Player(closest[0]);
                const done = await this.WebhookLog("Player Placed Inside Vehicle", `**${player.Name}** placed **${closestPlayer.Name}** inside a vehicle.`, closestPlayer);
                if (done) {
                    emitNet(Events.getSeated, closest[0], vehNet)
                }
            }
        } else {
            console.log("There was a problem with the passed vehicles network ID!");
        }
    }
    
    private async EVENT_UnseatPlayer(): Promise<void> {
        const player = new Player(source);
        const closest = await Utils.closestPlayer(source);
        if (closest[0] != null) {
            const closestPlayer = new Player(closest[0]);
            const done = await this.WebhookLog("Player Removed From Vehicle", `**${player.Name}** removed **${closestPlayer.Name}** from a vehicle.`, closestPlayer);
            if (done) {
                emitNet(Events.getUnseated, closest[0])
            }
        }
    }
    
    private async EVENT_Speedzone(position: Vector3, radius: number, speed: number, street: string, crossing: string): Promise<void> {
        const player = new Player(source);
        emitNet(Events.startSpeedzone, -1, position, radius, speed, crossing ? street : `${street} / ${crossing}`);
        const done = await this.WebhookLog("Speedzone Created", crossing ? `**${player.Name}** created a speedzone at **${street}** / **${crossing}**\n\n**Data** - Speed: **${speed}** | Radius: **${radius}** | Position: **Vector3(${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})**.` : `**${player.Name}** created a speedzone at **${street}**\n\n**Data** - Speed: **${speed}** | Radius: **${radius}** | Position: **Vector3(${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})**.`, player);
        if (done) {
            if (crossing) {
                emitNet("chat:addMessage", -1, {
                    color: [86, 96, 252],
                    args: ["^* ^1Traffic Announcement", `^*^7Police have ordered that traffic on ^2${street} / ${crossing} ^7is to travel at a speed of ^2${speed} mph ^7due to an incident.`]
                });
            } else {
                emitNet("chat:addMessage", -1, {
                    color: [86, 96, 252],
                    args: ["^* ^1Traffic Announcement", `^*^7Police have ordered that traffic on ^2${street} ^7is to travel at a speed of ^2${speed} mph ^7due to an incident.`]
                });
            }
        }
    }

    private async EVENT_DeleteSpeedzone(speedzone: Record<string, any>): Promise<void> {
        const player = new Player(source);
        const done = await this.WebhookLog("Speedzone Deleted", `**${player.Name}** deleted a speedzone at **${speedzone.street}**\n\n**Data** - Speed: **${speedzone.speed}** | Radius: **${speedzone.radius}** | Position: **Vector3(${speedzone.position.x.toFixed(2)}, ${speedzone.position.y.toFixed(2)}, ${speedzone.position.z.toFixed(2)})**.`, player);
        if (done) {
            emitNet(Events.removeSpeedzone, -1, speedzone);
        }
    }

    private async EVENT_Jail(id: number, seconds: number, reason: string): Promise<void> {
        const player = new Player(source);
        const jailedPlayer = new Player(id.toString());
        const done = await this.WebhookLog("Player Jailed", reason != "NONE" ? `**${player.Name}** jailed **${jailedPlayer.Name}**, with a sentence of **${reason}**, for **${(seconds / 10).toFixed(0)}** month/s.` : `**${player.Name}** jailed **${jailedPlayer.Name}**, for **${(seconds / 10).toFixed(0)}** month/s.`, jailedPlayer);
        if (done) {
            emitNet("chat:addMessage", -1, {
                color: [86, 96, 252],
                args: ["Judge", reason != "NONE" ? `^*^3${jailedPlayer.Name} ^r^0has been jailed with a sentence of ^*^3${reason}^r^0, for ^*^3${(seconds / 10).toFixed(0)} ^r^0month/s^r^0!` : `^*^3${jailedPlayer.Name} ^r^0has been jailed, for ^*^3${(seconds / 10).toFixed(0)} ^r^0month/s^r^0!`]
            });
            emitNet(Events.getJailed, jailedPlayer.GetHandle, seconds, reason);
        }
    }

    // FIRE EVENTS
    private async EVENT_Hospitalize(playerIndex: number): Promise<void> {
        const foundPlayer = playerManager.GetPlayers[playerIndex];
        if (foundPlayer) {
            if (this.Debugging) {
                console.log(`Found Player: ${JSON.stringify(foundPlayer)}`);
            }
            
            const player = new Player(source);
            const done = await this.WebhookLog("Player Hospitalized", `${player.Name} hospitalized ${foundPlayer.Name}`, foundPlayer);
            if (done) {
                const closestHospital = await this.GetClosestHospital(foundPlayer);
                for (let i = 0; i < closestHospital.beds.length; i++) {
                    if (!closestHospital.beds[i].taken) {
                        closestHospital.beds[i].taken = true;
                        if (this.Debugging) {
                            console.log(`Chosen Bed Is - ${JSON.stringify(closestHospital.beds[i])}`);
                        }
                        
                        // SetEntityCoords(GetPlayerPed(foundPlayer.GetHandle), closestHospital.beds[i].x, closestHospital.beds[i].y, closestHospital.beds[i].z, false, false, false, false);
                        foundPlayer.TriggerEvent(Events.getHospitalized, closestHospital, closestHospital.beds[i]);
                        emitNet("chat:addMessage", -1, {
                            color: [86, 96, 252],
                            args: ["Doctor", `${foundPlayer.Name} has been Hospitalized!`]
                        });
                        break;
                    }
                };
            }
        }
    }

    private EVENT_ExitBed(hospitalData: Record<string, any>, bedData: Record<string, any>): void {
        const hospitalIndex = this.hospitals.findIndex(hospital => hospital.type == hospitalData.type);
        if (this.hospitals[hospitalIndex]) {
            if (this.Debugging) {
                console.log(`Found Hospital: ${JSON.stringify(this.hospitals[hospitalIndex])}`);
            }
            
            const bedIndex = this.hospitals[hospitalIndex].beds.findIndex(bed => bed.x == bedData.x && bed.y == bedData.y && bedData.z && bed.heading == bedData.heading);
            if (this.hospitals[hospitalIndex].beds[bedIndex]) {
                if (this.Debugging) {
                    console.log(`Found Bed: ${JSON.stringify(this.hospitals[hospitalIndex].beds[bedIndex])}`);
                    console.log(`Bed 1: ${this.hospitals[hospitalIndex].beds[bedIndex].taken}`);
                }
                
                this.hospitals[hospitalIndex].beds[bedIndex].taken = false;

                if (this.Debugging) {
                    console.log(`Bed 2: ${this.hospitals[hospitalIndex].beds[bedIndex].taken}`);
                }
            }
        }
    }

    // CIV EVENTS
    private async EVENT_Advert(header: string, advert: string, dictionary: string, file: string): Promise<void> {
        const player = new Player(source);
        const done = await this.WebhookLog("Sending Advert", `**${player.Name}** is sending an advert.\n\n**Data** - Type: **${header}** | Contents: **${advert}**.`, player);
        if (done) {
            emitNet(Events.recieveAdvert, -1, header, advert, dictionary, file);
        }
    }

    private async EVENT_Kidnap(): Promise<void> {
        const player = new Player(source);
        const closest = await Utils.closestPlayer(source);
        if (closest[0] != null) {
            const closestPlayer = new Player(closest[0]);
            const foundIndex = this.kidnappedPlayers.findIndex(foundPlayer => foundPlayer == closest[0]);
            if (foundIndex != -1) {
                const done = await this.WebhookLog("Stopped Kidnapping", `**${player.Name}** stopped kidnapping **${closestPlayer.Name}**.`, closestPlayer);
                if (done) {
                    this.kidnappedPlayers.splice(foundIndex, 1);
                    emitNet(Events.setKidnapped, closest[0], false);
                }
            } else {
                const done = await this.WebhookLog("Started Kidnapping", `**${player.Name}** started kidnapping **${closestPlayer.Name}**.`, closestPlayer);
                if (done) {
                    this.kidnappedPlayers.push(closest[0])
                    emitNet(Events.setKidnapped, closest[0], true);
                }
            }
        }
    }

    // Methods
    private async WebhookLog(title: string, description: string, player: Player): Promise<boolean> {
        const player1 = new Player(source);
        let player1Steam = await player1.GetIdentifier("steam");
        player1Steam = player1Steam.replace("steam:", "");
        const player1SteamURL = `https://steamcommunity.com/profiles/${parseInt(player1Steam, 16)}`;
        const player1Discord = await player1.GetIdentifier("discord");
        const player1DiscordID = player1Discord.replace("discord:", "");

        let player2Steam = await player.GetIdentifier("steam");
        player2Steam = player2Steam.replace("steam:", "");
        const player2SteamURL = `https://steamcommunity.com/profiles/${parseInt(player2Steam, 16)}`;
        const player2Discord = await player.GetIdentifier("discord");
        const player2DiscordID = player2Discord.replace("discord:", "");

        webhookManager.Send(new WebhookMessage({username: "Interaction Menu Logs", embeds: [{
            color: 4431943,
            title: title,
            description: description,
            fields: [
                {
                    name: `${player1.Name} Information`,
                    value: `**Steam Hex**: ${player1Steam}\n**Steam URL**: ${player1SteamURL}\n**Discord**: <@${player1DiscordID}>`
                },
                {
                    name: `${player.Name} Information`,
                    value: `**Steam Hex**: ${player2Steam}\n**Steam URL**: ${player2SteamURL}\n**Discord**: <@${player2DiscordID}>`
                }
            ],
            footer: {text: "ProGamerNetwork - Server 1", icon_url: "https://i.imgur.com/TMsjL7R.png"},
        }]}));

        return true;
    }

    private async GetClosestHospital(player: Player): Promise<Record<string, any>> {
        let closestHospital;
        let closestDistance = 1000;
        let justStarted = true;
        const myPosition = GetEntityCoords(GetPlayerPed(player.GetHandle));
        
        this.hospitals.forEach(hospital => {
            const dist = Utils.Dist(new Vector3(myPosition[0], myPosition[1], myPosition[2]), hospital.location, true);

            if (justStarted) {
                closestHospital = hospital;
                closestDistance = dist;
                justStarted = false
            }

            if (dist < closestDistance) {
                closestHospital = hospital;
                closestDistance = dist;
            }
        });

        if (this.Debugging) {
            console.log(`Hospital Data - Entry: ${JSON.stringify(closestHospital)} | Dist: ${closestDistance}`);
        }

        return closestHospital;
    }
}

const server = new Server();
const webhookManager = new WebhookManager("https://discord.com/api/webhooks/855460154546716692/cJPuX8Ef-tXtiSf3DSmVwR5f95YGiKsJL127FVAUOUe5LICBAftr1-KHSNaRD08XapP_");
const callbackManager = new CallbackManager();
export const playerManager = new PlayerManager(server);