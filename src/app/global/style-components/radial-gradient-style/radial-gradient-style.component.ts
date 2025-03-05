import { AfterViewInit, Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import { RadialGradient } from '../../interfaces/canvasStyles/colorStyle';
import { FormsModule } from '@angular/forms';
import { GradientStopsComponent } from '../gradient-stops/gradient-stops.component';
import GradientStyle from '../gradient-stops/gradientStyle';

@Component({
  selector: 'app-radial-gradient-style',
  standalone: true,
  imports: [
    FormsModule,
    GradientStopsComponent
  ],
  templateUrl: './radial-gradient-style.component.html',
  styleUrl: './radial-gradient-style.component.scss'
})
export class RadialGradientStyleComponent extends GradientStyle<RadialGradient> implements AfterViewInit {
  @Input({required: true}) public picker?: Picker<RadialGradient>;

  ngAfterViewInit(): void {
    this.init();
  }
}