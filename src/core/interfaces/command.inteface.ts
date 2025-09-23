import { ApplicationCommandOptionData } from "discord.js";

export interface ICommand {
    name:        string;
    howToUse:    string;
    cooldown:    number;
    description: string;
    options:     ApplicationCommandOptionData[];
}