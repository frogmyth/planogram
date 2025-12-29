import { create } from 'zustand'
import type {
  Store,
  Fixture,
  ProductCategory,
  CameraConfig,
  FixtureStyle,
  Point3D,
  Dimensions3D,
  FixtureStructure,
} from '../types/store'

// ============================================
// 플래노그램 씬 스토어
// 좌표계: Three.js Y-up (X=동서, Y=높이, Z=남북)
// 단위: 미터 (실제 크기 100%)
// ============================================

// 네비게이션 레벨
export type NavigationLevel = 'select' | 'store' | 'fixture'

// 편집 모드
export type EditMode = 'view' | 'edit'

// 변환 모드 (3ds Max 스타일)
export type TransformMode = 'move' | 'rotate'

// 씬 상태 인터페이스
interface SceneState {
  // === 현재 매장 ===
  currentStore: Store | null
  loadStore: (store: Store) => void
  clearStore: () => void

  // === 네비게이션 ===
  navigationLevel: NavigationLevel
  setNavigationLevel: (level: NavigationLevel) => void

  // === 편집 모드 ===
  editMode: EditMode
  setEditMode: (mode: EditMode) => void

  // === 변환 모드 (W=이동, E=회전) ===
  transformMode: TransformMode
  setTransformMode: (mode: TransformMode) => void

  // === 선택된 매대 ===
  selectedFixtureId: string | null
  setSelectedFixture: (id: string | null) => void

  // === VMD 모드 (정면뷰) ===
  isVMDMode: boolean
  vmdFixtureIndex: number
  enterVMDMode: (fixtureId: string) => void
  exitVMDMode: () => void
  navigateVMD: (direction: 'prev' | 'next') => void

  // === 매대 드래그 ===
  isDragging: boolean
  draggedFixtureId: string | null
  startDragging: (fixtureId: string) => void
  stopDragging: () => void
  moveFixture: (fixtureId: string, position: Point3D) => void

  // === 매대 관리 ===
  fixtures: Fixture[]
  setFixtures: (fixtures: Fixture[]) => void
  addFixture: (fixture: Fixture) => void
  removeFixture: (id: string) => void
  updateFixture: (id: string, updates: Partial<Fixture>) => void

  // === 매대 편집 함수 ===
  updateFixturePosition: (id: string, position: Point3D) => void
  updateFixtureDimensions: (id: string, dimensions: Dimensions3D) => void
  updateFixtureStyle: (id: string, style: FixtureStyle) => void
  updateFixtureStructure: (id: string, structure: FixtureStructure) => void
  rotateFixture: (id: string, degrees: 90 | -90) => void
  rotateFixtureTo: (id: string, rotation: number) => void

  // === 제품군 관리 ===
  productCategories: ProductCategory[]
  setProductCategories: (categories: ProductCategory[]) => void

  // === 헬퍼 함수 ===
  getFixtureById: (id: string) => Fixture | undefined
  getFixturesByCategory: (categoryId: string) => Fixture[]
  getAdjacentFixtures: (fixtureId: string) => { prev: Fixture | null; next: Fixture | null }
  getSelectedFixture: () => Fixture | undefined

  // === 카메라 설정 ===
  getCameraConfig: () => CameraConfig
  getStoreCenter: () => { x: number; z: number }
  getStoreDimensions: () => { width: number; depth: number }
}

// 기본 카메라 설정
const DEFAULT_CAMERA: CameraConfig = {
  storeViewHeight: 25,
  zoneViewMinHeight: 8,
  zoneViewMaxHeight: 15,
  fixtureViewDistance: 3,
}

