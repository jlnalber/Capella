import { Component, Input } from '@angular/core';
import RibbonButton from 'src/app/whiteboard/global/classes/ribbon/ribbonButton';

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
