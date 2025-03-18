import { AfterViewInit, Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import { FormsModule } from '@angular/forms';
import { GradientStopsComponent } from '../gradient-stops/gradient-stops.component';
import GradientStyle from '../gradient-stops/gradientStyle';
import { LoadingComponent } from "../../loading/loading.component";
import { RadialGradient } from '../../interfaces/canvasStyles/gradientStyle';

@Component({
  selector: 'app-radial-gradient-style',
  standalone: true,
  imports: [
    FormsModule,
    GradientStopsComponent,
    LoadingComponent
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