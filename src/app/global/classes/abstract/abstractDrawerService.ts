import { Canvas } from "../../canvas/canvas";
import { Point } from "../../interfaces/point";
import AbstractRenderingContext from "../abstractRenderingContext";
import { Mode } from "../modes/mode";
import { PointerType } from "../pointerController";
import AbstractSettingsService from "./abstractSettingsService";

export default abstract class AbstractDrawerService {
  public canvas?: Canvas;
  
  protected redrawListener = () => {
    this.redraw();
  }

  public abstract redraw(): void;

  public abstract renderingContext: AbstractRenderingContext;

  public abstract getModeForPointerType(pointerType: PointerType): Mode<AbstractDrawerService, AbstractSettingsService> | undefined

  public abstract zoomToBy(p: Point, factor: number): void;

} // TODO: unify