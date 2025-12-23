import { Schema, model } from 'mongoose';
import { IParticipant } from '../interface/IParticipant';

const ParticipantSchema: Schema = new Schema({
    user_id: { type: String, required: true },
    raffle_id: { type: String, required: true },
    total_tickets: { type: Number, default: 0 }
});

ParticipantSchema.index({ user_id: 1, raffle_id: 1 }, { unique: true });

const Participant = model<IParticipant>('Participant', ParticipantSchema);

export { Participant }