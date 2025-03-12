import AbstractListenerCanvas from "../../canvas/abstractListenerCanvas";
import { Point } from "../../interfaces/point";
import AbstractRenderingContext from "../renderingContext/abstractRenderingContext";
import { Mode } from "../modes/mode";
import { PointerType } from "../pointerController";

export default abstract class AbstractDrawerService {
  public canvas?: AbstractListenerCanvas;
  
  protected redrawListener = async () => {
    await this.redraw();
  }

  public abstract redraw(): Promise<void>;

  public abstract renderingContext: AbstractRenderingContext;

  public abstract getModeForPointerType(pointerType: PointerType): Mode<AbstractDrawerService> | undefined;

  public abstract zoomToBy(p: Point, factor: number): void;

} // TODO: unify