export interface IRaffle{
  _id: string;
  date: number;
  type: number;
  value: number;
  tickets: number;
  last_winner: {id: string, name: string, tickets: number} | null;
  participants: number;
}