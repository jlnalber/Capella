import { AfterViewInit, Component, Input } from '@angular/core';
import AbstractStyleWrapperComponent from '../object-style-wrapper/abstractStyleWrapperComponent';
import ImageStyle, { getEmptyImageStyleForCopy, ImageStyleWrapper } from '../../interfaces/canvasStyles/imageStyle';
import Picker from '../pickers/picker';
import { FormsModule } from '@angular/forms';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';
import { LoadingComponent } from "../../loading/loading.component";
import { ImageStyleComponent } from "../image-style/image-style.component";

@Component({
  selector: 'app-image-style-wrapper',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent,
    ImageStyleComponent
],
  templateUrl: './image-style-wrapper.component.html',
  styleUrl: './image-style-wrapper.component.scss'
})
export class ImageStyleWrapperComponent extends AbstractStyleWrapperComponent<ImageStyleWrapper, ImageStyle> implements AfterViewInit {
  @Input({required: true}) public picker?: Picker<ImageStyleWrapper>;

  public ngAfterViewInit(): void {
      this.afterViewInit();
  }

  constructor(whiteboardService: WhiteboardService) {
    super(whiteboardService, () => getEmptyImageStyleForCopy());
  }
}
