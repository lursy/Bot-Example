import { ClientEvents } from "discord.js";
import { IEvent } from "../interfaces/event.interface";

export type DiscordEvents = keyof ClientEvents;

export class Event implements IEvent {
    public name: DiscordEvents;

    constructor(event: DiscordEvents){
        this.name = event;
    }
}