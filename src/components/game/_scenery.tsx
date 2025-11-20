import { useLoader } from "@react-three/fiber"
import { RepeatWrapping, SRGBColorSpace, TextureLoader } from "three"
import { memeConfigs } from "../../config/_meme-config"
import MemeLayer from "./_meme-layer"

/**
 * Scenery component - renders parallax background layers
 * Includes ground, forest, city, hills textures, and custom meme layer
 * All textures use repeat wrapping for seamless tiling
 */
export default function Scenery() {
  // Load and configure forest texture
  const forest = useLoader(TextureLoader, "/img/forest.png")
  forest.wrapS = RepeatWrapping
  forest.repeat.set(10, 1)
  forest.colorSpace = SRGBColorSpace

  // Load and configure city texture
  const city = useLoader(TextureLoader, "/img/city.png")
  city.wrapS = RepeatWrapping
  city.repeat.set(10, 1)
  city.colorSpace = SRGBColorSpace

  // Load and configure hills texture
  const hills = useLoader(TextureLoader, "/img/hills.png")
  hills.wrapS = RepeatWrapping
  hills.repeat.set(8, 1)
  hills.colorSpace = SRGBColorSpace

  return (
    <>
      {/* Ground plane */}
      {/* <mesh position={[0, -8, 0]} receiveShadow>
        <boxGeometry args={[600, 16, 10]} />
        <meshStandardMaterial color={"#B237B2"} />
      </mesh> */}

      {/* Forest layer (closest) */}
      {/* <mesh position={[0, 1.5, -5]} receiveShadow>
        <planeGeometry args={[600, 4]} />
        <meshStandardMaterial map={forest} transparent />
      </mesh> */}

      {/* City layer (middle) */}
      {/* <mesh position={[0, 2.5, -7.5]} receiveShadow>
        <planeGeometry args={[600, 12]} />
        <meshStandardMaterial map={city} transparent />
      </mesh> */}

      {/* Hills layer (farthest) */}
      {/* <mesh position={[0, 3, -10]} receiveShadow>
        <planeGeometry args={[600, 16]} />
        <meshStandardMaterial map={hills} transparent />
      </mesh> */}

      {/* Meme layer - custom positioned meme images */}
      {/* Edit config/_meme-config.ts to customize meme images and their positions */}
      <MemeLayer memes={memeConfigs} />
    </>
  )
}
