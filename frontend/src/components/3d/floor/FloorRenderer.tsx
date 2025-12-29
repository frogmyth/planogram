import { useState, useEffect } from 'react'
import * as THREE from 'three'

// ============================================
// 바닥면 렌더러
// 좌표계: Three.js Y-up (X=동서, Y=높이, Z=남북)
// 단위: 미터 (실제 크기 100%)
// ============================================

interface FloorRendererProps {
  width: number   // X축 크기 (미터)
  depth: number   // Z축 크기 (미터)
  centerX: number // 중심 X좌표
  centerZ: number // 중심 Z좌표
  floorPlanImageUrl?: string // 평면도 이미지 URL (optional)
}

// SVG를 Canvas로 래스터화하여 텍스처 생성
function loadSvgAsTexture(url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      // 고해상도 캔버스 생성
      const canvas = document.createElement('canvas')
      const scale = 2 // 해상도 배율
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      // 흰색 배경
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // SVG 그리기
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // 텍스처 생성
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      resolve(texture)
    }
    img.onerror = reject
    img.src = url
  })
}

export function FloorRenderer({
  width,
  depth,
  centerX,
  centerZ,
  floorPlanImageUrl,
}: FloorRendererProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (floorPlanImageUrl) {
      // SVG 파일인지 확인
      if (floorPlanImageUrl.endsWith('.svg')) {
        loadSvgAsTexture(floorPlanImageUrl)
          .then((tex) => {
            console.log('SVG texture loaded successfully:', floorPlanImageUrl)
            setTexture(tex)
          })
          .catch((error) => {
            console.error('Error loading SVG texture:', error)
          })
      } else {
        // 일반 이미지 로드
        const loader = new THREE.TextureLoader()
        loader.load(
          floorPlanImageUrl,
          (loadedTexture) => {
            console.log('Texture loaded successfully:', floorPlanImageUrl)
            setTexture(loadedTexture)
          },
          undefined,
          (error) => {
            console.error('Error loading texture:', error)
          }
        )
      }
    }
  }, [floorPlanImageUrl])

  return (
    <group>
      {/* 기본 바닥 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[centerX, -0.02, centerZ]}
      >
        <planeGeometry args={[width + 4, depth + 4]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* 평면도 이미지 오버레이 */}
      {texture && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[centerX, 0.01, centerZ]}
        >
          <planeGeometry args={[width, depth]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}
