import { useGLTF } from "@react-three/drei"
import { useEffect, useRef } from "react"
import type * as THREE from "three"

// Colliders type - maps collider names to mesh objects
type Colliders = Record<string, THREE.Mesh>

// Props interface for Pipe component
interface PipeProps {
  id: number
  position: [number, number, number]
  colliders: Colliders
}

// GLTF model type definition
interface PipeGLTF {
  nodes: {
    [key: string]: THREE.Mesh
  }
  materials: {
    [key: string]: THREE.Material
  }
}

/**
 * Pipe component - renders a pair of pipes (top and bottom) as obstacles
 * Registers collision meshes in the colliders object for hit detection
 */
export default function Pipe({ id, position, colliders }: PipeProps) {
  // References to the two collision meshes (top and bottom)
  const colliderRef = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)]

  // Load pipe model and materials
  const { nodes, materials } = useGLTF("/models/pipe.glb") as unknown as PipeGLTF

  // Register collision meshes in the colliders object
  useEffect(() => {
    if (colliderRef[0].current && colliderRef[1].current) {
      colliders[colliderRef[0].current.name] = colliderRef[0].current
      colliders[colliderRef[1].current.name] = colliderRef[1].current
    }
  }, [colliders, colliderRef[0].current, colliderRef[1].current])

  return (
    <group dispose={null} position={position}>
      {/* Bottom pipe meshes */}
      <mesh
        geometry={nodes.Cube004.geometry}
        material={materials["Material.007"]}
        castShadow
        position={[1.35, -13.13, 0]}
        scale={[0.05, 9, 0.12]}
      />
      <mesh
        geometry={nodes.Cube011.geometry}
        material={materials["Material.009"]}
        castShadow
        position={[-0.55, -13.13, 0]}
        scale={[0.05, 9, 0.12]}
      />
      <mesh
        geometry={nodes.Cube012.geometry}
        material={materials["Material.010"]}
        castShadow
        position={[-1.15, -13.13, 0]}
        scale={[0.05, 9, 0.12]}
      />
      <mesh
        geometry={nodes.Cube026.geometry}
        material={materials["Material.011"]}
        castShadow
        position={[0.75, -13.13, 0]}
        scale={[0.05, 9, 0.12]}
      />
      <mesh
        geometry={nodes.Cube029.geometry}
        material={materials["Material.012"]}
        castShadow
        position={[0.95, -13.13, 0]}
        scale={[0.05, 9, 0.12]}
      />

      {/* Top pipe meshes (rotated 180 degrees) */}
      <mesh
        geometry={nodes.Cube001.geometry}
        material={materials["Material.007"]}
        castShadow
        position={[-1.35, 13.13, 0]}
        rotation={[0, 0, Math.PI]}
        scale={[0.05, 9, 0.12]}
      />
      <mesh
        geometry={nodes.Cube002.geometry}
        material={materials["Material.009"]}
        castShadow
        position={[0.55, 13.13, 0]}
        rotation={[0, 0, Math.PI]}
        scale={[0.05, 9, 0.12]}
      />
      <mesh
        geometry={nodes.Cube003.geometry}
        material={materials["Material.010"]}
        castShadow
        position={[1.15, 13.13, 0]}
        rotation={[0, 0, Math.PI]}
        scale={[0.05, 9, 0.12]}
      />
      <mesh
        geometry={nodes.Cube005.geometry}
        material={materials["Material.011"]}
        castShadow
        position={[-0.75, 13.13, 0]}
        rotation={[0, 0, Math.PI]}
        scale={[0.05, 9, 0.12]}
      />
      <mesh
        geometry={nodes.Cube006.geometry}
        material={materials["Material.012"]}
        castShadow
        position={[-0.95, 13.13, 0]}
        rotation={[0, 0, Math.PI]}
        scale={[0.05, 9, 0.12]}
      />

      {/* Invisible collision meshes for hit detection */}
      <mesh ref={colliderRef[0]} name={"collider0_" + id} position-y={-7.05} visible>
        <planeGeometry args={[3, 9, 2, 5]} />
        <meshNormalMaterial transparent opacity={0} />
      </mesh>
      <mesh ref={colliderRef[1]} name={"collider1_" + id} position-y={7.05} visible>
        <planeGeometry args={[3, 9, 2, 5]} />
        <meshNormalMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

// Preload pipe model for better performance
useGLTF.preload("/models/pipe.glb")
