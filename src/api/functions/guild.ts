import { IGuild } from "../interfaces/IGuild";
import { generateToken } from "../token";

export async function getGuild(guild_id?: string, query?: any): Promise<IGuild | null>{
    const data = await fetch(`${process.env.API}/guild/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ guild_id, query })
    });
    
    if(data.status !== 200){
        return null;
    }

    const guild = await data.json();

    return guild;
}

export async function createGuild (guild_id: string): Promise<IGuild | null>{
    const data = await fetch(`${process.env.API}/guild/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ guild_id })
    });

    if(data.status !== 200){
        return null;
    }

    const guild = await data.json();

    return guild;
}
