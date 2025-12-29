// ============================================
// 자석 스냅 유틸리티
// 매대 이동 시 다른 매대/벽에 자석처럼 붙는 기능
// 벽 충돌 방지 기능 포함
// ============================================

import type { Fixture, Point3D, Wall } from '../../types/store'

// 스냅 설정
export const SNAP_CONFIG = {
  // 스냅 활성화 거리 (미터)
  snapDistance: 0.3,
  // 그리드 스냅 크기 (미터)
  gridSize: 0.1,
  // 스냅 우선순위: 다른 매대 > 그리드
}

// 스냅 결과 타입
export interface SnapResult {
  position: Point3D
  snappedToFixtureId?: string
  snappedToWallId?: string
  snappedEdge?: 'left' | 'right' | 'front' | 'back'
}

// 매대의 바운딩 박스 계산
export interface FixtureBounds {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
  centerX: number
  centerZ: number
  width: number
  depth: number
}

export function getFixtureBounds(fixture: Fixture): FixtureBounds {
  const { position, dimensions, rotation } = fixture

  // 회전에 따른 실제 크기 계산 (15도 단위 지원)
  const rotationRad = (rotation * Math.PI) / 180
  const cosR = Math.abs(Math.cos(rotationRad))
  const sinR = Math.abs(Math.sin(rotationRad))

  // 회전된 바운딩 박스 크기
  const effectiveWidth = dimensions.width * cosR + dimensions.depth * sinR
  const effectiveDepth = dimensions.width * sinR + dimensions.depth * cosR

  return {
    minX: position.x - effectiveWidth / 2,
    maxX: position.x + effectiveWidth / 2,
    minZ: position.z - effectiveDepth / 2,
    maxZ: position.z + effectiveDepth / 2,
    centerX: position.x,
    centerZ: position.z,
    width: effectiveWidth,
    depth: effectiveDepth,
  }
}

// 벽의 바운딩 박스 계산
export interface WallBounds {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
  isHorizontal: boolean // X축 방향 벽인지
  isVertical: boolean   // Z축 방향 벽인지
}

export function getWallBounds(wall: Wall): WallBounds {
  const { start, end, thickness = 0.15 } = wall
  const halfThickness = thickness / 2

  const minX = Math.min(start.x, end.x)
  const maxX = Math.max(start.x, end.x)
  const minZ = Math.min(start.z, end.z)
  const maxZ = Math.max(start.z, end.z)

  // 벽 방향 판단
  const isHorizontal = Math.abs(end.z - start.z) < 0.01
  const isVertical = Math.abs(end.x - start.x) < 0.01

  return {
    minX: minX - halfThickness,
    maxX: maxX + halfThickness,
    minZ: minZ - halfThickness,
    maxZ: maxZ + halfThickness,
    isHorizontal,
    isVertical,
  }
}

// 그리드 스냅
export function snapToGrid(value: number, gridSize: number = SNAP_CONFIG.gridSize): number {
  return Math.round(value / gridSize) * gridSize
}

