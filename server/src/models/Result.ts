import mongoose, { Schema, Document } from 'mongoose';

// ============================================================
// Result Model — Final aggregate results per player per game
// ============================================================

export interface IResultRound {
  roundNumber: number;
  wpm: number;
  accuracy: number;
  mistakes: number;
  score: number;
}

export interface IResult extends Document {
  gameId: mongoose.Types.ObjectId;
  playerId: mongoose.Types.ObjectId;
  playerName: string;
  totalScore: number;
  averageWpm: number;
  averageAccuracy: number;
  totalMistakes: number;
  rank: number;
  rounds: IResultRound[];
  completedAt: Date;
}

const ResultRoundSchema = new Schema<IResultRound>({
  roundNumber: { type: Number, required: true },
  wpm: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  mistakes: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
}, { _id: false });

const ResultSchema = new Schema<IResult>({
  gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  playerName: { type: String, required: true },
  totalScore: { type: Number, default: 0 },
  averageWpm: { type: Number, default: 0 },
  averageAccuracy: { type: Number, default: 0 },
  totalMistakes: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  rounds: [ResultRoundSchema],
  completedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IResult>('Result', ResultSchema);
