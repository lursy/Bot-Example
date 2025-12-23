import { ApplicationCommandOptionData } from "discord.js";

export interface ICommand {
    name:           string;
    aliases:        string[];
    group:          string;
    howToUse:       string;
    cooldown:       number;
    description:    string;
    options:        ApplicationCommandOptionData[];
}

export interface IConstructorCommand{
    name:           string;
    aliases:        string[];
    cooldown:       number;
    description:    string;
    options:        ApplicationCommandOptionData[];
}

export interface ICommandRequirements {
    balance?: boolean;
    player?: boolean;
    daily?: boolean;
}