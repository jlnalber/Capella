import {Component} from '@angular/core';
import DependencyPointElements from "../../global/classes/canvas-elements/dependencyPointElements";
import {DrawerService} from "../../services/drawer.service";
import PointElement from "../../global/classes/canvas-elements/pointElement";
import FormulaDialogElement from "../../global/classes/abstract/formulaDialogElement";
import { Point } from 'src/app/global/interfaces/point';
import { IntervalComponent } from '../../formula-tab/global/interval/interval.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface ViewDependencyPointElementsDialogData {
  dependencyPointElements?: DependencyPointElements
}

@Component({
  standalone: true,
  imports: [
    IntervalComponent,
    FormsModule,
    CommonModule
  ],
  selector: 'app-dependency-point-elements-dialog',
  templateUrl: './view-dependency-point-elements-dialog.component.html',
  styleUrls: ['./view-dependency-point-elements-dialog.component.css']
})
export class ViewDependencyPointElementsDialogComponent extends FormulaDialogElement {

  public override dialogData!: DependencyPointElements;

  constructor(private readonly drawerService: DrawerService) {
    super();
  }

  addPointToDrawerService(point: Point): void {
    this.drawerService.addCanvasElements(new PointElement(point, this.drawerService.getNewColor()));
  }

}
