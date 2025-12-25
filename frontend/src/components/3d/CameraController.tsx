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
  const { isVMDMode, vmdFixtureIndex, fixtures } = useSceneStore()

  useEffect(() => {
    if (!controlsRef.current) return

    const controls = controlsRef.current

    if (isVMDMode && fixtures.length > 0) {
      // VMD 정면뷰 모드
      const fixture = fixtures[vmdFixtureIndex]
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
    } else if (viewMode === 'TOP') {
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
        x: 15,
        y: 15,
        z: 15,
        duration: 0.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.lookAt(target[0], 0, target[2])
          controls.target.set(target[0], 0, target[2])
          controls.update()
        },
      })
    }
  }, [viewMode, camera, target, isVMDMode, vmdFixtureIndex, fixtures])

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minPolarAngle={isVMDMode ? Math.PI / 4 : viewMode === 'TOP' ? 0 : 0}
      maxPolarAngle={isVMDMode ? Math.PI / 2 : viewMode === 'TOP' ? 0.1 : Math.PI / 2}
      enableRotate={!isVMDMode && viewMode !== 'TOP'}
      enablePan={!isVMDMode}
      enableZoom={true}
      minDistance={isVMDMode ? 2 : 5}
      maxDistance={isVMDMode ? 10 : 100}
    />
  )
}
