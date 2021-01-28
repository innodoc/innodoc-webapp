import mongoose from 'mongoose'

const answeredQuestionSchema = new mongoose.Schema({
  id: String,
  exerciseId: String,
  answer: String,
  answeredTimestamp: Number,
  result: String,
  points: Number,
})

const UserProgress = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  answeredQuestions: { type: [answeredQuestionSchema], required: true },
  testScores: { type: Map, of: Number, required: true },
  visitedSections: { type: [String], required: true },
})

export default mongoose.model('UserProgress', UserProgress)
