import Embed, { EmbedData } from "./embed";

interface WebhookMessageData {
    username?: string;
    embeds?: EmbedData[];
}

class WebhookMessage {
  username?: string;
  embeds: Embed[];

  constructor(data?: WebhookMessageData) {
    this.username = data?.username;
    this.embeds = data?.embeds?.map(embedData => new Embed(embedData)) ?? [];
  }

  // Methods
  

  public toJSON(): WebhookMessageData {
    return {
      username: this.username,
      embeds: this.embeds.length > 0 ? this.embeds.map(embed => embed.toJSON()) : undefined
    };
  }
}

export default WebhookMessage;

export { WebhookMessageData };