export const useSceneStore = create<SceneState>((set, get) => ({
  // === 현재 매장 ===
  currentStore: null,

  loadStore: (store: Store) => {
    set({
      currentStore: store,
      fixtures: store.fixtures,
      productCategories: store.productCategories,
      navigationLevel: 'store',
      selectedFixtureId: null,
      isVMDMode: false,
      vmdFixtureIndex: 0,
      editMode: 'view',
      transformMode: 'move',
      isDragging: false,
      draggedFixtureId: null,
    })
  },

  clearStore: () => {
    set({
      currentStore: null,
      fixtures: [],
      productCategories: [],
      navigationLevel: 'select',
      selectedFixtureId: null,
      isVMDMode: false,
      vmdFixtureIndex: 0,
      editMode: 'view',
      transformMode: 'move',
      isDragging: false,
      draggedFixtureId: null,
    })
  },

  // === 네비게이션 ===
  navigationLevel: 'select',
  setNavigationLevel: (level) => set({ navigationLevel: level }),

  // === 편집 모드 ===
  editMode: 'view',
  setEditMode: (mode) => set({ editMode: mode }),

  // === 변환 모드 ===
  transformMode: 'move',
  setTransformMode: (mode) => set({ transformMode: mode }),

  // === 선택된 매대 ===
  selectedFixtureId: null,
  setSelectedFixture: (id) => set({ selectedFixtureId: id }),

  // === VMD 모드 ===
  isVMDMode: false,
  vmdFixtureIndex: 0,

  enterVMDMode: (fixtureId) => {
    const { fixtures } = get()
    const index = fixtures.findIndex((f) => f.id === fixtureId)
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
    set({
      navigationLevel: 'store',
      isVMDMode: false,
      selectedFixtureId: null,
    })
  },

  navigateVMD: (direction) => {
    const { fixtures, vmdFixtureIndex } = get()
    let newIndex = vmdFixtureIndex

    if (direction === 'prev' && vmdFixtureIndex > 0) {
      newIndex = vmdFixtureIndex - 1
    } else if (direction === 'next' && vmdFixtureIndex < fixtures.length - 1) {
      newIndex = vmdFixtureIndex + 1
    }

    if (newIndex !== vmdFixtureIndex && fixtures[newIndex]) {
      set({
        vmdFixtureIndex: newIndex,
        selectedFixtureId: fixtures[newIndex].id,
      })
    }
  },

  // === 매대 드래그 ===
  isDragging: false,
  draggedFixtureId: null,

  startDragging: (fixtureId) => {
    set({
      isDragging: true,
      draggedFixtureId: fixtureId,
      selectedFixtureId: fixtureId,
    })
  },

  stopDragging: () => {
    set({
      isDragging: false,
      draggedFixtureId: null,
    })
  },

  moveFixture: (fixtureId, position) => {
    set((state) => ({
      fixtures: state.fixtures.map((f) =>
        f.id === fixtureId ? { ...f, position } : f
      ),
    }))
  },

  // === 매대 관리 ===
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

  // === 매대 편집 함수 ===
  updateFixturePosition: (id, position) => {
    set((state) => ({
      fixtures: state.fixtures.map((f) =>
        f.id === id ? { ...f, position } : f
      ),
    }))
  },

  updateFixtureDimensions: (id, dimensions) => {
    set((state) => ({
      fixtures: state.fixtures.map((f) =>
        f.id === id ? { ...f, dimensions } : f
      ),
    }))
  },

  updateFixtureStyle: (id, style) => {
    set((state) => ({
      fixtures: state.fixtures.map((f) =>
        f.id === id ? { ...f, style } : f
      ),
    }))
  },

  updateFixtureStructure: (id, structure) => {
    set((state) => ({
      fixtures: state.fixtures.map((f) =>
        f.id === id ? { ...f, structure } : f
      ),
    }))
  },

  rotateFixture: (id, degrees) => {
    set((state) => ({
      fixtures: state.fixtures.map((f) => {
        if (f.id !== id) return f
        const currentRotation = f.rotation
        let newRotation = (currentRotation + degrees) % 360
        if (newRotation < 0) newRotation += 360
        return { ...f, rotation: newRotation as 0 | 90 | 180 | 270 }
      }),
    }))
  },

  rotateFixtureTo: (id, rotation) => {
    set((state) => ({
      fixtures: state.fixtures.map((f) => {
        if (f.id !== id) return f
        // 15도 단위로 스냅
        let snappedRotation = Math.round(rotation / 15) * 15
        // 0-360 범위로 정규화
        snappedRotation = ((snappedRotation % 360) + 360) % 360
        return { ...f, rotation: snappedRotation as number }
      }),
    }))
  },

  // === 제품군 관리 ===
  productCategories: [],
  setProductCategories: (categories) => set({ productCategories: categories }),

  // === 헬퍼 함수 ===
  getFixtureById: (id) => {
    const { fixtures } = get()
    return fixtures.find((f) => f.id === id)
  },

  getFixturesByCategory: (categoryId) => {
    const { fixtures } = get()
    return fixtures.filter((f) => f.categoryId === categoryId)
  },

  getAdjacentFixtures: (fixtureId) => {
    const { fixtures } = get()
    const index = fixtures.findIndex((f) => f.id === fixtureId)
    return {
      prev: index > 0 ? fixtures[index - 1] : null,
      next: index < fixtures.length - 1 ? fixtures[index + 1] : null,
    }
  },

  getSelectedFixture: () => {
    const { fixtures, selectedFixtureId } = get()
    if (!selectedFixtureId) return undefined
    return fixtures.find((f) => f.id === selectedFixtureId)
  },

  // === 카메라 설정 ===
  getCameraConfig: () => {
    const { currentStore } = get()
    return currentStore?.cameraConfig || DEFAULT_CAMERA
  },

  getStoreCenter: () => {
    const { currentStore } = get()
    if (!currentStore) return { x: 0, z: 0 }
    return {
      x: currentStore.floorPlan.widthMeters / 2,
      z: currentStore.floorPlan.depthMeters / 2,
    }
  },

  getStoreDimensions: () => {
    const { currentStore } = get()
    if (!currentStore) return { width: 20, depth: 20 }
    return {
      width: currentStore.floorPlan.widthMeters,
      depth: currentStore.floorPlan.depthMeters,
    }
  },
}))
