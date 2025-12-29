import { useSceneStore } from '../../store/useSceneStore'

interface NavigationBreadcrumbProps {
  storeName?: string
}

export function NavigationBreadcrumb({ storeName = '매장' }: NavigationBreadcrumbProps) {
  const {
    navigationLevel,
    selectedFixtureId,
    fixtures,
    exitVMDMode,
  } = useSceneStore()

  const selectedFixture = fixtures.find((f) => f.id === selectedFixtureId)

  const handleStoreClick = () => {
    if (navigationLevel === 'fixture') {
      exitVMDMode()
    }
  }

  return (
    <nav className="flex items-center gap-3 text-base">
      {/* 매장 */}
      <button
        onClick={handleStoreClick}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all font-bold ${
          navigationLevel === 'store'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span className="font-bold">{storeName}</span>
      </button>

      {/* 매대 */}
      {navigationLevel === 'fixture' && selectedFixture && (
        <>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <span className="font-bold">{selectedFixture.name}</span>
          </span>
        </>
      )}

      {/* 네비게이션 힌트 */}
      {navigationLevel === 'store' && (
        <span className="ml-3 text-sm text-gray-400 font-medium">
          매대를 클릭하세요
        </span>
      )}
    </nav>
  )
}
