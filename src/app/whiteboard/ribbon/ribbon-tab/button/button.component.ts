import { Component, Input } from '@angular/core';
import { RibbonButton } from '../../ribbon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input({required: true}) button!: RibbonButton;

}
