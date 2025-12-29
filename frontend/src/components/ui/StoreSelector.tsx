import { useRef, useState } from 'react'
import { getStoreList, getStoreById } from '../../data/stores'
import { useSceneStore } from '../../store'
import type { Store, StoreListItem } from '../../types/store'

interface StoreSelectorProps {
  onStoreSelect?: (storeId: string) => void
}

export function StoreSelector({ onStoreSelect }: StoreSelectorProps) {
  const stores = getStoreList()
  const { loadStore, currentStore } = useSceneStore()
  const [uploadedStores, setUploadedStores] = useState<Store[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSelect = (storeId: string) => {
    // 먼저 업로드된 매장에서 찾기
    const uploadedStore = uploadedStores.find(s => s.meta.id === storeId)
    if (uploadedStore) {
      loadStore(uploadedStore)
      onStoreSelect?.(storeId)
      return
    }

    // 기본 매장에서 찾기
    const store = getStoreById(storeId)
    if (store) {
      loadStore(store)
      onStoreSelect?.(storeId)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const storeData = JSON.parse(content) as Store

        // 기본 유효성 검사
        if (!storeData.meta?.id || !storeData.meta?.name) {
          throw new Error('매장 ID와 이름이 필요합니다.')
        }
        if (!storeData.floorPlan?.widthMeters || !storeData.floorPlan?.depthMeters) {
          throw new Error('평면도 정보(floorPlan)가 필요합니다.')
        }
        if (!Array.isArray(storeData.fixtures)) {
          throw new Error('매대(fixtures) 배열이 필요합니다.')
        }

        // 중복 ID 체크
        const existingIds = [...stores.map(s => s.id), ...uploadedStores.map(s => s.meta.id)]
        if (existingIds.includes(storeData.meta.id)) {
          // 같은 ID면 업데이트
          setUploadedStores(prev =>
            prev.map(s => s.meta.id === storeData.meta.id ? storeData : s)
          )
        } else {
          setUploadedStores(prev => [...prev, storeData])
        }

        // 바로 해당 매장으로 이동
        loadStore(storeData)
        onStoreSelect?.(storeData.meta.id)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'JSON 파싱 오류')
      }
    }
    reader.readAsText(file)

    // 파일 입력 초기화 (같은 파일 다시 선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 전체 매장 목록 (기본 + 업로드된)
  const allStores: StoreListItem[] = [
    ...stores,
    ...uploadedStores.map(s => ({
      id: s.meta.id,
      name: s.meta.name,
      address: s.meta.address,
      thumbnail: s.meta.thumbnail,
      fixtureCount: s.fixtures.length,
      updatedAt: s.meta.updatedAt,
    }))
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Planogram</h1>
          <p className="text-lg text-gray-500">플래노그램 관리 시스템</p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* 매장 목록 */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              isSelected={currentStore?.meta.id === store.id}
              isUploaded={uploadedStores.some(s => s.meta.id === store.id)}
              onClick={() => handleSelect(store.id)}
            />
          ))}

          {/* JSON 파일 업로드 카드 */}
          <label className="group bg-white/50 border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[220px] hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <span className="text-gray-500 group-hover:text-blue-600 font-medium transition-colors">
              JSON 파일 업로드
            </span>
            <span className="text-xs text-gray-400 mt-1">
              매장 데이터 파일 (.json)
            </span>
          </label>
        </div>

        {/* 도움말 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            매장 JSON 파일을 업로드하여 새 매장을 추가할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}

interface StoreCardProps {
  store: StoreListItem
  isSelected?: boolean
  isUploaded?: boolean
  onClick: () => void
}

function StoreCard({ store, isSelected, isUploaded, onClick }: StoreCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all p-6 text-left w-full relative ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
    >
      {/* 업로드 배지 */}
      {isUploaded && (
        <div className="absolute top-4 left-4 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          업로드됨
        </div>
      )}

      {/* 썸네일 영역 */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-36 mb-5 flex items-center justify-center overflow-hidden">
        {store.thumbnail ? (
          <img
            src={store.thumbnail}
            alt={store.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        )}
      </div>

      {/* 매장 정보 */}
      <h3 className="font-bold text-lg text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">
        {store.name}
      </h3>
      {store.address && (
        <p className="text-sm text-gray-500 mb-3">{store.address}</p>
      )}

      {/* 통계 */}
      <div className="flex gap-5 text-sm">
        <div className="flex items-center gap-1.5 text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <span>{store.fixtureCount} 매대</span>
        </div>
      </div>

      {/* 선택 표시 */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  )
}
