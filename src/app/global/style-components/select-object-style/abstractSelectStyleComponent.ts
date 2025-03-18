import { StyleWrapper } from "src/app/settings/view-objects/abstractViewObjectsComponent";
import AbstractPickerComponent from "../abstractPickerComponent";
import Picker from "../pickers/picker";
import { WhiteboardService } from "src/app/whiteboard/services/whiteboard.service";

export type CustomOrSaved = 'custom' | 'saved';

export default abstract class AbstractSelectStyleComponent<W extends StyleWrapper<S>, S> extends AbstractPickerComponent<Picker<S>, S> {

    private _isCustom?: CustomOrSaved;
    public get isCustom(): CustomOrSaved {
        return this._isCustom ?? 'custom';
    }

    public set isCustom(value: CustomOrSaved) {
        this._isCustom = value;
        if (value === 'custom' && this.customPicker && this.picker) {
        this.picker.value = this.customPicker.value;
        }
        if (value === 'saved' && this._selectedSavedObjectStyle && this.picker) {
        this.picker.value = this._selectedSavedObjectStyle.style;
        }
    }
  
  
    public get chosenObjectStyle(): W | undefined {
        if (this.picker) {
            const value = this.picker.value;
            
            // determine whether it is custom or not...
            const ojs = this.savedObjectStyles;
            for (let o of ojs) {
                if (this.areEqualStyles(value, o.style)) {
                return o;
                }
            }
        }
        return undefined;
    }
    
    public readonly savedObjectStyles: W[];
    
    private _selectedSavedObjectStyle: W;

    public get selectedSavedObjectStyle(): W {
        return this._selectedSavedObjectStyle;
    }

    public set selectedSavedObjectStyle(value: W) {
        this._selectedSavedObjectStyle = value;
        if (this.isCustom === 'saved' && this.picker && this._selectedSavedObjectStyle) {
            this.picker.value = this._selectedSavedObjectStyle.style;
        }
    }

    constructor(protected readonly whiteboardService: WhiteboardService, protected readonly areEqualStyles: (s1: S | undefined, s2: S | undefined) => boolean, protected readonly getEmptyStyle: () => W, protected readonly getSavedStyles: (whiteboardService: WhiteboardService) => W[]) {
        super();
        this.savedObjectStyles = [ this.getEmptyStyle(), ...this.getSavedStyles(whiteboardService) ]
        this._selectedSavedObjectStyle = this.savedObjectStyles[0];
    }

    public customPicker?: Picker<S>;

    public afterInit(): void {
        setTimeout(() => {
            const c = this.chosenObjectStyle;
            if (c === undefined) {
                this.isCustom = 'custom';
            }
            else {
                this._selectedSavedObjectStyle = c;
                this.isCustom = 'saved';
            }
    
            
            // initialize the custom picker
            let o: S | undefined = this.isCustom === 'custom' ? this.picker?.value : undefined;
            this.customPicker = new Picker<S>(() => o ?? this.getEmptyStyle().style, (objectStyle?: S) => {
                o = objectStyle ?? o;
                if (this.isCustom === 'custom' && this.picker) {
                    this.picker.value = o;
                }
            }, true);
            this.customPicker.onValueChanged.addListener(() => this.onChange());
        }, 0)
    }
}