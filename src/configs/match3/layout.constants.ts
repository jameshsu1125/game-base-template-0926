export const MATCH3_RGB_COLORS: [number, number, number][] = [
  [251, 230, 194],
  [112, 240, 252],
  [223, 86, 212],
  [164, 96, 241],
  [78, 160, 64],
];

export const MATCH3_SPECIAL_RGB_COLORS: [number, number, number][] = [
  [0, 0, 255], // 9x9炸彈
  [0, 0, 0], // horizontal line 紫色
  [255, 255, 255], // vertical line
];

export const MATCH3_SELECTION_COLOR: [number, number, number] = [255, 0, 0];

export const MATCH3_CONFIG = {
  x: 100,
  y: 100,
  rows: 7,
  cols: 7,
  width: 120,
  height: 120,
  transitionDuration: 0.3,
};
