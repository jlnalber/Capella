import { Point } from "src/app/global/interfaces/point";
import { CanvasClickerElement } from "../../../../global/classes/abstract/canvasClickerElement";


// in exactly this order!
type TransformationOnCanvasElement = {
  scale: Point,
  rotate: number,
  translate: Point
}

export abstract class WhiteboardCanvasTransformableElement extends CanvasClickerElement {
  protected transformation: TransformationOnCanvasElement = {
    scale: {x: 1, y: 1},
    rotate: 0,
    translate: {x: 0, y: 0}
  }

  public set scale(value: Point) {
    this.transformation.scale = {
      ...value
    }
    this.onChange.emit(value);
  }

  public set translate(value: Point) {
    this.transformation.translate = {
      ...value
    }
    this.onChange.emit(value);
  }

  public set rotate(value: number) {
    this.rotate = value;
    this.onChange.emit(value);
  }

  public get scale(): Point {
    return {
      ...this.transformation.scale
    }
  }

  public get translate(): Point {
    return {
      ...this.transformation.translate
    }
  }

  public get rotate(): number {
    return this.transformation.rotate;
  }

  protected pointWithTransform(p: Point): Point {
    const pS = {
      x: p.x * this.transformation.scale.x,
      y: p.y * this.transformation.scale.y
    };
    const pSR = rotatePointByAngle(pS, this.transformation.rotate);
    const pSRT = {
      x: pSR.x + this.transformation.translate.x,
      y: pSR.y + this.transformation.translate.y
    }
    return pSRT;
  }

  protected pointWithoutTransform(pSRT: Point): Point {
    const pSR = {
      x: pSRT.x - this.transformation.translate.x,
      y: pSRT.y - this.transformation.translate.y
    }
    const pS = rotatePointByAngle(pSR, -this.transformation.rotate);
    const p = {
      x: pS.x / this.transformation.scale.x,
      y: pS.y / this.transformation.scale.y
    };
    return p;
  }
}

function rotatePointByAngle(p: Point, angle: number) {
  return {
    x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
    y: p.y * Math.cos(angle) + p.x * Math.sin(angle)
  };
}