// 매대에 스냅 (가장 가까운 매대 가장자리에 붙음)
export function snapToFixtures(
  targetPosition: Point3D,
  targetFixture: Fixture,
  otherFixtures: Fixture[],
  snapDistance: number = SNAP_CONFIG.snapDistance
): SnapResult {
  const targetBounds = getFixtureBounds({ ...targetFixture, position: targetPosition })

  let bestSnap: SnapResult = { position: { ...targetPosition } }
  let minDistance = Infinity

  for (const other of otherFixtures) {
    if (other.id === targetFixture.id) continue

    const otherBounds = getFixtureBounds(other)

    // X축 스냅 체크 (좌우)
    // 타겟 오른쪽 → 다른 매대 왼쪽
    const rightToLeft = Math.abs(targetBounds.maxX - otherBounds.minX)
    if (rightToLeft < snapDistance && rightToLeft < minDistance) {
      // Z축 정렬 체크 (같은 줄에 있어야 스냅)
      if (isZAligned(targetBounds, otherBounds, snapDistance)) {
        minDistance = rightToLeft
        bestSnap = {
          position: {
            ...targetPosition,
            x: otherBounds.minX - targetBounds.width / 2,
          },
          snappedToFixtureId: other.id,
          snappedEdge: 'right',
        }
      }
    }

    // 타겟 왼쪽 → 다른 매대 오른쪽
    const leftToRight = Math.abs(targetBounds.minX - otherBounds.maxX)
    if (leftToRight < snapDistance && leftToRight < minDistance) {
      if (isZAligned(targetBounds, otherBounds, snapDistance)) {
        minDistance = leftToRight
        bestSnap = {
          position: {
            ...targetPosition,
            x: otherBounds.maxX + targetBounds.width / 2,
          },
          snappedToFixtureId: other.id,
          snappedEdge: 'left',
        }
      }
    }

    // Z축 스냅 체크 (앞뒤)
    // 타겟 앞쪽 → 다른 매대 뒤쪽
    const frontToBack = Math.abs(targetBounds.maxZ - otherBounds.minZ)
    if (frontToBack < snapDistance && frontToBack < minDistance) {
      if (isXAligned(targetBounds, otherBounds, snapDistance)) {
        minDistance = frontToBack
        bestSnap = {
          position: {
            ...targetPosition,
            z: otherBounds.minZ - targetBounds.depth / 2,
          },
          snappedToFixtureId: other.id,
          snappedEdge: 'front',
        }
      }
    }

    // 타겟 뒤쪽 → 다른 매대 앞쪽
    const backToFront = Math.abs(targetBounds.minZ - otherBounds.maxZ)
    if (backToFront < snapDistance && backToFront < minDistance) {
      if (isXAligned(targetBounds, otherBounds, snapDistance)) {
        minDistance = backToFront
        bestSnap = {
          position: {
            ...targetPosition,
            z: otherBounds.maxZ + targetBounds.depth / 2,
          },
          snappedToFixtureId: other.id,
          snappedEdge: 'back',
        }
      }
    }

    // 중심 정렬 스냅 (X축)
    const centerXDiff = Math.abs(targetBounds.centerX - otherBounds.centerX)
    if (centerXDiff < snapDistance * 0.5 && centerXDiff < minDistance) {
      if (isAdjacentZ(targetBounds, otherBounds, snapDistance)) {
        minDistance = centerXDiff
        bestSnap = {
          position: {
            ...bestSnap.position,
            x: otherBounds.centerX,
          },
          snappedToFixtureId: other.id,
        }
      }
    }

    // 중심 정렬 스냅 (Z축)
    const centerZDiff = Math.abs(targetBounds.centerZ - otherBounds.centerZ)
    if (centerZDiff < snapDistance * 0.5 && centerZDiff < minDistance) {
      if (isAdjacentX(targetBounds, otherBounds, snapDistance)) {
        minDistance = centerZDiff
        bestSnap = {
          position: {
            ...bestSnap.position,
            z: otherBounds.centerZ,
          },
          snappedToFixtureId: other.id,
        }
      }
    }
  }

  // 스냅이 없으면 그리드 스냅 적용
  if (!bestSnap.snappedToFixtureId) {
    bestSnap.position = {
      x: snapToGrid(targetPosition.x),
      y: targetPosition.y,
      z: snapToGrid(targetPosition.z),
    }
  }

  return bestSnap
}

// Z축 정렬 체크 (같은 줄에 있는지)
function isZAligned(a: FixtureBounds, b: FixtureBounds, tolerance: number): boolean {
  return Math.abs(a.centerZ - b.centerZ) < Math.max(a.depth, b.depth) / 2 + tolerance
}

// X축 정렬 체크 (같은 줄에 있는지)
function isXAligned(a: FixtureBounds, b: FixtureBounds, tolerance: number): boolean {
  return Math.abs(a.centerX - b.centerX) < Math.max(a.width, b.width) / 2 + tolerance
}

// Z축으로 인접한지 체크
function isAdjacentZ(a: FixtureBounds, b: FixtureBounds, tolerance: number): boolean {
  return (
    Math.abs(a.maxZ - b.minZ) < tolerance ||
    Math.abs(a.minZ - b.maxZ) < tolerance
  )
}

