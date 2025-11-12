import { IGame } from "../interfaces/IGame";
import { generateToken } from "../token";

export async function readGame(user_id: string, name?: undefined): Promise<IGame[] | null>;
export async function readGame(user_id: string, name?: string): Promise<IGame | null>;

export async function readGame(user_id: string, name?: string){
    const data = await fetch(`${process.env.API}/game/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ user_id: user_id, game: name })
    });

    if(data.status !== 200){
        return null;
    }

    const game = await data.json();

    return game;
}

export async function createGame(user_id: string, name: string): Promise<IGame | null>{
    const data = await fetch(`${process.env.API}/game/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ user_id, game: name })
    });

    if(data.status !== 200){
        return null;
    }

    const game = await data.json();

    return game;
}

export async function winGame(user_id:string, name: string): Promise<IGame | null>{
    const data = await fetch(`${process.env.API}/game/win`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ user_id, game: name })
    });

    if(data.status !== 200){
        return null;
    }

    const game = await data.json();

    return game;
}

export async function loseGame(user_id: string, name: string): Promise<IGame | null>{
    const data = await fetch(`${process.env.API}/game/lose`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ user_id, game: name })
    });
    
    if(data.status !== 200){
        return null;
    }

    const game = await data.json();

    return game;
}