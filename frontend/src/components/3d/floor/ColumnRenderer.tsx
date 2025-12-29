// ============================================
// 기둥 렌더러
// 좌표계: Three.js Y-up (X=동서, Y=높이, Z=남북)
// 단위: 미터 (실제 크기 100%)
// ============================================

import type { Column } from '../../../types/store'

interface ColumnRendererProps {
  columns: Column[]
  color?: string
  opacity?: number
}

function ColumnMesh({ column, color = '#333333', opacity = 1 }: { column: Column; color?: string; opacity?: number }) {
  const { position, width, depth, height } = column

  return (
    <mesh
      position={[position.x, height / 2, position.z]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color={color}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  )
}

export function ColumnRenderer({ columns, color = '#333333', opacity = 1 }: ColumnRendererProps) {
  return (
    <group>
      {columns.map((column) => (
        <ColumnMesh key={column.id} column={column} color={color} opacity={opacity} />
      ))}
    </group>
  )
}
