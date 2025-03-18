import { AfterViewInit, Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import ObjectStyle, { areEqualObjectStyles, getEmptyObjectStyleForCopy, getEmptyObjectStyleWrapperForCopy, ObjectStyleWrapper } from '../../interfaces/canvasStyles/objectStyle';
import Picker from '../pickers/picker';
import { WhiteboardService } from '../../../whiteboard/services/whiteboard.service';
import { LoadingComponent } from "../../loading/loading.component";
import { FormsModule } from '@angular/forms';
import { ObjectStyleComponent } from "../object-style/object-style.component";
import { CommonModule } from '@angular/common';
import AbstractSelectStyleComponent from './abstractSelectStyleComponent';

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
export class SelectObjectStyleComponent extends AbstractSelectStyleComponent<ObjectStyleWrapper, ObjectStyle> implements AfterViewInit {
  @Input({required: true}) public picker?: Picker<ObjectStyle>;

  constructor(whiteboardService: WhiteboardService) {
    super(whiteboardService, (o1: ObjectStyle | undefined, o2: ObjectStyle | undefined) => areEqualObjectStyles(o1, o2), () => getEmptyObjectStyleWrapperForCopy(), (ws: WhiteboardService) => ws.settings.getObjectStyles());
  }

  ngAfterViewInit(): void {
    this.afterInit();
  }
}
