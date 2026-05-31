import { useEffect } from 'react'
import { useSceneStore, type Scene } from '../store/scene'

/** Sets the active Swarm scene while this page is mounted. */
export default function SceneMarker({ scene }: { scene: Scene }) {
  const setScene = useSceneStore((s) => s.setScene)
  useEffect(() => {
    setScene(scene)
  }, [scene, setScene])
  return null
}
