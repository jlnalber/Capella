export interface Color {
  r: number,
  g: number,
  b: number,
  a?: number
}

export function getColorAsRgbFunction(color: Color): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function getColorAsRgbaFunction(color: Color): string {
  if (color.a !== undefined) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  }
  return `rgba(${color.r}, ${color.g}, ${color.b})`;
}

export function colorAsTransparent(color: Color, ratio: number = 0.5): Color {
  return {
    r: color.r,
    g: color.g,
    b: color.b,
    a: color.a === undefined ? ratio : color.a * ratio
  }
}

export function darken(color: Color, factor: number): Color {
  return {
    r: Math.round(color.r * factor),
    g: Math.round(color.g * factor),
    b: Math.round(color.b * factor),
    a: color.a
  }
}

export function getCopyOfColor(color: Color): Color {
  return { ...color }
}

export const BLACK: Color = {
  r: 0,
  g: 0,
  b: 0
}
export const WHITE: Color = {
  r: 255,
  g: 255,
  b: 255
}
export const RED: Color = {
  r: 255,
  g: 0,
  b: 0
}
export const GREEN: Color = {
  r: 0,
  g: 255,
  b: 0
}
export const BLUE: Color = {
  r: 0,
  g: 0,
  b: 255
}
export const TRANSPARENT: Color = {
  r: 0,
  g: 0,
  b: 0,
  a: 0
}
export const DEEPBLUE: Color = {
  r: 13,
  g: 48,
  b: 152
}
export const GREY: Color = {
  r: 127,
  g: 127,
  b: 127
}
export const YELLOW: Color = {
  r: 255,
  g: 255,
  b: 0
}

export const RED_FILTER = 'invert(27%) sepia(89%) saturate(7465%) hue-rotate(356deg) brightness(116%) contrast(126%)'
