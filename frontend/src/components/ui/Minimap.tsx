// ============================================
// 미니맵 컴포넌트
// 선택된 매대를 중심으로 매장 전체를 표시
// ============================================

import { useMemo } from 'react'
import { useSceneStore } from '../../store/useSceneStore'

interface MinimapProps {
  size?: number
}

export function Minimap({ size = 200 }: MinimapProps) {
  const {
    fixtures,
    currentStore,
    selectedFixtureId,
    navigationLevel,
    getStoreDimensions,
  } = useSceneStore()

  const storeDimensions = getStoreDimensions()
  const selectedFixture = fixtures.find((f) => f.id === selectedFixtureId)

  // 매장 비율에 맞춰 미니맵 크기 계산 (Hooks는 조건문 전에 호출)
  const mapDimensions = useMemo(() => {
    const ratio = storeDimensions.width / storeDimensions.depth
    if (ratio > 1) {
      return { width: size, height: size / ratio }
    } else {
      return { width: size * ratio, height: size }
    }
  }, [storeDimensions.width, storeDimensions.depth, size])

  // VMD 모드(매대 선택)가 아니면 표시하지 않음
  if (navigationLevel !== 'fixture') return null

  // 매장 좌표를 미니맵 좌표로 변환
  const toMapCoord = (x: number, z: number) => ({
    x: (x / storeDimensions.width) * mapDimensions.width,
    y: (z / storeDimensions.depth) * mapDimensions.height,
  })

  return (
    <div
      className="absolute left-4 bottom-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden"
      style={{ width: mapDimensions.width + 16, height: mapDimensions.height + 40 }}
    >
      {/* 헤더 */}
      <div className="px-2 py-1 bg-gray-100 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-600">미니맵</span>
      </div>

      {/* 맵 영역 */}
      <div className="p-2">
        <svg
          width={mapDimensions.width}
          height={mapDimensions.height}
          className="bg-gray-50 rounded"
        >
          {/* 바닥면 */}
          <rect
            x={0}
            y={0}
            width={mapDimensions.width}
            height={mapDimensions.height}
            fill="#f3f4f6"
            stroke="#d1d5db"
            strokeWidth={1}
          />

          {/* 벽 */}
          {currentStore?.walls?.map((wall) => {
            const start = toMapCoord(wall.start.x, wall.start.z)
            const end = toMapCoord(wall.end.x, wall.end.z)
            return (
              <line
                key={wall.id}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#6b7280"
                strokeWidth={2}
              />
            )
          })}

          {/* 기둥 */}
          {currentStore?.columns?.map((column) => {
            const pos = toMapCoord(column.position.x, column.position.z)
            const w = (column.width / storeDimensions.width) * mapDimensions.width
            const h = (column.depth / storeDimensions.depth) * mapDimensions.height
            return (
              <rect
                key={column.id}
                x={pos.x - w / 2}
                y={pos.y - h / 2}
                width={w}
                height={h}
                fill="#374151"
              />
            )
          })}

          {/* 모든 매대 */}
          {fixtures.map((fixture) => {
            const pos = toMapCoord(fixture.position.x, fixture.position.z)
            const isSelected = fixture.id === selectedFixtureId

            // 회전 적용된 크기 계산
            const rotated = fixture.rotation === 90 || fixture.rotation === 270
            const w = ((rotated ? fixture.dimensions.depth : fixture.dimensions.width) / storeDimensions.width) * mapDimensions.width
            const h = ((rotated ? fixture.dimensions.width : fixture.dimensions.depth) / storeDimensions.depth) * mapDimensions.height

            return (
              <g key={fixture.id}>
                <rect
                  x={pos.x - w / 2}
                  y={pos.y - h / 2}
                  width={Math.max(w, 2)}
                  height={Math.max(h, 2)}
                  fill={isSelected ? '#3b82f6' : '#9ca3af'}
                  stroke={isSelected ? '#1d4ed8' : 'transparent'}
                  strokeWidth={isSelected ? 2 : 0}
                  rx={1}
                />
                {/* 선택된 매대 주변 원형 표시 */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={Math.max(w, h) + 4}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth={1}
                    strokeDasharray="3,2"
                    opacity={0.5}
                  />
                )}
              </g>
            )
          })}

          {/* 선택된 매대 방향 표시 (화살표) */}
          {selectedFixture && (() => {
            const pos = toMapCoord(selectedFixture.position.x, selectedFixture.position.z)
            const rotationRad = (selectedFixture.rotation * Math.PI) / 180
            const arrowLength = 8
            const endX = pos.x + Math.sin(rotationRad) * arrowLength
            const endY = pos.y + Math.cos(rotationRad) * arrowLength

            return (
              <g>
                <line
                  x1={pos.x}
                  y1={pos.y}
                  x2={endX}
                  y2={endY}
                  stroke="#22c55e"
                  strokeWidth={2}
                />
                <circle
                  cx={endX}
                  cy={endY}
                  r={3}
                  fill="#22c55e"
                />
              </g>
            )
          })()}
        </svg>
      </div>
    </div>
  )
}
