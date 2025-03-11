import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import { EasyStrokeStyle, getEmptyEasyStrokeStyleForCopy } from '../../interfaces/canvasStyles/strokeStyle';
import AbstractPickerComponent from '../abstractPickerComponent';
import { ALL_LINECAP, ALL_LINEJOIN, DEFAULT_LINECAP, DEFAULT_LINEJOIN, LineCap, LineJoin } from '../../interfaces/canvasStyles/styleTypes';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-easy-stroke-style',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './easy-stroke-style.component.html',
  styleUrl: './easy-stroke-style.component.scss'
})
export class EasyStrokeStyleComponent extends AbstractPickerComponent<Picker<EasyStrokeStyle>, EasyStrokeStyle> {

  @Input({required: true}) public picker?: Picker<EasyStrokeStyle>;

  public get lineJoin(): LineJoin {
    return this.picker?.value?.lineJoin ?? DEFAULT_LINEJOIN;
  }
  
  public set lineJoin(value: LineJoin) {
    if (this.picker) {
      if (this.picker.value === undefined) {
        const ess = getEmptyEasyStrokeStyleForCopy();
        ess.lineJoin = value;
        this.picker.value = ess;
      }
      else {
        this.picker.value.lineJoin = value;
      }
      this.onChange();
    }
  }

  public get lineJoins(): LineJoin[] {
    return ALL_LINEJOIN
  }

  public get lineCap(): LineCap {
    return this.picker?.value?.lineCap ?? DEFAULT_LINECAP;
  }
  
  public set lineCap(value: LineCap) {
    if (this.picker) {
      if (this.picker.value === undefined) {
        const ess = getEmptyEasyStrokeStyleForCopy();
        ess.lineCap = value;
        this.picker.value = ess;
      }
      else {
        this.picker.value.lineCap = value;
      }
      this.onChange();
    }
  }

  get lineCaps(): LineCap[] {
    return ALL_LINECAP
  }

  public get lineDashOffset(): number {
    return this.picker?.value?.lineDashOffset ?? 0;
  }

  public set lineDashOffset(value: number) {
    if (this.picker) {
      if (this.picker.value === undefined) {
        const ess = getEmptyEasyStrokeStyleForCopy();
        ess.lineDashOffset = value;
        this.picker.value = ess;
      }
      else {
        this.picker.value.lineDashOffset = value;
      }
      this.onChange();
    }
  }

  private _lineDash: number[] = [];

  public get lineDash(): number[] {
    if (this.picker && this.picker.value && this.picker.value.lineDash) {
      this._lineDash = this.picker.value.lineDash;
    }
    return this._lineDash;
  }

  public removeLineDash(index: number) {
    if (index < this._lineDash.length) {
      this._lineDash.splice(index, 1);
      this.onChange();
    }
  }

  public addLineDash() {
    if (this.lineDashEnabled) {
      this._lineDash.push(0);
      this.onChange();
    }
  }

  public get lineDashEnabled(): boolean {
    return this.picker?.value?.lineDash !== undefined;
  }

  public set lineDashEnabled(value: boolean) {
    if (this.picker) {
      if (this.picker.value === undefined) {
        this.picker.value = getEmptyEasyStrokeStyleForCopy();
      }
      if (value !== this.lineDashEnabled) {
        if (value) {
          this.picker.value.lineDash = this._lineDash;
        }
        else {
          this.picker.value.lineDash = undefined;
        }
        this.onChange();
      }
    }
  }
}
