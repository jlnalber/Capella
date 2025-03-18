import { Component, OnDestroy } from '@angular/core';
import { WhiteboardService } from '../../whiteboard/services/whiteboard.service';
import { DEFAULT_PEN, EasyPenStyle, getCopyOfPen, Pen } from '../../whiteboard/global/interfaces/penStyle';
import { PenStyleComponent } from 'src/app/global/style-components/pen-style/pen-style.component';
import { ViewObjectsComponent } from "../view-objects/view-objects.component";
import { LoadingComponent } from "../../global/loading/loading.component";
import AbstractViewObjectsComponent from '../view-objects/abstractViewObjectsComponent';

@Component({
  standalone: true,
  imports: [
    ViewObjectsComponent,
    LoadingComponent
],
  selector: 'app-view-pens',
  templateUrl: './view-pens.component.html',
  styleUrl: './view-pens.component.scss'
})
export class ViewPensComponent extends AbstractViewObjectsComponent<Pen, EasyPenStyle, PenStyleComponent> implements OnDestroy {

  constructor (whiteboardService: WhiteboardService) {
    super(whiteboardService,
          ['Stift', 'Stifte'],
          (p: Pen, index?: number) => getCopyOfPen(p, index),
          PenStyleComponent,
          DEFAULT_PEN);
  }

  protected saveAdditionObjects(p: Pen[]) {
    this.whiteboardService.settings.setAdditionalPens(p);
  }

  protected override getDefaultObjects(): Pen[] {
    return this.whiteboardService.settings.getDefaultPens();
  }

  protected override getAdditionalObjects(): Pen[] {
    return this.whiteboardService.settings.getAdditionalPens();
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}

