import { Component, ElementRef, Input, ViewChild, ViewRef } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import Picker from '../pickers/picker';
import { Pattern } from '../../interfaces/canvasStyles/colorStyle';

@Component({
  selector: 'app-pattern-style',
  standalone: true,
  imports: [],
  templateUrl: './pattern-style.component.html',
  styleUrl: './pattern-style.component.scss'
})
export class PatternStyleComponent extends AbstractPickerComponent<Picker<Pattern>, Pattern> {
  @Input({required: true}) public picker?: Picker<Pattern>;
  
  @ViewChild('inp') contentDiv?: ElementRef;

  public fileOpened() {
    
    const inp = this.contentDiv?.nativeElement as HTMLInputElement | undefined;

    if (inp && inp.files) {
      const file = inp.files?.item(0);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string' && this.picker) {
            const base64String = e.target.result;
            this.picker.value = {
              picture: base64String
            };
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }
}
