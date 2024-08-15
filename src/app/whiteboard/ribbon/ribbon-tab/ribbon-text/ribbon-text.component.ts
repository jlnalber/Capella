import { Component, Input } from '@angular/core';
import { RibbonText } from '../../ribbon';

@Component({
  selector: 'app-ribbon-text',
  standalone: true,
  imports: [],
  templateUrl: './ribbon-text.component.html',
  styleUrl: './ribbon-text.component.scss'
})
export class RibbonTextComponent {
  @Input({required: true}) text!: RibbonText;
  
}
