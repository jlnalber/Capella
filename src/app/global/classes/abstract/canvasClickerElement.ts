import {CanvasIdElement} from "./canvasIdElement";
import {Point} from "src/app/global/interfaces/point";
import AbstractRenderingContext from "../abstractRenderingContext";

export abstract class CanvasClickerElement extends CanvasIdElement {

  // public abstract readonly componentType: Type<FormulaElement>;
  // public abstract readonly formulaDialogType: Type<FormulaDialogElement> | undefined;

  public getDistance(p: Point, ctx: AbstractRenderingContext): number | undefined {
    return undefined;
  }
}
