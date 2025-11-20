import { BroadcastChannel as BroadcastChannelPolyfill } from "broadcast-channel"
import { nanoid } from "nanoid"
import { type DependencyList, useCallback, useEffect, useRef } from "react"

// Type for message that can be any object
type Message = Record<string, any>

// Type for the message handler callback
type MessageHandler = (message: Message) => void

// No-op function for default callback
const noop: MessageHandler = () => {}

// Safe window access for SSR compatibility
let safeWindow: any = {}
if (typeof window !== "undefined") {
  safeWindow = window
}

// Use native BroadcastChannel if available, otherwise use polyfill
const BroadcastChannel = safeWindow.BroadcastChannel || BroadcastChannelPolyfill

/**
 * Custom hook for cross-tab/window communication
 * Uses BroadcastChannel API (with polyfill fallback) for messaging
 *
 * @param channelName - Name of the broadcast channel
 * @param onMessage - Callback function to handle incoming messages
 * @param deps - Dependencies array for the message handler
 * @returns Tuple of [postMessage function, broadcaster ID]
 */
export default function useBroadcastChannel(
  channelName: string,
  onMessage: MessageHandler = noop,
  deps: DependencyList = [],
) {
  // Unique ID for this broadcaster instance
  const broadcasterId = nanoid()

  // Reference to the BroadcastChannel instance
  const channel = useRef<any>()

  // Initialize the broadcast channel
  useEffect(() => {
    channel.current = new BroadcastChannel(channelName)

    return () => {
      channel.current?.close()
    }
  }, [channelName])

  /**
   * Post a message to the broadcast channel
   * Adds timestamp and broadcasts to parent window
   */
  const postMessage = useCallback((message: Message) => {
    const rawMessage = JSON.stringify({
      ...message,
      __t: Date.now(),
    })
    // channel.current?.postMessage(rawMessage)
    window.parent?.postMessage(rawMessage, "*")
  }, [])

  // Keep reference to the latest message handler
  const userMessageHandlerRef = useRef(onMessage)
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    userMessageHandlerRef.current = onMessage
  }, [...deps, postMessage])

  // Set up message listener on window
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!channel.current) return

    const messageHandler = (event: MessageEvent) => {
      const rawMessage = event.data
      try {
        const message = JSON.parse(rawMessage)
        userMessageHandlerRef.current(message)
      } catch (error) {
        // Silently ignore parse errors
      }
    }

    window.addEventListener("message", messageHandler)
    return () => {
      window.removeEventListener("message", messageHandler)
    }
  }, [postMessage])

  return [postMessage, broadcasterId] as const
}
