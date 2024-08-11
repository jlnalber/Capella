import { Component, Input } from '@angular/core';
import { RibbonToggle } from '../../ribbon';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss'
})
export class ToggleComponent {
  @Input({required: true}) toggle!: RibbonToggle;

}
