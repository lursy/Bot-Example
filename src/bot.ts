import { Client } from "discord.js";

export class Bot {
    public client: Client;

    constructor(client: Client) {
        this.client = client;

        this.client.login(process.env.TOKEN);
    }
}