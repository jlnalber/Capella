import {Type} from "@angular/core";
import {LINE_WIDTH_SELECTED_RATIO, TRANSPARENCY_RATIO} from "./graph";
import {GeometricFormulaComponent} from "../../../formula-tab/geometric-formula/geometric-formula.component";
import DynamicElement from "./dynamicElement";
import {CanvasElementSerialized} from "../../essentials/serializer";
import PointElement from "./pointElement";
import {ViewCircleElementComponent} from "../../../formula-dialogs/view-circle-element/view-circle-element.component";
import { Point } from "src/app/global/interfaces/point";
import { ProkyonCanvasElement } from "../abstract/prokyonCanvasElement";
import { Color, colorAsTransparent, TRANSPARENT } from "src/app/global/interfaces/color";
import AbstractRenderingContext from "src/app/global/classes/renderingContext/abstractRenderingContext";
import { getDistance, getDistanceUndef, getRegularLineDash } from "src/app/global/essentials/utils";
import { DEFAULT_LINEDASH, REGULAR_LINEDASH } from "src/app/global/interfaces/canvasStyles/styleTypes";

type Data = {
  center: number,
  scdPoint: number
}

export default class CircleElement extends DynamicElement {

  public readonly componentType: Type<GeometricFormulaComponent> = GeometricFormulaComponent;
  public override formulaDialogType = ViewCircleElementComponent;

  private _pointProvider: PointProvider;

  private _tempPoint: Point | undefined;

  public get point(): Point | undefined {
    if (this._tempPoint === undefined) {
      this._tempPoint = this._pointProvider();
    }
    return this._tempPoint;
  }

  public get pointProvider(): PointProvider {
    return this._pointProvider;
  }

  public set pointProvider(value: PointProvider) {
    this._pointProvider = value;
    this.onChange.emit(value);
  }

  private _radiusProvider: RadiusProvider;

  private _tempRadius: number | undefined;

  public get radius(): number | undefined {
    if (this._tempRadius === undefined) {
      this._tempRadius = this._radiusProvider();
    }
    return this._tempRadius;
  }

  public get radiusProvider(): RadiusProvider {
    return this._radiusProvider;
  }

  public set radiusProvider(value: RadiusProvider) {
    this._radiusProvider = value;
    this.onChange.emit(value);
  }

  constructor(pointProvider: PointProvider,
              radiusProvider: RadiusProvider,
              dependencies: ProkyonCanvasElement[],
              protected dataProvider: () => Data,
              color: Color = { r: 0, g: 0, b: 0 },
              formula?: string,
              visible: boolean = true,
              public lineWidth: number = 3,
              showLabel: boolean = true) {
    super(dependencies);
    this.configuration.formula = formula;
    this.configuration.showLabel = showLabel;
    this._color = color;
    this._visible = visible;
    this._pointProvider = pointProvider;
    this._radiusProvider = radiusProvider;
  }

  public draw(ctx: AbstractRenderingContext): void {
    const point = this.point;
    const radius = this.radius;

    if (point !== undefined && radius !== undefined) {
      if (ctx.selection.indexOf(this) !== -1) {
        ctx.drawCircle(point, radius, true, {
          color: TRANSPARENT
        }, {
          color: colorAsTransparent(this._color, TRANSPARENCY_RATIO),
          uniformSizeOnZoom: true,
          lineWidth: this.lineWidth * LINE_WIDTH_SELECTED_RATIO,
          lineDash: getRegularLineDash(this.configuration.dashed)
        })
      }
      ctx.drawCircle(point, radius, true, {
        color: TRANSPARENT
      }, {
        color: this.color,
        uniformSizeOnZoom: true,
        lineWidth: this.lineWidth,
        lineDash: getRegularLineDash(this.configuration.dashed)
      });
    }
  }

  public override getPositionForLabel(rtx: AbstractRenderingContext): Point | undefined {
    const depos = 15 / rtx.zoom;
    const center = this.point;
    const radius = this.radius;

    if (center === undefined || radius === undefined) {
      return undefined;
    }

    return {
      x: center.x + radius / Math.SQRT2 + depos,
      y: center.y + radius / Math.SQRT2 + depos
    }
  }

  public override getDistance(p: Point, ctx: AbstractRenderingContext): number | undefined {
    const point = this.point;
    const radius = this.radius;
    if (point !== undefined && radius !== undefined) {
      return Math.abs(getDistance(point, p) - radius);
    }

    return undefined;
  }

  public static getDefaultInstance(): CircleElement {
    return new CircleElement(() => undefined, () => undefined, [], () => {
      return {
        center: -1,
        scdPoint: -1
      }
    });
  }

  public override serialize(): CanvasElementSerialized {
    return {
      style: {
        color: this.color,
        size: this.lineWidth,
        visible: this.visible
      },
      data: this.dataProvider()
    }
  }

  public override loadFrom(canvasElements: { [id: number]: ProkyonCanvasElement | undefined }, canvasElementSerialized: CanvasElementSerialized) {
    if (canvasElementSerialized.data.center !== undefined && canvasElementSerialized.data.scdPoint !== undefined) {
      const center = canvasElements[canvasElementSerialized.data.center];
      const scdPoint = canvasElements[canvasElementSerialized.data.scdPoint];

      if (center instanceof PointElement && scdPoint instanceof PointElement) {
        this.pointProvider = () => center.point;
        this.radiusProvider = () => getDistanceUndef(center.point, scdPoint.point);
        this.dataProvider = () => {
          return {
            center: center.id,
            scdPoint: scdPoint.id
          }
        }

        this.addDependency(center, scdPoint);
      }

      this.color = canvasElementSerialized.style.color;
      this.lineWidth = canvasElementSerialized.style.size ?? this.lineWidth;
      this.visible = canvasElementSerialized.style.visible;
    }
  }

  public override resetTempListener = () => {
    this._tempPoint = undefined;
    this._tempRadius = undefined;
  }
}

type PointProvider = () => (Point | undefined);
type RadiusProvider = () => (number | undefined);
