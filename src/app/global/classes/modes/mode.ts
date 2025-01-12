import { Point } from "src/app/global/interfaces/point";
import AbstractDrawerService from "../abstract/abstractDrawerService";
import { PointerContext } from "../pointerController";
import AbstractRenderingContext from "../renderingContext/abstractRenderingContext";

export abstract class Mode<T extends AbstractDrawerService> {

  constructor() { }

  public abstract pointerMove(service: T, renderingContext: AbstractRenderingContext, from: Point, to: Point, pointerContext: PointerContext, evt: PointerEvent): void;

  public pointerStart(service: T, renderingContext: AbstractRenderingContext, point: Point, pointerContext: PointerContext, evt: PointerEvent): void { }

  public pointerEnd(service: T, renderingContext: AbstractRenderingContext, point: Point, pointerContext: PointerContext, evt: PointerEvent): void { }

  public abstract click(service: T, renderingContext: AbstractRenderingContext, point: Point, pointerContext: PointerContext, evt: PointerEvent): void;

}
