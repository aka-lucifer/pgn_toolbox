import fetch from "node-fetch";
import WebhookMessage from "../models/webhook/webhookMessage";

export class WebhookManager {
  private readonly _url: string;

  constructor(url: string) {
    this._url = url;
  }

  // Methods
  public async Send(message: WebhookMessage) {
    // console.log(message.toJSON());
    fetch(this._url, {
      method: "post",
      body: JSON.stringify(message.toJSON()),
      // body:    JSON.stringify({username: "Testing", embeds: {["color"]: "4431943", ["title"]: "im a title", ["description"]: "im a message"}}),
      headers: { 'Content-Type': 'application/json' },
    })
  }
}