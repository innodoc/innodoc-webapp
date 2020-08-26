import mongoose from 'mongoose'

import { connectDb } from '../db'
import User from './User'
import UserProgress from './UserProgress'

describe('UserProgress', () => {
  beforeAll(() => connectDb({ mongoUrl: process.env.MONGO_URL, nodeEnv: 'production' }))

  afterAll(() => mongoose.disconnect())

  const getRandEmail = () => {
    const randString = Math.random().toString(36).substring(2)
    return `alice-user-${randString}@example.com`
  }

  const addTestUser = async () => {
    const user = User({
      email: getRandEmail(),
      emailVerificationToken: '123vtoken!',
      emailVerified: false,
      passwordResetExpires: Date.now(),
      passwordResetToken: '123ptoken!',
    })
    await user.setPassword('g00dPassword!')
    await user.save()
    return user
  }

  const addTestUserProgress = async () => {
    const user = await addTestUser()
    const question = {
      id: 'foo/bar#Q01',
      exerciseId: 'foo/bar#EX01',
      answer: '42',
      answeredTimestamp: 1598451191939,
      result: 'CORRECT',
      points: 9,
    }
    const userProgress = UserProgress({
      user_id: user._id,
      answeredQuestions: [question],
      visitedSections: ['foo/bar', 'foo/baz'],
    })
    await userProgress.save()
    return [userProgress, user]
  }

  it('should have mongoose schema', async () => {
    const [userProgress, user] = await addTestUserProgress()
    expect(userProgress.user_id).toBe(user._id)
    expect(userProgress.answeredQuestions).toHaveLength(1)
    expect(userProgress.answeredQuestions[0].id).toBe('foo/bar#Q01')
    expect(userProgress.answeredQuestions[0].exerciseId).toBe('foo/bar#EX01')
    expect(userProgress.answeredQuestions[0].answer).toBe('42')
    expect(userProgress.answeredQuestions[0].answeredTimestamp).toBe(1598451191939)
    expect(userProgress.answeredQuestions[0].result).toBe('CORRECT')
    expect(userProgress.answeredQuestions[0].points).toBe(9)
    expect(userProgress.visitedSections).toHaveLength(2)
    expect(userProgress.visitedSections[0]).toBe('foo/bar')
    expect(userProgress.visitedSections[1]).toBe('foo/baz')
  })

  it('should have unique user_id field', async () => {
    const [, user] = await addTestUserProgress()
    const anotherUserProgress = UserProgress({ user_id: user._id })
    return expect(anotherUserProgress.save()).rejects.toThrow(/duplicate/)
  })
})
