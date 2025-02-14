import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import { LinearGradient } from '../../interfaces/canvasStyles/colorStyle';
import { GradientStopsComponent } from "../gradient-stops/gradient-stops.component";
import { FormsModule } from '@angular/forms';
import GradientStyle from '../gradient-stops/gradientStyle';

@Component({
  selector: 'app-linear-gradient-style',
  standalone: true,
  imports: [
    GradientStopsComponent,
    FormsModule
  ],
  templateUrl: './linear-gradient-style.component.html',
  styleUrl: './linear-gradient-style.component.scss'
})
export class LinearGradientStyleComponent extends GradientStyle<LinearGradient> {
  @Input({required: true}) public picker?: Picker<LinearGradient>;

}
