import { useThree } from "@react-three/fiber"
import { useLayoutEffect } from "react"

// Props interface for FrameLimiter component
interface FrameLimiterProps {
  fps?: number
}

/**
 * FrameLimiter component limits the frame rate of the Three.js scene
 * This helps with performance and battery life on mobile devices
 */
export function FrameLimiter({ fps = 60 }: FrameLimiterProps) {
  const { advance, set, frameloop: initFrameloop } = useThree()

  useLayoutEffect(() => {
    let elapsed = 0
    let then = 0
    let raf: number | null = null
    const interval = 1000 / fps

    function tick(t: number) {
      raf = requestAnimationFrame(tick)
      elapsed = t - then
      if (elapsed > interval) {
        advance(performance.now())
        then = t - (elapsed % interval)
      }
    }

    // Set frameloop to never, it will shut down the default render loop
    set({ frameloop: "never" })

    // Kick off custom render loop
    raf = requestAnimationFrame(tick)

    // Restore initial setting on cleanup
    return () => {
      if (raf !== null) {
        cancelAnimationFrame(raf)
      }
      set({ frameloop: initFrameloop })
    }
  }, [fps, advance, set, initFrameloop])

  return null
}
