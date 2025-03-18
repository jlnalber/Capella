import ColorPicker from 'src/app/global/style-components/pickers/colorPicker';
import { AfterViewInit, Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import { ColorStyle, DEFAULT_COLORSTYLE, DEFAULT_PATTERN, getCopyOfPattern, instanceOfColor, instanceOfPattern, Pattern } from '../../interfaces/canvasStyles/colorStyle';
import AbstractPickerComponent from '../abstractPickerComponent';
import { LoadingComponent } from "../../loading/loading.component";
import { Color, getCopyOfColor } from '../../interfaces/color';
import { ConicGradient, DEFAULT_CONIC_GRADIENT, DEFAULT_LINEARGRADIENT, DEFAULT_RADIAL_GRADIENT, getCopyOfConicGradient, getCopyOfLinearGradient, getCopyOfRadialGradient, instanceOfConicGradient, instanceOfLinearGradient, instanceOfRadialGradient, LinearGradient, RadialGradient } from '../../interfaces/canvasStyles/gradientStyle';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';
import { ColorPickerComponent } from "../color-picker/color-picker.component";
import { FormsModule } from '@angular/forms';
import { RadialGradientStyleComponent } from "../radial-gradient-style/radial-gradient-style.component";
import { ConicGradientStyleComponent } from "../conic-gradient-style/conic-gradient-style.component";
import { LinearGradientStyleComponent } from "../linear-gradient-style/linear-gradient-style.component";
import { PatternStyleComponent } from "../pattern-style/pattern-style.component";

type Types = 'color' | 'radialgrad' | 'conicgrad' | 'lineargrad' | 'pattern' | undefined

@Component({
  selector: 'app-color-style-style',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent,
    ColorPickerComponent,
    RadialGradientStyleComponent,
    ConicGradientStyleComponent,
    LinearGradientStyleComponent,
    PatternStyleComponent
],
  templateUrl: './color-style-style.component.html',
  styleUrl: './color-style-style.component.scss'
})
export class ColorStyleStyleComponent extends AbstractPickerComponent<Picker<ColorStyle>, ColorStyle> implements AfterViewInit {

  @Input({required: true}) public picker?: Picker<ColorStyle>;

  private _color: Color = getCopyOfColor(DEFAULT_COLORSTYLE);
  public get color(): Color {
    if (this.picker && this.picker.value !== undefined && instanceOfColor(this.picker.value)) {
      return this.picker.value;
    }
    return this._color;
  }
  public set color(value: Color) {
    this._color = value;
    if (this.selectedType === 'color' && this.picker) {
      this.picker.value = value;
    }
  }
  public colorPicker?: ColorPicker;

  private _radialGradient: RadialGradient = getCopyOfRadialGradient(DEFAULT_RADIAL_GRADIENT);
  public get radialGradient(): RadialGradient {
    if (this.picker && this.picker.value !== undefined && instanceOfRadialGradient(this.picker.value)) {
      return this.picker.value;
    }
    return this._radialGradient;
  }
  public set radialGradient(value: RadialGradient) {
    this._radialGradient = value;
    if (this.selectedType === 'radialgrad' && this.picker) {
      this.picker.value = value;
    }
  }
  public radialGradientPicker?: Picker<RadialGradient>;
  
  private _conicGradient: ConicGradient = getCopyOfConicGradient(DEFAULT_CONIC_GRADIENT);
  public get conicGradient(): ConicGradient {
    if (this.picker && this.picker.value !== undefined && instanceOfConicGradient(this.picker.value)) {
      return this.picker.value;
    }
    return this._conicGradient;
  }
  public set conicGradient(value: ConicGradient) {
    this._conicGradient = value;
    if (this.selectedType === 'conicgrad' && this.picker) {
      this.picker.value = value;
    }
  }
  public conicGradientPicker?: Picker<ConicGradient>;
  
  private _linearGradient: LinearGradient = getCopyOfLinearGradient(DEFAULT_LINEARGRADIENT);
  public get linearGradient(): LinearGradient {
    if (this.picker && this.picker.value !== undefined && instanceOfLinearGradient(this.picker.value)) {
      return this.picker.value;
    }
    return this._linearGradient;
  }
  public set linearGradient(value: LinearGradient) {
    this._linearGradient = value;
    if (this.selectedType === 'lineargrad' && this.picker) {
      this.picker.value = value;
    }
  }
  public linearGradientPicker?: Picker<LinearGradient>;
  
