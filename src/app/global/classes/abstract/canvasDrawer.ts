import AbstractRenderingContext from "../renderingContext/abstractRenderingContext";

export abstract class CanvasDrawer {
  public abstract draw(ctx: AbstractRenderingContext): void;
}
