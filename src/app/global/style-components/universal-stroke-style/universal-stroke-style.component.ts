import { AfterViewInit, Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import { DEFAULT_LINEWIDTH, EasyStrokeStyle, getEmptyEasyStrokeStyleForCopy, getEmptyStrokeStyleForCopy, StrokeStyle } from '../../interfaces/canvasStyles/strokeStyle';
import Picker from '../pickers/picker';
import { ALL_LINECAP, ALL_LINEJOIN, DEFAULT_LINECAP, DEFAULT_LINEJOIN, DEFAULT_STROKE_STYLE_UNIFORMSIZEONZOOM, LineCap, LineJoin } from '../../interfaces/canvasStyles/styleTypes';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from "../../loading/loading.component";
import { ColorStyleStyleComponent } from "../color-style-style/color-style-style.component";
import { ColorStyle, DEFAULT_COLORSTYLE } from '../../interfaces/canvasStyles/colorStyle';
import { SliderInputComponent } from "../slider-input/slider-input.component";
import SliderInputPicker from '../pickers/sliderInputPicker';
import { DEFAULT_MAX_PEN_SIZE, DEFAULT_MIN_PEN_SIZE, PEN_SIZE_TO_STRING } from 'src/app/whiteboard/global/interfaces/penStyle';

@Component({
  selector: 'app-universal-stroke-style',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent,
    ColorStyleStyleComponent,
    SliderInputComponent
],
  templateUrl: './universal-stroke-style.component.html',
  styleUrl: './universal-stroke-style.component.scss'
})
export class UniversalStrokeStyleComponent extends AbstractPickerComponent<Picker<EasyStrokeStyle | StrokeStyle>, EasyStrokeStyle> implements AfterViewInit {

  @Input({required: true}) public picker?: Picker<EasyStrokeStyle | StrokeStyle>;
  @Input({required: true}) public isComplete?: boolean;

  public get lineJoin(): LineJoin {
    return this.picker?.value?.lineJoin ?? DEFAULT_LINEJOIN;
  }
  
  public set lineJoin(value: LineJoin) {
    if (this.picker) {
      if (this.picker.value === undefined) {
        const ess = this.getEss();
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
        const ess = this.getEss();
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
  

  public get lineDashOffsetEnabled(): boolean {
    return this.picker?.value?.lineDashOffset !== undefined;
  }
  
  public set lineDashOffsetEnabled(value: boolean) {
    if (this.picker) {
      if (this.picker.value === undefined) {
        this.picker.value = this.getEss();
      }
      if (value !== this.lineDashOffsetEnabled) {
        if (value) {
          this.picker.value.lineDashOffset = this._lineDashOffset;
        }
        else {
          this.picker.value.lineDashOffset = undefined;
        }
        this.onChange();
      }
    }
  }

  private _lineDashOffset: number = 0;

  public get lineDashOffset(): number {
    if (this.picker && this.picker.value && this.picker.value.lineDashOffset !== undefined) {
      this._lineDashOffset = this.picker.value.lineDashOffset;
    }
    return this._lineDashOffset;
  }

  public set lineDashOffset(value: number) {
    if (this.picker) {
      this._lineDashOffset = value;

      if (this.lineDashOffsetEnabled) {
        if (this.picker.value === undefined) {
          this.picker.value = this.getEss();
        }
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
        this.picker.value = this.getEss();
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

  
  // for complete stroke style
  public colorStylePicker?: Picker<ColorStyle>;

  public get colorStyle(): ColorStyle | undefined {
    if (this.isComplete) {
      const strokeStyle = this.picker?.value as StrokeStyle | undefined;
      return strokeStyle?.color ?? DEFAULT_COLORSTYLE;
    }
    return undefined;
  }
  
  public set colorStyle(value: ColorStyle | undefined) {
    if (this.picker && this.isComplete && value) {
      if (this.picker.value === undefined) {
        const ess = this.getEss() as StrokeStyle;
        ess.color = value;
        this.picker.value = ess;
      }
      else {
        (this.picker.value as StrokeStyle).color = value;
      }
      this.onChange();
    }
  }

  public lineWidthPicker?: SliderInputPicker;

  public get lineWidth(): number | undefined {
    if (this.isComplete) {
      const strokeStyle = this.picker?.value as StrokeStyle | undefined;
      return strokeStyle?.lineWidth ?? DEFAULT_LINEWIDTH;
    }
    return undefined;
  }
  
  public set lineWidth(value: number | undefined) {
    if (this.picker && this.isComplete && value !== undefined) {
      if (this.picker.value === undefined) {
        const ess = this.getEss() as StrokeStyle;
        ess.lineWidth = value;
        this.picker.value = ess;
      }
      else {
        (this.picker.value as StrokeStyle).lineWidth = value;
      }
      this.onChange();
    }
  }

  public get uniformSizeOnZoom(): boolean | undefined {
    if (this.isComplete) {
      const strokeStyle = this.picker?.value as StrokeStyle | undefined;
      return strokeStyle?.uniformSizeOnZoom ?? DEFAULT_STROKE_STYLE_UNIFORMSIZEONZOOM;
    }
    return undefined;
  }
  
  public set uniformSizeOnZoom(value: boolean) {
    if (this.picker && this.isComplete) {
      if (this.picker.value === undefined) {
        const ess = this.getEss() as StrokeStyle;
        ess.uniformSizeOnZoom = value;
        this.picker.value = ess;
      }
      else {
        (this.picker.value as StrokeStyle).uniformSizeOnZoom = value;
      }
      this.onChange();
    }
  }

  public ngAfterViewInit(): void {
      setTimeout(() => {
        if (this.isComplete) {
          this.colorStylePicker = new Picker<ColorStyle>(() => this.colorStyle, (t: ColorStyle | undefined) => this.colorStyle = t, true, () => this.picker?.isDisabled() ?? true);
          this.colorStylePicker.onValueChanged.addListener(() => {
            this.onChange();
          });
  
          this.lineWidthPicker = new SliderInputPicker(() => this.lineWidth,
                            (t?: number) => this.lineWidth = t,
                            DEFAULT_MIN_PEN_SIZE,
                            DEFAULT_MAX_PEN_SIZE,
                            PEN_SIZE_TO_STRING,
                            undefined,
                            true);
          this.lineWidthPicker.onValueChanged.addListener(() => {
            this.onChange();
          });
        }
      }, 0)
  }

  private getEss(): StrokeStyle | EasyStrokeStyle {
    if (this.isComplete) {
      return getEmptyStrokeStyleForCopy();
    }
    else {
      return getEmptyEasyStrokeStyleForCopy();
    }
  }
}
