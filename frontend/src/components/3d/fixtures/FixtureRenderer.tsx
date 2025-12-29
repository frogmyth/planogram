import * as THREE from 'three'
import type { Fixture, FixtureStyle } from '../../../types/store'
import { useSceneStore } from '../../../store/useSceneStore'
import { FIXTURE_STYLE_COLORS } from '../../../types/store'

// ============================================
// 매대 렌더러
// 좌표계: Three.js Y-up (X=동서, Y=높이, Z=남북)
// 단위: 미터 (실제 크기 100%)
// ============================================

interface FixtureRendererProps {
  fixture: Fixture
  isSelected?: boolean
  isGhosted?: boolean
  onClick?: () => void
}

// type을 기반으로 기본 style 결정 (style 필드가 없는 기존 데이터 지원)
function getDefaultStyle(type: string): FixtureStyle {
  switch (type) {
    case 'refrigerator':
      return 'chilled'
    case 'freezer':
      return 'frozen'
    case 'island':
    case 'promotional':
      return 'open'
    default:
      return 'standard'
  }
}

export function FixtureRenderer({
  fixture,
  isSelected = false,
  isGhosted = false,
  onClick,
}: FixtureRendererProps) {
  const { position, rotation, dimensions, type, structure, categoryId } = fixture
  const { currentStore, editMode } = useSceneStore()

  // style 필드가 없으면 type에서 추론
  const style: FixtureStyle = fixture.style || getDefaultStyle(type)

  // 회전 각도 (도 → 라디안)
  const rotationY = (rotation * Math.PI) / 180

  // 제품군 색상 가져오기
  const getCategoryColor = (): string | null => {
    if (!categoryId || !currentStore?.productCategories) return null
    const category = currentStore.productCategories.find(c => c.id === categoryId)
    return category?.color || null
  }

  // 스타일 기반 색상 가져오기
  const styleColors = FIXTURE_STYLE_COLORS[style]
  const categoryColor = getCategoryColor()
  const frameColor = styleColors.frame
  // 선반 색상 - 흰색 대신 연한 회색 사용
  const shelfColor = categoryColor || '#e5e5e5'
  const opacity = isGhosted ? 0.3 : 1

  // 냉장/냉동 스타일인지 확인
  const isChilledOrFrozen = style === 'chilled' || style === 'frozen'

  // 편집 모드인지 확인
  const isEditMode = editMode === 'edit'

  // 상단 선반 높이 (매대 높이에서 약간 아래)
  const topShelfHeight = dimensions.height - 0.05

  return (
    <group
      position={[position.x, position.y, position.z]}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onPointerOver={() => {
        if (!isGhosted) {
          document.body.style.cursor = 'pointer'
        }
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      {/* 베이스 - 그림자 활성화 */}
      <mesh position={[0, structure.baseHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry
          args={[dimensions.width, structure.baseHeight, dimensions.depth]}
        />
        <meshStandardMaterial
          color={frameColor}
          transparent={isGhosted}
          opacity={opacity}
        />
      </mesh>

      {/* 선반들 - 그림자 활성화, 연한 회색 */}
      {structure.shelfHeights.map((shelfHeight, index) => (
        <mesh
          key={index}
          position={[0, shelfHeight + 0.02, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[dimensions.width - 0.04, 0.03, dimensions.depth - 0.02]}
          />
          <meshStandardMaterial
            color={shelfColor}
            transparent={isGhosted}
            opacity={opacity}
          />
        </mesh>
      ))}

      {/* 상단 선반 (제일 위 칸 위쪽) */}
      <mesh
        position={[0, topShelfHeight, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[dimensions.width - 0.04, 0.03, dimensions.depth - 0.02]}
        />
        <meshStandardMaterial
          color={shelfColor}
          transparent={isGhosted}
          opacity={opacity}
        />
      </mesh>

      {/* 프레임 (양쪽 측면) - 그림자 활성화 */}
      <mesh position={[-dimensions.width / 2 + 0.02, dimensions.height / 2, 0]} castShadow>
        <boxGeometry args={[0.04, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial
          color={frameColor}
          transparent={isGhosted}
          opacity={opacity}
        />
      </mesh>
      <mesh position={[dimensions.width / 2 - 0.02, dimensions.height / 2, 0]} castShadow>
        <boxGeometry args={[0.04, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial
          color={frameColor}
          transparent={isGhosted}
          opacity={opacity}
        />
      </mesh>

      {/* 뒷판 - 그림자 활성화 */}
      <mesh position={[0, dimensions.height / 2, -dimensions.depth / 2 + 0.01]} castShadow>
        <boxGeometry args={[dimensions.width - 0.04, dimensions.height, 0.02]} />
        <meshStandardMaterial
          color="#d4d4d4"
          transparent={isGhosted}
          opacity={opacity}
        />
      </mesh>

      {/* 앞면 표시 (편집 모드에서만) - 녹색 라인 */}
      {isEditMode && !isGhosted && (
        <mesh position={[0, 0.02, dimensions.depth / 2 + 0.01]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[dimensions.width, 0.08]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      )}

      {/* 앞면 화살표 (편집 모드에서만) */}
      {isEditMode && !isGhosted && (
        <group position={[0, 0.05, dimensions.depth / 2 + 0.15]}>
          {/* 화살표 몸통 */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.05, 0.1, 0.02]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          {/* 화살표 머리 */}
          <mesh position={[0, 0, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.06, 0.1, 3]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
        </group>
      )}

      {/* 제품군 색상 표시 - 바닥 면 */}
      {categoryColor && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[dimensions.width, dimensions.depth]} />
          <meshStandardMaterial
            color={categoryColor}
            transparent={isGhosted}
            opacity={opacity * 0.8}
          />
        </mesh>
      )}

      {/* 냉장/냉동 매대 유리 효과 */}
      {isChilledOrFrozen && (
        <mesh position={[0, dimensions.height / 2, dimensions.depth / 2 - 0.02]}>
          <boxGeometry args={[dimensions.width - 0.08, dimensions.height - 0.2, 0.02]} />
          <meshStandardMaterial
            color={style === 'frozen' ? '#e0f2fe' : '#dbeafe'}
            transparent
            opacity={isGhosted ? 0.15 : 0.4}
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>
      )}

      {/* 선택 표시 (외곽선) */}
      {isSelected && (
        <mesh position={[0, dimensions.height / 2, 0]}>
          <boxGeometry
            args={[
              dimensions.width + 0.1,
              dimensions.height + 0.1,
              dimensions.depth + 0.1,
            ]}
          />
          <meshBasicMaterial
            color="#3B82F6"
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  )
}
