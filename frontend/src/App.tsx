import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Environment } from '@react-three/drei'
import './App.css'

function Scene() {
  return (
    <>
      {/* 조명 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      {/* 바닥 그리드 */}
      <Grid
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6e6e6e"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />

      {/* 테스트용 박스 */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4a90d9" />
      </mesh>

      {/* 환경 */}
      <Environment preset="warehouse" />

      {/* 카메라 컨트롤 */}
      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  )
}

function App() {
  return (
    <div className="w-full h-full">
      {/* 헤더 */}
      <header className="absolute top-0 left-0 right-0 h-14 bg-gray-900 text-white flex items-center px-4 z-10">
        <h1 className="text-xl font-bold">Retail-X 3D Builder</h1>
      </header>

      {/* 3D 캔버스 */}
      <div className="pt-14 w-full h-full">
        <Canvas
          shadows
          camera={{ position: [10, 10, 10], fov: 50 }}
          className="bg-gray-800"
        >
          <Scene />
        </Canvas>
      </div>
    </div>
  )
}

export default App
