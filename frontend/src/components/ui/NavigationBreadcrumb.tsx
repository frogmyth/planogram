import { useSceneStore } from '../../store/useSceneStore'

interface NavigationBreadcrumbProps {
  storeName?: string
}

export function NavigationBreadcrumb({ storeName = '이마트 성수점' }: NavigationBreadcrumbProps) {
  const {
    navigationLevel,
    selectedZoneId,
    selectedFixtureId,
    zones,
    fixtures,
    exitZoneView,
    exitVMDMode,
  } = useSceneStore()

  const selectedZone = zones.find((z) => z.id === selectedZoneId)
  const selectedFixture = fixtures.find((f) => f.id === selectedFixtureId)

  const handleStoreClick = () => {
    if (navigationLevel === 'zone') {
      exitZoneView()
    } else if (navigationLevel === 'fixture') {
      exitVMDMode()
      exitZoneView()
    }
  }

  const handleZoneClick = () => {
    if (navigationLevel === 'fixture') {
      exitVMDMode()
    }
  }

  return (
    <nav className="flex items-center gap-2 text-sm">
      {/* 매장 */}
      <button
        onClick={handleStoreClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
          navigationLevel === 'store'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span className="font-medium">{storeName}</span>
      </button>

      {/* 구역 */}
      {(navigationLevel === 'zone' || navigationLevel === 'fixture') && selectedZone && (
        <>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <button
            onClick={handleZoneClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              navigationLevel === 'zone'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedZone.color }}
            />
            <span className="font-medium">{selectedZone.name}</span>
          </button>
        </>
      )}

      {/* 매대 */}
      {navigationLevel === 'fixture' && selectedFixture && (
        <>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <span className="font-medium">{selectedFixture.name}</span>
          </span>
        </>
      )}

      {/* 네비게이션 레벨 힌트 */}
      {navigationLevel === 'store' && (
        <span className="ml-2 text-xs text-gray-400">
          구역을 클릭하세요
        </span>
      )}
      {navigationLevel === 'zone' && (
        <span className="ml-2 text-xs text-gray-400">
          매대를 클릭하세요
        </span>
      )}
    </nav>
  )
}
