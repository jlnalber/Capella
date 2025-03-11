import { AfterViewInit, Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import Picker from '../pickers/picker';
import { ConicGradient, GradientColorStop } from '../../interfaces/canvasStyles/colorStyle';
import { FormsModule } from '@angular/forms';
import { GradientStopsComponent } from '../gradient-stops/gradient-stops.component';
import GradientStyle from '../gradient-stops/gradientStyle';
import { LoadingComponent } from "../../loading/loading.component";

@Component({
  selector: 'app-conic-gradient-style',
  standalone: true,
  imports: [
    FormsModule,
    GradientStopsComponent,
    LoadingComponent
],
  templateUrl: './conic-gradient-style.component.html',
  styleUrl: './conic-gradient-style.component.scss'
})
export class ConicGradientStyleComponent extends GradientStyle<ConicGradient> implements AfterViewInit {
  @Input({required: true}) public picker?: Picker<ConicGradient>;

  ngAfterViewInit(): void {
    this.init();
  }
}
