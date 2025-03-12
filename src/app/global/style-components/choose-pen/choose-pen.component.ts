import { Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import PenPicker from '../pickers/penPicker';
import { Pen } from 'src/app/whiteboard/global/interfaces/penStyle';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from "../../loading/loading.component";

@Component({
  selector: 'app-choose-pen',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent
],
  templateUrl: './choose-pen.component.html',
  styleUrl: './choose-pen.component.scss'
})
export class ChoosePenComponent extends AbstractPickerComponent<PenPicker, number> {
  @Input({required: true}) public picker?: PenPicker;

  public getPenFor(num: number): Pen | undefined {
    if (this.picker && num < this.picker.penList.length) {
      return this.picker.penList[num];
    }
    else {
      return undefined;
    }
  }

  public get value(): number | undefined {
    return this.picker?.value;
  }

  public set value(num: number | undefined) {
    if (num !== undefined && this.picker !== undefined) {
      if (typeof num === "string") {
        num = Number.parseInt(num);
      }
      this.picker.value = num;
    }
  }
}
