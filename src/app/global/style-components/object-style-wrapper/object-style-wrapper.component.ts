import { AfterViewInit, Component, Input } from '@angular/core';
import ObjectStyle, { getEmptyObjectStyleForCopy, ObjectStyleWrapper } from '../../interfaces/canvasStyles/objectStyle';
import Picker from '../pickers/picker';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';
import { ObjectStyleComponent } from "../object-style/object-style.component";
import { LoadingComponent } from "../../loading/loading.component";
import { FormsModule } from '@angular/forms';
import AbstractStyleWrapperComponent from './abstractStyleWrapperComponent';

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
export class ObjectStyleWrapperComponent extends AbstractStyleWrapperComponent<ObjectStyleWrapper, ObjectStyle> implements AfterViewInit {
  @Input({required: true}) public picker?: Picker<ObjectStyleWrapper>;

  public ngAfterViewInit(): void {
      this.afterViewInit();
  }

  constructor(whiteboardService: WhiteboardService) {
    super(whiteboardService, () => getEmptyObjectStyleForCopy());
  }
}
