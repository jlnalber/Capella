import {Type} from "@angular/core";
import {FormulaElement} from "./formulaElement";
import {Point} from "src/app/global/interfaces/point";
import {RenderingContext} from "src/app/global/classes/renderingContext";
import {BLACK, Color} from "src/app/global/interfaces/color";
import {DrawerService} from "../../../services/drawer.service";
import {CanvasElementSerialized} from "../../essentials/serializer";
import FormulaDialogElement from "./formulaDialogElement";
import { CanvasClickerElement } from "src/app/global/classes/abstract/canvasClickerElement";
import AbstractRenderingContext from "src/app/global/classes/abstractRenderingContext";

export interface ProkyonCanvasElementConfiguration {
  label?: string,
  showLabel?: boolean,
  dontUseLaTeX?: boolean,
  displayBlackLabel?: boolean,
  labelSizeFactor?: number
  name?: string,
  formula?: string,
  editable?: boolean,
  dashed?: boolean
}

export abstract class ProkyonCanvasElement extends CanvasClickerElement {
  
  public abstract readonly componentType: Type<FormulaElement>;
  public abstract readonly formulaDialogType: Type<FormulaDialogElement> | undefined;

  public abstract serialize(): CanvasElementSerialized;
  public abstract loadFrom(canvasElements: { [id: number]: ProkyonCanvasElement | undefined }, canvasElementSerialized: CanvasElementSerialized, drawerService: DrawerService): void;

  public configuration: ProkyonCanvasElementConfiguration = {};

  protected _color: Color = BLACK;
  public get color(): Color {
    return this._color;
  }
  public set color(value: Color) {
    this._color = value;
    this.svgLabel = undefined;
    this.onChange.emit(value);
  }

  protected _visible: boolean = true;
  public get visible(): boolean {
    return this._visible;
  }
  public set visible(value: boolean) {
    this._visible = value;
    this.onChange.emit(value);
  }

  public svgLabel: undefined | HTMLImageElement;

  private _labelTranslate: Point = {
    x: 0,
    y: 0
  }

  public get labelTranslateX(): number {
    return this._labelTranslate.x;
  }
  public set labelTranslateX(value: number) {
    this._labelTranslate.x = value;
    this.onChange.emit(value);
  }

  public get labelTranslateY(): number {
    return this._labelTranslate.y;
  }
  public set labelTranslateY(value: number) {
    this._labelTranslate.y = value;
    this.onChange.emit(value);
  }

  public get labelTranslate(): Point {
    return {
      x: this._labelTranslate.x,
      y: this._labelTranslate.y
    }
  }
  public set labelTranslate(value: Point) {
    this._labelTranslate = {
      x: value.x,
      y: value.y
    }
    this.onChange.emit(value);
  }

  protected constructor() {
    super();
  }

  public getPositionForLabel(rtx: AbstractRenderingContext): Point | undefined {
    return undefined;
  }
}
