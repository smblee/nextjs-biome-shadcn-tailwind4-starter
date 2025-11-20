import type { MemeConfig } from "../components/game/_meme-layer"

/**
 * Cyberpunk Billboard Configuration
 * Each billboard has:
 * - Dark metal frame with smooth metallic finish
 * - Glowing neon LED strips around the edges
 * - Corner accent lights
 * - Neon rings on support posts
 * - Emissive materials for realistic glow
 *
 * Customize with:
 * - frameColor: Metal frame color (default: "#1a1a1a" dark metal)
 * - neonColor: LED strip color (default: "#00ffff" cyan)
 * - neonIntensity: Glow brightness (default: 2, range: 0-5)
 *
 * Popular Cyberpunk Neon Colors:
 * - "#00ffff" - Cyan (default, classic cyberpunk)
 * - "#ff00ff" - Magenta (vibrant pink)
 * - "#ff0080" - Hot pink
 * - "#7B68EE" - Medium slate blue (purple)
 * - "#00ff41" - Matrix green
 * - "#ff4500" - Orange red
 * - "#ffd700" - Gold
 * - "#9d00ff" - Violet
 */
export const memeConfigs: MemeConfig[] = [
  // Example: Cyan neon (default cyberpunk look)
  {
    id: "meme-1",
    src: "/memes/14.jpeg",
    afterPipe: -1,
    scale: 2.5,
  },
  // Example: Magenta/pink neon
  {
    id: "meme-2",
    src: "/memes/2.jpeg",
    afterPipe: 20 * (2 - 1),
  },
  // Example: Matrix green neon
  {
    id: "meme-3",
    src: "/memes/3.png",
    afterPipe: 20 * (3 - 1),
  },
  {
    id: "meme-4",
    src: "/memes/4.jpeg",
    afterPipe: 20 * (4 - 1),
  },
  {
    id: "meme-5",
    src: "/memes/5.png",
    afterPipe: 20 * (5 - 1),
  },
  {
    id: "meme-6",
    src: "/memes/6.png",
    afterPipe: 20 * (6 - 1),
  },
  {
    id: "meme-7",
    src: "/memes/7.png",
    afterPipe: 20 * (7 - 1),
  },
  {
    id: "meme-8",
    src: "/memes/8.jpeg",
    afterPipe: 20 * (8 - 1),
  },
  {
    id: "meme-9",
    src: "/memes/9.png",
    afterPipe: 20 * (9 - 1),
  },
  {
    id: "meme-10",
    src: "/memes/10.png",
    afterPipe: 20 * (10 - 1),
  },
  {
    id: "meme-11",
    src: "/memes/11.jpeg",
    afterPipe: 20 * (11 - 1),
  },
  {
    id: "meme-12",
    src: "/memes/12.jpeg",
    afterPipe: 20 * (12 - 1),
  },
  {
    id: "meme-13",
    src: "/memes/13.jpeg",
    afterPipe: 20 * (13 - 1),
  },
  {
    id: "meme-14",
    src: "/memes/1.png",
    afterPipe: 20 * (14 - 1),
  },
  {
    id: "meme-15",
    src: "/memes/15.png",
    afterPipe: 20 * 15,
  },
  {
    id: "meme-16",
    src: "/memes/16.jpeg",
    afterPipe: 20 * 16,
  },
]

/**
 * Helper function to generate evenly spaced memes
 *
 * @param imagePaths - Array of image paths to use
 * @param startPipe - Which pipe to start after (e.g., 5)
 * @param spacing - How many pipes between each meme (e.g., 4)
 * @param options - Optional customization for all memes
 * @returns Array of MemeConfig objects
 */
export function generateEvenlySpacedMemes(
  imagePaths: string[],
  startPipe: number = 5,
  spacing: number = 4,
  options?: {
    scale?: number
    yOffset?: number
    randomRotation?: boolean
    randomScale?: boolean
  },
): MemeConfig[] {
  return imagePaths.map((src, index) => {
    // Calculate which pipe this meme comes after
    const afterPipe = 20 * startPipe + index * spacing

    // Optional random variations
    const rotation = options?.randomRotation ? (Math.random() - 0.5) * 0.3 : 0

    const scale = options?.randomScale
      ? (options.scale || 1.0) * (0.8 + Math.random() * 0.4) // ±20% variation
      : options?.scale || 1.0

    return {
      id: `meme-${index}`,
      src,
      afterPipe,
      scale,
      yOffset: options?.yOffset,
      rotation,
    }
  })
}

/**
 * Helper function to generate randomly spaced memes
 *
 * @param imagePaths - Array of image paths to cycle through
 * @param count - How many memes to generate
 * @param startPipe - Starting pipe number
 * @param endPipe - Ending pipe number
 * @returns Array of MemeConfig objects
 */
export function generateRandomMemes(
  imagePaths: string[],
  count: number,
  startPipe: number = 5,
  endPipe: number = 50,
): MemeConfig[] {
  const memes: MemeConfig[] = []
  const pipeRange = endPipe - startPipe

  for (let i = 0; i < count; i++) {
    // Pick a random pipe in the range
    const afterPipe = 20 * startPipe + Math.floor(Math.random() * pipeRange)

    // Random scale and position
    const scale = 0.8 + Math.random() * 0.6 // Range: 0.8 to 1.4
    const yOffset = 2 + Math.random() * 2.5 // Range: 2 to 4.5
    const rotation = (Math.random() - 0.5) * 0.4 // Range: -0.2 to 0.2

    // Pick a random image
    const src = imagePaths[i % imagePaths.length]

    memes.push({
      id: `random-meme-${i}`,
      src,
      afterPipe,
      scale,
      yOffset,
      rotation,
      opacity: 0.9 + Math.random() * 0.1,
    })
  }

  // Sort by pipe number for better performance
  return memes.sort((a, b) => a.afterPipe - b.afterPipe)
}

// Example: Generate evenly spaced memes (uncomment to use)
/*
export const evenlySpacedMemes = generateEvenlySpacedMemes(
  [
    "/memes/1.png",
    "/memes/2.jpg",
    "/memes/3.jpeg",
    "/memes/4.jpeg",
  ],
  5,  // Start after pipe 5
  4,  // Space every 4 pipes
  {
    scale: 1.0,
    randomRotation: true,
    randomScale: true,
  }
)
*/

// Example: Generate random memes (uncomment to use)
/*
export const randomMemes = generateRandomMemes(
  [
    "/memes/1.png",
    "/memes/2.jpg",
    "/memes/3.jpeg",
  ],
  10,  // Generate 10 memes
  5,   // Between pipe 5
  30   // and pipe 30
)
*/
