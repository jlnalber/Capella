import { AfterViewInit, Component, Input } from '@angular/core';
import AbstractSelectStyleComponent from '../select-object-style/abstractSelectStyleComponent';
import { areEqualStrokeStyles, getEmptyStrokeStyleWrapperForCopy, StrokeStyle, StrokeStyleWrapper } from '../../interfaces/canvasStyles/strokeStyle';
import Picker from '../pickers/picker';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from "../../loading/loading.component";
import { StrokeStyleComponent } from "../stroke-style/stroke-style.component";

@Component({
  selector: 'app-select-stroke-style',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent,
    StrokeStyleComponent
],
  templateUrl: './select-stroke-style.component.html',
  styleUrl: './select-stroke-style.component.scss'
})
export class SelectStrokeStyleComponent extends AbstractSelectStyleComponent<StrokeStyleWrapper, StrokeStyle> implements AfterViewInit {
  @Input({required: true}) public picker?: Picker<StrokeStyle>;

  constructor(whiteboardService: WhiteboardService) {
    super(whiteboardService, (o1: StrokeStyle | undefined, o2: StrokeStyle | undefined) => areEqualStrokeStyles(o1, o2), () => getEmptyStrokeStyleWrapperForCopy(), (ws: WhiteboardService) => ws.settings.getStrokeStyles());
  }

  ngAfterViewInit(): void {
    this.afterInit();
  }
}
