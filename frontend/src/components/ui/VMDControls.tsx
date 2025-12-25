interface VMDControlsProps {
  currentIndex: number
  totalCount: number
  fixtureName: string
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}

export function VMDControls({
  currentIndex,
  totalCount,
  fixtureName,
  onPrev,
  onNext,
  onClose,
}: VMDControlsProps) {
  return (
    <>
      {/* 상단 정보 바 */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 px-6 py-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-100">
          <span className="text-sm font-medium text-gray-900">{fixtureName}</span>
          <span className="text-sm text-gray-400">|</span>
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {totalCount}
          </span>
        </div>
      </div>

      {/* 좌측 화살표 */}
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className={`absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
          currentIndex === 0
            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
            : 'bg-white shadow-lg hover:shadow-xl hover:scale-105 text-gray-700 hover:text-gray-900 border border-gray-100'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 우측 화살표 */}
      <button
        onClick={onNext}
        disabled={currentIndex === totalCount - 1}
        className={`absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
          currentIndex === totalCount - 1
            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
            : 'bg-white shadow-lg hover:shadow-xl hover:scale-105 text-gray-700 hover:text-gray-900 border border-gray-100'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-20 right-6 z-20 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200 border border-gray-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 키보드 단축키 힌트 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 px-4 py-2 bg-black/5 rounded-full text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white rounded shadow-sm border text-gray-600">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-white rounded shadow-sm border text-gray-600">→</kbd>
            이동
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white rounded shadow-sm border text-gray-600">ESC</kbd>
            닫기
          </span>
        </div>
      </div>
    </>
  )
}
