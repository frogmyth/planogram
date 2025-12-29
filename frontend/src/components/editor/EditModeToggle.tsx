// ============================================
// 편집 모드 토글 버튼
// 뷰 모드와 편집 모드를 전환하는 버튼
// W = 이동, E = 회전 (3ds Max 스타일)
// ============================================

import { useSceneStore } from '../../store/useSceneStore'

export function EditModeToggle() {
  const { editMode, setEditMode, transformMode, setTransformMode, navigationLevel } = useSceneStore()

  // 매장 뷰가 아니면 숨김
  if (navigationLevel !== 'store') return null

  const isEditMode = editMode === 'edit'
  const isMoveMode = transformMode === 'move'
  const isRotateMode = transformMode === 'rotate'

  return (
    <div className="absolute left-4 top-20 z-20">
      {/* 편집 모드 토글 */}
      <button
        onClick={() => setEditMode(isEditMode ? 'view' : 'edit')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all ${
          isEditMode
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
        }`}
      >
        {isEditMode ? (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="font-medium">편집 중</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="font-medium">편집 모드</span>
          </>
        )}
      </button>

      {/* 변환 도구 선택 (편집 모드에서만) */}
      {isEditMode && (
        <div className="mt-2 flex gap-1">
          {/* 이동 모드 (W) */}
          <button
            onClick={() => setTransformMode('move')}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isMoveMode
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
            title="이동 모드 (W)"
          >
            {/* 이동 아이콘 */}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>W</span>
          </button>

          {/* 회전 모드 (E) */}
          <button
            onClick={() => setTransformMode('rotate')}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isRotateMode
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
            title="회전 모드 (E)"
          >
            {/* 회전 아이콘 */}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>E</span>
          </button>
        </div>
      )}

      {/* 편집 모드 안내 */}
      {isEditMode && (
        <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
          <p className="font-medium mb-1">
            {isMoveMode ? '이동 모드' : '회전 모드'} (15° 단위)
          </p>
          <p>매대 선택 후 기즈모를 드래그</p>
          <p className="text-blue-500 mt-1">W: 이동 | E: 회전 | ESC: 종료</p>
        </div>
      )}
    </div>
  )
}
