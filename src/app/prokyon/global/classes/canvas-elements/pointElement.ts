import {Type} from "@angular/core";
import {PointFormulaComponent} from "../../../formula-tab/point-formula/point-formula.component";
import {FormulaElement} from "../abstract/formulaElement";
import DynamicElement from "./dynamicElement";
import {CanvasElementSerialized, Style} from "../../essentials/serializer";
import {DrawerService} from "../../../services/drawer.service";
import {ViewPointElementComponent} from "../../../formula-dialogs/view-point-element/view-point-element.component";
import { BLACK, Color, colorAsTransparent } from "src/app/global/interfaces/color";
import { Point } from "src/app/global/interfaces/point";
import { ProkyonCanvasElement } from "../abstract/prokyonCanvasElement";
import AbstractRenderingContext from "src/app/global/classes/renderingContext/abstractRenderingContext";
import { isIn } from "src/app/global/essentials/utils";


type Data = {
  x: number | undefined,
  y: number | undefined,
  dependent: boolean,
  name?: string
}

export default class PointElement extends DynamicElement {

  public readonly componentType: Type<FormulaElement> = PointFormulaComponent;
  public override formulaDialogType = ViewPointElementComponent;

  private _stroke: Color = {
    r: 100,
    g: 100,
    b: 100
  }
  public get stroke(): Color {
    return this._stroke;
  }
  public set stroke(value: Color) {
    this._stroke = value;
    this.onChange.emit(value);
  }

  private _strokeWidth: number = 3;
  public get strokeWidth(): number {
    return this._strokeWidth;
  }
  public set strokeWidth(value: number) {
    this._strokeWidth = value;
    this.onChange.emit(value);
  }

  private _radius: number = 5;
  public get radius(): number {
    return this._radius;
  }
  public set radius(value: number) {
    this._radius = value;
    this.onChange.emit(value);
  }

  private _x: number | undefined;
  private _y: number | undefined;

  public get x(): number | undefined {
    return this._x;
  }

  public set x(value: number | undefined) {
    if (!this.dependent) {
      this._x = value;
      this.onChange.emit(value);
    }
  }

  public get y(): number | undefined {
    return this._y;
  }

  public set y(value: number | undefined) {
    if (!this.dependent) {
      this._y = value;
      this.onChange.emit(value);
    }
  }

  public set point(value: Point | undefined) {
    if (!this.dependent) {
      this.forceSetPoint(value);
    }
  }

  public forceSetPoint(value: Point | undefined) {
    this._x = value?.x;
    this._y = value?.y;
    this.onChange.emit(value);
  }

  public get point(): Point | undefined {
    if (this.x !== undefined && this.y !== undefined) {
      return {
        x: this.x,
        y: this.y
      }
    }
    return undefined;
  }

  // indicates whether this point is element of a selected dependencyPointElements
  public selected: boolean = false;

  // the constructor, dependent means that the point is dependent of another canvas element
  constructor(p: Point | undefined, color: Color = BLACK, public dependent = false, dependencies: ProkyonCanvasElement[] = [], visible: boolean = true, showLabel: boolean = true) {
    super(dependencies);
    this._x = p?.x;
    this._y = p?.y;
    this._color = color;
    this._visible = visible;
    this.configuration.showLabel = showLabel;
  }

  public override draw(ctx: AbstractRenderingContext): void {
    const selectionRadiusFactor = 1.75;
    const point = this.point;
    if (point !== undefined && isIn(point, ctx.range, selectionRadiusFactor * this.radius / ctx.zoom)) {
      if (this.selected || ctx.selection.indexOf(this) !== -1) {
        ctx.drawCircle(point, selectionRadiusFactor * this.radius, true, {
          color: colorAsTransparent(this.color, 0.3)
        })
      }
      ctx.drawCircle(point, this.radius, true, {
        color: this.color
      }, {
        color: this.stroke,
        lineWidth: this.strokeWidth,
        uniformSizeOnZoom: true
      });
    }
  }

  public override getDistance(p: Point, ctx: AbstractRenderingContext): number | undefined {
    const t = this.point;
    if (t !== undefined) {
      // calculate the distance, subtract the radius --> point in canvas isn't a perfect geometric point but has a radius
      return Math.sqrt((t.x - p.x) ** 2 + (t.y - p.y) ** 2) - this.radius / ctx.zoom;
    }
    return undefined;
  }

  public override getPositionForLabel(rtx: AbstractRenderingContext): Point | undefined {
    const depos = 15;
    const x = this.x;
    const y = this.y;
    if (x !== undefined && y !== undefined) {
      return {
        x: x + depos / rtx.zoom,
        y: y + depos / rtx.zoom
      }
    }
    return undefined;
  }

  public static getDefaultInstance(): PointElement {
    return new PointElement(undefined);
  }

  public override serialize(): CanvasElementSerialized {
    const data: Data = {
      x: this.x,
      y: this.y,
      dependent: this.dependent
    };
    return {
      data,
      style: {
        color: this.color,
        stroke: this.stroke,
        size: this.radius,
        strokeWidth: this.strokeWidth,
        visible: this.visible
      }
    };
  }

  public override loadFrom(canvasElements: {
    [p: number]: ProkyonCanvasElement | undefined
  }, canvasElementSerialized: CanvasElementSerialized, drawerService: DrawerService) {
    const data: Data = canvasElementSerialized.data as Data;
    this.forceSetPoint(data.x === undefined || data.y === undefined ? undefined : {
      x: data.x,
      y: data.y
    });
    this.dependent = data.dependent;

    this.loadStyle(canvasElementSerialized.style);
  }

  protected loadStyle(style: Style): void {
    this.color = style.color;
    this.visible = style.visible;
    this.radius = style.size ?? this.radius;
    this.stroke = style.stroke ?? this.stroke;
    this.strokeWidth = style.strokeWidth ?? this.strokeWidth;
  }

}
