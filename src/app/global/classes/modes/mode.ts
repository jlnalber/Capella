import { Point } from "src/app/global/interfaces/point";
import AbstractDrawerService from "../abstract/abstractDrawerService";
import { PointerContext } from "../pointerController";
import AbstractRenderingContext from "../abstractRenderingContext";

export abstract class Mode<T extends AbstractDrawerService> {

  public abstract pointerMove(service: T, renderingContext: AbstractRenderingContext, from: Point, to: Point, pointerContext: PointerContext): void;

  public pointerStart(service: T, renderingContext: AbstractRenderingContext, point: Point, pointerContext: PointerContext): void { }

  public pointerEnd(service: T, renderingContext: AbstractRenderingContext, point: Point, pointerContext: PointerContext): void { }

  public abstract click(service: T, renderingContext: AbstractRenderingContext, point: Point, pointerContext: PointerContext): void;

}
