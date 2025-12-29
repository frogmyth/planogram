import type { Store, ProductCategory, Wall, Column } from '../../types/store'
import { geojeFixtures } from './geoje-fixtures'

// ============================================
// 거제 아주동 하나로마트 매장 데이터
// ============================================
//
// [좌표계]
// - Three.js Y-up: X=동서(오른쪽+), Y=높이(위+), Z=남북(아래+)
// - 단위: 미터 (실제 크기 100%)
// - 매장 크기: 46.25m (가로) x 20.3m (세로)
// - 좌표 원점: 왼쪽 상단 (북서쪽 코너)
//
// [SVG → Three.js 좌표 변환]
// - SVG viewBox: 3700 x 2050 px
// - 변환 공식: X = svgX / 80, Z = svgY / 101
// - SVG Y축과 Three.js Z축 방향 동일 (둘 다 아래로 증가)
//
// [벽 두께 모서리 조정]
// - 벽 두께: 0.25m, 절반: 0.125m
// - 가로벽 끝점: 세로벽 중심까지 (세로벽X - 0.125)
// - 세로벽 시작/끝점: 가로벽 바깥까지 (가로벽Z ± 0.125)
//
// 상세 변환 로직: README-coordinate-system.md 참조
// ============================================

// 제품군 정의 (구역 이미지 참조)
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: 'fruit', name: '청과', color: '#90EE90', isRefrigerated: false },
  { id: 'vegetable', name: '채소', color: '#98FB98', isRefrigerated: false },
  { id: 'tofu', name: '두부/간나물', color: '#F5F5DC', isRefrigerated: true },
  { id: 'dried-fish', name: '건어물', color: '#FFE4C4', isRefrigerated: false },
  { id: 'special', name: '특산', color: '#FFDAB9', isRefrigerated: false },
  { id: 'sauce', name: '조미료/장류', color: '#DDA0DD', isRefrigerated: false },
  { id: 'snack', name: '과자/스낵', color: '#E6E6FA', isRefrigerated: false },
  { id: 'ramen', name: '라면/통조림', color: '#E6E6FA', isRefrigerated: false },
  { id: 'drink', name: '음료/커피', color: '#E6E6FA', isRefrigerated: false },
  { id: 'liquor', name: '주류/안주', color: '#E6E6FA', isRefrigerated: false },
  { id: 'kitchen', name: '주방용품', color: '#F0E68C', isRefrigerated: false },
  { id: 'cleaning', name: '세제/청소', color: '#F0E68C', isRefrigerated: false },
  { id: 'diaper', name: '화장지/기저귀', color: '#F0E68C', isRefrigerated: false },
  { id: 'shampoo', name: '샴푸/치약', color: '#F0E68C', isRefrigerated: false },
  { id: 'appliance', name: '가전/잡화', color: '#F0E68C', isRefrigerated: false },
  { id: 'ice-cream', name: '아이스크림', color: '#ADD8E6', isRefrigerated: true },
  { id: 'frozen', name: '냉동식품', color: '#87CEEB', isRefrigerated: true },
  { id: 'chilled', name: '냉장식품', color: '#B0E0E6', isRefrigerated: true },
  { id: 'dairy', name: '유제품', color: '#E0FFFF', isRefrigerated: true },
  { id: 'meat', name: '축산', color: '#FFC0CB', isRefrigerated: true },
  { id: 'bakery', name: '베이커리', color: '#FAEBD7', isRefrigerated: false },
  { id: 'pos', name: 'POS', color: '#808080', isRefrigerated: false },
]