// X축으로 인접한지 체크
function isAdjacentX(a: FixtureBounds, b: FixtureBounds, tolerance: number): boolean {
  return (
    Math.abs(a.maxX - b.minX) < tolerance ||
    Math.abs(a.minX - b.maxX) < tolerance
  )
}

// 충돌 체크 (매대 간)
export function checkCollision(
  fixture: Fixture,
  position: Point3D,
  otherFixtures: Fixture[]
): boolean {
  const targetBounds = getFixtureBounds({ ...fixture, position })

  for (const other of otherFixtures) {
    if (other.id === fixture.id) continue

    const otherBounds = getFixtureBounds(other)

    // AABB 충돌 체크
    const xOverlap = targetBounds.maxX > otherBounds.minX && targetBounds.minX < otherBounds.maxX
    const zOverlap = targetBounds.maxZ > otherBounds.minZ && targetBounds.minZ < otherBounds.maxZ

    if (xOverlap && zOverlap) {
      return true
    }
  }

  return false
}

// 벽 충돌 체크
export function checkWallCollision(
  fixture: Fixture,
  position: Point3D,
  walls: Wall[]
): boolean {
  const targetBounds = getFixtureBounds({ ...fixture, position })

  for (const wall of walls) {
    const wallBounds = getWallBounds(wall)

    // AABB 충돌 체크
    const xOverlap = targetBounds.maxX > wallBounds.minX && targetBounds.minX < wallBounds.maxX
    const zOverlap = targetBounds.maxZ > wallBounds.minZ && targetBounds.minZ < wallBounds.maxZ

    if (xOverlap && zOverlap) {
      return true
    }
  }

  return false
}

// 벽에 스냅 (가장 가까운 벽에 붙음)
export function snapToWalls(
  targetPosition: Point3D,
  targetFixture: Fixture,
  walls: Wall[],
  snapDistance: number = SNAP_CONFIG.snapDistance
): SnapResult {
  const targetBounds = getFixtureBounds({ ...targetFixture, position: targetPosition })

  let bestSnap: SnapResult = { position: { ...targetPosition } }
  let minDistance = Infinity

  for (const wall of walls) {
    const wallBounds = getWallBounds(wall)

    if (wallBounds.isVertical) {
      // 수직 벽 (Z축 방향) - X축으로 스냅
      // 매대 오른쪽 → 벽 왼쪽 (벽 왼편에 붙음)
      const rightToWall = Math.abs(targetBounds.maxX - wallBounds.minX)
      if (rightToWall < snapDistance && rightToWall < minDistance) {
        // Z축 범위 체크
        if (targetBounds.maxZ > wallBounds.minZ && targetBounds.minZ < wallBounds.maxZ) {
          minDistance = rightToWall
          bestSnap = {
            position: {
              ...targetPosition,
              x: wallBounds.minX - targetBounds.width / 2,
            },
            snappedToWallId: wall.id,
            snappedEdge: 'right',
          }
        }
      }

      // 매대 왼쪽 → 벽 오른쪽 (벽 오른편에 붙음)
      const leftToWall = Math.abs(targetBounds.minX - wallBounds.maxX)
      if (leftToWall < snapDistance && leftToWall < minDistance) {
        if (targetBounds.maxZ > wallBounds.minZ && targetBounds.minZ < wallBounds.maxZ) {
          minDistance = leftToWall
          bestSnap = {
            position: {
              ...targetPosition,
              x: wallBounds.maxX + targetBounds.width / 2,
            },
            snappedToWallId: wall.id,
            snappedEdge: 'left',
          }
        }
      }
    }

    if (wallBounds.isHorizontal) {
      // 수평 벽 (X축 방향) - Z축으로 스냅

      // 매대 앞쪽 → 벽 뒤쪽 (벽 앞에 붙음)
      const frontToWall = Math.abs(targetBounds.maxZ - wallBounds.minZ)
      if (frontToWall < snapDistance && frontToWall < minDistance) {
        if (targetBounds.maxX > wallBounds.minX && targetBounds.minX < wallBounds.maxX) {
          minDistance = frontToWall
          bestSnap = {
            position: {
              ...targetPosition,
              z: wallBounds.minZ - targetBounds.depth / 2,
            },
            snappedToWallId: wall.id,
            snappedEdge: 'front',
          }
        }
      }

      // 매대 뒤쪽 → 벽 앞쪽 (벽 뒤에 붙음)
      const backToWall = Math.abs(targetBounds.minZ - wallBounds.maxZ)
      if (backToWall < snapDistance && backToWall < minDistance) {
        if (targetBounds.maxX > wallBounds.minX && targetBounds.minX < wallBounds.maxX) {
          minDistance = backToWall
          bestSnap = {
            position: {
              ...targetPosition,
              z: wallBounds.maxZ + targetBounds.depth / 2,
            },
            snappedToWallId: wall.id,
            snappedEdge: 'back',
          }
        }
      }
    }
  }

  return bestSnap
}

