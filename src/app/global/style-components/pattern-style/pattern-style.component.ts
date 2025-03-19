import { Component, ElementRef, Input, ViewChild, ViewRef } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import Picker from '../pickers/picker';
import { DEFAULT_PATTERN_ZOOMFACTOR, Pattern } from '../../interfaces/canvasStyles/colorStyle';
import { getImageToBase64 } from '../../essentials/imageUtils';
import { FormsModule } from '@angular/forms';
import { SnackbarService } from '../../snackbar/snackbar.service';

@Component({
  selector: 'app-pattern-style',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './pattern-style.component.html',
  styleUrl: './pattern-style.component.scss'
})
export class PatternStyleComponent extends AbstractPickerComponent<Picker<Pattern>, Pattern> {
  @Input({required: true}) public picker?: Picker<Pattern>;
  
  @ViewChild('inp') contentDiv?: ElementRef;

  public get zoomFactor(): number {
    return this.picker?.value?.zoomFactor ?? DEFAULT_PATTERN_ZOOMFACTOR
  }

  public set zoomFactor(value: number) {
    if (this.picker && this.picker.value) {
      this.picker.value.zoomFactor = value;
      this.onChange();
    }
  }

  public fileOpened() {
    
    const inp = this.contentDiv?.nativeElement as HTMLInputElement | undefined;

    if (inp && inp.files) {
      const file = inp.files?.item(0);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string' && this.picker) {
            const base64String = e.target.result;
            getImageToBase64(base64String, () => {
              if (this.picker) {
                this.picker.value = {
                  picture: base64String,
                  zoomFactor: this.zoomFactor
                };
              }
            })
          }
        };
        reader.onerror = ev => {
          this.snackbarService.openErrorSnackbar(ev.type)
        }
        reader.readAsDataURL(file);
      }
    }
  }

  constructor(private readonly snackbarService: SnackbarService) {
    super();
  }
}
