/**
 * Pipe positions definition
 * Uses a seeded random number generator for consistent pipe placement
 */

// Type for pipe position data
export interface PipePosition {
  position: [number, number, number]
}

// Seedable RNG implementation (Linear Congruential Generator)
// Source: https://gist.github.com/blixt/f17b47c62508be59987b
const LCG = (s: number) => (_: number) => {
  s = Math.imul(741103597, s) >>> 0
  return s / 2 ** 32
}

// Create RNG with seed 12345678 for deterministic pipe generation
const nextRandom = LCG(12345678)

/**
 * Generate 449 pipe positions with gradually increasing difficulty
 * Height differences between pipes become more extreme as the game progresses
 */
export const pipePositions: PipePosition[] = [...Array(449)].map((_, i) => ({
  // x: evenly spaced every 10 units, starting at -250
  // y: random height that increases in variance with progress
  // z: always 0 (no depth variation)
  position: [i * 10 - 250, nextRandom(1) * (5 + Math.min(i, 30) / 7.5) + 3, 0],
}))
