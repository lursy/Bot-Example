import { ApplicationCommandOptionData } from "discord.js";
import { ICommand } from "../interfaces/command.inteface";

export class Command implements Omit<ICommand, "group"> {
    public name: string;
    public description: string;
    public cooldown: number;
    public howToUse: string;
    public options: ApplicationCommandOptionData[];

    constructor(command: Omit<ICommand, "howToUse" | "group">){
        this.name = command.name;
        this.options = command.options
        this.cooldown = command.cooldown;
        this.description = command.description;
        this.howToUse = `${process.env.PREFIX}${this.name} ${this.options.map(e => `<${e.name}> `)}`;
    }
}