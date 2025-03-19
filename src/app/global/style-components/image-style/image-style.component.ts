import { Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import Picker from '../pickers/picker';
import ImageStyle, { ALL_IMAGESMOOTHINGQUALITY, getEmptyImageStyleForCopy } from '../../interfaces/canvasStyles/imageStyle';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from "../../loading/loading.component";
import { DEFAULT_IMAGESMOOTHINGENABLED, DEFAULT_IMAGESMOOTHINGQUALITY } from '../../interfaces/canvasStyles/styleTypes';

@Component({
  selector: 'app-image-style',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent
],
  templateUrl: './image-style.component.html',
  styleUrl: './image-style.component.scss'
})
export class ImageStyleComponent extends AbstractPickerComponent<Picker<ImageStyle>, ImageStyle> {
  @Input({required: true}) public picker?: Picker<ImageStyle>;
  
  private _imageSmoothingEnabled: boolean = DEFAULT_IMAGESMOOTHINGENABLED;

  public get imageSmoothingEnabled(): boolean {
    if (this.picker && this.picker.value && this.picker.value.imageSmoothingEnabled !== undefined) {
      this._imageSmoothingEnabled = this.picker.value.imageSmoothingEnabled;
    }
    return this._imageSmoothingEnabled;
  }

  public set imageSmoothingEnabled(value: boolean) {
    if (this.picker) {
      this._imageSmoothingEnabled = value;

      if (this.picker.value === undefined) {
        this.picker.value = getEmptyImageStyleForCopy();
      }
      this.picker.value.imageSmoothingEnabled = value;

      this.onChange();
    }
  }
  
  public get imageSmoothingQuality(): ImageSmoothingQuality {
    return this.picker?.value?.imageSmoothingQuality ?? DEFAULT_IMAGESMOOTHINGQUALITY;
  }
  
  public set imageSmoothingQuality(value: ImageSmoothingQuality) {
    if (this.picker) {
      if (this.picker.value === undefined) {
        const ess = getEmptyImageStyleForCopy();
        ess.imageSmoothingQuality = value;
        this.picker.value = ess;
      }
      else {
        this.picker.value.imageSmoothingQuality = value;
      }
      this.onChange();
    }
  }

  public get imageSmoothingQualities(): ImageSmoothingQuality[] {
    return ALL_IMAGESMOOTHINGQUALITY
  }

}