import { Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import { FormsModule } from '@angular/forms';
import StringInputPicker from '../pickers/stringInputPicker';

@Component({
  selector: 'app-string-input',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './string-input.component.html',
  styleUrl: './string-input.component.scss'
})
export class StringInputComponent extends AbstractPickerComponent<StringInputPicker, string> {
  @Input({required: true}) public picker?: StringInputPicker;

  public get text(): string {
    return this.picker?.value ?? '';
  }

  public set text(value: string) {
    if (this.picker) {
      this.picker.value = value;
    }
  }
}
