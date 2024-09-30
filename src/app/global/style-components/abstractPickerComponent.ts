import Picker from "./pickers/picker";

export default abstract class AbstractPickerComponent<T extends Picker<E>, E> {
    public abstract picker: T;
}