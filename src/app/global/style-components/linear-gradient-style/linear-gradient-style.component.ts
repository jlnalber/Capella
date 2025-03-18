import { AfterViewInit, Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import { GradientStopsComponent } from "../gradient-stops/gradient-stops.component";
import { FormsModule } from '@angular/forms';
import GradientStyle from '../gradient-stops/gradientStyle';
import { LoadingComponent } from "../../loading/loading.component";
import { LinearGradient } from '../../interfaces/canvasStyles/gradientStyle';

@Component({
  selector: 'app-linear-gradient-style',
  standalone: true,
  imports: [
    GradientStopsComponent,
    FormsModule,
    LoadingComponent
],
  templateUrl: './linear-gradient-style.component.html',
  styleUrl: './linear-gradient-style.component.scss'
})
export class LinearGradientStyleComponent extends GradientStyle<LinearGradient> implements AfterViewInit {
  @Input({required: true}) public picker?: Picker<LinearGradient>;

  ngAfterViewInit(): void {
      this.init();
  }
}
