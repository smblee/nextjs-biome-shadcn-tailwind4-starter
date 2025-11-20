import { useFrame } from "@react-three/fiber"
import { nanoid } from "nanoid"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type * as THREE from "three"
import { MathUtils, Vector3 } from "three"
import { pipePositions } from "../../config/_pipes-def"
import useBroadcastChannel from "../../hooks/_use-broadcast-channel"
import Overlay from "./_overlay"
import Unicorn from "./_unicorn"

// Constants for game physics
const GRAVITY = 50
const frameRate = 60
const gameStepSizeMs = 1000 / frameRate
const maxFrameTime = gameStepSizeMs * 4

// Game state tracking variables
let previousFrameTime = 0
let frame = 0

// Debug and replay flags
const REPLAY = false
const DEBUG = false
const LOG = DEBUG ? console.log : () => {}

// Colliders type
type Colliders = Record<string, THREE.Mesh>

// Game state type
type GameState = "not-started" | "started" | "crashed" | "win"

// Props interface for Player component
interface PlayerProps {
  colliders: Colliders
}

/**
 * Player component - handles all game logic, physics, and player control
 * Manages game state, collision detection, scoring, and rendering
 */
export default function Player({ colliders }: PlayerProps) {
  // Reference to the bird model's group
  const model = useRef<THREE.Group>(null)

  // Physics vectors
  const velocity = useMemo(() => new Vector3(), [])
  const lookAt = useMemo(() => new Vector3(), [])
  const startPosition = useMemo(() => new Vector3(-260, 7, 0), [])

  // Game state management
  const [gameState, setGameState] = useState<GameState>("not-started")
  const [startFrame, setStartFrame] = useState(0)
  const jumpQueue = useRef<string[]>([])
  const history = useRef<number[]>([])
  const [prevSession, setPrevSession] = useState<number[]>([])
  const scoreProof = useRef<[number, number][]>([])
  const gameId = useRef<string>()
  const [score, setScore] = useState(0)
  const [postMessage] = useBroadcastChannel("flappy")

  // Lock state to prevent rapid restart
  const [lock, setLock] = useState(false)

  /**
   * Handle flap/jump input
   * Enqueues a jump to be processed in the next game tick
   */
  const onFlap = useCallback(() => {
    if (lock) return
    // Enqueue the flap
    jumpQueue.current.push("flap")
  }, [lock])

  // Lock controls for 2 seconds after crash/win
  useEffect(() => {
    if (gameState === "crashed" || gameState === "win") {
      setLock(true)
      setTimeout(() => {
        setLock(false)
      }, 1000)
    }
  }, [gameState])

  // Register mouse click listener for flap control
  useEffect(() => {
    document.addEventListener("mousedown", onFlap)
    return () => {
      document.removeEventListener("mousedown", onFlap)
    }
  }, [onFlap])

  // Register keyboard listener for flap control
  // Supports Space, Arrow Up, and W key
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if pressed key is Space, ArrowUp, or 'w'
      if (event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW") {
        onFlap()
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [onFlap])

  // Broadcast game results when crashed or won
  useEffect(() => {
    if (gameState === "crashed" || gameState === "win") {
      velocity.x = 0
      velocity.y = 0
      LOG("crashed or won. last session: ", history.current)
      setPrevSession([...history.current])
      postMessage({
        t: "c", // crashed
        id: gameId.current,
        fs: score,
        jh: history.current,
      })
      history.current = []
    }
  }, [gameState, velocity, score, postMessage])

  /**
   * Main game loop - runs at fixed frame rate
   * Handles physics, collision detection, scoring, and camera movement
   */
  useFrame((state) => {
    if (!model.current) return

    const now = performance.now()
    const delta = 1 / frameRate

    // Prevent spiral of death (large time gaps)
    if (now - previousFrameTime > maxFrameTime) {
      previousFrameTime = now - maxFrameTime
    }

    // Camera positioning when game is not active
    if (gameState !== "started") {
      lookAt.lerp(model.current.position, 0.5)
    }
    if (gameState === "crashed") {
      lookAt.lerp(model.current.position, 0.5)
    }

    // Fixed timestep game loop
    while (previousFrameTime <= now - gameStepSizeMs) {
      // Start game on first jump
      if (gameState !== "started") {
        state.camera.position.x = model.current.position.x
        state.camera.position.y = model.current.position.y
        state.camera.lookAt(model.current.position)

        if (!jumpQueue.current.length) return

        // Initialize new game
        gameId.current = nanoid(8)
        postMessage({
          t: "s", // started
          id: gameId.current,
          fc: 0, // frame count
        })
        scoreProof.current = []
        setScore(0)

        // Start the game with initial jump
        jumpQueue.current.shift()
        LOG("starting at frame", frame)
        setStartFrame(frame)
        model.current.position.copy(startPosition)
        velocity.y = 10
        setGameState("started")
      }

      // Replay mode (for debugging)
      if (REPLAY && prevSession.length && prevSession[0] === frame - startFrame) {
        velocity.y = 10
        prevSession.shift()
      }

      // Score calculation based on position
      let s = Math.floor((model.current.position.x - 2) / 10) + 26
      if (s < 0) {
        s = 0
      }

      // Update score when passing a pipe
      if (s > scoreProof.current.length) {
        LOG("Score increased at", [model.current.position.x, model.current.position.y], "For pipe at", [
          pipePositions[s - 1].position[0],
          pipePositions[s - 1].position[1],
        ])
        scoreProof.current.push([model.current.position.x, model.current.position.y])
        setScore((prev) => {
          if (prev === pipePositions.length - 1) {
            setGameState("win")
            return prev
          }
          return prev + 1
        })
        postMessage({
          t: "pg", // point gained
          id: gameId.current,
          fc: frame - startFrame,
          s: s, // score
          sp: [model.current.position.x, model.current.position.y],
        })
      }

      // Process jump queue
      while (jumpQueue.current.shift()) {
        history.current.push(frame - startFrame)
        LOG("jumped at frame: ", previousFrameTime)
        velocity.y = 10
      }

      // Player movement physics
      let damping = Math.exp(-4 * delta) - 1
      if (model.current.position.y > 0.65) {
        // In air - apply gravity and acceleration
        velocity.x += delta * 2
        velocity.y -= GRAVITY * delta
        damping *= 0.066 // affects speed up
      } else {
        // Hit the ground - game over
        model.current.position.y = 0.65
        lookAt.lerp(model.current.position, 0.1)
        setGameState("crashed")
        return
      }

      // Apply damping and update position
      velocity.addScaledVector(velocity, damping)
      const deltaPosition = velocity.clone().multiplyScalar(delta)
      model.current.position.add(deltaPosition)

      // Rotate player based on vertical velocity
      model.current.rotation.z = (velocity.y / 180) * Math.PI * 2

      // Camera movement during gameplay
      if (gameState === "started") {
        state.camera.position.y = MathUtils.lerp(state.camera.position.y, model.current.position.y, 0.1)
        if (state.camera.position.y < 1) {
          state.camera.position.y = 1
        }
        state.camera.position.x = MathUtils.lerp(state.camera.position.x, model.current.position.x, 0.1)
      }

      // Update camera look-at target
      lookAt.lerp(model.current.position, 0.1)
      lookAt.x += 0.1
      state.camera.lookAt(lookAt)

      // Collision detection with pipes
      const nextPipeID = Math.floor((model.current.position.x - 5) / 10 + 26)
      for (let i = 0; i < 2; i++) {
        if (gameState === "started" && nextPipeID > -1) {
          const pipeCollider = colliders["collider" + i + "_" + nextPipeID]
          if (pipeCollider) {
            const positions = pipeCollider.geometry.attributes.position.array
            for (let j = 0; j < positions.length; j += 3) {
              const v = new Vector3(positions[j], positions[j + 1], positions[j + 2])
              const globalVertex = v.applyMatrix4(pipeCollider.matrixWorld)
              if (globalVertex.distanceTo(model.current.position) < 0.75) {
                setGameState("crashed")
              }
            }
          }
        }
      }

      // Height check - flying too high is game over
      model.current.position.y > 20 && setGameState("crashed")

      // Increment frame counter
      previousFrameTime += gameStepSizeMs
      frame += 1
    }
  }, 1)

  return (
    <>
      {/* Player model group */}
      <group ref={model} dispose={null} position={startPosition} />

      {/* Unicorn player character */}
      <Unicorn birdRef={model} />

      {/* UI Overlay */}
      <Overlay
        model={model}
        locked={lock}
        crashed={gameState === "crashed"}
        started={gameState === "started"}
        win={gameState === "win"}
        onFlapOrRestart={onFlap}
        score={score}
      />
    </>
  )
}
