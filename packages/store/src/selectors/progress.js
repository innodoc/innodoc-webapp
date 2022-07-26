import { createSelector } from '@reduxjs/toolkit'

export const selectTest = createSelector(() => ({
  canBeReset: true,
  canBeSubmitted: true,
  isSubmitted: true,
  score: undefined,
  totalScore: 0,
}))
