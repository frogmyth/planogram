import type { Fixture } from '../../types/store'

// ============================================
// 거제 아주동 하나로마트 매대 데이터
// 좌표계: Three.js Y-up (X=동서, Y=높이, Z=남북)
// 단위: 미터 (실제 크기 100%)
// 매장 크기: 46.25m (가로) x 20.3m (세로)
// 좌표 원점: 매장 왼쪽 하단 (남서쪽 코너)
// X축: 오른쪽이 +, Z축: 위쪽이 +
// SVG 좌표 변환: X = svgX/80, Z = svgY/101
// ============================================

// 공통 선반 구조
const WALL_SHELF_STRUCTURE = {
  shelfCount: 5,
  shelfHeights: [0.3, 0.6, 0.9, 1.2, 1.5],
  baseHeight: 0.1,
}

const GONDOLA_STRUCTURE = {
  shelfCount: 5,
  shelfHeights: [0.3, 0.6, 0.9, 1.2, 1.5],
  baseHeight: 0.15,
}

const REFRIGERATOR_STRUCTURE = {
  shelfCount: 4,
  shelfHeights: [0.3, 0.6, 0.9, 1.2],
  baseHeight: 0.1,
}

// ============================================
// 벽면 매대 (1-35번)
// 1-18: 북쪽 벽면 (일반)
// 19-20: 북동쪽 코너 (냉장)
// 21-25: 동쪽 벽면 (냉장)
// 26-35: 남쪽 벽면 (냉장)
// ============================================
const wallFixtures: Fixture[] = [
  // === 북쪽 벽면 (1-18번) - 위쪽 벽 ===
  // SVG Y=94.45 → Z=0.94m
  { id: 'fixture-1', name: '매대 1', position: { x: 10.98, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-2', name: '매대 2', position: { x: 12.23, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-3', name: '매대 3', position: { x: 13.48, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-4', name: '매대 4', position: { x: 14.73, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-5', name: '매대 5', position: { x: 15.98, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-6', name: '매대 6', position: { x: 17.23, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-7', name: '매대 7', position: { x: 19.02, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-8', name: '매대 8', position: { x: 20.27, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-9', name: '매대 9', position: { x: 21.52, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-10', name: '매대 10', position: { x: 22.77, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-11', name: '매대 11', position: { x: 24.02, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-12', name: '매대 12', position: { x: 25.27, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-13', name: '매대 13', position: { x: 27.57, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-14', name: '매대 14', position: { x: 28.82, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-15', name: '매대 15', position: { x: 30.07, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-16', name: '매대 16', position: { x: 31.32, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-17', name: '매대 17', position: { x: 32.57, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  { id: 'fixture-18', name: '매대 18', position: { x: 33.82, y: 0, z: 0.94 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },

  // === 북동쪽 코너 (19-20번) - 냉장 ===
  // SVG: (2895.11, 151.85) 및 (3212.32, 151.85) → X=36.19, 40.15, Z=1.50
  { id: 'fixture-19', name: '매대 19 (냉장)', position: { x: 38.17, y: 0, z: 1.50 }, rotation: 0, dimensions: { width: 3.97, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },
  { id: 'fixture-20', name: '매대 20 (냉장)', position: { x: 42.14, y: 0, z: 1.50 }, rotation: 0, dimensions: { width: 3.97, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },

  // === 동쪽 벽면 (21-25번) - 냉장, 세로 방향 ===
  { id: 'fixture-21', name: '매대 21 (냉장)', position: { x: 44.80, y: 0, z: 4.10 }, rotation: 90, dimensions: { width: 3.23, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },
  { id: 'fixture-22', name: '매대 22 (냉장)', position: { x: 44.80, y: 0, z: 6.63 }, rotation: 90, dimensions: { width: 2.51, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },
  { id: 'fixture-23', name: '매대 23 (냉장)', position: { x: 44.80, y: 0, z: 9.14 }, rotation: 90, dimensions: { width: 2.51, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },
  { id: 'fixture-24', name: '매대 24 (냉장)', position: { x: 44.80, y: 0, z: 12.96 }, rotation: 90, dimensions: { width: 2.51, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },
  { id: 'fixture-25', name: '매대 25 (냉장)', position: { x: 44.05, y: 0, z: 17.61 }, rotation: 90, dimensions: { width: 2.51, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },

  // === 남쪽 벽면 (26-35번) - 냉장 ===
  // SVG Y=1890.97 → Z=18.72
  { id: 'fixture-26', name: '매대 26 (냉장)', position: { x: 42.51, y: 0, z: 18.72 }, rotation: 180, dimensions: { width: 1.61, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },
  { id: 'fixture-27', name: '매대 27 (냉장)', position: { x: 40.78, y: 0, z: 18.72 }, rotation: 180, dimensions: { width: 3.12, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },
  { id: 'fixture-28', name: '매대 28 (냉장)', position: { x: 37.62, y: 0, z: 18.72 }, rotation: 180, dimensions: { width: 2.34, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },
  { id: 'fixture-29', name: '매대 29 (냉장)', position: { x: 35.28, y: 0, z: 18.72 }, rotation: 180, dimensions: { width: 2.34, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },
  { id: 'fixture-30', name: '매대 30 (냉장)', position: { x: 32.94, y: 0, z: 18.72 }, rotation: 180, dimensions: { width: 2.34, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },
  { id: 'fixture-31', name: '매대 31 (냉장)', position: { x: 30.61, y: 0, z: 18.72 }, rotation: 180, dimensions: { width: 2.34, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },
  { id: 'fixture-32', name: '매대 32 (냉장)', position: { x: 26.70, y: 0, z: 18.72 }, rotation: 180, dimensions: { width: 4.68, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },
  { id: 'fixture-33', name: '매대 33 (냉장)', position: { x: 22.02, y: 0, z: 18.72 }, rotation: 180, dimensions: { width: 4.68, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },
  { id: 'fixture-34', name: '매대 34 (냉장)', position: { x: 18.14, y: 0, z: 18.72 }, rotation: 180, dimensions: { width: 3.91, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },
  { id: 'fixture-35', name: '매대 35 (냉장)', position: { x: 14.22, y: 0, z: 18.72 }, rotation: 180, dimensions: { width: 3.95, height: 2.0, depth: 0.8 }, type: 'refrigerator', structure: REFRIGERATOR_STRUCTURE, categoryId: null },
]

// ============================================
// 입구/코너 매대 (36-38번)
// ============================================
const entranceFixtures: Fixture[] = [
  // 36번: 입구 근처
  { id: 'fixture-36', name: '매대 36', position: { x: 10.44, y: 0, z: 17.87 }, rotation: 90, dimensions: { width: 2.50, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  // 37번: 왼쪽 하단
  { id: 'fixture-37', name: '매대 37', position: { x: 8.36, y: 0, z: 16.41 }, rotation: 0, dimensions: { width: 1.60, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
  // 38번: 왼쪽 하단
  { id: 'fixture-38', name: '매대 38', position: { x: 3.33, y: 0, z: 16.41 }, rotation: 0, dimensions: { width: 5.75, height: 1.8, depth: 0.5 }, type: 'wall-shelf', structure: WALL_SHELF_STRUCTURE, categoryId: null },
]

// ============================================
// 곤돌라 매대 그룹 1 (39-53, 47-53) - 첫 번째 블록
// SVG: Y=252.17~344.64 → Z=2.50~3.41
// ============================================
const gondolaGroup1: Fixture[] = [
  // 39번: 블록 시작 엔드캡
  { id: 'fixture-39', name: '매대 39', position: { x: 12.93, y: 0, z: 3.48 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },

  // 40-46번: 상단 열
  { id: 'fixture-40', name: '매대 40', position: { x: 14.14, y: 0, z: 2.91 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-41', name: '매대 41', position: { x: 15.39, y: 0, z: 2.91 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-42', name: '매대 42', position: { x: 16.64, y: 0, z: 2.91 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-43', name: '매대 43', position: { x: 17.89, y: 0, z: 2.91 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-44', name: '매대 44', position: { x: 19.14, y: 0, z: 2.91 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-45', name: '매대 45', position: { x: 20.39, y: 0, z: 2.91 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-46', name: '매대 46', position: { x: 21.64, y: 0, z: 2.91 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  // 47-53번: 하단 열
  { id: 'fixture-47', name: '매대 47', position: { x: 14.14, y: 0, z: 3.83 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-48', name: '매대 48', position: { x: 15.39, y: 0, z: 3.83 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-49', name: '매대 49', position: { x: 16.64, y: 0, z: 3.83 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-50', name: '매대 50', position: { x: 17.89, y: 0, z: 3.83 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-51', name: '매대 51', position: { x: 19.14, y: 0, z: 3.83 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-52', name: '매대 52', position: { x: 20.39, y: 0, z: 3.83 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-53', name: '매대 53', position: { x: 21.64, y: 0, z: 3.83 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  // 54번: 블록 끝 엔드캡
  { id: 'fixture-54', name: '매대 54', position: { x: 22.45, y: 0, z: 3.48 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },
]

// ============================================
// 곤돌라 매대 그룹 2 (55-68) - 두 번째 블록
// ============================================
const gondolaGroup2: Fixture[] = [
  // 55번: 블록 시작 엔드캡
  { id: 'fixture-55', name: '매대 55', position: { x: 25.46, y: 0, z: 3.48 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },

  // 56-60번: 상단 열
  { id: 'fixture-56', name: '매대 56', position: { x: 26.70, y: 0, z: 2.91 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-57', name: '매대 57', position: { x: 27.95, y: 0, z: 2.91 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-58', name: '매대 58', position: { x: 29.20, y: 0, z: 2.91 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-59', name: '매대 59', position: { x: 30.45, y: 0, z: 2.91 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-60', name: '매대 60', position: { x: 31.70, y: 0, z: 2.91 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  // 61-65번: 하단 열
  { id: 'fixture-61', name: '매대 61', position: { x: 26.70, y: 0, z: 3.83 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-62', name: '매대 62', position: { x: 27.95, y: 0, z: 3.83 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-63', name: '매대 63', position: { x: 29.20, y: 0, z: 3.83 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-64', name: '매대 64', position: { x: 30.45, y: 0, z: 3.83 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-65', name: '매대 65', position: { x: 31.70, y: 0, z: 3.83 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  // 66-68번: 세로 엔드캡들
  { id: 'fixture-66', name: '매대 66', position: { x: 32.85, y: 0, z: 3.48 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-67', name: '매대 67', position: { x: 34.96, y: 0, z: 3.59 }, rotation: 90, dimensions: { width: 1.54, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-68', name: '매대 68', position: { x: 36.29, y: 0, z: 3.59 }, rotation: 90, dimensions: { width: 1.54, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },
]

// ============================================
// 곤돌라 매대 그룹 3 (69-84) - 세 번째 블록
// SVG: Y=485.95~577.86 → Z=4.81~5.72
// ============================================
const gondolaGroup3: Fixture[] = [
  { id: 'fixture-69', name: '매대 69', position: { x: 12.93, y: 0, z: 5.81 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-70', name: '매대 70', position: { x: 14.14, y: 0, z: 5.23 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-71', name: '매대 71', position: { x: 15.39, y: 0, z: 5.23 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-72', name: '매대 72', position: { x: 16.64, y: 0, z: 5.23 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-73', name: '매대 73', position: { x: 17.89, y: 0, z: 5.23 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-74', name: '매대 74', position: { x: 19.14, y: 0, z: 5.23 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-75', name: '매대 75', position: { x: 20.39, y: 0, z: 5.23 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-76', name: '매대 76', position: { x: 21.64, y: 0, z: 5.23 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-77', name: '매대 77', position: { x: 14.14, y: 0, z: 6.15 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-78', name: '매대 78', position: { x: 15.39, y: 0, z: 6.15 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-79', name: '매대 79', position: { x: 16.64, y: 0, z: 6.15 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-80', name: '매대 80', position: { x: 17.89, y: 0, z: 6.15 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-81', name: '매대 81', position: { x: 19.14, y: 0, z: 6.15 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-82', name: '매대 82', position: { x: 20.39, y: 0, z: 6.15 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-83', name: '매대 83', position: { x: 21.64, y: 0, z: 6.15 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-84', name: '매대 84', position: { x: 22.45, y: 0, z: 5.81 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },
]

// ============================================
// 곤돌라 매대 그룹 4 (85-102) - 네 번째 블록
// ============================================
const gondolaGroup4: Fixture[] = [
  { id: 'fixture-85', name: '매대 85', position: { x: 25.46, y: 0, z: 5.81 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-86', name: '매대 86', position: { x: 26.51, y: 0, z: 5.23 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-87', name: '매대 87', position: { x: 27.76, y: 0, z: 5.23 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-88', name: '매대 88', position: { x: 29.01, y: 0, z: 5.23 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-89', name: '매대 89', position: { x: 30.26, y: 0, z: 5.23 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-90', name: '매대 90', position: { x: 31.51, y: 0, z: 5.23 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-91', name: '매대 91', position: { x: 32.76, y: 0, z: 5.23 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-92', name: '매대 92', position: { x: 34.01, y: 0, z: 5.23 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-93', name: '매대 93', position: { x: 35.26, y: 0, z: 5.23 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-94', name: '매대 94', position: { x: 26.51, y: 0, z: 6.15 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-95', name: '매대 95', position: { x: 27.76, y: 0, z: 6.15 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-96', name: '매대 96', position: { x: 29.01, y: 0, z: 6.15 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-97', name: '매대 97', position: { x: 30.26, y: 0, z: 6.15 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-98', name: '매대 98', position: { x: 31.51, y: 0, z: 6.15 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-99', name: '매대 99', position: { x: 32.76, y: 0, z: 6.15 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-100', name: '매대 100', position: { x: 34.01, y: 0, z: 6.15 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-101', name: '매대 101', position: { x: 35.26, y: 0, z: 6.15 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-102', name: '매대 102', position: { x: 35.96, y: 0, z: 5.81 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },
]

// ============================================
// 곤돌라 매대 그룹 5 (103-118) - 다섯 번째 블록
// SVG: Y=720.95~814.07 → Z=7.14~8.06
// ============================================
const gondolaGroup5: Fixture[] = [
  { id: 'fixture-103', name: '매대 103', position: { x: 12.93, y: 0, z: 8.13 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-104', name: '매대 104', position: { x: 14.14, y: 0, z: 7.56 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-105', name: '매대 105', position: { x: 15.39, y: 0, z: 7.56 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-106', name: '매대 106', position: { x: 16.64, y: 0, z: 7.56 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-107', name: '매대 107', position: { x: 17.89, y: 0, z: 7.56 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-108', name: '매대 108', position: { x: 19.14, y: 0, z: 7.56 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-109', name: '매대 109', position: { x: 20.39, y: 0, z: 7.56 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-110', name: '매대 110', position: { x: 21.64, y: 0, z: 7.56 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-111', name: '매대 111', position: { x: 14.14, y: 0, z: 8.48 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-112', name: '매대 112', position: { x: 15.39, y: 0, z: 8.48 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-113', name: '매대 113', position: { x: 16.64, y: 0, z: 8.48 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-114', name: '매대 114', position: { x: 17.89, y: 0, z: 8.48 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-115', name: '매대 115', position: { x: 19.14, y: 0, z: 8.48 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-116', name: '매대 116', position: { x: 20.39, y: 0, z: 8.48 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-117', name: '매대 117', position: { x: 21.64, y: 0, z: 8.48 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-118', name: '매대 118', position: { x: 22.45, y: 0, z: 8.13 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },
]

// ============================================
// 곤돌라 매대 그룹 6 (119-136)
// ============================================
const gondolaGroup6: Fixture[] = [
  { id: 'fixture-119', name: '매대 119', position: { x: 25.46, y: 0, z: 8.13 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-120', name: '매대 120', position: { x: 26.51, y: 0, z: 7.56 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-121', name: '매대 121', position: { x: 27.76, y: 0, z: 7.56 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-122', name: '매대 122', position: { x: 29.01, y: 0, z: 7.56 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-123', name: '매대 123', position: { x: 30.26, y: 0, z: 7.56 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-124', name: '매대 124', position: { x: 31.51, y: 0, z: 7.56 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-125', name: '매대 125', position: { x: 32.76, y: 0, z: 7.56 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-126', name: '매대 126', position: { x: 34.01, y: 0, z: 7.56 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-127', name: '매대 127', position: { x: 35.26, y: 0, z: 7.56 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-128', name: '매대 128', position: { x: 26.51, y: 0, z: 8.48 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-129', name: '매대 129', position: { x: 27.76, y: 0, z: 8.48 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-130', name: '매대 130', position: { x: 29.01, y: 0, z: 8.48 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-131', name: '매대 131', position: { x: 30.26, y: 0, z: 8.48 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-132', name: '매대 132', position: { x: 31.51, y: 0, z: 8.48 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-133', name: '매대 133', position: { x: 32.76, y: 0, z: 8.48 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-134', name: '매대 134', position: { x: 34.01, y: 0, z: 8.48 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-135', name: '매대 135', position: { x: 35.26, y: 0, z: 8.48 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-136', name: '매대 136', position: { x: 35.96, y: 0, z: 8.13 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },
]

// ============================================
// 곤돌라 매대 그룹 7 (137-152) - 기둥 근처 블록
// SVG: Y=957.20~1050.32 → Z=9.48~10.40
// ============================================
const gondolaGroup7: Fixture[] = [
  { id: 'fixture-137', name: '매대 137', position: { x: 12.93, y: 0, z: 10.46 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-138', name: '매대 138', position: { x: 14.14, y: 0, z: 9.89 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-139', name: '매대 139', position: { x: 15.39, y: 0, z: 9.89 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-140', name: '매대 140', position: { x: 16.64, y: 0, z: 9.89 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-141', name: '매대 141', position: { x: 17.89, y: 0, z: 9.89 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-142', name: '매대 142', position: { x: 19.14, y: 0, z: 9.89 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-143', name: '매대 143', position: { x: 20.39, y: 0, z: 9.89 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-144', name: '매대 144', position: { x: 21.64, y: 0, z: 9.89 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-145', name: '매대 145', position: { x: 14.14, y: 0, z: 10.81 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-146', name: '매대 146', position: { x: 15.39, y: 0, z: 10.81 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-147', name: '매대 147', position: { x: 16.64, y: 0, z: 10.81 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-148', name: '매대 148', position: { x: 17.89, y: 0, z: 10.81 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-149', name: '매대 149', position: { x: 19.14, y: 0, z: 10.81 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-150', name: '매대 150', position: { x: 20.39, y: 0, z: 10.81 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-151', name: '매대 151', position: { x: 21.64, y: 0, z: 10.81 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-152', name: '매대 152', position: { x: 22.45, y: 0, z: 10.46 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },
]

// ============================================
// 곤돌라 매대 그룹 8 (153-170)
// ============================================
const gondolaGroup8: Fixture[] = [
  { id: 'fixture-153', name: '매대 153', position: { x: 25.46, y: 0, z: 10.46 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-154', name: '매대 154', position: { x: 26.51, y: 0, z: 9.89 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-155', name: '매대 155', position: { x: 27.76, y: 0, z: 9.89 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-156', name: '매대 156', position: { x: 29.01, y: 0, z: 9.89 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-157', name: '매대 157', position: { x: 30.26, y: 0, z: 9.89 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-158', name: '매대 158', position: { x: 31.51, y: 0, z: 9.89 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-159', name: '매대 159', position: { x: 32.76, y: 0, z: 9.89 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-160', name: '매대 160', position: { x: 34.01, y: 0, z: 9.89 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-161', name: '매대 161', position: { x: 35.26, y: 0, z: 9.89 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-162', name: '매대 162', position: { x: 26.51, y: 0, z: 10.81 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-163', name: '매대 163', position: { x: 27.76, y: 0, z: 10.81 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-164', name: '매대 164', position: { x: 29.01, y: 0, z: 10.81 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-165', name: '매대 165', position: { x: 30.26, y: 0, z: 10.81 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-166', name: '매대 166', position: { x: 31.51, y: 0, z: 10.81 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-167', name: '매대 167', position: { x: 32.76, y: 0, z: 10.81 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-168', name: '매대 168', position: { x: 34.01, y: 0, z: 10.81 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-169', name: '매대 169', position: { x: 35.26, y: 0, z: 10.81 }, rotation: 0, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },

  { id: 'fixture-170', name: '매대 170', position: { x: 35.96, y: 0, z: 10.46 }, rotation: 90, dimensions: { width: 0.96, height: 1.8, depth: 0.5 }, type: 'endcap', structure: GONDOLA_STRUCTURE, categoryId: null },
]

// ============================================
// 오른쪽 벽 근처 세로 매대 (171-178)
// ============================================
const rightSideFixtures: Fixture[] = [
  { id: 'fixture-171', name: '매대 171', position: { x: 40.45, y: 0, z: 4.06 }, rotation: 90, dimensions: { width: 2.62, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-172', name: '매대 172', position: { x: 39.87, y: 0, z: 5.93 }, rotation: 90, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-173', name: '매대 173', position: { x: 40.91, y: 0, z: 5.93 }, rotation: 90, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-174', name: '매대 174', position: { x: 40.45, y: 0, z: 7.37 }, rotation: 90, dimensions: { width: 2.62, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-175', name: '매대 175', position: { x: 40.45, y: 0, z: 9.89 }, rotation: 90, dimensions: { width: 2.62, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-176', name: '매대 176', position: { x: 39.87, y: 0, z: 11.52 }, rotation: 90, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-177', name: '매대 177', position: { x: 40.91, y: 0, z: 11.52 }, rotation: 90, dimensions: { width: 1.25, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-178', name: '매대 178', position: { x: 40.45, y: 0, z: 12.95 }, rotation: 90, dimensions: { width: 2.62, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
]

// ============================================
// 아일랜드/중앙 블록 매대 (179-208)
// 큰 직사각형 블록 형태
// ============================================
const islandFixtures: Fixture[] = [
  // 179-184 블록
  { id: 'fixture-179', name: '매대 179', position: { x: 13.87, y: 0, z: 12.87 }, rotation: 0, dimensions: { width: 2.37, height: 1.8, depth: 0.9 }, type: 'island', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-180', name: '매대 180', position: { x: 12.37, y: 0, z: 14.38 }, rotation: 90, dimensions: { width: 1.87, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-181', name: '매대 181', position: { x: 13.44, y: 0, z: 14.38 }, rotation: 90, dimensions: { width: 1.87, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-182', name: '매대 182', position: { x: 12.37, y: 0, z: 15.80 }, rotation: 90, dimensions: { width: 1.72, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-183', name: '매대 183', position: { x: 13.44, y: 0, z: 15.80 }, rotation: 90, dimensions: { width: 1.72, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-184', name: '매대 184', position: { x: 13.87, y: 0, z: 16.95 }, rotation: 0, dimensions: { width: 2.37, height: 1.8, depth: 0.9 }, type: 'island', structure: GONDOLA_STRUCTURE, categoryId: null },

  // 185-190 블록
  { id: 'fixture-185', name: '매대 185', position: { x: 18.04, y: 0, z: 12.87 }, rotation: 0, dimensions: { width: 2.37, height: 1.8, depth: 0.9 }, type: 'island', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-186', name: '매대 186', position: { x: 16.54, y: 0, z: 14.38 }, rotation: 90, dimensions: { width: 1.87, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-187', name: '매대 187', position: { x: 17.61, y: 0, z: 14.38 }, rotation: 90, dimensions: { width: 1.87, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-188', name: '매대 188', position: { x: 16.54, y: 0, z: 15.80 }, rotation: 90, dimensions: { width: 1.72, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-189', name: '매대 189', position: { x: 17.61, y: 0, z: 15.80 }, rotation: 90, dimensions: { width: 1.72, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-190', name: '매대 190', position: { x: 18.04, y: 0, z: 16.95 }, rotation: 0, dimensions: { width: 2.37, height: 1.8, depth: 0.9 }, type: 'island', structure: GONDOLA_STRUCTURE, categoryId: null },

  // 191-196 블록
  { id: 'fixture-191', name: '매대 191', position: { x: 22.35, y: 0, z: 12.87 }, rotation: 0, dimensions: { width: 2.37, height: 1.8, depth: 0.9 }, type: 'island', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-192', name: '매대 192', position: { x: 20.85, y: 0, z: 14.38 }, rotation: 90, dimensions: { width: 1.87, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-193', name: '매대 193', position: { x: 21.92, y: 0, z: 14.38 }, rotation: 90, dimensions: { width: 1.87, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-194', name: '매대 194', position: { x: 20.85, y: 0, z: 15.80 }, rotation: 90, dimensions: { width: 1.72, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-195', name: '매대 195', position: { x: 21.92, y: 0, z: 15.80 }, rotation: 90, dimensions: { width: 1.72, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-196', name: '매대 196', position: { x: 22.35, y: 0, z: 16.95 }, rotation: 0, dimensions: { width: 2.37, height: 1.8, depth: 0.9 }, type: 'island', structure: GONDOLA_STRUCTURE, categoryId: null },

  // 197-202 블록
  { id: 'fixture-197', name: '매대 197', position: { x: 26.74, y: 0, z: 12.87 }, rotation: 0, dimensions: { width: 2.37, height: 1.8, depth: 0.9 }, type: 'island', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-198', name: '매대 198', position: { x: 25.24, y: 0, z: 14.38 }, rotation: 90, dimensions: { width: 1.87, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-199', name: '매대 199', position: { x: 26.31, y: 0, z: 14.38 }, rotation: 90, dimensions: { width: 1.87, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-200', name: '매대 200', position: { x: 25.24, y: 0, z: 15.80 }, rotation: 90, dimensions: { width: 1.72, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-201', name: '매대 201', position: { x: 26.31, y: 0, z: 15.80 }, rotation: 90, dimensions: { width: 1.72, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-202', name: '매대 202', position: { x: 26.74, y: 0, z: 16.95 }, rotation: 0, dimensions: { width: 2.37, height: 1.8, depth: 0.9 }, type: 'island', structure: GONDOLA_STRUCTURE, categoryId: null },

  // 203-208 블록
  { id: 'fixture-203', name: '매대 203', position: { x: 31.05, y: 0, z: 12.87 }, rotation: 0, dimensions: { width: 2.37, height: 1.8, depth: 0.9 }, type: 'island', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-204', name: '매대 204', position: { x: 29.55, y: 0, z: 14.38 }, rotation: 90, dimensions: { width: 1.87, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-205', name: '매대 205', position: { x: 30.62, y: 0, z: 14.38 }, rotation: 90, dimensions: { width: 1.87, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-206', name: '매대 206', position: { x: 29.55, y: 0, z: 15.80 }, rotation: 90, dimensions: { width: 1.72, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-207', name: '매대 207', position: { x: 30.62, y: 0, z: 15.80 }, rotation: 90, dimensions: { width: 1.72, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-208', name: '매대 208', position: { x: 31.05, y: 0, z: 16.95 }, rotation: 0, dimensions: { width: 2.37, height: 1.8, depth: 0.9 }, type: 'island', structure: GONDOLA_STRUCTURE, categoryId: null },
]

// ============================================
// 오른쪽 하단 (209-211)
// ============================================
const bottomRightFixtures: Fixture[] = [
  { id: 'fixture-209', name: '매대 209', position: { x: 38.11, y: 0, z: 14.88 }, rotation: 90, dimensions: { width: 2.62, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-210', name: '매대 210', position: { x: 40.45, y: 0, z: 15.82 }, rotation: 0, dimensions: { width: 1.44, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
  { id: 'fixture-211', name: '매대 211', position: { x: 40.75, y: 0, z: 17.11 }, rotation: 90, dimensions: { width: 2.51, height: 1.8, depth: 0.5 }, type: 'gondola', structure: GONDOLA_STRUCTURE, categoryId: null },
]

// ============================================
// 모든 매대 합치기
// ============================================
export const geojeFixtures: Fixture[] = [
  ...wallFixtures,
  ...entranceFixtures,
  ...gondolaGroup1,
  ...gondolaGroup2,
  ...gondolaGroup3,
  ...gondolaGroup4,
  ...gondolaGroup5,
  ...gondolaGroup6,
  ...gondolaGroup7,
  ...gondolaGroup8,
  ...rightSideFixtures,
  ...islandFixtures,
  ...bottomRightFixtures,
]

export default geojeFixtures
