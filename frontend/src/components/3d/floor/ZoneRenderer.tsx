import { useMemo } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

interface Zone {
  id: string
  name: string
  color: string
  bounds: {
    minX: number
    minZ: number
    maxX: number
    maxZ: number
  }
}

interface ZoneRendererProps {
  zones: Zone[]
  showLabels?: boolean
  opacity?: number
}

function ZoneMesh({ zone, opacity = 0.6, showLabel = true }: { zone: Zone; opacity?: number; showLabel?: boolean }) {
  const { bounds, color, name } = zone

  const width = bounds.maxX - bounds.minX
  const depth = bounds.maxZ - bounds.minZ
  const centerX = bounds.minX + width / 2
  const centerZ = bounds.minZ + depth / 2

  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.lineTo(width, 0)
    s.lineTo(width, depth)
    s.lineTo(0, depth)
    s.closePath()
    return s
  }, [width, depth])

  return (
    <group position={[bounds.minX, 0.01, bounds.minZ]}>
      {/* 구역 바닥 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 구역 테두리 */}
      <lineSegments rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.ShapeGeometry(shape)]} />
        <lineBasicMaterial color="#ffffff" linewidth={2} />
      </lineSegments>

      {/* 구역 라벨 */}
      {showLabel && (
        <Html
          position={[width / 2, 0.5, depth / 2]}
          center
          distanceFactor={15}
          style={{
            pointerEvents: 'none',
          }}
        >
          <div className="px-2 py-1 bg-white/80 rounded text-sm font-medium text-gray-800 whitespace-nowrap shadow">
            {name}
          </div>
        </Html>
      )}
    </group>
  )
}

export function ZoneRenderer({ zones, showLabels = true, opacity = 0.6 }: ZoneRendererProps) {
  return (
    <group>
      {zones.map((zone) => (
        <ZoneMesh
          key={zone.id}
          zone={zone}
          opacity={opacity}
          showLabel={showLabels}
        />
      ))}
    </group>
  )
}
