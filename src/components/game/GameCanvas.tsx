"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Suspense, useEffect, useRef, useState } from "react"
import { BackSide, TextureLoader } from "three"
import Game from "./Game"

/**
 * Main App component - sets up the Three.js Canvas and renders the game
 */
export default function GameCanvas() {
  function ImageBackground() {
    const { camera } = useThree()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meshRef = useRef<any>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [texture, setTexture] = useState<any>(null)

    useEffect(() => {
      const loader = new TextureLoader()
      loader.load(
        "/img/sky.jpg",
        (loadedTexture) => {
          // Set encoding property to satisfy TypeScript type requirements
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(loadedTexture as any).encoding = 3001 // sRGBEncoding value
          setTexture(loadedTexture)
        },
        undefined,
        (error) => {
          console.error("Error loading sky image:", error)
        },
      )

      return () => {
        if (texture) {
          texture.dispose()
        }
      }
    }, [texture])

    // Position sphere at camera position so it follows the camera
    useFrame(() => {
      if (meshRef.current && camera) {
        meshRef.current.position.copy(camera.position)
      }
    })

    if (!texture) return null

    return (
      <mesh ref={meshRef}>
        <sphereGeometry args={[500, 32, 32]} />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <meshBasicMaterial map={texture as any} side={BackSide} />
      </mesh>
    )
  }

  return (
    <Canvas
      shadows
      dpr={1}
      camera={{
        position: [0, 5, 5],
        fov: 80,
      }}
    >
      <ImageBackground />
      <Game />
    </Canvas>
  )
}

/**
 * Loading component displayed while assets are loading
 */
function Loading() {
  return <div className="grid h-screen place-items-center text-center font-bold text-2xl text-white">Loading...</div>
}
