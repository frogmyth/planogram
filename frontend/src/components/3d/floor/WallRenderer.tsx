// ============================================
// 벽 렌더러
// 좌표계: Three.js Y-up (X=동서, Y=높이, Z=남북)
// 단위: 미터 (실제 크기 100%)
// ============================================

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
  opacity?: number
}

function WallMesh({ wall, color = '#ffffff', opacity = 1 }: { wall: Wall; color?: string; opacity?: number }) {
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
      castShadow
      receiveShadow
    >
      <boxGeometry args={[length, height, thickness]} />
      <meshStandardMaterial
        color={color}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  )
}

export function WallRenderer({ walls, color = '#ffffff', opacity = 1 }: WallRendererProps) {
  return (
    <group>
      {walls.map((wall) => (
        <WallMesh key={wall.id} wall={wall} color={color} opacity={opacity} />
      ))}
    </group>
  )
}
