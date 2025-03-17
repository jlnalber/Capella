import { AfterViewInit, Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import ObjectStyle, { areEqualObjectStyles, getEmptyObjectStyleForCopy, getEmptyObjectStyleWrapperForCopy, ObjectStyleWrapper } from '../../interfaces/canvasStyles/objectStyle';
import Picker from '../pickers/picker';
import { WhiteboardService } from '../../../whiteboard/services/whiteboard.service';
import { LoadingComponent } from "../../loading/loading.component";
import { FormsModule } from '@angular/forms';
import { ObjectStyleComponent } from "../object-style/object-style.component";
import { CommonModule } from '@angular/common';

type CustomOrSaved = 'custom' | 'saved';

@Component({
  selector: 'app-select-object-style',
  standalone: true,
  imports: [
    LoadingComponent,
    FormsModule,
    CommonModule,
    ObjectStyleComponent
],
  templateUrl: './select-object-style.component.html',
  styleUrl: './select-object-style.component.scss'
})
export class SelectObjectStyleComponent  extends AbstractPickerComponent<Picker<ObjectStyle>, ObjectStyle> implements AfterViewInit {
  @Input({required: true}) public picker?: Picker<ObjectStyle>;

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

  constructor(protected readonly whiteboardService: WhiteboardService) {
    super();
  }

  public get chosenObjectStyle(): ObjectStyleWrapper | undefined {
    if (this.picker) {
      const value = this.picker.value;
      
      // determine whether it is custom or not...
      const ojs = this.savedObjectStyles;
      for (let o of ojs) {
        if (areEqualObjectStyles(value, o.style)) {
          return o;
        }
      }
    }
    return undefined;
  }

  public savedObjectStyles: ObjectStyleWrapper[] = [ getEmptyObjectStyleWrapperForCopy(), ...this.whiteboardService.settings.getObjectStyles() ]

  private _selectedSavedObjectStyle: ObjectStyleWrapper = this.savedObjectStyles[0];

  public get selectedSavedObjectStyle(): ObjectStyleWrapper {
    return this._selectedSavedObjectStyle;
  }

  public set selectedSavedObjectStyle(value: ObjectStyleWrapper) {
    this._selectedSavedObjectStyle = value;
    if (this.isCustom === 'saved' && this.picker && this._selectedSavedObjectStyle) {
      this.picker.value = this._selectedSavedObjectStyle.style;
    }
  }

  public customPicker?: Picker<ObjectStyle>;

  ngAfterViewInit(): void {
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
        let o: ObjectStyle | undefined = this.isCustom === 'custom' ? this.picker?.value : undefined;
        this.customPicker = new Picker<ObjectStyle>(() => o ?? getEmptyObjectStyleForCopy(), (objectStyle?: ObjectStyle) => {
          o = objectStyle ?? o;
          if (this.isCustom === 'custom' && this.picker) {
            this.picker.value = o;
          }
        }, true);
        this.customPicker.onValueChanged.addListener(() => this.onChange());
      }, 0)
  }
}
