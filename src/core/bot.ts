import { Client, Collection, GatewayIntentBits } from "discord.js";
import { CommandGroup } from "../enitities/command-group.entity";
import { ICommand } from "../interfaces/command.inteface";
import { IEvent } from "../interfaces/event.interface";
import settings from "../settings.json";
import mongoose from "mongoose";
import { config } from "dotenv";

config();

export class Bot {
    static #instance: Bot;
    
    public readonly client: Client;
    public readonly groups = new Collection<string, CommandGroup>();
    public readonly commands = new Collection<string, ICommand & { execute: (...args: any[]) => Promise<void> }>();
    public readonly aliases= new Collection<string, ICommand & { execute: (...args: any[]) => Promise<void> }>();
    public readonly events = new Collection<string, IEvent & { execute: (...args: any[]) => Promise<void> }>();
    public readonly leaderboard: string | null = null;
    public readonly prefix: string;
    public readonly id: string;
    static readonly settings = settings;

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
    
    public async start() {
        try {
            await mongoose.connect(process.env.MONGO_URI!);
            console.log('[MongoDB] conectado!');
        } catch (err) {
            console.log('[MongoDB] conexão não estabelecida!');
        }

        console.log(" ⏳ Recording events...");

        this.events.forEach((event) => {
            console.log(event.name);
            this.client.on(event.name, event.execute);
        });
        
        console.log(" ✅ Events successfully registered!");
        await this.client.login(process.env.TOKEN);
    }
}

import "../loader";

Bot.instance.start().catch(console.error);