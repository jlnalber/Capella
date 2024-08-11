import { Event } from "../../essentials/event";
import { WhiteboardService } from "src/app/services/whiteboard.service";
import getNewID from "../../essentials/idProvider";
import AbstractRenderingContext from "../abstractRenderingContext";

export abstract class CanvasElement {
  public readonly id: number;
  
  protected constructor() {
    this.id = getNewID();
  }

  // public abstract serialize(): CanvasElementSerialized;
  // public abstract loadFrom(canvasElements: { [id: number]: CanvasElement | undefined }, canvasElementSerialized: CanvasElementSerialized, drawerService: DrawerService): void;

  public readonly onChange: Event<any> = new Event<any>();
  public readonly onRemove: Event<WhiteboardService> = new Event<WhiteboardService>();
  public readonly onAdd: Event<WhiteboardService> = new Event<WhiteboardService>();

  public abstract draw(ctx: AbstractRenderingContext): void;
}
