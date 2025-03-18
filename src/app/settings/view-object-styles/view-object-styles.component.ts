import { Component, OnDestroy } from '@angular/core';
import { LoadingComponent } from "../../global/loading/loading.component";
import { ViewObjectsComponent } from "../view-objects/view-objects.component";
import { EMPTY_OBJECTSTYLEWRAPPER, getCopyOfObjectStyleWrapper, ObjectStyleWrapper } from 'src/app/global/interfaces/canvasStyles/objectStyle';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';
import { ObjectStyleWrapperComponent } from 'src/app/global/style-components/object-style-wrapper/object-style-wrapper.component';
import AbstractViewObjectsComponent from '../view-objects/abstractViewObjectsComponent';

@Component({
  selector: 'app-view-object-styles',
  standalone: true,
  imports: [
    LoadingComponent,
    ViewObjectsComponent
  ],
  templateUrl: './view-object-styles.component.html',
  styleUrl: './view-object-styles.component.scss'
})
export class ViewObjectStylesComponent extends AbstractViewObjectsComponent<ObjectStyleWrapper, ObjectStyleWrapperComponent> implements OnDestroy {

  constructor (whiteboardService: WhiteboardService) {
    super(whiteboardService,
          ['Objektstil', 'Objektstile'],
          (o: ObjectStyleWrapper) => getCopyOfObjectStyleWrapper(o),
          ObjectStyleWrapperComponent,
          EMPTY_OBJECTSTYLEWRAPPER);
  }

  protected override saveAdditionObjects(objs: ObjectStyleWrapper[]): void {
    this.whiteboardService.settings.setObjectStyles(objs);
  }

  protected override getDefaultObjects(): ObjectStyleWrapper[] {
    return [];
  }
  
  protected override getAdditionalObjects(): ObjectStyleWrapper[] {
    return this.whiteboardService.settings.getObjectStyles();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

}
