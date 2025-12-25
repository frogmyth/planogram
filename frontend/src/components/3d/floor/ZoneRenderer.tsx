import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import type { Zone } from '../../../store/useSceneStore'

interface ZoneRendererProps {
  zones: Zone[]
  showLabels?: boolean
  opacity?: number
  selectedZoneId?: string | null
  onZoneClick?: (zoneId: string) => void
  interactive?: boolean
}

interface ZoneMeshProps {
  zone: Zone
  opacity?: number
  showLabel?: boolean
  isSelected?: boolean
  isHovered?: boolean
  onClick?: () => void
  onHover?: (hovered: boolean) => void
  interactive?: boolean
}

function ZoneMesh({
  zone,
  opacity = 0.6,
  showLabel = true,
  isSelected = false,
  isHovered = false,
  onClick,
  onHover,
  interactive = false,
}: ZoneMeshProps) {
  const { bounds, color, name } = zone

  const width = bounds.maxX - bounds.minX
  const depth = bounds.maxZ - bounds.minZ

  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.lineTo(width, 0)
    s.lineTo(width, depth)
    s.lineTo(0, depth)
    s.closePath()
    return s
  }, [width, depth])

  // 선택/호버 상태에 따른 시각 효과
  const effectiveOpacity = isSelected ? 0.8 : isHovered ? 0.7 : opacity
  const borderColor = isSelected ? '#1d4ed8' : isHovered ? '#3b82f6' : '#ffffff'
  const elevation = isSelected ? 0.05 : isHovered ? 0.03 : 0.01

  return (
    <group position={[bounds.minX, elevation, bounds.minZ]}>
      {/* 구역 바닥 - 클릭 가능 영역 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          if (interactive && onClick) {
            e.stopPropagation()
            onClick()
          }
        }}
        onPointerOver={(e) => {
          if (interactive && onHover) {
            e.stopPropagation()
            onHover(true)
            document.body.style.cursor = 'pointer'
          }
        }}
        onPointerOut={(e) => {
          if (interactive && onHover) {
            e.stopPropagation()
            onHover(false)
            document.body.style.cursor = 'auto'
          }
        }}
      >
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={effectiveOpacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 구역 테두리 */}
      <lineSegments rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.ShapeGeometry(shape)]} />
        <lineBasicMaterial color={borderColor} linewidth={isSelected ? 3 : 2} />
      </lineSegments>

      {/* 선택 표시 - 두꺼운 테두리 */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <shapeGeometry args={[shape]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

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
          <div
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg transition-all ${
              isSelected
                ? 'bg-blue-600 text-white scale-110'
                : isHovered
                ? 'bg-white text-gray-900 scale-105'
                : 'bg-white/80 text-gray-800'
            }`}
          >
            {name}
            {interactive && !isSelected && (
              <span className="ml-1 text-xs opacity-60">클릭</span>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}

export function ZoneRenderer({
  zones,
  showLabels = true,
  opacity = 0.6,
  selectedZoneId = null,
  onZoneClick,
  interactive = false,
}: ZoneRendererProps) {
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null)

  return (
    <group>
      {zones.map((zone) => (
        <ZoneMesh
          key={zone.id}
          zone={zone}
          opacity={opacity}
          showLabel={showLabels}
          isSelected={selectedZoneId === zone.id}
          isHovered={hoveredZoneId === zone.id}
          onClick={() => onZoneClick?.(zone.id)}
          onHover={(hovered) => setHoveredZoneId(hovered ? zone.id : null)}
          interactive={interactive}
        />
      ))}
    </group>
  )
}
