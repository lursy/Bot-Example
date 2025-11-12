import { IRaffle } from "../interfaces/IRaffle";
import { generateToken } from "../token";

export const createRaffle = async (time: number, last_winner?: {id: string, name: string, tickets: number}, type?: number) => {
    const data = await fetch(`${process.env.API}/raffle/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ time, last_winner, type })
    });

    if(data.status !== 200){
        return null;
    }

    const raffle = await data.json();

    return raffle;
}

export async function readRaffle(raffle_id?: string, type?: number): Promise<IRaffle | null>{
    const data = await fetch(`${process.env.API}/raffle/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ raffle_id, type })
    });

    if(data.status !== 200){
        return null;
    }

    const raffle = await data.json();

    return raffle;
}

export async function updateRaffle(user_id: string, tickets: number, value: number, raffle_id?: string, type?: number): Promise<IRaffle | null>{
    const data = await fetch(`${process.env.API}/raffle/buy`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ user_id, tickets, value, raffle_id, type })
    });

    if(data.status !== 200){
        return null;
    }

    return await data.json();
}

export const deleteRaffle = async (raffle_id: string) => {
    const data = await fetch(`${process.env.API}/raffle/delete`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ raffle_id })
    });

    if(data.status !== 200){
        return null;
    }

    const raffle = await data.json();

    return raffle;
}