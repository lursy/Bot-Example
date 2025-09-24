import { CommandHandlerDTO } from "../dtos/command.dto";
import { Bot } from "../bot";

export function commandHandler(data: CommandHandlerDTO) {
    let content: string;
    let args: (string | number | boolean | undefined)[];
    let commandName: string;

    if(data.type === "prefix") {
        content = data.message.content.toLowerCase();
        args = content.slice(Bot.instance.prefix.length).trim().split(/ +/g);
        commandName = args.shift()! as string;
    } else {
        args = data.interaction.options.data.map(element => {
            return element.value
        });

        commandName = data.interaction.commandName;
    }

    const command = Bot.instance.commands.get(commandName.toLowerCase());

    if (!command) return;

    command.execute(data, ...args);
}