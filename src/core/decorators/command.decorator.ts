import { CommandGroup } from "../enitities/command-group.entity";
import { ICommand } from "../interfaces/command.inteface";
import { bot } from "../../main";


export function RegisterCommand(group: CommandGroup) {
    return function <T extends ICommand & { "execute": () => Promise<void> }>(constructor: new (...args: any[]) => T) {
        const instance = new constructor();
        
        bot.commands.set(instance.name, instance);
        group.addCommand(instance);
    };
}