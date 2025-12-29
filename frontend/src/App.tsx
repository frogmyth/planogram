import { useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { CameraController } from './components/3d/CameraController'
import { VMDControls } from './components/ui/VMDControls'
import { NavigationBreadcrumb } from './components/ui/NavigationBreadcrumb'
import { StoreSelector } from './components/ui/StoreSelector'
import { Minimap } from './components/ui/Minimap'
import { FixtureRenderer } from './components/3d/fixtures/FixtureRenderer'
import { FloorRenderer } from './components/3d/floor/FloorRenderer'
import { WallRenderer } from './components/3d/floor/WallRenderer'
import { ColumnRenderer } from './components/3d/floor/ColumnRenderer'
import { DraggableFixture, EditModeToggle, FixtureEditPanel, TransformGizmo } from './components/editor'
import { useSceneStore } from './store'
import './App.css'

// ============================================
// 플래노그램 메인 앱
// 좌표계: Three.js Y-up (X=동서, Y=높이, Z=남북)
// 단위: 미터 (실제 크기 100%)
// ============================================

// 3D 씬 컴포넌트
function Scene() {
  const {
    fixtures,
    selectedFixtureId,
    navigationLevel,
    currentStore,
    editMode,
    enterVMDMode,
    setSelectedFixture,
    getStoreCenter,
    getStoreDimensions,
    getAdjacentFixtures,
    getSelectedFixture,
  } = useSceneStore()

  const isStoreLevel = navigationLevel === 'store'
  const isFixtureLevel = navigationLevel === 'fixture'
  const isEditMode = editMode === 'edit'
  const selectedFixture = getSelectedFixture()

  // 매장 중심과 크기
  const storeCenter = getStoreCenter()
  const storeDimensions = getStoreDimensions()

  // VMD 모드에서 표시할 매대 (선택된 매대 + 인접 매대)
  const visibleFixtures = isFixtureLevel
    ? (() => {
        const adjacents = getAdjacentFixtures(selectedFixtureId || '')
        const result = []
        if (adjacents.prev) result.push(adjacents.prev)
        const current = fixtures.find((f) => f.id === selectedFixtureId)
        if (current) result.push(current)
        if (adjacents.next) result.push(adjacents.next)
        return result
      })()
    : fixtures

  return (
    <>
      {/* 조명 - 그림자 활성화 */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[20, 30, 20]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <directionalLight position={[-10, 20, -10]} intensity={0.3} />

      {/* 바닥면 */}
      <FloorRenderer
        width={storeDimensions.width}
        depth={storeDimensions.depth}
        centerX={storeCenter.x}
        centerZ={storeCenter.z}
        floorPlanImageUrl={currentStore?.floorPlan?.imageUrl}
      />

      {/* 벽면 - VMD 모드에서 투명화 */}
      {currentStore?.walls && (
        <WallRenderer
          walls={currentStore.walls}
          color="#6b7280"
          opacity={isFixtureLevel ? 0.15 : 1}
        />
      )}

      {/* 기둥 - VMD 모드에서 투명화 */}
      {currentStore?.columns && (
        <ColumnRenderer
          columns={currentStore.columns}
          color="#374151"
          opacity={isFixtureLevel ? 0.15 : 1}
        />
      )}

      {/* 매대 렌더링 - 편집 모드와 뷰 모드 분기 */}
      {visibleFixtures.map((fixture) =>
        isEditMode && isStoreLevel ? (
          <DraggableFixture
            key={fixture.id}
            fixture={fixture}
            isSelected={selectedFixtureId === fixture.id}
            isGhosted={false}
            onSelect={() => setSelectedFixture(fixture.id)}
          />
        ) : (
          <FixtureRenderer
            key={fixture.id}
            fixture={fixture}
            isSelected={selectedFixtureId === fixture.id}
            isGhosted={isFixtureLevel && selectedFixtureId !== fixture.id}
            onClick={() => {
              if (isStoreLevel && !isEditMode) {
                enterVMDMode(fixture.id)
              }
            }}
          />
        )
      )}

      {/* 변환 기즈모 (편집 모드 + 선택된 매대) */}
      {isEditMode && isStoreLevel && selectedFixture && (
        <TransformGizmo fixture={selectedFixture} />
      )}

      {/* 환경 */}
      <Environment preset="apartment" />

      {/* 카메라 컨트롤러 */}
      <CameraController />
    </>
  )
}

// 매장 뷰 컴포넌트
function StoreView() {
  const {
    fixtures,
    currentStore,
    navigationLevel,
    vmdFixtureIndex,
    editMode,
    exitVMDMode,
    navigateVMD,
    clearStore,
    setEditMode,
    setTransformMode,
    getStoreCenter,
    getStoreDimensions,
  } = useSceneStore()

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 필드에서는 무시
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (navigationLevel === 'fixture') {
        if (e.key === 'ArrowLeft') {
          navigateVMD('prev')
        } else if (e.key === 'ArrowRight') {
          navigateVMD('next')
        } else if (e.key === 'Escape') {
          exitVMDMode()
        }
      } else if (navigationLevel === 'store') {
        // W = 이동 모드
        if (e.key === 'w' || e.key === 'W') {
          if (editMode !== 'edit') {
            setEditMode('edit')
          }
          setTransformMode('move')
        }
        // E = 회전 모드
        else if (e.key === 'e' || e.key === 'E') {
          if (editMode !== 'edit') {
            setEditMode('edit')
          }
          setTransformMode('rotate')
        }
        // Escape = 편집 모드 종료 또는 매장 나가기
        else if (e.key === 'Escape') {
          if (editMode === 'edit') {
            setEditMode('view')
          } else {
            clearStore()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigationLevel, editMode, navigateVMD, exitVMDMode, clearStore, setEditMode, setTransformMode])

  const currentFixture = fixtures[vmdFixtureIndex]
  const isFixtureLevel = navigationLevel === 'fixture'

  // 카메라 초기 위치 계산
  const storeCenter = getStoreCenter()
  const storeDimensions = getStoreDimensions()

  const maxDim = Math.max(storeDimensions.width, storeDimensions.depth)
  const fovRad = (50 * Math.PI) / 180
  const initialCameraHeight = (maxDim / 2) / Math.tan(fovRad / 2) * 1.3

  return (
    <div className="w-full h-full bg-white">
      {/* 헤더 */}
      <header className="absolute top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={clearStore}
            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            Planogram
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <NavigationBreadcrumb storeName={currentStore?.meta.name || '매장'} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clearStore}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            매장 변경
          </button>
        </div>
      </header>

      {/* VMD 컨트롤 (매대 레벨에서만) */}
      {isFixtureLevel && currentFixture && (
        <VMDControls
          currentIndex={vmdFixtureIndex}
          totalCount={fixtures.length}
          fixtureName={currentFixture.name}
          onPrev={() => navigateVMD('prev')}
          onNext={() => navigateVMD('next')}
          onClose={exitVMDMode}
        />
      )}

      {/* 편집 모드 토글 (매장 레벨에서만) */}
      <EditModeToggle />

      {/* 매대 편집 패널 (편집 모드에서만) */}
      <FixtureEditPanel />

      {/* 미니맵 (VMD 모드에서만) */}
      <Minimap />

      {/* 3D 캔버스 */}
      <div className="w-full h-full">
        <Canvas
          shadows
          camera={{
            position: [storeCenter.x, initialCameraHeight, storeCenter.z],
            fov: 50,
          }}
          style={{ background: '#525252' }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}

// 메인 앱
function App() {
  const { navigationLevel, currentStore } = useSceneStore()

  if (navigationLevel === 'select' || !currentStore) {
    return <StoreSelector />
  }

  return <StoreView />
}

export default App
