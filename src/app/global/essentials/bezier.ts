import { PenPoint } from "../interfaces/penPoint";
import { Point } from '../interfaces/point';
import { getDistance } from './utils';

// adapted version of https://github.com/szimek/signature_pad/blob/master/src/bezier.ts

export class Bezier {
  public static fromPoints(
    points: PenPoint[],
    widths: { start: number; end: number },
  ): Bezier | undefined {
    if (points.length < 4) {
        return undefined;
    }

    const c2 = this.calculateControlPoints(points[0], points[1], points[2]).c2;
    const c3 = this.calculateControlPoints(points[1], points[2], points[3]).c1;

    return new Bezier(points[1], c2, c3, points[2], widths.start, widths.end);
  }

  private static calculateControlPoints(
    s1: PenPoint,
    s2: PenPoint,
    s3: PenPoint,
  ): {
    c1: Point;
    c2: Point;
  } {
    const dx1 = s1.x - s2.x;
    const dy1 = s1.y - s2.y;
    const dx2 = s2.x - s3.x;
    const dy2 = s2.y - s3.y;

    const m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 };
    const m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 };

    const l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    const dxm = m1.x - m2.x;
    const dym = m1.y - m2.y;

    const k = l1 + l2 == 0 ? 0 : l2 / (l1 + l2);
    const cm = { x: m2.x + dxm * k, y: m2.y + dym * k };

    const tx = s2.x - cm.x;
    const ty = s2.y - cm.y;

    return {
      c1: {
        x: m1.x + tx, 
        y: m1.y + ty
      },
      c2: {
        x: m2.x + tx,
        y: m2.y + ty
      }
    };
  }

  constructor(
    public startPoint: PenPoint,
    public control2: Point,
    public control1: Point,
    public endPoint: PenPoint,
    public startWidth: number,
    public endWidth: number,
  ) {}

  // Returns roughly approximated length.
  public length(): number {
    return getDistance(this.startPoint, this.control1) + getDistance(this.control1, this.control2) + getDistance(this.control2, this.endPoint);
  }
}