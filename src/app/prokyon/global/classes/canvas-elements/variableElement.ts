import {FormulaElement} from "../abstract/formulaElement";
import {Type} from "@angular/core";
import {VariableFormulaComponent} from "../../../formula-tab/variable-formula/variable-formula.component";
import {CanvasElementSerialized} from "../../essentials/serializer";
import { ProkyonCanvasElement } from "../abstract/prokyonCanvasElement";

type Data = {
  key: string,
  value: number
}

export default class VariableElement extends ProkyonCanvasElement {
  public readonly componentType: Type<FormulaElement> = VariableFormulaComponent;
  public override formulaDialogType = undefined;

  public override async draw(): Promise<void> {
    return;
  }

  constructor(key: string, value: number) {
    super();
    this._key = key;
    this._value = value;
    this.visible = false;
  }

  private _value: number;
  public get value(): number {
    return this._value;
  }
  public set value(value: number) {
    this._value = value;
    this.onChange.emit(value);
  }

  private _key: string;
  public get key(): string {
    return this._key;
  }
  public set key(value: string) {
    this._key = value;
    this.onChange.emit(value);
  }

  public static getDefaultInstance(): VariableElement {
    return new VariableElement('', 0);
  }

  public override serialize(): CanvasElementSerialized {
    const data: Data = {
      value: this.value,
      key: this.key
    }
    return {
      data,
      style: {
        color: this.color,
        visible: this.visible
      }
    }
  }

  public override loadFrom(canvasElements: {
    [p: number]: ProkyonCanvasElement | undefined
  }, canvasElementSerialized: CanvasElementSerialized) {
    const data: Data = canvasElementSerialized.data as Data;
    this.color = canvasElementSerialized.style.color;
    this.visible = canvasElementSerialized.style.visible;
    this.key = data.key;
    this.value = data.value;
  }
}
