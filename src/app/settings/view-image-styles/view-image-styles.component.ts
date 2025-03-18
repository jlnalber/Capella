import { Component, OnDestroy } from '@angular/core';
import { ViewObjectsComponent } from "../view-objects/view-objects.component";
import { LoadingComponent } from "../../global/loading/loading.component";
import AbstractViewObjectsComponent from '../view-objects/abstractViewObjectsComponent';
import ImageStyle, { EMPTY_IMAGESTYLEWRAPPER, getCopyOfImageStyleWrapper, ImageStyleWrapper } from 'src/app/global/interfaces/canvasStyles/imageStyle';
import { ImageStyleWrapperComponent } from 'src/app/global/style-components/image-style-wrapper/image-style-wrapper.component';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';

@Component({
  selector: 'app-view-image-styles',
  standalone: true,
  imports: [ViewObjectsComponent, LoadingComponent],
  templateUrl: './view-image-styles.component.html',
  styleUrl: './view-image-styles.component.scss'
})
export class ViewImageStylesComponent extends AbstractViewObjectsComponent<ImageStyleWrapper, ImageStyle, ImageStyleWrapperComponent> implements OnDestroy {

  constructor (whiteboardService: WhiteboardService) {
    super(whiteboardService,
          ['Bildstil', 'Bildstile'],
          (o: ImageStyleWrapper) => getCopyOfImageStyleWrapper(o),
          ImageStyleWrapperComponent,
          EMPTY_IMAGESTYLEWRAPPER);
  }

  protected override saveAdditionObjects(objs: ImageStyleWrapper[]): void {
    this.whiteboardService.settings.setImageStyles(objs);
  }
  
  protected override getAdditionalObjects(): ImageStyleWrapper[] {
    return this.whiteboardService.settings.getImageStyles();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

}