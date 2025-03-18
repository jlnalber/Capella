import { AfterViewInit, Component, Input } from '@angular/core';
import AbstractSelectStyleComponent from '../select-object-style/abstractSelectStyleComponent';
import FillStyle, { areEqualFillStyles, FillStyleWrapper, getEmptyFillStyleWrapperForCopy } from '../../interfaces/canvasStyles/fillStyle';
import Picker from '../pickers/picker';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';
import { FormsModule } from '@angular/forms';
import { FillStyleComponent } from "../fill-style/fill-style.component";
import { LoadingComponent } from "../../loading/loading.component";

@Component({
  selector: 'app-select-fill-style',
  standalone: true,
  imports: [
    FormsModule,
    FillStyleComponent,
    LoadingComponent
],
  templateUrl: './select-fill-style.component.html',
  styleUrl: './select-fill-style.component.scss'
})
export class SelectFillStyleComponent extends AbstractSelectStyleComponent<FillStyleWrapper, FillStyle> implements AfterViewInit {
  @Input({required: true}) public picker?: Picker<FillStyle>;

  constructor(whiteboardService: WhiteboardService) {
    super(whiteboardService, (o1: FillStyle | undefined, o2: FillStyle | undefined) => areEqualFillStyles(o1, o2), () => getEmptyFillStyleWrapperForCopy(), (ws: WhiteboardService) => ws.settings.getFillStyles());
  }

  ngAfterViewInit(): void {
    this.afterInit();
  }
}
