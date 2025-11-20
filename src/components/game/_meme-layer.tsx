import { Billboard } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { SRGBColorSpace, TextureLoader } from "three"

/**
 * Simplified meme configuration interface
 * Just specify which pipe to appear after and a scale factor!
 */
export interface MemeConfig {
  id: string // Unique identifier for the meme
  src: string // Path to the meme image (e.g., "/memes/doge.png")
  afterPipe: number // Which pipe # to appear after (e.g., 5 = between pipe 5 and 6)
  scale?: number // Size multiplier - defaults to 1.5 (larger = bigger meme)
  yOffset?: number // Vertical offset from center - defaults to 5 (range: 1-5 recommended)
  rotation?: number // Rotation in radians - defaults to 0
  opacity?: number // Opacity from 0 to 1 - defaults to 1
  showFrame?: boolean // Show cyberpunk billboard frame with neon lighting - defaults to true
  frameColor?: string // Metal frame color - defaults to "#1a1a1a" (dark metal)
  neonColor?: string // Neon edge lighting color - defaults to "#6E54FF" (monad)
  neonIntensity?: number // Brightness of neon glow - defaults to 6
}

/**
 * Props for the MemeLayer component
 */
interface MemeLayerProps {
  memes: MemeConfig[] // Array of meme configurations to display
}

/**
 * Individual meme component that renders a single meme image
 * Automatically calculates correct aspect ratio from the image
 * Can optionally display a realistic 3D billboard frame with support posts
 */
