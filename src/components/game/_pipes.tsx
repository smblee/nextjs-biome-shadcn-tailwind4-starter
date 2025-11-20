import { nanoid } from "nanoid"
import { useRef } from "react"
import type * as THREE from "three"
import { pipePositions } from "../../config/_pipes-def"
import Pipe from "./_pipe"

// Colliders type - maps collider names to mesh objects
type Colliders = Record<string, THREE.Mesh>

// Props interface for Pipes component
interface PipesProps {
  colliders: Colliders
}

/**
 * Pipes component - renders all pipe obstacles in the game
 * Maps over pipePositions array to create individual Pipe components
 */
export default function Pipes({ colliders }: PipesProps) {
  const ref = useRef<THREE.Group>(null)

  return (
    <group ref={ref} name="pipes">
      {pipePositions.map(({ position }, i) => (
        <Pipe key={nanoid()} id={i} position={position} colliders={colliders} />
      ))}
    </group>
  )
}