// 매대 + 벽 통합 스냅 (벽 충돌 방지 포함)
export function snapToFixturesAndWalls(
  targetPosition: Point3D,
  targetFixture: Fixture,
  otherFixtures: Fixture[],
  walls: Wall[],
  snapDistance: number = SNAP_CONFIG.snapDistance
): SnapResult {
  // 1. 먼저 매대 스냅 시도
  const fixtureSnap = snapToFixtures(targetPosition, targetFixture, otherFixtures, snapDistance)

  // 2. 벽 스냅 시도
  const wallSnap = snapToWalls(fixtureSnap.position, targetFixture, walls, snapDistance)

  // 3. 벽 스냅이 있으면 벽 스냅 우선, 없으면 매대 스냅 사용
  let finalPosition = wallSnap.snappedToWallId ? wallSnap.position : fixtureSnap.position

  // 4. 벽 충돌 체크 및 보정
  if (checkWallCollision(targetFixture, finalPosition, walls)) {
    // 충돌 시 원래 위치로 롤백
    finalPosition = targetFixture.position
  }

  return {
    position: finalPosition,
    snappedToFixtureId: fixtureSnap.snappedToFixtureId,
    snappedToWallId: wallSnap.snappedToWallId,
    snappedEdge: wallSnap.snappedEdge || fixtureSnap.snappedEdge,
  }
}

// 위치 보정 (벽 경계 내로 제한)
export function clampToWallBounds(
  position: Point3D,
  fixture: Fixture,
  walls: Wall[]
): Point3D {
  const bounds = getFixtureBounds({ ...fixture, position })
  let newPosition = { ...position }

  for (const wall of walls) {
    const wallBounds = getWallBounds(wall)

    if (wallBounds.isVertical) {
      // 매대가 벽과 겹치면 밀어냄
      const xOverlap = bounds.maxX > wallBounds.minX && bounds.minX < wallBounds.maxX
      const zOverlap = bounds.maxZ > wallBounds.minZ && bounds.minZ < wallBounds.maxZ

      if (xOverlap && zOverlap) {
        const pushLeft = wallBounds.minX - bounds.maxX
        const pushRight = wallBounds.maxX - bounds.minX

        if (Math.abs(pushLeft) < Math.abs(pushRight)) {
          newPosition.x += pushLeft - 0.01
        } else {
          newPosition.x += pushRight + 0.01
        }
      }
    }

    if (wallBounds.isHorizontal) {
      const xOverlap = bounds.maxX > wallBounds.minX && bounds.minX < wallBounds.maxX
      const zOverlap = bounds.maxZ > wallBounds.minZ && bounds.minZ < wallBounds.maxZ

      if (xOverlap && zOverlap) {
        const pushFront = wallBounds.minZ - bounds.maxZ
        const pushBack = wallBounds.maxZ - bounds.minZ

        if (Math.abs(pushFront) < Math.abs(pushBack)) {
          newPosition.z += pushFront - 0.01
        } else {
          newPosition.z += pushBack + 0.01
        }
      }
    }
  }

  return newPosition
}
