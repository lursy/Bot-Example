import { ApplicationCommandData, Client, REST, Routes } from "discord.js";
import { RegisterEvent } from "../decorators/event.decorator";
import { Event } from "../enitities/event.entity";
import { Bot } from "../bot";
@RegisterEvent()
export class ReadyEvent extends Event {
    constructor() {
        super('clientReady');
    }

    public async execute(client: Client) {
        console.log("\n ⏳ Recording slashes...");

        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);
        const commands: ApplicationCommandData[] = [];

        Bot.instance.commands.forEach((collection) => {
            commands.push({
                name: collection.name,
                description: collection.description,
                options: collection.options,
            });
        });

        await rest.put(
            Routes.applicationCommands(Bot.instance.id),
            { body: commands }
        );

        console.log(` ✅ Slashes successfully registered!`);

        console.log(`\n ⏹️  ${client.user?.username} (${Bot.instance.id}) is running!`);
    }
}