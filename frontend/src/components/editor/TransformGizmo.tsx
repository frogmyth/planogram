// ============================================
// 변환 기즈모 컴포넌트 (3ds Max 스타일)
// W = 이동 모드 (X, Z 축 화살표)
// E = 회전 모드 (Y축 원형 기즈모)
// ============================================

import { useRef, useState, useCallback, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { Fixture, Point3D } from '../../types/store'
import { useSceneStore } from '../../store/useSceneStore'
import { snapToWalls, checkWallCollision, checkCollision } from './snapUtils'

interface TransformGizmoProps {
  fixture: Fixture
}

// 화살표 머리 생성 함수
function ArrowHead({ color, rotation, size = 1 }: { color: string; rotation: [number, number, number]; size?: number }) {
  return (
    <mesh rotation={rotation}>
      <coneGeometry args={[0.12 * size, 0.3 * size, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

// 이동 기즈모 (로컬 좌표계 - 매대 앞방향 기준)
function MoveGizmo({ fixture, onDrag }: { fixture: Fixture; onDrag: (axis: 'x' | 'z', delta: number) => void }) {
  const { camera, raycaster, gl } = useThree()
  const [dragging, setDragging] = useState<'x' | 'z' | null>(null)
  const [hovered, setHovered] = useState<'x' | 'z' | null>(null)
  const dragStart = useRef<THREE.Vector3 | null>(null)
  const floorPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))

  const arrowLength = 1.2
  const arrowThickness = 0.05
  const pivotY = 0.1

  // 매대 회전각 (라디안)
  const rotationRad = (fixture.rotation * Math.PI) / 180

  const getIntersection = useCallback((clientX: number, clientY: number): THREE.Vector3 | null => {
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

  // window 레벨 이벤트 핸들러 (드래그 중 마우스가 객체를 벗어나도 동작)
  useEffect(() => {
    if (!dragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStart.current) return

      const current = getIntersection(e.clientX, e.clientY)
      if (current) {
        // 월드 좌표계에서의 델타
        const worldDeltaX = current.x - dragStart.current.x
        const worldDeltaZ = current.z - dragStart.current.z

        // 로컬 좌표계로 변환 (매대 회전의 역변환 적용)
        const cosR = Math.cos(-rotationRad)
        const sinR = Math.sin(-rotationRad)
        const localDeltaX = worldDeltaX * cosR - worldDeltaZ * sinR
        const localDeltaZ = worldDeltaX * sinR + worldDeltaZ * cosR

        // 선택된 축의 로컬 델타를 월드 델타로 다시 변환
        if (dragging === 'x') {
          // 로컬 X축 (매대의 좌우)
          const cosP = Math.cos(rotationRad)
          const sinP = Math.sin(rotationRad)
          onDrag('x', localDeltaX * cosP)
          onDrag('z', localDeltaX * sinP)
        } else {
          // 로컬 Z축 (매대의 앞뒤)
          const cosP = Math.cos(rotationRad)
          const sinP = Math.sin(rotationRad)
          onDrag('x', -localDeltaZ * sinP)
          onDrag('z', localDeltaZ * cosP)
        }
        dragStart.current = current
      }
    }

    const handleMouseUp = () => {
      setDragging(null)
      dragStart.current = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, rotationRad, getIntersection, onDrag])

  const handlePointerDown = useCallback((axis: 'x' | 'z') => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const intersection = getIntersection(e.clientX, e.clientY)
    if (intersection) {
      setDragging(axis)
      dragStart.current = intersection
    }
  }, [getIntersection])

  const xColor = hovered === 'x' || dragging === 'x' ? '#ff6666' : '#ff0000'
  const zColor = hovered === 'z' || dragging === 'z' ? '#6666ff' : '#0000ff'

  return (
    <group position={[fixture.position.x, pivotY, fixture.position.z]} rotation={[0, rotationRad, 0]}>
      {/* X 축 (빨강) - 로컬 좌우 방향 */}
      <group
        onPointerDown={handlePointerDown('x')}
        onPointerOver={() => setHovered('x')}
        onPointerOut={() => !dragging && setHovered(null)}
      >
        {/* 축 라인 */}
        <mesh position={[arrowLength / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[arrowThickness, arrowThickness, arrowLength, 12]} />
          <meshBasicMaterial color={xColor} />
        </mesh>
        {/* 화살표 머리 */}
        <group position={[arrowLength, 0, 0]}>
          <ArrowHead color={xColor} rotation={[0, 0, -Math.PI / 2]} size={1.2} />
        </group>
        {/* 히트 영역 (투명) */}
        <mesh position={[arrowLength / 2, 0, 0]}>
          <boxGeometry args={[arrowLength + 0.4, 0.35, 0.35]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>

      {/* Z 축 (파랑) - 로컬 앞뒤 방향 (매대 정면) */}
      <group
        onPointerDown={handlePointerDown('z')}
        onPointerOver={() => setHovered('z')}
        onPointerOut={() => !dragging && setHovered(null)}
      >
        {/* 축 라인 */}
        <mesh position={[0, 0, arrowLength / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[arrowThickness, arrowThickness, arrowLength, 12]} />
          <meshBasicMaterial color={zColor} />
        </mesh>
        {/* 화살표 머리 */}
        <group position={[0, 0, arrowLength]}>
          <ArrowHead color={zColor} rotation={[Math.PI / 2, 0, 0]} size={1.2} />
        </group>
        {/* 히트 영역 (투명) */}
        <mesh position={[0, 0, arrowLength / 2]}>
          <boxGeometry args={[0.35, 0.35, arrowLength + 0.4]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>

      {/* 중심점 */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
    </group>
  )
}

// 회전 기즈모 (Y축 원형)
function RotateGizmo({ fixture, onRotate }: { fixture: Fixture; onRotate: (angle: number) => void }) {
  const { camera, raycaster, gl } = useThree()
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const startAngle = useRef<number>(0)
  const floorPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))

  const ringRadius = 1.0
  const ringThickness = 0.06
  const pivotY = 0.05

  const getAngle = useCallback((clientX: number, clientY: number): number | null => {
    const rect = gl.domElement.getBoundingClientRect()
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    )
    raycaster.setFromCamera(mouse, camera)
    const intersection = new THREE.Vector3()
    const hit = raycaster.ray.intersectPlane(floorPlane.current, intersection)

    if (hit) {
      const dx = intersection.x - fixture.position.x
      const dz = intersection.z - fixture.position.z
      return Math.atan2(dx, dz) * (180 / Math.PI)
    }
    return null
  }, [camera, raycaster, gl, fixture.position])

  // window 레벨 이벤트 핸들러
  useEffect(() => {
    if (!dragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const currentAngle = getAngle(e.clientX, e.clientY)
      if (currentAngle !== null) {
        const newRotation = currentAngle - startAngle.current
        onRotate(newRotation)
      }
    }

    const handleMouseUp = () => {
      setDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, getAngle, onRotate])

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const angle = getAngle(e.clientX, e.clientY)
    if (angle !== null) {
      setDragging(true)
      startAngle.current = angle - fixture.rotation
    }
  }, [getAngle, fixture.rotation])

  const ringColor = hovered || dragging ? '#ffff66' : '#ffff00'

  return (
    <group position={[fixture.position.x, pivotY, fixture.position.z]}>
      {/* 회전 링 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => !dragging && setHovered(false)}
      >
        <torusGeometry args={[ringRadius, ringThickness, 12, 64]} />
        <meshBasicMaterial color={ringColor} />
      </mesh>

      {/* 현재 방향 표시 (녹색 화살표) */}
      <group rotation={[0, (fixture.rotation * Math.PI) / 180, 0]}>
        <mesh position={[0, 0.03, ringRadius + 0.25]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.12, 0.3, 12]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        {/* 방향 라인 */}
        <mesh position={[0, 0.03, ringRadius / 2]}>
          <boxGeometry args={[0.05, 0.05, ringRadius]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>

      {/* 중심점 */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>

      {/* 각도 눈금 (15도 단위) */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180
        const isMain = i % 6 === 0 // 90도 간격
        const length = isMain ? 0.2 : 0.1
        const innerRadius = ringRadius - length - 0.08
        return (
          <mesh
            key={i}
            position={[
              Math.sin(angle) * (innerRadius + length / 2),
              0,
              Math.cos(angle) * (innerRadius + length / 2),
            ]}
            rotation={[-Math.PI / 2, 0, -angle]}
          >
            <boxGeometry args={[0.02, length, 0.02]} />
            <meshBasicMaterial color={isMain ? '#ffffff' : '#888888'} />
          </mesh>
        )
      })}
    </group>
  )
}

export function TransformGizmo({ fixture }: TransformGizmoProps) {
  const { transformMode, moveFixture, rotateFixtureTo, editMode, currentStore, fixtures } = useSceneStore()

  const walls = currentStore?.walls || []
  const otherFixtures = fixtures.filter((f) => f.id !== fixture.id)

  // 편집 모드가 아니면 숨김
  if (editMode !== 'edit') return null

  const handleMove = useCallback((axis: 'x' | 'z', delta: number) => {
    const newPosition: Point3D = { ...fixture.position }
    if (axis === 'x') {
      newPosition.x += delta
    } else {
      newPosition.z += delta
    }

    // 벽 스냅 적용
    const wallSnapResult = snapToWalls(newPosition, fixture, walls)
    let finalPosition = wallSnapResult.snappedToWallId ? wallSnapResult.position : newPosition

    // 벽 충돌 체크
    if (checkWallCollision(fixture, finalPosition, walls)) {
      return // 충돌 시 이동하지 않음
    }

    // 매대 충돌 체크
    if (checkCollision(fixture, finalPosition, otherFixtures)) {
      return // 충돌 시 이동하지 않음
    }

    moveFixture(fixture.id, finalPosition)
  }, [fixture, walls, otherFixtures, moveFixture])

  const handleRotate = useCallback((angle: number) => {
    rotateFixtureTo(fixture.id, angle)
  }, [fixture.id, rotateFixtureTo])

  return (
    <>
      {transformMode === 'move' && (
        <MoveGizmo fixture={fixture} onDrag={handleMove} />
      )}
      {transformMode === 'rotate' && (
        <RotateGizmo fixture={fixture} onRotate={handleRotate} />
      )}
    </>
  )
}
