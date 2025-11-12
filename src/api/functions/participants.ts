import { IParticipant } from "../interfaces/IParticipant";
import { generateToken } from "../token";

export async function getParticipants(user_id?: string, raffle_id?: undefined, query?: undefined, skip?: undefined): Promise<IParticipant[] | null>;
export async function getParticipants(user_id?: undefined, raffle_id?: string, query?: undefined, skip?: undefined): Promise<IParticipant[] | null>;
export async function getParticipants(user_id?: undefined, raffle_id?: undefined, query?: object, skip?: number): Promise<IParticipant[] | null>;
export async function getParticipants(user_id: undefined, raffle_id: string, query?: undefined, skip?: number): Promise<IParticipant[] | null>;
export async function getParticipants(user_id: string, raffle_id: string, query?: undefined, skip?: number): Promise<IParticipant | null>;

export async function getParticipants(user_id?: string, raffle_id?: string, query?: any, skip?: number){
    const data = await fetch(`${process.env.API}/participant/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateToken()}`
        },
        body: JSON.stringify({ user_id, raffle_id, query, skip })
    });

    if(data.status !== 200){
        return null;
    }

    const participants = await data.json();

    return participants;
}