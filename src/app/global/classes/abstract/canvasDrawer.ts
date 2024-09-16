import AbstractRenderingContext from "../abstractRenderingContext";

export abstract class CanvasDrawer {
  public abstract draw(ctx: AbstractRenderingContext): void;
}
