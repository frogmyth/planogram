import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useUIStore } from '../../store'
import { useSceneStore } from '../../store/useSceneStore'
import gsap from 'gsap'

interface CameraControllerProps {
  target?: [number, number, number]
}

export function CameraController({ target = [0, 0, 0] }: CameraControllerProps) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const { viewMode } = useUIStore()
  const {
    navigationLevel,
    isVMDMode,
    vmdFixtureIndex,
    fixtures,
    selectedZoneId,
    zones,
  } = useSceneStore()

  useEffect(() => {
    if (!controlsRef.current) return

    const controls = controlsRef.current

    if (navigationLevel === 'fixture' && isVMDMode) {
      // VMD 정면뷰 모드 - 현재 구역 내 매대만 대상
      const zoneFixtures = selectedZoneId
        ? fixtures.filter((f) => f.zoneId === selectedZoneId)
        : fixtures
      const fixture = zoneFixtures[vmdFixtureIndex]

      if (fixture) {
        const { position, depth, height } = fixture
        const targetY = height / 2
        const cameraZ = position.z + depth / 2 + 3 // 매대 앞에서 3m 거리

        gsap.to(camera.position, {
          x: position.x,
          y: targetY,
          z: cameraZ,
          duration: 0.6,
          ease: 'power2.out',
          onUpdate: () => {
            controls.target.set(position.x, targetY, position.z)
            controls.update()
          },
        })
      }
    } else if (navigationLevel === 'zone' && selectedZoneId) {
      // 구역 뷰 - 선택된 구역 중심으로 카메라 이동
      const zone = zones.find((z) => z.id === selectedZoneId)
      if (zone) {
        const { bounds } = zone
        const centerX = (bounds.minX + bounds.maxX) / 2
        const centerZ = (bounds.minZ + bounds.maxZ) / 2
        const zoneWidth = bounds.maxX - bounds.minX
        const zoneDepth = bounds.maxZ - bounds.minZ
        const maxDim = Math.max(zoneWidth, zoneDepth)

        // 구역 크기에 따른 카메라 높이 조절
        const cameraHeight = Math.max(8, maxDim * 1.2)

        gsap.to(camera.position, {
          x: centerX,
          y: cameraHeight,
          z: centerZ + maxDim * 0.3, // 약간 앞에서 바라봄
          duration: 0.8,
          ease: 'power2.inOut',
          onUpdate: () => {
            controls.target.set(centerX, 0, centerZ)
            controls.update()
          },
        })
      }
    } else if (navigationLevel === 'store') {
      // 매장 전체 뷰
      if (viewMode === 'TOP') {
        // 탑뷰 (직교 뷰처럼 위에서 내려다봄)
        gsap.to(camera.position, {
          x: target[0],
          y: 30,
          z: target[2],
          duration: 0.8,
          ease: 'power2.inOut',
          onUpdate: () => {
            camera.lookAt(target[0], 0, target[2])
            controls.target.set(target[0], 0, target[2])
            controls.update()
          },
        })
      } else if (viewMode === 'PERSPECTIVE') {
        // 3D 퍼스펙티브 뷰
        gsap.to(camera.position, {
          x: 20,
          y: 20,
          z: 20,
          duration: 0.8,
          ease: 'power2.inOut',
          onUpdate: () => {
            camera.lookAt(target[0], 0, target[2])
            controls.target.set(target[0], 0, target[2])
            controls.update()
          },
        })
      }
    }
  }, [
    viewMode,
    camera,
    target,
    navigationLevel,
    isVMDMode,
    vmdFixtureIndex,
    fixtures,
    selectedZoneId,
    zones,
  ])

  // 네비게이션 레벨에 따른 컨트롤 설정
  const isFixtureMode = navigationLevel === 'fixture'
  const isZoneMode = navigationLevel === 'zone'
  const isTopView = viewMode === 'TOP' && navigationLevel === 'store'

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minPolarAngle={isFixtureMode ? Math.PI / 4 : isTopView ? 0 : 0}
      maxPolarAngle={isFixtureMode ? Math.PI / 2 : isTopView ? 0.1 : Math.PI / 2}
      enableRotate={!isFixtureMode && !isTopView}
      enablePan={!isFixtureMode}
      enableZoom={true}
      minDistance={isFixtureMode ? 2 : isZoneMode ? 3 : 5}
      maxDistance={isFixtureMode ? 10 : isZoneMode ? 30 : 100}
    />
  )
}
