import { Client, Collection } from "discord.js";
import { ICommand } from "./interfaces/command.inteface";
import { CommandGroup } from "./enitities/command-group.entity";
import { ready } from "./events/ready.event";
import { IEvent } from "./interfaces/event.interface";

export class Bot {
    public client: Client;
    public groups   = new Collection<string, CommandGroup>();
    public commands = new Collection<string, ICommand>();
    public events   = new Collection<string, IEvent>();
    public id: string;

    constructor(client: Client) {
        this.client = client;
        this.id = process.env.ID!;
        this.client.login(process.env.TOKEN);
    }

    private loadEvents(){
        this.events.forEach((event) => {
            this.client.on(event.name, event.execute);
        });
    }
}