import { Event } from "../../essentials/event";
import getNewID from "../../essentials/idProvider";
import StrictEvent from "../../essentials/strictEvent";
import { CanvasDrawer } from "./canvasDrawer";

export abstract class CanvasIdElement<T> extends CanvasDrawer {
  public readonly id: number;
  
  protected constructor() {
    super();
    this.id = getNewID();
  }

  // public abstract serialize(): CanvasElementSerialized;
  // public abstract loadFrom(canvasElements: { [id: number]: CanvasElement | undefined }, canvasElementSerialized: CanvasElementSerialized, drawerService: DrawerService): void;

  public readonly onChange: StrictEvent<T> = new StrictEvent<any>();
  public readonly onRemove: Event<any> = new Event<any>();
  public readonly onAdd: Event<any> = new Event<any>();
}
