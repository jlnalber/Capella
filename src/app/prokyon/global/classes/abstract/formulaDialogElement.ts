import { Dialog } from "src/app/global/dialog/dialog";
import { ProkyonCanvasElement } from "./prokyonCanvasElement";

export default abstract class FormulaDialogElement {
  public abstract dialogData: ProkyonCanvasElement;

  public dialog!: Dialog<FormulaDialogElement>;
}
