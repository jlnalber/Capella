import { Component, Input } from '@angular/core';
import { RibbonPointerModeToggle } from '../../ribbon';
import { Color, getColorAsRgbaFunction } from 'src/app/global/interfaces/color';

@Component({
  selector: 'app-pointer-mode-toggle',
  standalone: true,
  imports: [],
  templateUrl: './pointer-mode-toggle.component.html',
  styleUrl: './pointer-mode-toggle.component.scss'
})
export class PointerModeToggleComponent {
  @Input({required: true}) pointerToggle!: RibbonPointerModeToggle;


  getStyleForPointer(pointer: () => Color | undefined): string {
    const res = pointer();
    if (res) {
      return 'background-color: ' + getColorAsRgbaFunction(res) + ';';
    } else {
      return 'display: none;'
    }
  }
}
