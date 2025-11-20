import { type MutableRefObject, useEffect } from "react"
import type * as THREE from "three"

/**
 * Custom hook for multiplayer functionality using Socket.IO
 *
 * NOTE: This hook is currently disabled as socket.io-client is not installed.
 * To enable multiplayer functionality:
 * 1. Install socket.io-client: pnpm install socket.io-client
 * 2. Uncomment the implementation code below
 * 3. Set up a Socket.IO server backend
 *
 * @param _model - Reference to the local player's model (unused in placeholder)
 * @param _otherBirds - Array of references to other bird models (unused in placeholder)
 */
export default function useSocketIO(
  _model: MutableRefObject<THREE.Group | null>,
  _otherBirds: MutableRefObject<THREE.Object3D | null>[],
) {
  // Placeholder implementation - Socket.IO not installed

  useEffect(() => {
    // Placeholder - Socket.IO multiplayer is not currently enabled
    console.log("Socket.IO multiplayer not initialized - install socket.io-client to enable")

    /* 
    MULTIPLAYER IMPLEMENTATION (requires socket.io-client):
    
    import { io } from 'socket.io-client'
    
    const socket = io()
    const myId = useRef<string>()
    const otherPlayers = useRef<Record<string, THREE.Object3D>>({})
    
    const intervalId = setInterval(() => {
      if (model.current) {
        socket.emit('update', {
          t: Date.now(),
          p: model.current.position
        })
      }
    }, 100)

    socket.on('id', (id: string) => {
      myId.current = id
    })

    socket.on('clients', (clients: any) => {
      // Handle client position updates
    })

    socket.on('removeClient', (id: string) => {
      // Handle client disconnection
    })

    return () => {
      clearInterval(intervalId)
      socket.off('id')
      socket.off('clients')
      socket.off('removeClient')
    }
    */
  }, [])
}
