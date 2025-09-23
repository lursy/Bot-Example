import { ICommand } from "../interfaces/command.inteface";
import { Collection } from "discord.js";
import { bot } from "../../main";

export class CommandGroup {
    public name:        string;
    public description: string;
    public commands = new Collection<string, ICommand>();

    constructor(name: string, description: string){
        this.name = name;
        this.description = description;

        bot.groups.set(this.name, this);
    }

    public addCommand(command: ICommand){
        this.commands.set(command.name, command);
    }
}