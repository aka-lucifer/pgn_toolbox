import Color from "color";

import EmbedFooter from "./embedFooter";
import EmbedField from "./embedField";

interface EmbedData {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: EmbedFooter;
    fields?: EmbedField[];
}

class Embed {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: EmbedFooter;
    fields: EmbedField[];

    constructor(data?: EmbedData) {
        this.title = data?.title;
        this.description = data?.description;
        this.url = data?.url;
        this.timestamp = data?.timestamp;
        this.color = data?.color;
        this.footer = data?.footer;
        this.fields = data?.fields ?? [];
    }

    setTitle(title: string) {
        this.title = title;
        return this;
    }

    setDescription(description: string) {
        this.description = description;
        return this;
    }

    setUrl(url: string) {
        this.url = url;
        return this;
    }

    setTimestamp(date: Date = new Date()) {
        this.timestamp = date.toISOString();
        return this;
    }

    setColor(color: Color) {
        this.color = color.rgbNumber();
        return this;
    }

    setFooter(text: string, iconUrl?: string) {
        this.footer = {
            text,
            icon_url: iconUrl
        };
        return this;
    }

    addField(name: string, value: string, inline: boolean = false) {
        this.fields.push({
            name,
            value
        });
        return this;
    }

    toJSON(): EmbedData {
        return {
            title: this.title,
            description: this.description,
            url: this.url,
            timestamp: this.timestamp,
            color: this.color,
            footer: this.footer,
            fields: this.fields.length > 0 ? this.fields : undefined
        };
    }
}

export default Embed;

export { EmbedData };
