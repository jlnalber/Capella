import { AfterViewInit, Component, Input } from '@angular/core';
import AbstractSelectStyleComponent from '../select-object-style/abstractSelectStyleComponent';
import ImageStyle, { areEqualImageStyles, getEmptyImageStyleWrapperForCopy, ImageStyleWrapper } from '../../interfaces/canvasStyles/imageStyle';
import Picker from '../pickers/picker';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from "../../loading/loading.component";
import { ImageStyleComponent } from "../image-style/image-style.component";

@Component({
  selector: 'app-select-image-style',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent,
    ImageStyleComponent
],
  templateUrl: './select-image-style.component.html',
  styleUrl: './select-image-style.component.scss'
})
export class SelectImageStyleComponent extends AbstractSelectStyleComponent<ImageStyleWrapper, ImageStyle> implements AfterViewInit {
  @Input({required: true}) public picker?: Picker<ImageStyle>;

  constructor(whiteboardService: WhiteboardService) {
    super(whiteboardService, (o1: ImageStyle | undefined, o2: ImageStyle | undefined) => areEqualImageStyles(o1, o2), () => getEmptyImageStyleWrapperForCopy(), (ws: WhiteboardService) => ws.settings.getImageStyles());
  }

  ngAfterViewInit(): void {
    this.afterInit();
  }
}
