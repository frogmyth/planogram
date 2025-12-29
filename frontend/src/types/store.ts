// ============================================
// 플래노그램 타입 정의
// 좌표계: Three.js Y-up (X=동서, Y=높이, Z=남북)
// 단위: 미터 (실제 크기 100%)
// ============================================

// === 기본 좌표 타입 ===

/** 2D 좌표 (평면도용) */
export interface Point2D {
  x: number // 동서 방향 (오른쪽 +)
  z: number // 남북 방향 (앞쪽 +)
}

/** 3D 좌표 */
export interface Point3D {
  x: number // 동서 방향 (오른쪽 +)
  y: number // 높이 (위쪽 +)
  z: number // 남북 방향 (앞쪽 +)
}

/** 3D 크기 */
export interface Dimensions3D {
  width: number  // X축 크기 (미터)
  height: number // Y축 크기 (미터)
  depth: number  // Z축 크기 (미터)
}

// === 매장 구조물 ===

/** 벽면 정의 */
export interface Wall {
  id: string
  start: Point2D // 시작점 (미터)
  end: Point2D   // 끝점 (미터)
  height: number // 벽 높이 (미터)
  thickness: number // 벽 두께 (미터)
}

/** 기둥 정의 */
export interface Column {
  id: string
  position: Point2D  // 중심 위치 (미터)
  width: number      // X축 크기 (미터)
  depth: number      // Z축 크기 (미터)
  height: number     // 높이 (미터)
}

// === 매대 (Fixture) ===

/** 매대 유형 */
export type FixtureType =
  | 'gondola'      // 곤돌라 (양면 선반)
  | 'wall-shelf'   // 벽면 선반
  | 'endcap'       // 엔드캡 (통로 끝)
  | 'island'       // 아일랜드 (독립형)
  | 'refrigerator' // 냉장 진열대
  | 'freezer'      // 냉동 진열대
  | 'checkout'     // 계산대
  | 'promotional'  // 프로모션 진열대

/** 매대 스타일 (외관) */
export type FixtureStyle =
  | 'standard'     // 일반 매대 (높은 선반, 5-6단)
  | 'open'         // 오픈형 매대 (낮은 매대, 상품을 위에 올려놓음)
  | 'chilled'      // 냉장 매대 (유리문 또는 오픈형)
  | 'frozen'       // 냉동 매대 (유리문)

/** 매대 회전 (15도 단위, 0-345) */
export type FixtureRotation = number

/** 매대 구조 설정 */
export interface FixtureStructure {
  shelfCount: number      // 선반 개수
  shelfHeights: number[]  // 각 선반의 높이 (바닥부터, 미터)
  baseHeight: number      // 베이스(받침대) 높이 (미터)
}

/** 매대 정의 */
export interface Fixture {
  id: string
  name: string

  // 위치 및 크기 (모두 미터 단위)
  position: Point3D           // 중심 위치
  rotation: FixtureRotation   // 회전 각도
  dimensions: Dimensions3D    // 크기

  // 매대 속성
  type: FixtureType
  style?: FixtureStyle        // 매대 스타일 (외관, 없으면 type에서 추론)
  structure: FixtureStructure

  // 제품군 연결
  categoryId: string | null   // 할당된 제품군 ID
}

// === 제품군 (Product Category) ===

/** 제품군 정의 */
export interface ProductCategory {
  id: string
  name: string
  color: string           // 구역 표시 색상 (hex)
  isRefrigerated: boolean // 냉장/냉동 필요 여부
  parentId?: string       // 상위 카테고리 ID (대분류-중분류 구조용)
}

// === 매장 (Store) ===

/** 평면도 정보 */
export interface FloorPlan {
  imageUrl: string      // 평면도 이미지 URL
  widthMeters: number   // 실제 가로 크기 (미터)
  depthMeters: number   // 실제 세로 크기 (미터)
}

/** 카메라 설정 */
export interface CameraConfig {
  storeViewHeight: number      // 매장 전체 뷰 높이 (미터)
  zoneViewMinHeight: number    // 구역 뷰 최소 높이 (미터)
  zoneViewMaxHeight: number    // 구역 뷰 최대 높이 (미터)
  fixtureViewDistance: number  // 매대 정면 뷰 거리 (미터)
}

