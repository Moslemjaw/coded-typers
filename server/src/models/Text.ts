import mongoose, { Schema, Document } from 'mongoose';

// ============================================================
// Text Model — Typing content organized by language & difficulty
// ============================================================

export interface IText extends Document {
  content: string;
  language: 'english' | 'arabic' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  wordCount: number;
  category: string;
}

const TextSchema = new Schema<IText>({
  content: { type: String, required: true },
  language: { type: String, enum: ['english', 'arabic', 'mixed'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  wordCount: { type: Number, required: true },
  category: { type: String, default: 'general' },
});

TextSchema.index({ language: 1, difficulty: 1 });

export default mongoose.model<IText>('Text', TextSchema);