  private _pattern: Pattern = getCopyOfPattern(DEFAULT_PATTERN);
  public get pattern(): Pattern {
    if (this.picker && this.picker.value !== undefined && instanceOfPattern(this.picker.value)) {
      return this.picker.value;
    }
    return this._pattern;
  }
  public set pattern(value: Pattern) {
    this._pattern = value;
    if (this.selectedType === 'pattern' && this.picker) {
      this.picker.value = value;
    }
  }
  public patternPicker?: Picker<Pattern>;
  
  constructor(private readonly whiteboardService: WhiteboardService) {
    super();
  }

  private onChangeListener = () => {
    this.setValueAccordingToSelectedType(this.selectedType);
  }

  public get selectedType(): Types {
    if (this.picker) {
      const active = this.picker.value;
      if (active === undefined) {
        return undefined;
      }
      else if (instanceOfColor(active)) {
        return 'color';
      } else if (instanceOfConicGradient(active)) {
        return 'conicgrad';
      } else if (instanceOfLinearGradient(active)) {
        return 'lineargrad';
      } else if (instanceOfRadialGradient(active)) {
        return 'radialgrad';
      } else if (instanceOfPattern(active)) {
        return 'pattern';
      }
    }
    return undefined;
  }
  public set selectedType(value: Types) {
    if (this.picker) {
      this.setValueAccordingToSelectedType(value);
    }
  }

  private setValueAccordingToSelectedType(selectedType: Types) {
    if (this.picker) {
      switch (selectedType) {
        case 'color':
          this.picker.value = this._color;
          break;
        case 'radialgrad':
          this.picker.value = this._radialGradient;
          break;
        case 'conicgrad':
          this.picker.value = this._conicGradient;
          break;
        case 'lineargrad':
          this.picker.value = this._linearGradient;
          break;
        case 'pattern':
          this.picker.value = this._pattern;
          break;
        default:
          break;
      }
    }
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadPickerValue();

      this.colorPicker = new ColorPicker(this.whiteboardService.settings.getColors(), () => this.color, (value) => this.color = value ?? this.color, () => this.selectedType !== 'color', true);
      this.colorPicker.onValueChanged.addListener(this.onChangeListener);
      
      this.radialGradientPicker = new Picker<RadialGradient>(() => this.radialGradient, (value) => this.radialGradient = value ?? this.radialGradient, true, () => this.selectedType !== 'radialgrad');
      this.radialGradientPicker.onValueChanged.addListener(this.onChangeListener);
      
      this.conicGradientPicker = new Picker<ConicGradient>(() => this.conicGradient, (value) => this.conicGradient = value ?? this.conicGradient, true, () => this.selectedType !== 'conicgrad');
      this.conicGradientPicker.onValueChanged.addListener(this.onChangeListener);
      
      this.linearGradientPicker = new Picker<LinearGradient>(() => this.linearGradient, (value) => this.linearGradient = value ?? this.linearGradient, true, () => this.selectedType !== 'lineargrad');
      this.linearGradientPicker.onValueChanged.addListener(this.onChangeListener);
      
      this.patternPicker = new Picker<Pattern>(() => this.pattern, (value) => this.pattern = value ?? this.pattern, true, () => this.selectedType !== 'pattern');
      this.patternPicker.onValueChanged.addListener(this.onChangeListener);
    }, 0);
  }

  private loadPickerValue() {
    if (this.picker) {
      switch (this.selectedType) {
        case 'color': this._color = this.picker.value as Color; break;
        case 'conicgrad': this._conicGradient = this.picker.value as ConicGradient; break;
        case 'lineargrad': this._linearGradient = this.picker.value as LinearGradient; break;
        case 'radialgrad': this._radialGradient = this.picker.value as RadialGradient; break;
        case 'pattern': this._pattern = this.picker.value as Pattern; break;
        default: break;
      }
    }
  }
}
