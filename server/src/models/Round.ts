import mongoose, { Schema, Document } from 'mongoose';

// ============================================================
// Round Model — Stores per-round data and all player results
// ============================================================

export interface IRoundResult {
  playerId: string;
  playerName: string;
  wpm: number;
  accuracy: number;
  mistakes: number;
  score: number;
  progress: number;
  finishPosition: number;
  finishTime: number;
}

export interface IRound extends Document {
  gameId: mongoose.Types.ObjectId;
  roundNumber: number;
  textId: mongoose.Types.ObjectId;
  textContent: string;
  startedAt: Date;
  endedAt: Date;
  results: IRoundResult[];
}

const RoundResultSchema = new Schema<IRoundResult>({
  playerId: { type: String, required: true },
  playerName: { type: String, required: true },
  wpm: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  mistakes: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  finishPosition: { type: Number, default: 0 },
  finishTime: { type: Number, default: 0 },
}, { _id: false });

const RoundSchema = new Schema<IRound>({
  gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  roundNumber: { type: Number, required: true },
  textId: { type: Schema.Types.ObjectId, ref: 'Text' },
  textContent: { type: String, required: true },
  startedAt: { type: Date },
  endedAt: { type: Date },
  results: [RoundResultSchema],
});

export default mongoose.model<IRound>('Round', RoundSchema);
