import { ApplicationCommandData, Client, REST, Routes } from "discord.js";
import { bot } from "../../main";

export async function ready(client: Client){
    console.log("starting bot...");
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);
    const commands: ApplicationCommandData[] = [];

    bot.commands.forEach((collection) => {
        console.log(`⏳ the "${collection.name}" command has been added`);
        
        commands.push({
            name: collection.name,
            description: collection.description,
            options: collection.options,
        });
    });

    await rest.put(
        Routes.applicationCommands(bot.id),
        { body: commands }
    );

    console.log(`✅ Loaded slashes!`);

    console.log(`\n\n${client.user?.username} (${bot.client.user?.id}) is running!`);
}