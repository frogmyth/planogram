// ============================================
// 매대 편집 패널
// 선택된 매대의 속성을 편집할 수 있는 사이드 패널
// ============================================

import { useCallback, useMemo } from 'react'
import { useSceneStore } from '../../store/useSceneStore'
import type { FixtureStyle, Dimensions3D } from '../../types/store'
import { FIXTURE_STYLE_LABELS, FIXTURE_STYLE_COLORS } from '../../types/store'

// 숫자 입력 컴포넌트
interface NumberInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
}

function NumberInput({ label, value, onChange, min = 0, max = 100, step = 0.1, unit = 'm' }: NumberInputProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
    </div>
  )
}

// 스타일 선택 버튼
interface StyleButtonProps {
  style: FixtureStyle
  isSelected: boolean
  onClick: () => void
}

function StyleButton({ style, isSelected, onClick }: StyleButtonProps) {
  const colors = FIXTURE_STYLE_COLORS[style]
  const label = FIXTURE_STYLE_LABELS[style]

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div
        className="w-8 h-8 rounded mb-1"
        style={{ backgroundColor: colors.frame }}
      />
      <span className="text-xs text-gray-700">{label}</span>
    </button>
  )
}

export function FixtureEditPanel() {
  const {
    editMode,
    setEditMode,
    selectedFixtureId,
    getSelectedFixture,
    updateFixtureDimensions,
    updateFixtureStyle,
    updateFixtureStructure,
    rotateFixture,
    removeFixture,
    setSelectedFixture,
  } = useSceneStore()

  const fixture = useMemo(() => getSelectedFixture(), [getSelectedFixture, selectedFixtureId])

  // 치수 변경 핸들러
  const handleDimensionChange = useCallback(
    (key: keyof Dimensions3D, value: number) => {
      if (!fixture) return
      updateFixtureDimensions(fixture.id, {
        ...fixture.dimensions,
        [key]: value,
      })
    },
    [fixture, updateFixtureDimensions]
  )

  // 스타일 변경 핸들러
  const handleStyleChange = useCallback(
    (style: FixtureStyle) => {
      if (!fixture) return
      updateFixtureStyle(fixture.id, style)
    },
    [fixture, updateFixtureStyle]
  )

  // 선반 개수 변경 핸들러
  const handleShelfCountChange = useCallback(
    (count: number) => {
      if (!fixture) return
      const validCount = Math.max(1, Math.min(10, count))
      const newHeights: number[] = []
      const spacing = (fixture.dimensions.height - fixture.structure.baseHeight - 0.1) / (validCount + 1)
      for (let i = 0; i < validCount; i++) {
        newHeights.push(fixture.structure.baseHeight + spacing * (i + 1))
      }
      updateFixtureStructure(fixture.id, {
        ...fixture.structure,
        shelfCount: validCount,
        shelfHeights: newHeights,
      })
    },
    [fixture, updateFixtureStructure]
  )

  // 베이스 높이 변경 핸들러
  const handleBaseHeightChange = useCallback(
    (baseHeight: number) => {
      if (!fixture) return
      updateFixtureStructure(fixture.id, {
        ...fixture.structure,
        baseHeight,
      })
    },
    [fixture, updateFixtureStructure]
  )

  // 개별 선반 높이 변경 핸들러
  const handleShelfHeightChange = useCallback(
    (index: number, height: number) => {
      if (!fixture) return
      const newHeights = [...fixture.structure.shelfHeights]
      newHeights[index] = height
      updateFixtureStructure(fixture.id, {
        ...fixture.structure,
        shelfHeights: newHeights,
      })
    },
    [fixture, updateFixtureStructure]
  )

  // 회전 핸들러
  const handleRotate = useCallback(
    (degrees: 90 | -90) => {
      if (!fixture) return
      rotateFixture(fixture.id, degrees)
    },
    [fixture, rotateFixture]
  )

  // 삭제 핸들러
  const handleDelete = useCallback(() => {
    if (!fixture) return
    if (confirm(`"${fixture.name}" 매대를 삭제하시겠습니까?`)) {
      removeFixture(fixture.id)
      setSelectedFixture(null)
    }
  }, [fixture, removeFixture, setSelectedFixture])

  // 편집 모드가 아니면 null 반환
  if (editMode !== 'edit') return null

  // 선택된 매대가 없으면 안내 메시지
  if (!fixture) {
    return (
      <div className="absolute right-4 top-20 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="text-center text-gray-500">
          <p className="text-sm">편집할 매대를 선택하세요</p>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute right-4 top-20 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-h-[calc(100vh-120px)] overflow-y-auto">
      {/* 헤더 */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">{fixture.name}</h3>
          <button
            onClick={() => setEditMode('view')}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">ID: {fixture.id}</p>
      </div>

      {/* 스타일 선택 */}
      <div className="p-4 border-b border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">매대 스타일</h4>
        <div className="grid grid-cols-4 gap-2">
          {(['standard', 'open', 'chilled', 'frozen'] as FixtureStyle[]).map((style) => (
            <StyleButton
              key={style}
              style={style}
              isSelected={fixture.style === style}
              onClick={() => handleStyleChange(style)}
            />
          ))}
        </div>
      </div>

      {/* 크기 조절 */}
      <div className="p-4 border-b border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">크기</h4>
        <div className="space-y-3">
          <NumberInput
            label="가로 (Width)"
            value={fixture.dimensions.width}
            onChange={(v) => handleDimensionChange('width', v)}
            min={0.3}
            max={10}
            step={0.1}
          />
          <NumberInput
            label="세로 (Depth)"
            value={fixture.dimensions.depth}
            onChange={(v) => handleDimensionChange('depth', v)}
            min={0.3}
            max={5}
            step={0.1}
          />
          <NumberInput
            label="높이 (Height)"
            value={fixture.dimensions.height}
            onChange={(v) => handleDimensionChange('height', v)}
            min={0.5}
            max={3}
            step={0.1}
          />
        </div>
      </div>

      {/* 회전 */}
      <div className="p-4 border-b border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">회전</h4>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">현재: {fixture.rotation}°</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleRotate(-90)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              -90°
            </button>
            <button
              onClick={() => handleRotate(90)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              +90°
            </button>
          </div>
        </div>
      </div>

      {/* 선반 설정 */}
      <div className="p-4 border-b border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">선반 설정</h4>
        <div className="space-y-3">
          <NumberInput
            label="선반 개수"
            value={fixture.structure.shelfCount}
            onChange={handleShelfCountChange}
            min={1}
            max={10}
            step={1}
            unit="개"
          />
          <NumberInput
            label="베이스 높이"
            value={fixture.structure.baseHeight}
            onChange={handleBaseHeightChange}
            min={0.05}
            max={0.5}
            step={0.05}
          />
        </div>

        {/* 개별 선반 높이 */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">선반별 높이</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {fixture.structure.shelfHeights.map((height, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">선반 {index + 1}</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={height.toFixed(2)}
                    onChange={(e) => handleShelfHeightChange(index, parseFloat(e.target.value) || 0)}
                    min={fixture.structure.baseHeight}
                    max={fixture.dimensions.height - 0.1}
                    step={0.05}
                    className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                  <span className="text-xs text-gray-500">m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 위치 정보 (읽기 전용) */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-2">위치</h4>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <span className="text-gray-500">X</span>
            <p className="font-mono">{fixture.position.x.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <span className="text-gray-500">Y</span>
            <p className="font-mono">{fixture.position.y.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <span className="text-gray-500">Z</span>
            <p className="font-mono">{fixture.position.z.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* 삭제 버튼 */}
      <div className="p-4">
        <button
          onClick={handleDelete}
          className="w-full py-2 px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
        >
          매대 삭제
        </button>
      </div>
    </div>
  )
}
