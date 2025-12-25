import { create } from 'zustand'

type ViewMode = 'TOP' | 'FRONT' | 'PERSPECTIVE'

interface UIState {
  // 뷰 모드
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void

  // 사이드바 상태
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  toggleLeftSidebar: () => void
  toggleRightSidebar: () => void

  // 로딩 상태
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  // 뷰 모드
  viewMode: 'PERSPECTIVE',
  setViewMode: (mode) => set({ viewMode: mode }),

  // 사이드바 상태
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  toggleLeftSidebar: () => set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
  toggleRightSidebar: () => set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),

  // 로딩 상태
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}))
