import mongoose, { Schema, Document } from 'mongoose';

// ============================================================
// Player Model — Individual player in a game session
// ============================================================

export interface IRoundEntry {
  roundNumber: number;
  wpm: number;
  accuracy: number;
  mistakes: number;
  score: number;
  finishTime: number;
  finishPosition: number;
  progress: number;
}

export interface IPlayer extends Document {
  socketId: string;
  gameId: mongoose.Types.ObjectId;
  displayName: string;
  language: string;
  avatar: string;
  isReady: boolean;
  isHost: boolean;
  isConnected: boolean;
  totalScore: number;
  rounds: IRoundEntry[];
  joinedAt: Date;
}

const RoundEntrySchema = new Schema<IRoundEntry>({
  roundNumber: { type: Number, required: true },
  wpm: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  mistakes: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  finishTime: { type: Number, default: 0 },
  finishPosition: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
}, { _id: false });

const PlayerSchema = new Schema<IPlayer>({
  socketId: { type: String, required: true },
  gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  displayName: { type: String, required: true, trim: true, maxlength: 20 },
  language: { type: String, default: 'english' },
  avatar: { type: String, default: 'rocket' },
  isReady: { type: Boolean, default: false },
  isHost: { type: Boolean, default: false },
  isConnected: { type: Boolean, default: true },
  totalScore: { type: Number, default: 0 },
  rounds: [RoundEntrySchema],
  joinedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPlayer>('Player', PlayerSchema);
