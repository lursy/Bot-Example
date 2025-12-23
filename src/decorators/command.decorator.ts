import { CommandGroup } from "../enitities/command-group.entity";
import { ICommand } from "../interfaces/command.inteface";
import { CommandDTO } from "../dtos/command.dto";
import { Bot } from "../core/bot";

export function RegisterCommand(group: CommandGroup,) {
    return function <T extends ICommand & { "execute": (...args: any[]) => Promise<void> }>(constructor: new (...args: any[]) => T) {
        const instance = new constructor(group.name);

        const originalMethod = instance.execute;

        instance.execute = async (data: CommandDTO, ...args: any[]) => {
            // Bot.instance.cooldown.set(data.user._id, instance.cooldown);
            
            await originalMethod.call(instance, data, ...args);
        }

        Bot.instance.commands.set(instance.name, instance);

        for (const name of instance.aliases) {
            Bot.instance.aliases.set(name, instance);
        }

        group.addCommand(instance);
    };
}