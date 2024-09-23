import { Component, Input } from '@angular/core';
import { RibbonTab } from '../../global/classes/ribbon/ribbon';
import { ContentViewerComponent } from "./content-viewer/content-viewer.component";

@Component({
  selector: 'app-ribbon-tab',
  standalone: true,
  imports: [ContentViewerComponent],
  templateUrl: './ribbon-tab.component.html',
  styleUrl: './ribbon-tab.component.scss'
})
export class RibbonTabComponent {
  @Input({required: true}) ribbonTab!: RibbonTab;

}
