import { Component } from '@angular/core';
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import CompiledPointElement from "../../global/classes/canvas-elements/compiledPointElement";
import { ColorCircleComponent } from '../global/color-circle/color-circle.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    ColorCircleComponent,
    CommonModule,
    FormsModule
  ],
  selector: 'app-compiled-point-formula',
  templateUrl: './compiled-point-formula.component.html',
  styleUrls: ['./compiled-point-formula.component.css']
})
export class CompiledPointFormulaComponent extends FormulaElement {

  public canvasElement: CompiledPointElement;

  constructor() {
    super();
    this.canvasElement = CompiledPointElement.getDefaultInstance();
  }

  public get name(): string {
    return this.canvasElement.configuration.name
      ? this.canvasElement.configuration.name + ' '
      : '';
  }

  public get errorMessageX(): string | undefined {
    return this.canvasElement.xErrorText;
  }

  public get errorMessageY(): string | undefined {
    return this.canvasElement.yErrorText;
  }

}
