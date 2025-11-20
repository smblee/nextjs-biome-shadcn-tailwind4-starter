import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import type * as THREE from "three"
import Pipes from "./_pipes"
import Player from "./_player"
import Scenery from "./_scenery"

/**
 * Main Game component - orchestrates the game scene
 * Manages lighting, scenery, pipes, and player
 */
export default function Game() {
  // Reference to directional light for dynamic positioning
  const lightRef = useRef<THREE.DirectionalLight>(null)

  // Colliders object shared between Player and Pipes for collision detection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colliders: Record<string, any> = {}

  // Update light position to follow camera each frame
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = state.camera.position.x
      lightRef.current.target.position.x = state.camera.position.x
      lightRef.current.target.updateMatrixWorld()
    }
  })

  return (
    <>
      {/* Background scenery */}
      <Scenery />

      {/* Obstacles */}
      <Pipes colliders={colliders} />

      {/* Player controlled bird */}
      <Player colliders={colliders} />

      {/* Dynamic directional light that follows the camera */}
      <directionalLight
        ref={lightRef}
        position={[10, 10, 10]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={40}
        shadow-camera-top={30}
        intensity={2}
      />
    </>
  )
}
