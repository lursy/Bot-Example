import { Bot } from "../core/bot";
import { CommandGroup } from "../enitities/command-group.entity";
import { ICommand } from "../interfaces/command.inteface";

export function RegisterCommand(group: CommandGroup) {
    return function <T extends ICommand & { "execute": (...args: any[]) => Promise<void> }>(constructor: new (...args: any[]) => T) {
        const instance = new constructor(group.name);
        
        Bot.instance.commands.set(instance.name, instance);

        for(const name of instance.aliases){
            Bot.instance.aliases.set(name, instance);
        }

        group.addCommand(instance);
    };
}