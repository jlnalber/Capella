import { AfterViewInit, Component, Input } from '@angular/core';
import AbstractStyleWrapperComponent from '../object-style-wrapper/abstractStyleWrapperComponent';
import Picker from '../pickers/picker';
import FillStyle, { FillStyleWrapper, getEmptyFillStyleForCopy } from '../../interfaces/canvasStyles/fillStyle';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from "../../loading/loading.component";
import { FillStyleComponent } from "../fill-style/fill-style.component";

@Component({
  selector: 'app-fill-style-wrapper',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent,
    FillStyleComponent
],
  templateUrl: './fill-style-wrapper.component.html',
  styleUrl: './fill-style-wrapper.component.scss'
})
export class FillStyleWrapperComponent extends AbstractStyleWrapperComponent<FillStyleWrapper, FillStyle> implements AfterViewInit {
  @Input({required: true}) public picker?: Picker<FillStyleWrapper>;

  public ngAfterViewInit(): void {
      this.afterViewInit();
  }

  constructor(whiteboardService: WhiteboardService) {
    super(whiteboardService, () => getEmptyFillStyleForCopy());
  }
}
