/**
 * @param min -min number float
 * @param max -max number float
 * @param chunks -chunks from function createChunks
 * @param sum -sum from function createChunks
 */
export function randomWithCustomDistribution(
  min: number,
  max: number,
  chunks: number[],
  sum: number
) {
  const rand = Math.random() * sum
  let temp = 0
  let currentChunk!: number
  for (let i = 0; i < chunks.length; i++) {
    temp += chunks[i]
    if (temp > rand) {
      currentChunk = i
      break
    }
  }
  const interval = (max - min) / chunks.length
  const currentMin = min + currentChunk * interval
  const currentMax = currentMin + interval
  return currentMin + Math.random() * (currentMax - currentMin)
}

/**
 *
 * @param center -center chunk index with max probability
 * @param mult1 -multiply probability from start to center  x > 1
 * @param mult2 -multiply probability from center to end  0 < x < 1
 * @param chunksSize -number of chunks
 */

export function createChunks(
  center: number,
  mult1: number,
  mult2: number,
  chunksSize: number
): [number[], number] {
  const chunks = [1]
  for (let i = 1; i <= center; i++) {
    chunks.push(chunks[i - 1] * mult1)
  }
  for (let i = center + 1; i < chunksSize; i++) {
    chunks.push(chunks[i - 1] * mult2)
  }
  const sum = chunks.reduce((acc, cur) => acc + cur, 0)
  return [chunks, sum]
}