function Meme({ config }: { config: MemeConfig }) {
  // Load the meme texture
  const texture = useLoader(TextureLoader, config.src)
  texture.colorSpace = SRGBColorSpace

  // Calculate position based on pipe number
  // Pipes are at: pipeNumber * 10 - 250
  // We want to be BETWEEN pipes, so add 5 units (halfway)
  const PIPE_SPACING = 10
  const PIPE_START_X = -250
  const xPosition = config.afterPipe * PIPE_SPACING + PIPE_START_X + 5

  // Y position (vertical) - default to 5 if not specified
  const yPosition = config.yOffset !== undefined ? config.yOffset : 5

  // Z position - always in front of forest layer (-5)
  const Z_POSITION = -4

  // Calculate aspect ratio from the loaded texture
  const aspectRatio = texture.image.width / texture.image.height

  // Apply scale factor (default to 1.5)
  const scale = config.scale || 1.5
  const baseSize = 3.5 // Base size in world units

  // Width and height maintain aspect ratio
  const width = baseSize * scale * aspectRatio
  const height = baseSize * scale

  const rotation = config.rotation || 0
  const opacity = config.opacity !== undefined ? config.opacity : 1
  const showFrame = config.showFrame !== undefined ? config.showFrame : true
  const frameColor = config.frameColor || "#1a1a1a" // Dark metal gray
  const neonColor = config.neonColor || "#6E54FF" // Monad neon
  const neonIntensity = config.neonIntensity || 6 // Glow brightness

  // Cyberpunk billboard structure dimensions
  const framePadding = 0.15 // Space between image and frame
  const frameThickness = 0.08 // Thin metal backing
  const frameBarWidth = 0.12 // Thin metal frame bars
  const neonBarWidth = 0.06 // Width of neon strips
  const postRadius = 0.05 // Thin metal support posts
  const postHeight = height * 0.7 // Taller posts for futuristic look

  return (
    <Billboard
      position={[xPosition, yPosition, Z_POSITION]}
      follow={true} // Always face the camera
      lockX={false} // Allow rotation on X axis
      lockY={false} // Allow rotation on Y axis
      lockZ={false} // Allow rotation on Z axis
    >
      <group rotation={[0, 0, rotation]}>
        {/* Cyberpunk Billboard Frame with Neon Lighting */}
        {showFrame && (
          <>
            {/* Dark metal backing panel */}
            <mesh position={[0, 0, -frameThickness * 2]} castShadow>
              <boxGeometry args={[width + framePadding * 2, height + framePadding * 2, frameThickness]} />
              <meshStandardMaterial
                color={frameColor}
                roughness={0.3} // Smooth metal
                metalness={0.9} // Very metallic
              />
            </mesh>

            {/* Metal frame bars */}
            {/* Top bar */}
            <mesh position={[0, height / 2 + framePadding + frameBarWidth / 2, 0]} castShadow>
              <boxGeometry args={[width + framePadding * 2 + frameBarWidth * 2, frameBarWidth, frameThickness * 3]} />
              <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.8} />
            </mesh>

            {/* Bottom bar */}
            <mesh position={[0, -height / 2 - framePadding - frameBarWidth / 2, 0]} castShadow>
              <boxGeometry args={[width + framePadding * 2 + frameBarWidth * 2, frameBarWidth, frameThickness * 3]} />
              <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.8} />
            </mesh>

            {/* Left bar */}
            <mesh position={[-width / 2 - framePadding - frameBarWidth / 2, 0, 0]} castShadow>
              <boxGeometry args={[frameBarWidth, height + framePadding * 2, frameThickness * 3]} />
              <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.8} />
            </mesh>

            {/* Right bar */}
            <mesh position={[width / 2 + framePadding + frameBarWidth / 2, 0, 0]} castShadow>
              <boxGeometry args={[frameBarWidth, height + framePadding * 2, frameThickness * 3]} />
              <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.8} />
            </mesh>

            {/* Neon LED strips with glow halos */}
            {/* Top glow halo */}
            <mesh position={[0, height / 2 + framePadding + frameBarWidth + neonBarWidth / 2, frameThickness - 0.01]}>
              <boxGeometry args={[width + framePadding * 2, neonBarWidth * 4, neonBarWidth * 3]} />
              <meshStandardMaterial
                color={neonColor}
                emissive={neonColor}
                emissiveIntensity={neonIntensity * 0.4}
                transparent
                opacity={0.3}
                toneMapped={false}
              />
            </mesh>
            {/* Top neon strip */}
            <mesh position={[0, height / 2 + framePadding + frameBarWidth + neonBarWidth / 2, frameThickness]}>
              <boxGeometry args={[width + framePadding * 2, neonBarWidth, neonBarWidth]} />
              <meshStandardMaterial
                color={neonColor}
                emissive={neonColor}
                emissiveIntensity={neonIntensity}
                toneMapped={false}
              />
            </mesh>

            {/* Bottom glow halo */}
            <mesh position={[0, -height / 2 - framePadding - frameBarWidth - neonBarWidth / 2, frameThickness - 0.01]}>
              <boxGeometry args={[width + framePadding * 2, neonBarWidth * 4, neonBarWidth * 3]} />
              <meshStandardMaterial
                color={neonColor}
                emissive={neonColor}
                emissiveIntensity={neonIntensity * 0.4}
                transparent
                opacity={0.3}
                toneMapped={false}
              />
            </mesh>
            {/* Bottom neon strip */}
            <mesh position={[0, -height / 2 - framePadding - frameBarWidth - neonBarWidth / 2, frameThickness]}>
              <boxGeometry args={[width + framePadding * 2, neonBarWidth, neonBarWidth]} />
              <meshStandardMaterial
                color={neonColor}
                emissive={neonColor}
                emissiveIntensity={neonIntensity}
                toneMapped={false}
              />
            </mesh>

            {/* Left glow halo */}
            <mesh position={[-width / 2 - framePadding - frameBarWidth - neonBarWidth / 2, 0, frameThickness - 0.01]}>
              <boxGeometry args={[neonBarWidth * 4, height + framePadding * 2, neonBarWidth * 3]} />
              <meshStandardMaterial
                color={neonColor}
                emissive={neonColor}
                emissiveIntensity={neonIntensity * 0.4}
                transparent
                opacity={0.3}
                toneMapped={false}
              />
            </mesh>
            {/* Left neon strip */}
            <mesh position={[-width / 2 - framePadding - frameBarWidth - neonBarWidth / 2, 0, frameThickness]}>
              <boxGeometry args={[neonBarWidth, height + framePadding * 2, neonBarWidth]} />
              <meshStandardMaterial
                color={neonColor}
                emissive={neonColor}
                emissiveIntensity={neonIntensity}
                toneMapped={false}
              />
            </mesh>

            {/* Right glow halo */}
            <mesh position={[width / 2 + framePadding + frameBarWidth + neonBarWidth / 2, 0, frameThickness - 0.01]}>
              <boxGeometry args={[neonBarWidth * 4, height + framePadding * 2, neonBarWidth * 3]} />
              <meshStandardMaterial
                color={neonColor}
                emissive={neonColor}
                emissiveIntensity={neonIntensity * 0.4}
                transparent
                opacity={0.3}
                toneMapped={false}
              />
            </mesh>
            {/* Right neon strip */}
            <mesh position={[width / 2 + framePadding + frameBarWidth + neonBarWidth / 2, 0, frameThickness]}>
              <boxGeometry args={[neonBarWidth, height + framePadding * 2, neonBarWidth]} />
              <meshStandardMaterial
                color={neonColor}
                emissive={neonColor}
                emissiveIntensity={neonIntensity}
                toneMapped={false}
              />
            </mesh>

            {/* Corner accent lights with glow */}
            {[
              { id: "top-left", xDir: -1, yDir: 1 },
              { id: "top-right", xDir: 1, yDir: 1 },
              { id: "bottom-left", xDir: -1, yDir: -1 },
              { id: "bottom-right", xDir: 1, yDir: -1 },
            ].map(({ id, xDir, yDir }) => (
              <group key={`corner-${config.id}-${id}`}>
                {/* Corner glow halo */}
                <mesh
                  position={[
                    xDir * (width / 2 + framePadding + frameBarWidth),
                    yDir * (height / 2 + framePadding + frameBarWidth),
                    frameThickness * 2 - 0.02,
                  ]}
                >
                  <sphereGeometry args={[neonBarWidth * 4, 8, 8]} />
                  <meshStandardMaterial
                    color={neonColor}
                    emissive={neonColor}
                    emissiveIntensity={neonIntensity * 0.5}
                    transparent
                    opacity={0.2}
                    toneMapped={false}
                  />
                </mesh>
                {/* Corner light */}
                <mesh
                  position={[
                    xDir * (width / 2 + framePadding + frameBarWidth),
                    yDir * (height / 2 + framePadding + frameBarWidth),
                    frameThickness * 2,
                  ]}
                >
                  <sphereGeometry args={[neonBarWidth * 1.5, 8, 8]} />
                  <meshStandardMaterial
                    color={neonColor}
                    emissive={neonColor}
                    emissiveIntensity={neonIntensity * 1.5}
                    toneMapped={false}
                  />
                </mesh>
              </group>
            ))}

            {/* Industrial metal support posts */}
            {/* Left post */}
            <mesh position={[-width / 3, -height / 2 - framePadding - frameBarWidth - postHeight / 2, 0]} castShadow>
              <cylinderGeometry args={[postRadius, postRadius * 1.2, postHeight, 6]} />
              <meshStandardMaterial color={frameColor} roughness={0.5} metalness={0.9} />
            </mesh>

            {/* Right post */}
            <mesh position={[width / 3, -height / 2 - framePadding - frameBarWidth - postHeight / 2, 0]} castShadow>
              <cylinderGeometry args={[postRadius, postRadius * 1.2, postHeight, 6]} />
              <meshStandardMaterial color={frameColor} roughness={0.5} metalness={0.9} />
            </mesh>
          </>
        )}

        {/* Main meme image (slightly raised from backing for depth) */}
        <mesh position={[0, 0, frameThickness / 2]}>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial map={texture} transparent opacity={opacity} />
        </mesh>
      </group>
    </Billboard>
  )
}

/**
 * MemeLayer component - renders a collection of meme images as billboards
 * Displays memes between pipes at specified intervals
 *
 * Example usage:
 * ```tsx
 * const memeConfig: MemeConfig[] = [
 *   {
 *     id: "doge",
 *     src: "/memes/doge.png",
 *     afterPipe: 5,     // Appears between pipe 5 and 6
 *     scale: 1.2,       // 20% bigger than default
 *     showFrame: true,  // Show 3D billboard frame
 *   },
 *   {
 *     id: "pepe",
 *     src: "/memes/pepe.png",
 *     afterPipe: 12,
 *     scale: 0.8,       // 20% smaller
 *     yOffset: 4,       // Higher up
 *     rotation: 0.2,    // Slight tilt
 *     showFrame: true,
 *     frameColor: "#654321",  // Dark wood
 *   }
 * ]
 *
 * <MemeLayer memes={memeConfig} />
 * ```
 */
export default function MemeLayer({ memes }: MemeLayerProps) {
  return (
    <>
      {memes.map((meme) => (
        <Meme key={meme.id} config={meme} />
      ))}
    </>
  )
}
