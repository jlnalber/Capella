import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import FormulaDialogElement from '../../global/classes/abstract/formulaDialogElement';
import ShapeElement from '../../global/classes/canvas-elements/shapeElement';

@Component({
  selector: 'app-view-shape-element',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './view-shape-element.component.html',
  styleUrl: './view-shape-element.component.css'
})
export class ViewShapeElementComponent extends FormulaDialogElement {

  constructor() {
    super();
  }

  public get name(): string {
    return this.dialogData.configuration.name ?
      this.dialogData.configuration.name :
      ''
  }

  public set name(value: string) {
    this.dialogData.configuration.name = value;
    this.dialogData.configuration.label = value;
    this.dialogData.svgLabel = undefined;
    this.dialogData.onChange.emit(value);
  }

  public dialogData!: ShapeElement;

  public get dashed(): boolean {
    return this.dialogData.configuration.dashed === true;
  }

  public set dashed(value: boolean) {
    this.dialogData.configuration.dashed = value;
    this.dialogData.onChange.emit(undefined);
  }

  public get latex(): boolean {
    return !(this.dialogData.configuration.dontUseLaTeX ?? false);
  }

  public set latex(value: boolean) {
    this.dialogData.configuration.dontUseLaTeX = !value;
    this.dialogData.onChange.emit(undefined);
  }

  public get displayBlack(): boolean {
    return this.dialogData.configuration.displayBlackLabel ?? false;
  }

  public set displayBlack(value: boolean) {
    this.dialogData.configuration.displayBlackLabel = value;
    this.dialogData.svgLabel = undefined;
    this.dialogData.onChange.emit(undefined);
  }

  public get labelSize(): number {
    return this.dialogData.configuration.labelSizeFactor ?? 1;
  }

  public set labelSize(value: number) {
    this.dialogData.configuration.labelSizeFactor = value;
    this.dialogData.onChange.emit(undefined);
  }
}
