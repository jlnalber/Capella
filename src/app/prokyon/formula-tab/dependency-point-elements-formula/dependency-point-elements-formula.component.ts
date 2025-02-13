import { Component } from '@angular/core';
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import DependencyPointElements from "../../global/classes/canvas-elements/dependencyPointElements";
import { DialogService } from 'src/app/global/dialog/dialog.service';
import { ColorCircleComponent } from '../global/color-circle/color-circle.component';

@Component({
  standalone: true,
  imports: [
    ColorCircleComponent
  ],
  selector: 'app-dependency-point-element-formula',
  templateUrl: './dependency-point-elements-formula.component.html',
  styleUrls: ['./dependency-point-elements-formula.component.css']
})
export class DependencyPointElementsFormulaComponent extends FormulaElement {

  constructor(private readonly dialogService: DialogService) {
    super();
  }

  public canvasElement!: DependencyPointElements;

  get elementCountStr(): string {
    const size = this.canvasElement.size;
    if (size === 0) {
      return 'Keine Elemente'
    } else if (size === 1) {
      return 'Ein Element'
    } else {
      return `${size} Elemente`;
    }
  }

}