// ============================================
// 벽면 데이터 - 평면도 이미지와 맞춰서 순차적으로 추가
// 좌표: 왼쪽 하단이 원점 (0,0)
// X: 오른쪽이 +, Z: 위쪽이 +
// 전체 크기: 46.25m (X) x 20.3m (Z)
// ============================================
const WALLS: Wall[] = [
  // SVG 파일에서 추출한 좌표 (SVG 이미지와 동일한 방향)
  // viewBox: 3700 x 2050 px = 46.25m x 20.3m
  // 스케일: X = px/80, Z = px/101
  // SVG 좌표 그대로 사용 (이미지와 벽이 같은 방향)

  // 외벽 path: M39.27,33.3 → M39.27,2020.3 → M3533.15,2020.3 → M3533.15,2000.29 → ...
  // 내부 경계: x=59.27~3649.55, y=53.3~2000.3

  // === 위쪽 벽 (북쪽, SVG에서 y=53.3) ===
  // y=53.3 → z=53.3/101=0.53m
  { id: 'wall-n', start: { x: 0.74, z: 0.53 }, end: { x: 45.62, z: 0.53 }, height: 3, thickness: 0.25 },

  // === 오른쪽 벽 (동쪽, SVG에서 x=3649.55) ===
  // x=3649.55 → x=45.62m
  // 위쪽 벽 바깥 가장자리까지 연장 (z: 0.53-0.125=0.405)
  { id: 'wall-e1', start: { x: 45.62, z: 0.405 }, end: { x: 45.62, z: 16.31 }, height: 3, thickness: 0.25 },

  // === 오른쪽 오목부 ===
  // x=3533.04~3649.55 → x=44.16~45.62m, y=1647.3 → z=16.31m
  // wall-e1 바깥 가장자리까지 연장 (x: 45.62+0.125=45.745)
  { id: 'wall-e2', start: { x: 45.745, z: 16.31 }, end: { x: 44.16, z: 16.31 }, height: 3, thickness: 0.25 },
  // y=1647.3~2000.3 → z=16.31~19.81m
  // wall-e2/wall-s1 바깥 가장자리까지 연장
  { id: 'wall-e3', start: { x: 44.16, z: 16.185 }, end: { x: 44.16, z: 19.935 }, height: 3, thickness: 0.25 },

  // === 아래쪽 벽 (남쪽, SVG에서 y=2000.3) ===
  // y=2000.3 → z=19.81m
  // wall-s1: 오른쪽 부분 (오목부 ~ 왼쪽 벽까지)
  { id: 'wall-s1', start: { x: 44.16, z: 19.81 }, end: { x: 0.74, z: 19.81 }, height: 3, thickness: 0.25 },

  // === 왼쪽 벽 (서쪽) ===
  // x=59.27 → x=0.74m
  // 위아래 벽 바깥 가장자리까지 연장 (z: 0.53-0.125=0.405 ~ 19.81+0.125=19.935)
  { id: 'wall-w1', start: { x: 0.74, z: 19.935 }, end: { x: 0.74, z: 0.405 }, height: 3, thickness: 0.25 },

  // === 왼쪽 계단형 돌출부 ===
  // 벽 두께 0.25m, 절반 = 0.125m
  // 모서리가 깔끔하게 맞도록 좌표 조정

  // 1단 가로벽: 왼쪽 벽(x=0.74)에서 세로벽(x=2.43)까지
  // 세로벽 중심까지만 (x=2.43 - 0.125 = 2.305)
  { id: 'wall-step1-h', start: { x: 0.74, z: 1.87 }, end: { x: 2.305, z: 1.87 }, height: 3, thickness: 0.25 },

  // 1단 세로벽: 가로벽(z=1.87)에서 2단 가로벽(z=4.38)까지
  // 양쪽 가로벽 바깥 가장자리까지 연장
  { id: 'wall-step1-v', start: { x: 2.43, z: 1.745 }, end: { x: 2.43, z: 4.505 }, height: 3, thickness: 0.25 },

  // 2단 가로벽 왼쪽: 세로벽(x=2.43)에서 출입구까지
  // 세로벽 바깥쪽에서 시작 (x=2.43 + 0.125 = 2.555)
  { id: 'wall-step2-h-left', start: { x: 2.555, z: 4.38 }, end: { x: 4.1, z: 4.38 }, height: 3, thickness: 0.25 },

  // 2단 가로벽 오른쪽: 출입구에서 세로벽(x=9.17)까지
  // 세로벽 중심까지만 (x=9.17 - 0.125 = 9.045)
  { id: 'wall-step2-h-right', start: { x: 5.58, z: 4.38 }, end: { x: 9.045, z: 4.38 }, height: 3, thickness: 0.25 },

  // 2단 세로벽: 위쪽 벽(z=0.53)에서 가로벽(z=4.38)까지
  // 가로벽 바깥 가장자리까지 연장 (z=4.38 + 0.125 = 4.505)
  { id: 'wall-step2-v', start: { x: 9.17, z: 4.505 }, end: { x: 9.17, z: 0.53 }, height: 3, thickness: 0.25 },

  // 입구 왼쪽 세로벽 (아래쪽 부분, rect x=736.05, y=1658.89~2003.29)
  // x=736.05 → x=9.2m, y=1658.89~2003.29 → z=16.42~19.84m
  { id: 'wall-entrance-left', start: { x: 9.2, z: 16.42 }, end: { x: 9.2, z: 19.81 }, height: 3, thickness: 0.25 },
]

