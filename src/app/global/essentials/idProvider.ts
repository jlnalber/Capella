import {CanvasIdElement} from "../classes/abstract/canvasIdElement";

const ids: number[] = [];

export default function getNewID(): number {
  for (let i = 0; true; i++) {
    if (ids.indexOf(i) === -1) {
      ids.push(i);
      return i;
    }
  }
  return Number.NaN;
}

export function getElementToID(canvasElements: CanvasIdElement[], id: number): CanvasIdElement | undefined {
  for (let c of canvasElements) {
    if (c.id === id) {
      return c;
    }
  }
  return undefined;
}
