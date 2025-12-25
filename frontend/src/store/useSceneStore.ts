import { create } from 'zustand'

export interface FixtureInstance {
  id: string
  name: string
  zoneId: string
  position: { x: number; y: number; z: number }
  rotation: number
  width: number
  height: number
  depth: number
  shelfCount: number
}

export interface Zone {
  id: string
  name: string
  color: string
  bounds: {
    minX: number
    minZ: number
    maxX: number
    maxZ: number
  }
}

// 네비게이션 레벨
export type NavigationLevel = 'store' | 'zone' | 'fixture'

interface SceneState {
  // 네비게이션 레벨
  navigationLevel: NavigationLevel
  setNavigationLevel: (level: NavigationLevel) => void

  // 선택된 구역
  selectedZoneId: string | null
  setSelectedZone: (id: string | null) => void
  enterZoneView: (zoneId: string) => void
  exitZoneView: () => void

  // 구역 목록
  zones: Zone[]
  setZones: (zones: Zone[]) => void

  // 선택된 매대
  selectedFixtureId: string | null
  setSelectedFixture: (id: string | null) => void

  // VMD 모드 (정면뷰)
  isVMDMode: boolean
  vmdFixtureIndex: number
  enterVMDMode: (fixtureId: string) => void
  exitVMDMode: () => void
  navigateVMD: (direction: 'prev' | 'next') => void

  // 매대 목록
  fixtures: FixtureInstance[]
  setFixtures: (fixtures: FixtureInstance[]) => void
  addFixture: (fixture: FixtureInstance) => void
  removeFixture: (id: string) => void
  updateFixture: (id: string, updates: Partial<FixtureInstance>) => void

  // 헬퍼 함수
  getFixturesByZone: (zoneId: string) => FixtureInstance[]
  getZoneFixtures: () => FixtureInstance[]
  getAdjacentFixtures: (fixtureId: string) => { prev: FixtureInstance | null; next: FixtureInstance | null }
}

export const useSceneStore = create<SceneState>((set, get) => ({
  // 네비게이션 레벨
  navigationLevel: 'store',
  setNavigationLevel: (level) => set({ navigationLevel: level }),

  // 선택된 구역
  selectedZoneId: null,
  setSelectedZone: (id) => set({ selectedZoneId: id }),
  enterZoneView: (zoneId) => {
    set({
      navigationLevel: 'zone',
      selectedZoneId: zoneId,
      selectedFixtureId: null,
      isVMDMode: false,
    })
  },
  exitZoneView: () => {
    set({
      navigationLevel: 'store',
      selectedZoneId: null,
      selectedFixtureId: null,
      isVMDMode: false,
    })
  },

  // 구역 목록
  zones: [],
  setZones: (zones) => set({ zones }),

  // 선택된 매대
  selectedFixtureId: null,
  setSelectedFixture: (id) => set({ selectedFixtureId: id }),

  // VMD 모드
  isVMDMode: false,
  vmdFixtureIndex: 0,
  enterVMDMode: (fixtureId) => {
    const { fixtures, selectedZoneId } = get()
    // 현재 구역 내 매대만 필터링
    const zoneFixtures = selectedZoneId
      ? fixtures.filter((f) => f.zoneId === selectedZoneId)
      : fixtures
    const index = zoneFixtures.findIndex((f) => f.id === fixtureId)
    if (index !== -1) {
      set({
        navigationLevel: 'fixture',
        isVMDMode: true,
        vmdFixtureIndex: index,
        selectedFixtureId: fixtureId,
      })
    }
  },
  exitVMDMode: () => {
    const { selectedZoneId } = get()
    set({
      navigationLevel: selectedZoneId ? 'zone' : 'store',
      isVMDMode: false,
      selectedFixtureId: null,
    })
  },
  navigateVMD: (direction) => {
    const { fixtures, vmdFixtureIndex, selectedZoneId } = get()
    // 현재 구역 내 매대만 대상으로 네비게이션
    const zoneFixtures = selectedZoneId
      ? fixtures.filter((f) => f.zoneId === selectedZoneId)
      : fixtures
    let newIndex = vmdFixtureIndex
    if (direction === 'prev' && vmdFixtureIndex > 0) {
      newIndex = vmdFixtureIndex - 1
    } else if (direction === 'next' && vmdFixtureIndex < zoneFixtures.length - 1) {
      newIndex = vmdFixtureIndex + 1
    }
    if (newIndex !== vmdFixtureIndex && zoneFixtures[newIndex]) {
      set({
        vmdFixtureIndex: newIndex,
        selectedFixtureId: zoneFixtures[newIndex].id,
      })
    }
  },

  // 매대 목록
  fixtures: [],
  setFixtures: (fixtures) => set({ fixtures }),
  addFixture: (fixture) =>
    set((state) => ({ fixtures: [...state.fixtures, fixture] })),
  removeFixture: (id) =>
    set((state) => ({ fixtures: state.fixtures.filter((f) => f.id !== id) })),
  updateFixture: (id, updates) =>
    set((state) => ({
      fixtures: state.fixtures.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    })),

  // 헬퍼 함수
  getFixturesByZone: (zoneId) => {
    const { fixtures } = get()
    return fixtures.filter((f) => f.zoneId === zoneId)
  },
  getZoneFixtures: () => {
    const { fixtures, selectedZoneId } = get()
    return selectedZoneId
      ? fixtures.filter((f) => f.zoneId === selectedZoneId)
      : fixtures
  },
  getAdjacentFixtures: (fixtureId) => {
    const { fixtures, selectedZoneId } = get()
    const zoneFixtures = selectedZoneId
      ? fixtures.filter((f) => f.zoneId === selectedZoneId)
      : fixtures
    const index = zoneFixtures.findIndex((f) => f.id === fixtureId)
    return {
      prev: index > 0 ? zoneFixtures[index - 1] : null,
      next: index < zoneFixtures.length - 1 ? zoneFixtures[index + 1] : null,
    }
  },
}))
