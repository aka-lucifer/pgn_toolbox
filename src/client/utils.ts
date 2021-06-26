import { Font, Game, Vector3, Vehicle, World } from "fivem-js";
import { Colour } from "./models/colour";
import { client } from "./client";

/**
 * @param reference Title for organisation logs
 * @param message Log message
*/

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

export function createUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
 });
}

/**
 * 
 * @param notificationMessage The message on the notification.
 * @param flashNotification If the notification should flash or not
 * @param saveToBrief No idea.
 * @param hudColorIndex Some colour bullshit.
 */
export function showNotification(notificationMessage: string, flashNotification: boolean = false, saveToBrief: boolean = false, hudColorIndex: number = 0) {
	const notify = `${GetCurrentResourceName()}-${Random(1, 9999)}:notification`;
	AddTextEntry(notify, `[~y~PGN Menu~w~]\n\n${notificationMessage}`)
	BeginTextCommandThefeedPost(notify)
	if (hudColorIndex) { ThefeedNextPostBackgroundColor(hudColorIndex) }
	EndTextCommandThefeedPostTicker(flashNotification || false, saveToBrief || true)
}

export async function loadAnimation(animationDict: string): Promise<boolean> {
  RequestAnimDict(animationDict);
  while (!HasAnimDictLoaded(animationDict)) {
    RequestAnimDict(animationDict);
    await Delay(0);
  }

  return true;
}

export async function KeyboardInput(textEntry: string, maxStringLength: number): Promise<string> {
	AddTextEntry("FMMC_KEY_TIP1", textEntry)
	DisplayOnscreenKeyboard(1, "FMMC_KEY_TIP1", "", "", "", "", "", maxStringLength)
	client.usingInput = true

	while (UpdateOnscreenKeyboard() != 1 && UpdateOnscreenKeyboard() != 2) {
		await Delay(0)
  }
		
	if (UpdateOnscreenKeyboard() != 2) {
		const keyboardResult = GetOnscreenKeyboardResult()
		await Delay(500)
		client.usingInput = false
		return keyboardResult
  } else {
		await Delay(500)
		client.usingInput = false
		return null
  }
}

/**
 * 
 * @param header Advert Header
 * @param advert Advert Text
 * @param dictionary Dictionary of the YTD
 * @param file File of the YTD
 */
 export function advertNotification(header: string, advert: string, dictionary: string, file: string): void {
  SetNotificationTextEntry("STRING")
  AddTextComponentString(advert)
  EndTextCommandThefeedPostMessagetext(dictionary, file, true, 2, header, "~y~Advertisement")
  DrawNotification(false, true)
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

export async function ClosestVehicle(position: Vector3): Promise<[Vehicle, number]> {
  let closestVehicle;
  let closestDist;
  let firstEntity = true

  World.getAllVehicles().forEach(element => {
    const vehDist = Dist(element.Position, Game.PlayerPed.Position, true);
    if (firstEntity) {
      console.log("DEFINE FIRST DATA!");
      closestVehicle = element;
      closestDist = vehDist;
      firstEntity = false;
    } else {
      if (vehDist < closestDist) {
        console.log("UPDATE VARS TO NEW DATA!");
        closestVehicle = element;
        closestDist = vehDist;
      }
    }
  })

  return [closestVehicle, closestDist];
}



export function Draw3DText(position: Vector3, colour: Colour, text: string, font: Font, rescaleUponDistance: boolean = true, textScale: number = 1.0, dropShadow: boolean = false) {
  const camPosition = GetGameplayCamCoord()
  const dist = Dist(new Vector3(camPosition[0], camPosition[1], camPosition[2]), position, true);
  let scale = (1 / dist) * 20;
  const fov = (1 / GetGameplayCamFov()) * 100;
  scale = scale * fov;
  if (rescaleUponDistance) {
    SetTextScale(textScale * scale, textScale * scale);
  } else {
    SetTextScale(textScale, textScale);
  }

  SetTextFont(Number(font));
  SetTextProportional(true);
  SetTextColour(colour.r, colour.g, colour.b, colour.a);
  
  if (dropShadow)
  {
    SetTextDropshadow(1, 1, 1, 1, 255);
    SetTextDropShadow();
  }

  SetTextOutline();
  SetTextEntry("STRING");
  SetTextCentre(true);
  AddTextComponentString(text);
  SetDrawOrigin(position.x, position.y, position.z, 0);
  DrawText(0, 0);
  ClearDrawOrigin();
}

export function DisplayHelp(helpMessage: string, beepSound: boolean = false): void {
  BeginTextCommandDisplayHelp('STRING')
	AddTextComponentScaleform(helpMessage)
	EndTextCommandDisplayHelp(0, false, beepSound, -1)
}