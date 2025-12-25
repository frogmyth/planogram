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

interface SceneState {
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
}

export const useSceneStore = create<SceneState>((set, get) => ({
  // 선택된 매대
  selectedFixtureId: null,
  setSelectedFixture: (id) => set({ selectedFixtureId: id }),

  // VMD 모드
  isVMDMode: false,
  vmdFixtureIndex: 0,
  enterVMDMode: (fixtureId) => {
    const { fixtures } = get()
    const index = fixtures.findIndex((f) => f.id === fixtureId)
    if (index !== -1) {
      set({
        isVMDMode: true,
        vmdFixtureIndex: index,
        selectedFixtureId: fixtureId,
      })
    }
  },
  exitVMDMode: () => set({ isVMDMode: false, selectedFixtureId: null }),
  navigateVMD: (direction) => {
    const { fixtures, vmdFixtureIndex } = get()
    let newIndex = vmdFixtureIndex
    if (direction === 'prev' && vmdFixtureIndex > 0) {
      newIndex = vmdFixtureIndex - 1
    } else if (direction === 'next' && vmdFixtureIndex < fixtures.length - 1) {
      newIndex = vmdFixtureIndex + 1
    }
    if (newIndex !== vmdFixtureIndex) {
      set({
        vmdFixtureIndex: newIndex,
        selectedFixtureId: fixtures[newIndex].id,
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
}))
