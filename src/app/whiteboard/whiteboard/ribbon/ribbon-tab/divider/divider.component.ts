import { Component, forwardRef, Input } from '@angular/core';
import { Divider } from '../../ribbon';
import { ContentViewerComponent } from "../content-viewer/content-viewer.component";

@Component({
  selector: 'app-divider',
  standalone: true,
  imports: [forwardRef(() => ContentViewerComponent)],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss'
})
export class DividerComponent {
  @Input({required: true}) divider!: Divider;

}
