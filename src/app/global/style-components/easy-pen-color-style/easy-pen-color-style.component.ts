import { ConicGradient, DEFAULT_CONIC_GRADIENT, DEFAULT_LINEARGRADIENT, DEFAULT_PATTERN, DEFAULT_RADIAL_GRADIENT, LinearGradient, Pattern, RadialGradient } from './../../interfaces/canvasStyles/colorStyle';
import { AfterViewInit, Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import { EasyPenColorStyle } from 'src/app/whiteboard/global/interfaces/penStyle';
import Picker from '../pickers/picker';
import { instanceOfConicGradient, instanceOfLinearGradient, instanceOfPattern, instanceOfRadialGradient } from '../../interfaces/canvasStyles/colorStyle';
import { FormsModule } from '@angular/forms';
import { RadialGradientStyleComponent } from "../radial-gradient-style/radial-gradient-style.component";
import { ConicGradientStyleComponent } from "../conic-gradient-style/conic-gradient-style.component";
import { LinearGradientStyleComponent } from "../linear-gradient-style/linear-gradient-style.component";
import { PatternStyleComponent } from "../pattern-style/pattern-style.component";
import { ChoosePenStyleComponent } from "../choose-pen-style/choose-pen-style.component";
import PenPicker from '../pickers/penPicker';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';

type Types = 'color' | 'otherpen' | 'radialgrad' | 'conicgrad' | 'lineargrad' | 'pattern' | undefined

@Component({
  selector: 'app-easy-pen-color-style',
  standalone: true,
  imports: [
    FormsModule,
    RadialGradientStyleComponent,
    ConicGradientStyleComponent,
    LinearGradientStyleComponent,
    PatternStyleComponent,
    ChoosePenStyleComponent
],
  templateUrl: './easy-pen-color-style.component.html',
  styleUrl: './easy-pen-color-style.component.scss'
})
export class EasyPenColorStyleComponent extends AbstractPickerComponent<Picker<EasyPenColorStyle>, EasyPenColorStyle> implements AfterViewInit {

  @Input({required: true}) public picker?: Picker<EasyPenColorStyle>;

  private _otherPen: number = 0;
  public get otherPen(): number {
    if (this.picker && typeof this.picker.value === 'number') {
      return this.picker.value;
    }
    return this._otherPen;
  }
  public set otherPen(value: number) {
    this._otherPen = value;
    if (this.selectedType === 'otherpen' && this.picker) {
      this.picker.value = value;
    }
  }
  public otherPenPicker: PenPicker = new PenPicker(() => this.otherPen, (value) => this.otherPen = value, this.whiteboardService.settings.getDefaultPens(), true, () => this.selectedType !== 'otherpen');

  private _radialGradient: RadialGradient = DEFAULT_RADIAL_GRADIENT;
  public get radialGradient(): RadialGradient {
    if (this.picker && this.picker.value !== undefined && typeof this.picker.value !== 'number' && instanceOfRadialGradient(this.picker.value)) {
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
  public radialGradientPicker: Picker<RadialGradient> = new Picker<RadialGradient>(() => this.radialGradient, (value) => this.radialGradient = value, true, () => this.selectedType !== 'radialgrad');
  
  private _conicGradient: ConicGradient = DEFAULT_CONIC_GRADIENT;
  public get conicGradient(): ConicGradient {
    if (this.picker && this.picker.value !== undefined && typeof this.picker.value !== 'number' && instanceOfConicGradient(this.picker.value)) {
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
  public conicGradientPicker: Picker<ConicGradient> = new Picker<ConicGradient>(() => this.conicGradient, (value) => this.conicGradient = value, true, () => this.selectedType !== 'conicgrad');
  
  private _linearGradient: LinearGradient = DEFAULT_LINEARGRADIENT;
  public get linearGradient(): LinearGradient {
    if (this.picker && this.picker.value !== undefined && typeof this.picker.value !== 'number' && instanceOfLinearGradient(this.picker.value)) {
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
  public linearGradientPicker: Picker<LinearGradient> = new Picker<LinearGradient>(() => this.linearGradient, (value) => this.linearGradient = value, true, () => this.selectedType !== 'lineargrad');
  
  private _pattern: Pattern = DEFAULT_PATTERN;
  public get pattern(): Pattern {
    if (this.picker && this.picker.value !== undefined && typeof this.picker.value !== 'number' && instanceOfPattern(this.picker.value)) {
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
  public patternPicker: Picker<Pattern> = new Picker<Pattern>(() => this.pattern, (value) => this.pattern = value, true, () => this.selectedType !== 'pattern');
  
  constructor(private readonly whiteboardService: WhiteboardService) {
    super();
  }

  public get selectedType(): Types {
    if (this.picker) {
      const active = this.picker.value;
      if (active === undefined) {
        return 'color';
      } else if (typeof active === 'number') {
        return 'otherpen';
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
      switch (value) {
        case 'color':
          this.picker.value = undefined;
          break;
        case 'otherpen':
          this.picker.value = this.otherPen;
          break;
        case 'radialgrad':
          this.picker.value = this.radialGradient;
          break;
        case 'conicgrad':
          this.picker.value = this.conicGradient;
          break;
        case 'lineargrad':
          this.picker.value = this.linearGradient;
          break;
        case 'pattern':
          this.picker.value = this.pattern;
          break;
        default:
          break;
      }
    }
  }

  public ngAfterViewInit(): void {
    this.otherPenPicker.onValueChanged.addListener((t: any) => {
      this.picker?.onValueChanged.emit(t);
    });
    this.radialGradientPicker.onValueChanged.addListener((t: any) => {
      this.picker?.onValueChanged.emit(t);
    });
    this.conicGradientPicker.onValueChanged.addListener((t: any) => {
      this.picker?.onValueChanged.emit(t);
    });
    this.linearGradientPicker.onValueChanged.addListener((t: any) => {
      this.picker?.onValueChanged.emit(t);
    });
    this.patternPicker.onValueChanged.addListener((t: any) => {
      this.picker?.onValueChanged.emit(t);
    });
  }
}

