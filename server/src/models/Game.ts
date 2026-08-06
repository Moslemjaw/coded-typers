import mongoose, { Schema, Document } from 'mongoose';

// ============================================================
// Game Model — Stores game configuration and state
// ============================================================

export interface IGame extends Document {
  pin: string;
  name: string;
  hostSocketId: string;
  hostPlayerId: string;
  language: 'english' | 'arabic' | 'mixed';
  rounds: number;
  typingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  maxPlayers: number;
  randomTexts: boolean;
  leaderboardAfterRound: boolean;
  allowReconnect: boolean;
  music: boolean;
  soundEffects: boolean;
  status: 'waiting' | 'countdown' | 'playing' | 'round-end' | 'finished';
  currentRound: number;
  players: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const GameSchema = new Schema<IGame>({
  pin: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  hostSocketId: { type: String, required: true },
  hostPlayerId: { type: String, required: true },
  language: { type: String, enum: ['english', 'arabic', 'mixed'], default: 'english' },
  rounds: { type: Number, default: 3, min: 1, max: 10 },
  typingTime: { type: Number, default: 60, enum: [15, 30, 60, 90] },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  maxPlayers: { type: Number, default: 30, min: 2, max: 50 },
  randomTexts: { type: Boolean, default: true },
  leaderboardAfterRound: { type: Boolean, default: true },
  allowReconnect: { type: Boolean, default: true },
  music: { type: Boolean, default: false },
  soundEffects: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ['waiting', 'countdown', 'playing', 'round-end', 'finished'],
    default: 'waiting',
  },
  currentRound: { type: Number, default: 0 },
  players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IGame>('Game', GameSchema);
