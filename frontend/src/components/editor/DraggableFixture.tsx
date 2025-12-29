// ============================================
// 드래그 가능한 매대 컴포넌트
// 편집 모드에서 매대를 드래그하여 이동할 수 있음
// ============================================

import { useRef, useState, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { Fixture, Point3D } from '../../types/store'
import { useSceneStore } from '../../store/useSceneStore'
import { FixtureRenderer } from '../3d/fixtures/FixtureRenderer'
import { snapToFixturesAndWalls, checkCollision, checkWallCollision } from './snapUtils'

interface DraggableFixtureProps {
  fixture: Fixture
  isSelected: boolean
  isGhosted?: boolean
  onSelect: () => void
}

export function DraggableFixture({
  fixture,
  isSelected,
  isGhosted = false,
  onSelect,
}: DraggableFixtureProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera, raycaster, gl } = useThree()

  const {
    editMode,
    transformMode,
    fixtures,
    currentStore,
    isDragging,
    draggedFixtureId,
    startDragging,
    stopDragging,
    moveFixture,
  } = useSceneStore()

  const walls = currentStore?.walls || []

  const [dragOffset, setDragOffset] = useState<{ x: number; z: number } | null>(null)
  const floorPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))

  const isEditMode = editMode === 'edit'
  const isMoveMode = transformMode === 'move'
  const isThisFixtureDragging = isDragging && draggedFixtureId === fixture.id

  // 바닥 평면과의 교차점 계산
  const getFloorIntersection = useCallback((clientX: number, clientY: number): THREE.Vector3 | null => {
    const rect = gl.domElement.getBoundingClientRect()
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    )

    raycaster.setFromCamera(mouse, camera)
    const intersection = new THREE.Vector3()
    const hit = raycaster.ray.intersectPlane(floorPlane.current, intersection)

    return hit ? intersection : null
  }, [camera, raycaster, gl])

  // 드래그 시작 (이동 모드에서만 작동)
  const handlePointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (!isEditMode || !isMoveMode || isGhosted) return

    event.stopPropagation()
    onSelect()

    // 편집 모드에서만 드래그 시작
    const intersection = getFloorIntersection(event.clientX, event.clientY)
    if (intersection) {
      setDragOffset({
        x: fixture.position.x - intersection.x,
        z: fixture.position.z - intersection.z,
      })
      startDragging(fixture.id)

      // 포인터 캡처
      gl.domElement.setPointerCapture(event.pointerId)
    }
  }, [isEditMode, isMoveMode, isGhosted, fixture.id, fixture.position, getFloorIntersection, startDragging, onSelect, gl])

  // 드래그 중
  const handlePointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (!isThisFixtureDragging || !dragOffset) return

    event.stopPropagation()

    const intersection = getFloorIntersection(event.clientX, event.clientY)
    if (intersection) {
      // 새 위치 계산 (드래그 오프셋 적용)
      const rawPosition: Point3D = {
        x: intersection.x + dragOffset.x,
        y: fixture.position.y,
        z: intersection.z + dragOffset.z,
      }

      // 다른 매대 및 벽에 스냅
      const otherFixtures = fixtures.filter((f) => f.id !== fixture.id)
      const snapResult = snapToFixturesAndWalls(rawPosition, fixture, otherFixtures, walls)

      // 충돌 체크 (매대 + 벽)
      const hasFixtureCollision = checkCollision(fixture, snapResult.position, otherFixtures)
      const hasWallCollision = checkWallCollision(fixture, snapResult.position, walls)

      // 충돌이 없으면 이동
      if (!hasFixtureCollision && !hasWallCollision) {
        moveFixture(fixture.id, snapResult.position)
      }
    }
  }, [isThisFixtureDragging, dragOffset, fixture, fixtures, walls, getFloorIntersection, moveFixture])

  // 드래그 종료
  const handlePointerUp = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (!isThisFixtureDragging) return

    event.stopPropagation()
    setDragOffset(null)
    stopDragging()

    // 포인터 캡처 해제
    gl.domElement.releasePointerCapture(event.pointerId)
  }, [isThisFixtureDragging, stopDragging, gl])

  // 클릭 (드래그 없이 클릭만 한 경우)
  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    if (!isDragging) {
      event.stopPropagation()
      onSelect()
    }
  }, [isDragging, onSelect])

  return (
    <group
      ref={groupRef}
      onPointerDown={isEditMode && isMoveMode ? handlePointerDown : undefined}
      onPointerMove={isThisFixtureDragging ? handlePointerMove : undefined}
      onPointerUp={isThisFixtureDragging ? handlePointerUp : undefined}
      onClick={handleClick}
    >
      <FixtureRenderer
        fixture={fixture}
        isSelected={isSelected}
        isGhosted={isGhosted}
      />

      {/* 드래그 중일 때 하이라이트 */}
      {isThisFixtureDragging && (
        <mesh
          position={[fixture.position.x, 0.02, fixture.position.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry
            args={[
              fixture.dimensions.width + 0.2,
              fixture.dimensions.depth + 0.2,
            ]}
          />
          <meshBasicMaterial
            color="#22c55e"
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* 편집 모드에서 선택된 매대 표시 */}
      {isEditMode && isSelected && !isThisFixtureDragging && (
        <mesh
          position={[fixture.position.x, 0.02, fixture.position.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry
            args={[
              fixture.dimensions.width + 0.1,
              fixture.dimensions.depth + 0.1,
            ]}
          />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
    </group>
  )
}
