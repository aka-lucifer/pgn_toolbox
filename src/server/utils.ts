/**
 * @param reference Title for organisation logs
 * @param message Log message
*/

import { playerManager } from "./server";
import { Events } from "../shared/enums/events";
import { Ped, Vector3 } from "fivem-js";

onNet("logMessage", Log);

export function Log(reference: string, message: string): void {
  console.log(`[^2PGN Menu LOG^7]\t[^2${reference}^7] ${message}`);
}

/**
 * @param reference Title for organisation logs
 * @param message Inform message
*/
export function Inform(reference: string, message: string): void {
  console.log(`[^5PGN Menu INFORM^7]\t[^5${reference}^7] ${message}`);
}

/**
 * @param reference Title for organisation logs
 * @param message Warn message
*/
export function Warn(reference: string, message: string): void {
  console.log(`[^3PGN Menu WARNING^7]\t[^3${reference}^7] ${message}`);
}

/**
 * @param reference Title for organisation logs
 * @param message Error message
*/
export function Error(reference: string, message: string): void {
  console.log(`[^8PGN Menu ERROR^7]\t[^8${reference}^7] ${message}`);
}

/**
 * 
 * @param ms Time in milliseconds
 * @returns Waits a specified amount of time in milliseconds
 */
export function Delay(ms : number) : Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 
 * @param min Minimum number
 * @param max Maximum number
 * @returns Random number between the minimum and maximum number
 */
export function Random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @param c1 First Coord location
 * @param c2 Second Coord location
 * @param useZCoord Whether or not to use the Z coordinate to determine your distance.
 * @returns 
 */
export function Dist(c1: Vector3, c2: Vector3, useZCoord: boolean): number {
  if (useZCoord) {
    const xDist = c1.x - c2.x;
    const yDist = c1.y - c2.y;
    const zDist = c1.z - c1.z;
    return Math.sqrt((xDist * xDist) + (yDist * yDist) + (zDist * zDist));
  } else {
    const xDist = c1.x - c2.x;
    const yDist = c1.y - c2.y;
    return Math.sqrt((xDist * xDist) + (yDist * yDist));
  }
}

export async function closestPlayer(handle: string): Promise<[string, number]> {
  let closestPlayer;
  let closestDistance = 1000;
  let justStarted = true;
  const myPosition = GetEntityCoords(GetPlayerPed(handle));
  
  playerManager.GetPlayers.forEach(element => {
    if (element.GetHandle != handle) {
      const position = GetEntityCoords(GetPlayerPed(element.GetHandle));
      const pedDist = Dist(new Vector3(myPosition[0], myPosition[1], myPosition[2]), new Vector3(position[0], position[1], position[2]), true);

      if (justStarted) {
        closestPlayer = element.GetHandle;
        closestDistance = pedDist;
        justStarted = false;
      }

      if (pedDist < closestDistance) {
        closestPlayer = element.GetHandle;
        closestDistance = pedDist;
      }
    }
  })

  console.log(closestDistance)
  if (closestDistance <= 10.0) {
    return [closestPlayer, closestDistance];
  } else {
    emitNet(Events.showNotification, handle, "~r~No player found!")
    return [null, null];
  }
}

export function createUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
 });
}