import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { ZoneRenderer } from './components/3d/floor/ZoneRenderer'
import { WallRenderer } from './components/3d/floor/WallRenderer'
import { GondolaMesh } from './components/3d/fixtures/GondolaMesh'
import { CameraController } from './components/3d/CameraController'
import { ViewControls } from './components/ui/ViewControls'
import { VMDControls } from './components/ui/VMDControls'
import { useUIStore, useSceneStore } from './store'
import type { FixtureInstance } from './store/useSceneStore'
import './App.css'

// 샘플 매장 구역 데이터
const sampleZones = [
  { id: 'zone-1', name: '농산', color: '#86efac', bounds: { minX: 0, minZ: 0, maxX: 6, maxZ: 5 } },
  { id: 'zone-2', name: '정육', color: '#fca5a5', bounds: { minX: 6, minZ: 0, maxX: 10, maxZ: 5 } },
  { id: 'zone-3', name: '수산', color: '#93c5fd', bounds: { minX: 10, minZ: 0, maxX: 15, maxZ: 5 } },
  { id: 'zone-4', name: '유제품', color: '#fcd34d', bounds: { minX: 0, minZ: 5, maxX: 5, maxZ: 10 } },
  { id: 'zone-5', name: '냉동', color: '#67e8f9', bounds: { minX: 5, minZ: 5, maxX: 10, maxZ: 10 } },
  { id: 'zone-6', name: '과자', color: '#f9a8d4', bounds: { minX: 10, minZ: 5, maxX: 15, maxZ: 10 } },
  { id: 'zone-7', name: '음료', color: '#c4b5fd', bounds: { minX: 0, minZ: 10, maxX: 7, maxZ: 15 } },
  { id: 'zone-8', name: '생활용품', color: '#fdba74', bounds: { minX: 7, minZ: 10, maxX: 15, maxZ: 15 } },
]

const sampleWalls = [
  { id: 'wall-1', start: { x: 0, z: 0 }, end: { x: 15, z: 0 }, height: 3, thickness: 0.15 },
  { id: 'wall-2', start: { x: 15, z: 0 }, end: { x: 15, z: 15 }, height: 3, thickness: 0.15 },
  { id: 'wall-3', start: { x: 15, z: 15 }, end: { x: 0, z: 15 }, height: 3, thickness: 0.15 },
  { id: 'wall-4', start: { x: 0, z: 15 }, end: { x: 0, z: 0 }, height: 3, thickness: 0.15 },
]

// 샘플 매대 데이터
const sampleFixtures: FixtureInstance[] = [
  { id: 'fix-1', name: 'A-01', zoneId: 'zone-1', position: { x: 2, y: 0, z: 2 }, rotation: 0, width: 1.2, height: 2, depth: 0.5, shelfCount: 5 },
  { id: 'fix-2', name: 'A-02', zoneId: 'zone-1', position: { x: 4, y: 0, z: 2 }, rotation: 0, width: 1.2, height: 2, depth: 0.5, shelfCount: 5 },
  { id: 'fix-3', name: 'B-01', zoneId: 'zone-2', position: { x: 7, y: 0, z: 2 }, rotation: 0, width: 1.2, height: 1.8, depth: 0.5, shelfCount: 4 },
  { id: 'fix-4', name: 'B-02', zoneId: 'zone-2', position: { x: 9, y: 0, z: 2 }, rotation: 0, width: 1.2, height: 1.8, depth: 0.5, shelfCount: 4 },
  { id: 'fix-5', name: 'C-01', zoneId: 'zone-3', position: { x: 12, y: 0, z: 2 }, rotation: 0, width: 1.5, height: 2.2, depth: 0.6, shelfCount: 6 },
  { id: 'fix-6', name: 'D-01', zoneId: 'zone-4', position: { x: 2, y: 0, z: 7 }, rotation: 90, width: 1.2, height: 2, depth: 0.5, shelfCount: 5 },
  { id: 'fix-7', name: 'E-01', zoneId: 'zone-5', position: { x: 7, y: 0, z: 7 }, rotation: 0, width: 1.8, height: 2, depth: 0.8, shelfCount: 4 },
  { id: 'fix-8', name: 'F-01', zoneId: 'zone-6', position: { x: 12, y: 0, z: 7 }, rotation: 0, width: 1.2, height: 2, depth: 0.5, shelfCount: 5 },
]

