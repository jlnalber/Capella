import { AfterViewInit, Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import ObjectStyle, { getEmptyObjectStyleForCopy, ObjectStyleWrapper } from '../../interfaces/canvasStyles/objectStyle';
import Picker from '../pickers/picker';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';
import { ObjectStyleComponent } from "../object-style/object-style.component";
import { LoadingComponent } from "../../loading/loading.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-object-style-wrapper',
  standalone: true,
  imports: [
    ObjectStyleComponent,
    LoadingComponent,
    FormsModule
  ],
  templateUrl: './object-style-wrapper.component.html',
  styleUrl: './object-style-wrapper.component.scss'
})
export class ObjectStyleWrapperComponent extends AbstractPickerComponent<Picker<ObjectStyleWrapper>, ObjectStyleWrapper> implements AfterViewInit {
  @Input({required: true}) public picker?: Picker<ObjectStyleWrapper>;

  public objectStylePicker?: Picker<ObjectStyle>;

  public get name(): string {
    return this.picker?.value?.name ?? '';
  }

  public set name(val: string) {
    if (this.picker && this.picker.value) {
      this.picker.value.name = val;
      this.onChange();
    }
  }

  public ngAfterViewInit(): void {
      setTimeout(() => {
        this.objectStylePicker = new Picker<ObjectStyle>(() => this.picker?.value?.style ?? getEmptyObjectStyleForCopy(), (objectStyle?: ObjectStyle) => {
          if (objectStyle && this.picker?.value) {
            this.picker.value.style = objectStyle;
            this.onChange();
          }
        }, true);
        this.objectStylePicker.onValueChanged.addListener(() => this.onChange());
      }, 0);
  }

  constructor(protected readonly whiteboardService: WhiteboardService) {
    super();
  }
}
