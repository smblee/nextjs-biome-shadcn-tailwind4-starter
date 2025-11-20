import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import type * as THREE from "three"
import { TextureLoader } from "three"

interface UnicornProps {
  birdRef: React.RefObject<THREE.Group>
}

/**
 * Unicorn component - renders the main player character as a 3D box with unicorn PNG texture
 * Positioned and rotated based on the player's physics model
 */
export default function Unicorn({ birdRef }: UnicornProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const { camera } = useThree()

  // Load the unicorn PNG texture
  useEffect(() => {
    const loader = new TextureLoader()
    loader.load(
      "/img/monad-unicorn.png",
      (loadedTexture) => {
        // Set texture properties for better rendering
        loadedTexture.flipY = false // Don't flip the texture (scale handles orientation)
        setTexture(loadedTexture)
      },
      undefined,
      (error) => {
        console.error("Error loading unicorn texture:", error)
      },
    )

    return () => {
      if (texture) {
        texture.dispose()
      }
    }
  }, [texture])

  // Update position and rotation to match player's position and rotation every frame
  useFrame(() => {
    if (meshRef.current && birdRef.current) {
      // Match player's position exactly
      meshRef.current.position.copy(birdRef.current.position)

      // Make the unicorn face the camera (billboard effect)
      meshRef.current.lookAt(camera.position)

      // Apply the player's Z-axis rotation (for jumping/tilting effect)
      meshRef.current.rotation.z = birdRef.current.rotation.z
    }
  })

  if (!texture) return null

  return (
    <mesh ref={meshRef} scale={[1.3, -1.3, 0.39]}>
      <boxGeometry args={[2, 2, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={1} />
    </mesh>
  )
}
