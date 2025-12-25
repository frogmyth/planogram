import { useUIStore } from '../../store'

export function ViewControls() {
  const { viewMode, setViewMode } = useUIStore()

  return (
    <div className="absolute right-4 top-20 flex flex-col gap-2 z-20">
      {/* 2D/3D 전환 버튼 */}
      <button
        onClick={() => setViewMode(viewMode === 'TOP' ? 'PERSPECTIVE' : 'TOP')}
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center font-bold text-sm transition-all
          ${viewMode === 'TOP'
            ? 'bg-gray-800 text-white'
            : 'bg-white text-gray-800 hover:bg-gray-100'
          }`}
      >
        {viewMode === 'TOP' ? '3D' : '2D'}
      </button>

      {/* 리셋 버튼 */}
      <button
        onClick={() => setViewMode('PERSPECTIVE')}
        className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all"
        title="카메라 리셋"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  )
}
