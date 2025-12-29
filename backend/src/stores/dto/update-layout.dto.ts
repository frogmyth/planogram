export interface GridConfig {
  cellSize: number;
  cols: number;
  rows: number;
}

export class UpdateLayoutDto {
  gridLayout: (string | null)[][];
  gridConfig?: GridConfig;
}
