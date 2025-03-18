import { WhiteboardService } from "src/app/whiteboard/services/whiteboard.service";
import Picker from "./pickers/picker";

export default abstract class AbstractPickerComponent<T extends Picker<E>, E> {
    public abstract picker?: T;

    public onChange() {
        this.picker?.triggerChange();
    }
}