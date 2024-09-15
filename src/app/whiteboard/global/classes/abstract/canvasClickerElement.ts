import {CanvasElement} from "./canvasElement";
import {Point} from "../../interfaces/point";
import AbstractRenderingContext from "../abstractRenderingContext";

export abstract class CanvasClickerElement extends CanvasElement {

  // public abstract readonly componentType: Type<FormulaElement>;
  // public abstract readonly formulaDialogType: Type<FormulaDialogElement> | undefined;

  public getDistance(p: Point, ctx: AbstractRenderingContext): number | undefined {
    return undefined;
  }
}
