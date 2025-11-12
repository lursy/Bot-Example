import { IDrop } from "../interfaces/IDrop";
import { generateToken } from "../token";

export async function getDrop(drop_id: string): Promise<IDrop | null>{
    const data = await fetch(`${process.env.API}/drop/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ drop_id })
    });

    if(data.status !== 200){
        return null;
    }

    const drop = await data.json();

    return drop;
}

export async function createDrop(value: number, time: number): Promise<IDrop | null>{
    const data = await fetch(`${process.env.API}/drop/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ value, time })
    });

    if(data.status !== 200){
        return null;
    }

    const drop = await data.json();

    return drop;
}

export async function updateDrop(drop_id: string, user_id: string): Promise<IDrop | null>{
    const data = await fetch(`${process.env.API}/drop/update`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ drop_id, user_id })
    });

    if(data.status !== 200){
        return null;
    }

    const drop = await data.json();

    return drop;
}

export async function deleteDrop(drop_id: string): Promise<IDrop | null>{
    const data = await fetch(`${process.env.API}/drop/delete`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ drop_id })
    });

    if(data.status !== 200){
        return null;
    }

    const drop = await data.json();

    return drop;
}