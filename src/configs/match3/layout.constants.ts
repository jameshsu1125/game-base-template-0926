export const MATCH3_RGB_COLORS: [number, number, number][] = [
  [255, 128, 128],
  [128, 255, 128],
  [128, 128, 255],
  [255, 255, 128],
  [255, 128, 255],
  [128, 255, 255],
  [255, 255, 255],
];

export const MATCH3_SPECIAL_RGB_COLORS: [number, number, number][] = [
  [0, 0, 0], // 2x2 + L 爆炸 黑色
  [102, 0, 255], // horizontal line 紫色
  [0, 0, 255], // vertical line
];

export const MATCH3_SELECTION_COLOR: [number, number, number] = [255, 0, 0];

export const MATCH3_CONFIG = {
  x: 100,
  y: 100,
  rows: 8,
  cols: 8,
  width: 120,
  height: 120,
  transitionDuration: 0.3,
};
