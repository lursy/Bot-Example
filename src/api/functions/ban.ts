import { IBan } from "../interfaces/IBan";
import { generateToken } from "../token";


export async function getBan(ban_id?: string, user_id?: string): Promise<IBan | null>{
    const data = await fetch(`${process.env.API}/ban/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ ban_id, user_id })
    });

    const ban = await data.json();

    return ban;
}

export async function createBan(user_id: string, author: string, reason: string, date: number): Promise<IBan | null>{
    const data = await fetch(`${process.env.API}/ban/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ user_id, author, reason, date })
    });

    if(data.status !== 200){
        return null;
    }

    const ban = await data.json();

    return ban;
}

export async function deleteBan(user_id: string): Promise<IBan | null>{
    const data = await fetch(`${process.env.API}/ban/delete`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ user_id })
    });

    if(data.status !== 200){
        return null;
    }

    const ban = await data.json();

    return ban;
}