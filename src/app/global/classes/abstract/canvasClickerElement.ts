import {Point} from "src/app/global/interfaces/point";
import AbstractRenderingContext from "../renderingContext/abstractRenderingContext";

export interface ICanvasClickerElement {

  // public abstract readonly componentType: Type<FormulaElement>;
  // public abstract readonly formulaDialogType: Type<FormulaDialogElement> | undefined;

  getDistance(p: Point, ctx: AbstractRenderingContext): number | undefined
}
