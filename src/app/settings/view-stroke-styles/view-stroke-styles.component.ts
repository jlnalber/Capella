import { Component, OnDestroy } from '@angular/core';
import { LoadingComponent } from "../../global/loading/loading.component";
import { ViewObjectsComponent } from "../view-objects/view-objects.component";
import AbstractViewObjectsComponent from '../view-objects/abstractViewObjectsComponent';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';
import { EMPTY_STROKESTYLEWRAPPER, getCopyOfStrokeStyleWrapper, StrokeStyle, StrokeStyleWrapper } from 'src/app/global/interfaces/canvasStyles/strokeStyle';
import { StrokeStyleWrapperComponent } from 'src/app/global/style-components/stroke-style-wrapper/stroke-style-wrapper.component';

@Component({
  selector: 'app-view-stroke-styles',
  standalone: true,
  imports: [LoadingComponent, ViewObjectsComponent],
  templateUrl: './view-stroke-styles.component.html',
  styleUrl: './view-stroke-styles.component.scss'
})
export class ViewStrokeStylesComponent extends AbstractViewObjectsComponent<StrokeStyleWrapper, StrokeStyle, StrokeStyleWrapperComponent> implements OnDestroy {

  constructor (whiteboardService: WhiteboardService) {
    super(whiteboardService,
          ['Strichstil', 'Strichstile'],
          (o: StrokeStyleWrapper) => getCopyOfStrokeStyleWrapper(o),
          StrokeStyleWrapperComponent,
          EMPTY_STROKESTYLEWRAPPER);
  }

  protected override saveAdditionObjects(objs: StrokeStyleWrapper[]): void {
    this.whiteboardService.settings.setStrokeStyles(objs);
  }
  
  protected override getAdditionalObjects(): StrokeStyleWrapper[] {
    return this.whiteboardService.settings.getStrokeStyles();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

}