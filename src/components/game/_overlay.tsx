import { Html, Hud, OrthographicCamera } from "@react-three/drei"
import type * as THREE from "three"

// Props interface for Overlay component
interface OverlayProps {
  model: React.RefObject<THREE.Group>
  score: number
  locked: boolean
  crashed: boolean
  win: boolean
  started: boolean
  onFlapOrRestart: () => void
}

/**
 * Overlay component - renders the UI overlay on top of the 3D game
 * Shows score, game state messages, and controls
 */
export default function Overlay({ score, locked, crashed, win }: OverlayProps) {
  // Detect if user is on mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  return (
    <Hud>
      <OrthographicCamera makeDefault position={[0, 0, 0]} />

      {/* Score display */}
      <Html>
        <div
          id="score"
          className="prompt"
          style={{
            userSelect: "none",
          }}
        >
          {score}
        </div>
      </Html>

      {/* Crashed message */}
      {crashed &&
        (isMobile ? (
          <Html center>
            <div className="prompt float">
              You crashed.
              <br />
              {!locked && (
                <>
                  <kbd>Tap</kbd> to restart
                </>
              )}
            </div>
          </Html>
        ) : (
          <Html center>
            <div className="prompt float">
              You crashed.
              <br />
              {!locked && (
                <>
                  <kbd>Click</kbd> to restart
                </>
              )}
            </div>
          </Html>
        ))}

      {/* Win message */}
      {win &&
        (isMobile ? (
          <Html center>
            <div className="prompt float">
              You got the highest score!
              <br />
              {!locked && (
                <>
                  <kbd>Tap</kbd> to restart
                </>
              )}
            </div>
          </Html>
        ) : (
          <Html center>
            <div className="prompt float">
              You got the highest score!
              <br />
              {!locked && (
                <>
                  <kbd>Click</kbd> to restart
                </>
              )}
            </div>
          </Html>
        ))}
    </Hud>
  )
}
