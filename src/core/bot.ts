import { CommandGroup } from "./enitities/command-group.entity";
import { ICommand } from "./interfaces/command.inteface";
import { IEvent } from "./interfaces/event.interface";
import { Client, Collection, GatewayIntentBits } from "discord.js";

export class Bot {
    public client: Client;
    public groups = new Collection<string, CommandGroup>();
    public commands = new Collection<string, ICommand & { execute: () => Promise<void> }>();
    public events = new Collection<string, IEvent & { execute: () => Promise<void> }>();
    public prefix: string;
    public id: string;

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.Guilds
            ],
            sweepers: {
                messages: {
                    interval: 60,
                    lifetime: 600
                }
            }
        });
        this.id = process.env.ID!;
        this.prefix = process.env.PREFIX!;
    }

    private start() {
        console.log("Carregando eventos...");
        this.events.forEach((event) => {
            this.client.on(event.name, event.execute);
        });

        console.log("Conectando ao bot...");
        this.client.login(process.env.TOKEN);
    }
}