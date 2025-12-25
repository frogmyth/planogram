import * as THREE from 'three'
import { useMemo } from 'react'

interface Wall {
  id: string
  start: { x: number; z: number }
  end: { x: number; z: number }
  height: number
  thickness: number
}

interface WallRendererProps {
  walls: Wall[]
  color?: string
}

function WallMesh({ wall, color = '#ffffff' }: { wall: Wall; color?: string }) {
  const { start, end, height, thickness } = wall

  const length = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.z - start.z, 2)
  )
  const angle = Math.atan2(end.z - start.z, end.x - start.x)
  const centerX = (start.x + end.x) / 2
  const centerZ = (start.z + end.z) / 2

  return (
    <mesh
      position={[centerX, height / 2, centerZ]}
      rotation={[0, -angle, 0]}
    >
      <boxGeometry args={[length, height, thickness]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export function WallRenderer({ walls, color = '#ffffff' }: WallRendererProps) {
  return (
    <group>
      {walls.map((wall) => (
        <WallMesh key={wall.id} wall={wall} color={color} />
      ))}
    </group>
  )
}
