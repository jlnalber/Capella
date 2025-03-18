import { AfterViewInit, Component, Input } from '@angular/core';
import AbstractStyleWrapperComponent from '../object-style-wrapper/abstractStyleWrapperComponent';
import { getEmptyStrokeStyleForCopy, StrokeStyle, StrokeStyleWrapper } from '../../interfaces/canvasStyles/strokeStyle';
import Picker from '../pickers/picker';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';
import { StrokeStyleComponent } from "../stroke-style/stroke-style.component";
import { LoadingComponent } from "../../loading/loading.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stroke-style-wrapper',
  standalone: true,
  imports: [
    StrokeStyleComponent,
    LoadingComponent,
    FormsModule
  ],
  templateUrl: './stroke-style-wrapper.component.html',
  styleUrl: './stroke-style-wrapper.component.scss'
})
export class StrokeStyleWrapperComponent extends AbstractStyleWrapperComponent<StrokeStyleWrapper, StrokeStyle> implements AfterViewInit {
  @Input({required: true}) public picker?: Picker<StrokeStyleWrapper>;

  public ngAfterViewInit(): void {
      this.afterViewInit();
  }

  constructor(whiteboardService: WhiteboardService) {
    super(whiteboardService, () => getEmptyStrokeStyleForCopy());
  }
}