function Scene() {
  const { viewMode } = useUIStore()
  const { fixtures, selectedFixtureId, isVMDMode, enterVMDMode, setSelectedFixture } = useSceneStore()
  const isTopView = viewMode === 'TOP'

  return (
    <>
      {/* 조명 */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 10]} intensity={0.6} castShadow />
      <directionalLight position={[-10, 20, -10]} intensity={0.3} />

      {/* 바닥 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7.5, -0.01, 7.5]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#fafafa" />
      </mesh>

      {/* 구역 렌더링 */}
      <ZoneRenderer
        zones={sampleZones}
        showLabels={!isVMDMode}
        opacity={isVMDMode ? 0.1 : isTopView ? 0.6 : 0.4}
      />

      {/* 벽체 렌더링 */}
      <WallRenderer
        walls={sampleWalls.map(w => ({
          ...w,
          height: isVMDMode ? 0.1 : isTopView ? 0.2 : 3
        }))}
        color="#e5e7eb"
      />

      {/* 매대 렌더링 */}
      {fixtures.map((fixture) => (
        <GondolaMesh
          key={fixture.id}
          id={fixture.id}
          name={fixture.name}
          position={[fixture.position.x, fixture.position.y, fixture.position.z]}
          rotation={fixture.rotation}
          width={fixture.width}
          height={fixture.height}
          depth={fixture.depth}
          shelfCount={fixture.shelfCount}
          isSelected={selectedFixtureId === fixture.id}
          isGhosted={isVMDMode && selectedFixtureId !== fixture.id}
          onClick={() => {
            if (isVMDMode) return
            setSelectedFixture(fixture.id)
          }}
        />
      ))}

      {/* 환경 */}
      <Environment preset="apartment" />

      {/* 카메라 컨트롤 */}
      <CameraController target={[7.5, 0, 7.5]} />
    </>
  )
}

function App() {
  const { viewMode } = useUIStore()
  const {
    fixtures,
    setFixtures,
    selectedFixtureId,
    isVMDMode,
    vmdFixtureIndex,
    enterVMDMode,
    exitVMDMode,
    navigateVMD,
  } = useSceneStore()

  // 샘플 데이터 초기화
  useEffect(() => {
    setFixtures(sampleFixtures)
  }, [setFixtures])

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isVMDMode) {
        if (e.key === 'ArrowLeft') {
          navigateVMD('prev')
        } else if (e.key === 'ArrowRight') {
          navigateVMD('next')
        } else if (e.key === 'Escape') {
          exitVMDMode()
        }
      } else if (selectedFixtureId && e.key === 'Enter') {
        enterVMDMode(selectedFixtureId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isVMDMode, selectedFixtureId, navigateVMD, exitVMDMode, enterVMDMode])

  const currentFixture = fixtures[vmdFixtureIndex]

  return (
    <div className="w-full h-full bg-white">
      {/* 헤더 */}
      <header className="absolute top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">Retail-X</h1>
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-sm text-gray-500">이마트 성수점</span>
        </div>
        <div className="flex items-center gap-3">
          {!isVMDMode && (
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              viewMode === 'TOP'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {viewMode === 'TOP' ? '2D' : '3D'}
            </span>
          )}
          {selectedFixtureId && !isVMDMode && (
            <button
              onClick={() => enterVMDMode(selectedFixtureId)}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-full transition-colors"
            >
              상세보기
            </button>
          )}
        </div>
      </header>

      {/* 뷰 컨트롤 버튼 (VMD 모드가 아닐 때만) */}
      {!isVMDMode && <ViewControls />}

      {/* VMD 컨트롤 (VMD 모드일 때만) */}
      {isVMDMode && currentFixture && (
        <VMDControls
          currentIndex={vmdFixtureIndex}
          totalCount={fixtures.length}
          fixtureName={currentFixture.name}
          onPrev={() => navigateVMD('prev')}
          onNext={() => navigateVMD('next')}
          onClose={exitVMDMode}
        />
      )}

      {/* 3D 캔버스 */}
      <div className="w-full h-full">
        <Canvas
          shadows
          camera={{ position: [15, 15, 15], fov: 50 }}
          style={{ background: '#fafafa' }}
          onPointerMissed={() => {
            if (!isVMDMode) {
              useSceneStore.getState().setSelectedFixture(null)
            }
          }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* 선택된 매대 정보 (VMD 모드가 아닐 때) */}
      {selectedFixtureId && !isVMDMode && (
        <div className="absolute bottom-6 left-6 z-20">
          <div className="px-4 py-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
            <div className="text-xs text-gray-400 mb-1">선택된 매대</div>
            <div className="text-sm font-semibold text-gray-900">
              {fixtures.find(f => f.id === selectedFixtureId)?.name}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              더블클릭 또는 Enter로 상세보기
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
