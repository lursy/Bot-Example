import { config } from "dotenv";
import { CommandGroup } from "../enitities/command-group.entity";
import { ICommand } from "../interfaces/command.inteface";
import { IEvent } from "../interfaces/event.interface";
import { Client, Collection, GatewayIntentBits } from "discord.js";

config();
export class Bot {
    static #instance: Bot;

    public client: Client;
    public groups = new Collection<string, CommandGroup>();
    public commands = new Collection<string, ICommand & { execute: (...args: any[]) => Promise<void> }>();
    public aliases= new Collection<string, ICommand & { execute: (...args: any[]) => Promise<void> }>();
    public events = new Collection<string, IEvent & { execute: (...args: any[]) => Promise<void> }>();
    public leaderboard: string | null = null;
    public prefix: string;
    public id: string;

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent,
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

    public static get instance(): Bot {
        if (!Bot.#instance) {
            Bot.#instance = new Bot();
        }

        return Bot.#instance;
    }

    public start() {
        console.log(" ⏳ Recording events...");

        this.events.forEach((event) => {
            this.client.on(event.name, event.execute);
        });
        
        console.log(" ✅ Events successfully registered!");
        this.client.login(process.env.TOKEN);
    }
}