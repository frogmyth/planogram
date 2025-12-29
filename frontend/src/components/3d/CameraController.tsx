import { useRef, useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useSceneStore } from '../../store/useSceneStore'
import gsap from 'gsap'

// ============================================
// 카메라 컨트롤러
// 좌표계: Three.js Y-up (X=동서, Y=높이, Z=남북)
// 단위: 미터 (실제 크기 100%)
// ============================================

// 매장 크기에 맞는 카메라 높이 계산 (전체 평면도가 보이도록)
function calculateOptimalHeight(width: number, depth: number, fov: number = 50): number {
  const maxDim = Math.max(width, depth)
  // FOV를 고려하여 전체가 보이는 높이 계산
  const fovRad = (fov * Math.PI) / 180
  const height = (maxDim / 2) / Math.tan(fovRad / 2)
  // 약간의 여유 추가 (20%)
  return height * 1.2
}

export function CameraController() {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const storeIdRef = useRef<string | null>(null)
  const prevNavigationLevel = useRef<string>('select')

  const {
    navigationLevel,
    isVMDMode,
    vmdFixtureIndex,
    fixtures,
    currentStore,
    getStoreCenter,
    getStoreDimensions,
    getCameraConfig,
  } = useSceneStore()

  // 동적 타겟 및 설정 계산
  const storeCenter = getStoreCenter()
  const storeDimensions = getStoreDimensions()
  const cameraConfig = getCameraConfig()
  const target: [number, number, number] = [storeCenter.x, 0, storeCenter.z]

  // 매장 크기에 맞는 최적 카메라 높이 계산
  const optimalStoreViewHeight = useMemo(() => {
    return calculateOptimalHeight(storeDimensions.width, storeDimensions.depth)
  }, [storeDimensions])

  // 매장 전환 시 카메라 즉시 재설정
  useEffect(() => {
    if (!controlsRef.current || !currentStore) return

    const newStoreId = currentStore.meta.id

    // 매장이 변경되었을 때만 카메라 리셋
    if (storeIdRef.current !== newStoreId) {
      storeIdRef.current = newStoreId

      // 즉시 카메라 위치 설정 (애니메이션 없이)
      camera.position.set(target[0], optimalStoreViewHeight, target[2])
      controlsRef.current.target.set(target[0], 0, target[2])
      controlsRef.current.update()
    }
  }, [camera, currentStore, target, optimalStoreViewHeight])

  // 네비게이션 레벨 변경 시 카메라 이동
  useEffect(() => {
    if (!controlsRef.current) return

    const controls = controlsRef.current
    const wasInFixtureMode = prevNavigationLevel.current === 'fixture'

    if (navigationLevel === 'fixture' && isVMDMode) {
      // VMD 정면뷰 모드
      const fixture = fixtures[vmdFixtureIndex]

      if (fixture) {
        const { position, dimensions, rotation } = fixture
        const targetY = dimensions.height / 2
        const cameraDistance = cameraConfig?.fixtureViewDistance || 3

        // 매대 회전에 따른 카메라 위치 계산
        const rotationRad = (rotation * Math.PI) / 180
        const cameraX = position.x + Math.sin(rotationRad) * (dimensions.depth / 2 + cameraDistance)
        const cameraZ = position.z + Math.cos(rotationRad) * (dimensions.depth / 2 + cameraDistance)

        const isAlreadyFrontView = camera.position.y < 5

        if (isAlreadyFrontView) {
          // 이미 정면뷰에서 다른 매대로 이동
          gsap.to(camera.position, {
            x: cameraX,
            z: cameraZ,
            duration: 0.4,
            ease: 'power2.inOut',
          })
          gsap.to(controls.target, {
            x: position.x,
            z: position.z,
            duration: 0.4,
            ease: 'power2.inOut',
            onUpdate: () => controls.update(),
          })
        } else {
          // 탑뷰에서 정면뷰로 전환
          controls.target.set(position.x, targetY, position.z)
          gsap.to(camera.position, {
            x: cameraX,
            y: targetY,
            z: cameraZ,
            duration: 0.6,
            ease: 'power2.out',
            onUpdate: () => controls.update(),
          })
        }
      }
    } else if (navigationLevel === 'store' && wasInFixtureMode) {
      // VMD 모드에서 매장 뷰로 돌아올 때만 카메라 리셋
      // (편집 모드 전환/매대 선택은 줌 상태 유지)
      const targetObj = { x: controls.target.x, z: controls.target.z }

      gsap.to(camera.position, {
        x: target[0],
        y: optimalStoreViewHeight,
        z: target[2],
        duration: 0.8,
        ease: 'power2.inOut',
      })

      gsap.to(targetObj, {
        x: target[0],
        z: target[2],
        duration: 0.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          controls.target.set(targetObj.x, 0, targetObj.z)
          controls.update()
        },
      })
    }

    // 이전 네비게이션 레벨 저장
    prevNavigationLevel.current = navigationLevel
  }, [
    camera,
    target,
    navigationLevel,
    isVMDMode,
    vmdFixtureIndex,
    fixtures,
    optimalStoreViewHeight,
    cameraConfig,
  ])

  // 네비게이션 레벨에 따른 컨트롤 설정
  const isFixtureMode = navigationLevel === 'fixture'
  const isStoreMode = navigationLevel === 'store'

  // 매장 크기에 따른 줌 범위 동적 계산
  const zoomLimits = useMemo(() => {
    const maxDim = Math.max(storeDimensions.width, storeDimensions.depth)
    return {
      min: Math.max(5, maxDim * 0.2),  // 최소 줌 (가까이)
      max: maxDim * 2.5,                // 최대 줌 (멀리)
    }
  }, [storeDimensions])

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minPolarAngle={isFixtureMode ? Math.PI / 4 : 0}
      maxPolarAngle={isFixtureMode ? Math.PI / 2 : 0.01}
      enableRotate={!isStoreMode && !isFixtureMode}
      enablePan={true}
      screenSpacePanning={true}
      enableZoom={true}
      zoomSpeed={1.2}
      minDistance={isFixtureMode ? 2 : zoomLimits.min}
      maxDistance={isFixtureMode ? 10 : zoomLimits.max}
      enableDamping={true}
      dampingFactor={0.1}
    />
  )
}
