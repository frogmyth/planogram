import { create } from 'zustand'

interface SceneState {
  // 선택된 객체
  selectedObjectId: string | null
  setSelectedObject: (id: string | null) => void

  // 매대 목록 (임시)
  fixtures: FixtureInstance[]
  addFixture: (fixture: FixtureInstance) => void
  removeFixture: (id: string) => void
  updateFixture: (id: string, updates: Partial<FixtureInstance>) => void
}

interface FixtureInstance {
  id: string
  templateId: string
  position: { x: number; y: number; z: number }
  rotation: number
  name: string
}

export const useSceneStore = create<SceneState>((set) => ({
  // 선택된 객체
  selectedObjectId: null,
  setSelectedObject: (id) => set({ selectedObjectId: id }),

  // 매대 목록
  fixtures: [],
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
