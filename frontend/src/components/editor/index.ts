// 매대 편집 컴포넌트
export { DraggableFixture } from './DraggableFixture'
export { FixtureEditPanel } from './FixtureEditPanel'
export { EditModeToggle } from './EditModeToggle'
export { TransformGizmo } from './TransformGizmo'

// 유틸리티
export {
  snapToGrid,
  snapToFixtures,
  snapToWalls,
  snapToFixturesAndWalls,
  checkCollision,
  checkWallCollision,
  clampToWallBounds,
  getFixtureBounds,
  getWallBounds,
  SNAP_CONFIG,
} from './snapUtils'
export type { SnapResult, FixtureBounds, WallBounds } from './snapUtils'
