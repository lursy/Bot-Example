import { CommandDTO } from "../dtos/command.dto";
import { Bot } from "../bot";

export function commandHandler(data: CommandDTO) {
    let content: string;
    let args: (string | number | boolean | undefined)[];
    let commandName: string;

    if(data.type === "prefix") {
        content = data.command.content.toLowerCase();
        args = content.slice(Bot.instance.prefix.length).trim().split(/ +/g);
        commandName = args.shift()! as string;
    } else {
        args = data.command.options.data.map(element => {
            return element.value
        });

        commandName = data.command.commandName;
    }

    const command = Bot.instance.commands.get(commandName.toLowerCase());

    if (!command) return;

    command.execute(data, ...args);
}