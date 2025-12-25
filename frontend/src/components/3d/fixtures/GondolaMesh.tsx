import { useRef } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

interface GondolaMeshProps {
  id: string
  name: string
  position: [number, number, number]
  rotation?: number
  width: number
  height: number
  depth: number
  shelfCount: number
  isSelected?: boolean
  isGhosted?: boolean
  onClick?: () => void
}

export function GondolaMesh({
  id,
  name,
  position,
  rotation = 0,
  width,
  height,
  depth,
  shelfCount,
  isSelected = false,
  isGhosted = false,
  onClick,
}: GondolaMeshProps) {
  const groupRef = useRef<THREE.Group>(null)

  const shelfHeight = 0.02
  const shelfSpacing = (height - 0.2) / (shelfCount + 1)
  const postWidth = 0.03
  const baseHeight = 0.15

  // 색상 설정
  const frameColor = isSelected ? '#1d4ed8' : '#d1d5db'
  const shelfColor = '#f5f5f5'
  const opacity = isGhosted ? 0.3 : 1

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, (rotation * Math.PI) / 180, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      {/* 베이스 */}
      <mesh position={[0, baseHeight / 2, 0]}>
        <boxGeometry args={[width, baseHeight, depth]} />
        <meshStandardMaterial
          color={frameColor}
          transparent={isGhosted}
          opacity={opacity}
        />
      </mesh>

      {/* 좌측 포스트 */}
      <mesh position={[-width / 2 + postWidth / 2, height / 2, 0]}>
        <boxGeometry args={[postWidth, height, depth]} />
        <meshStandardMaterial
          color={frameColor}
          transparent={isGhosted}
          opacity={opacity}
        />
      </mesh>

      {/* 우측 포스트 */}
      <mesh position={[width / 2 - postWidth / 2, height / 2, 0]}>
        <boxGeometry args={[postWidth, height, depth]} />
        <meshStandardMaterial
          color={frameColor}
          transparent={isGhosted}
          opacity={opacity}
        />
      </mesh>

      {/* 선반들 */}
      {Array.from({ length: shelfCount }).map((_, i) => (
        <mesh
          key={i}
          position={[0, baseHeight + shelfSpacing * (i + 1), 0]}
        >
          <boxGeometry args={[width - postWidth * 2, shelfHeight, depth]} />
          <meshStandardMaterial
            color={shelfColor}
            transparent={isGhosted}
            opacity={opacity}
          />
        </mesh>
      ))}

      {/* 뒷판 */}
      <mesh position={[0, height / 2, -depth / 2 + 0.01]}>
        <boxGeometry args={[width, height, 0.02]} />
        <meshStandardMaterial
          color="#e5e7eb"
          transparent={isGhosted}
          opacity={opacity}
        />
      </mesh>

      {/* 매대 라벨 (탑뷰에서 표시) */}
      {!isGhosted && (
        <Html
          position={[0, height + 0.3, 0]}
          center
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap shadow-sm ${
            isSelected
              ? 'bg-blue-600 text-white'
              : 'bg-white/90 text-gray-700 border border-gray-200'
          }`}>
            {name}
          </div>
        </Html>
      )}

      {/* 선택 표시 (하이라이트 아웃라인) */}
      {isSelected && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width + 0.1, height + 0.1, depth + 0.1]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  )
}
