/* eslint-disable no-plusplus */
import { roundToNearest } from './format'

export const mergeLevelsByPrice = (levels: number[][]): number[][] => {
  const mergedLevels: number[][] = []

  for (let i = 0; i < levels.length; i++) {
    const currentLevel = levels[i]
    const nextLevel = levels[i + 1]

    if (nextLevel && currentLevel[0] === nextLevel[0]) {
      currentLevel[1] += nextLevel[1]
      i++ // Skip the next level since it's already merged
    } else if (i === 0 || currentLevel[0] !== levels[i - 1][0]) {
      mergedLevels.push(currentLevel) // Add only if it's not a duplicate
    }
  }

  return mergedLevels
}

export const mergeAndGroupLevelsBySize = (levels: number[][], ticketSize: number): number[][] => mergeLevelsByPrice(
  levels.map((level) => [roundToNearest(level[0], ticketSize), level[1]])
)
