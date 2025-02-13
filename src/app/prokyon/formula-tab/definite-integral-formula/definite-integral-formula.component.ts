import {Component} from '@angular/core';
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import DefiniteIntegral from "../../global/classes/canvas-elements/definiteIntegral";
import { ColorCircleComponent } from '../global/color-circle/color-circle.component';
import { FormsModule } from '@angular/forms';
import { IntervalComponent } from '../global/interval/interval.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    ColorCircleComponent,
    IntervalComponent,
    FormsModule,
    CommonModule
  ],
  selector: 'app-definite-integral-formula',
  templateUrl: './definite-integral-formula.component.html',
  styleUrls: ['./definite-integral-formula.component.css']
})
export class DefiniteIntegralFormulaComponent extends FormulaElement {

  public canvasElement!: DefiniteIntegral;

}