// ============================================
// 기둥 데이터 - 평면도 이미지와 맞춰서 순차적으로 추가
// ============================================
const COLUMNS: Column[] = [
  // SVG에서 추출한 기둥 좌표 (rect 44x44 px = 0.55m x 0.44m)
  // X: px/80, Z: py/101 (SVG 이미지와 동일한 방향)

  // 기둥 1: (735.42, 531.3) → x=9.19m, z=5.26m
  { id: 'col-1', position: { x: 9.19, z: 5.26 }, width: 0.55, depth: 0.44, height: 3 },

  // 기둥 2: (41.23, 1015.05) → x=0.52m, z=10.05m (왼쪽 벽 근처)
  { id: 'col-2', position: { x: 0.52, z: 10.05 }, width: 0.55, depth: 0.44, height: 3 },

  // 기둥 3: (735.42, 1015.05) → x=9.19m, z=10.05m
  { id: 'col-3', position: { x: 9.19, z: 10.05 }, width: 0.55, depth: 0.44, height: 3 },

  // 기둥 4: (1435.42, 1015.05) → x=17.94m, z=10.05m
  { id: 'col-4', position: { x: 17.94, z: 10.05 }, width: 0.55, depth: 0.44, height: 3 },

  // 기둥 5: (2133.88, 1015.05) → x=26.67m, z=10.05m
  { id: 'col-5', position: { x: 26.67, z: 10.05 }, width: 0.55, depth: 0.44, height: 3 },

  // 기둥 6: (2835.42, 1015.05) → x=35.44m, z=10.05m
  { id: 'col-6', position: { x: 35.44, z: 10.05 }, width: 0.55, depth: 0.44, height: 3 },

  // 기둥 7: (3533.55, 1015.05) → x=44.17m, z=10.05m
  { id: 'col-7', position: { x: 44.17, z: 10.05 }, width: 0.55, depth: 0.44, height: 3 },
]

// 매장 데이터
export const geojeHanaromart: Store = {
  meta: {
    id: 'geoje-hanaromart',
    name: '거제 아주동 하나로마트',
    address: '경상남도 거제시 아주동',
    createdAt: '2025-01-01',
    updatedAt: '2025-12-26',
  },

  // 평면도 기반 매장 정보 (치수 이미지 기준)
  floorPlan: {
    imageUrl: '/images/jangseungpo-ajou-floor-plan.svg',
    widthMeters: 46.25,
    depthMeters: 20.3,
  },

  // 구조물 (벽, 기둥)
  walls: WALLS,
  columns: COLUMNS,

  // 매대 목록
  fixtures: geojeFixtures,

  // 제품군 정의
  productCategories: PRODUCT_CATEGORIES,

  // 카메라 설정
  cameraConfig: {
    storeViewHeight: 40,
    zoneViewMinHeight: 10,
    zoneViewMaxHeight: 25,
    fixtureViewDistance: 3,
  },
}

export default geojeHanaromart