/** 매장 메타데이터 */
export interface StoreMeta {
  id: string
  name: string
  address?: string
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

/** 매장 전체 데이터 */
export interface Store {
  meta: StoreMeta

  // 평면도 기반 매장 정보
  floorPlan: FloorPlan

  // 구조물
  walls: Wall[]
  columns: Column[]

  // 매대 목록
  fixtures: Fixture[]

  // 제품군 정의
  productCategories: ProductCategory[]

  // 카메라 설정
  cameraConfig: CameraConfig
}

// === 매장 목록용 ===

/** 매장 목록 아이템 (간략 정보) */
export interface StoreListItem {
  id: string
  name: string
  address?: string
  thumbnail?: string
  fixtureCount: number
  updatedAt: string
}

// === 기본값 상수 ===

/** 기본 카메라 설정 */
export const DEFAULT_CAMERA_CONFIG: CameraConfig = {
  storeViewHeight: 25,
  zoneViewMinHeight: 8,
  zoneViewMaxHeight: 15,
  fixtureViewDistance: 3,
}

/** 기본 매대 구조 (곤돌라) */
export const DEFAULT_GONDOLA_STRUCTURE: FixtureStructure = {
  shelfCount: 5,
  shelfHeights: [0.3, 0.6, 0.9, 1.2, 1.5],
  baseHeight: 0.15,
}

/** 매대 유형별 기본 크기 (미터) */
export const DEFAULT_FIXTURE_DIMENSIONS: Record<FixtureType, Dimensions3D> = {
  'gondola': { width: 1.2, height: 1.8, depth: 0.9 },
  'wall-shelf': { width: 1.2, height: 2.0, depth: 0.5 },
  'endcap': { width: 1.2, height: 1.8, depth: 0.6 },
  'island': { width: 1.5, height: 1.0, depth: 1.5 },
  'refrigerator': { width: 1.5, height: 2.0, depth: 0.8 },
  'freezer': { width: 2.0, height: 1.0, depth: 1.2 },
  'checkout': { width: 1.0, height: 1.0, depth: 0.6 },
  'promotional': { width: 1.2, height: 1.2, depth: 0.6 },
}

/** 매대 스타일별 기본 구조 */
export const DEFAULT_STYLE_STRUCTURES: Record<FixtureStyle, FixtureStructure> = {
  'standard': {
    shelfCount: 5,
    shelfHeights: [0.3, 0.6, 0.9, 1.2, 1.5],
    baseHeight: 0.15,
  },
  'open': {
    shelfCount: 2,
    shelfHeights: [0.4, 0.7],
    baseHeight: 0.1,
  },
  'chilled': {
    shelfCount: 4,
    shelfHeights: [0.4, 0.8, 1.2, 1.6],
    baseHeight: 0.2,
  },
  'frozen': {
    shelfCount: 3,
    shelfHeights: [0.3, 0.6, 0.9],
    baseHeight: 0.3,
  },
}

/** 매대 스타일별 색상 */
export const FIXTURE_STYLE_COLORS: Record<FixtureStyle, { frame: string; shelf: string; accent: string }> = {
  'standard': {
    frame: '#8B7355',   // 나무색
    shelf: '#f5f5f5',   // 흰색
    accent: '#a3a3a3',  // 회색
  },
  'open': {
    frame: '#696969',   // 다크 그레이
    shelf: '#d4d4d4',   // 밝은 회색
    accent: '#525252',  // 진한 회색
  },
  'chilled': {
    frame: '#60a5fa',   // 밝은 파랑
    shelf: '#dbeafe',   // 연한 파랑
    accent: '#3b82f6',  // 파랑
  },
  'frozen': {
    frame: '#93c5fd',   // 더 밝은 파랑
    shelf: '#e0f2fe',   // 아주 연한 파랑
    accent: '#2563eb',  // 진한 파랑
  },
}

/** 스타일 라벨 (한글) */
export const FIXTURE_STYLE_LABELS: Record<FixtureStyle, string> = {
  'standard': '일반 매대',
  'open': '오픈형 매대',
  'chilled': '냉장 매대',
  'frozen': '냉동 매대',
}
