import { Schema, model } from 'mongoose';
import { IRaffle } from '../interface/IRaffle';


const RaffleSchema: Schema = new Schema({
  date: { type: Number, required: true},
  type: { type: Number, default: 0},
  value: { type: Number, default: 0 },
  tickets: { type: Number, default: 0 },
  participants: { type: Number, default: 0 },
  last_winner: { type: { id: String, name: String, tickets: Number }, default: null }
});


const Raffle = model<IRaffle>('Raffle', RaffleSchema);

export { Raffle };
