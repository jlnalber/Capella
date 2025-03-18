import { Component, OnDestroy } from '@angular/core';
import { ViewObjectsComponent } from "../view-objects/view-objects.component";
import { LoadingComponent } from "../../global/loading/loading.component";
import AbstractViewObjectsComponent from '../view-objects/abstractViewObjectsComponent';
import FillStyle, { EMPTY_FILLSTYLEWRAPPER, FillStyleWrapper, getCopyOfFillStyleWrapper } from 'src/app/global/interfaces/canvasStyles/fillStyle';
import { FillStyleWrapperComponent } from 'src/app/global/style-components/fill-style-wrapper/fill-style-wrapper.component';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';

@Component({
  selector: 'app-view-fill-styles',
  standalone: true,
  imports: [ViewObjectsComponent, LoadingComponent],
  templateUrl: './view-fill-styles.component.html',
  styleUrl: './view-fill-styles.component.scss'
})
export class ViewFillStylesComponent extends AbstractViewObjectsComponent<FillStyleWrapper, FillStyle, FillStyleWrapperComponent> implements OnDestroy {

  constructor (whiteboardService: WhiteboardService) {
    super(whiteboardService,
          ['Füllungsstil', 'Füllungsstile'],
          (o: FillStyleWrapper) => getCopyOfFillStyleWrapper(o),
          FillStyleWrapperComponent,
          EMPTY_FILLSTYLEWRAPPER);
  }

  protected override saveAdditionObjects(objs: FillStyleWrapper[]): void {
    this.whiteboardService.settings.setFillStyles(objs);
  }
  
  protected override getAdditionalObjects(): FillStyleWrapper[] {
    return this.whiteboardService.settings.getFillStyles();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

}
