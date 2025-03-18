import { StyleWrapper } from "src/app/settings/view-objects/abstractViewObjectsComponent";
import AbstractPickerComponent from "../abstractPickerComponent";
import Picker from "../pickers/picker";
import { WhiteboardService } from "src/app/whiteboard/services/whiteboard.service";

export default abstract class AbstractStyleWrapperComponent<T extends StyleWrapper<S>, S> extends AbstractPickerComponent<Picker<T>, T> {
    
    public get name(): string {
        return this.picker?.value?.name ?? '';
    }
    
    public set name(val: string) {
        if (this.picker && this.picker.value) {
            this.picker.value.name = val;
            this.onChange();
        }
    }

    public stylePicker?: Picker<S>;

    public afterViewInit(): void {
        setTimeout(() => {
            this.stylePicker = new Picker<S>(() => this.picker?.value?.style ?? this.getEmptyStyleForCopy(), (style?: S) => {
                if (style && this.picker?.value) {
                    this.picker.value.style = style;
                    this.onChange();
                }
            }, true);
            this.stylePicker.onValueChanged.addListener(() => this.onChange());
        }, 0);
    }

    constructor(protected readonly whiteboardService: WhiteboardService,
                protected readonly getEmptyStyleForCopy: () => S) {
        super();
    }
}