import { Component, Input } from '@angular/core';
import { Content, Divider } from '../../../global/classes/ribbon/ribbon';
import { ToggleComponent } from "../toggle/toggle.component";
import { ButtonComponent } from '../button/button.component';
import { DividerComponent } from '../divider/divider.component';
import { PointerModeToggleComponent } from "../pointer-mode-toggle/pointer-mode-toggle.component";
import { RibbonTextComponent } from "../ribbon-text/ribbon-text.component";
import RibbonToggle from 'src/app/whiteboard/global/classes/ribbon/ribbonToggle';
import RibbonPointerModeToggle from 'src/app/whiteboard/global/classes/ribbon/ribbonPointerModeToggle';
import RibbonButton from 'src/app/whiteboard/global/classes/ribbon/ribbonButton';
import RibbonText from 'src/app/whiteboard/global/classes/ribbon/ribbonText';
import RibbonPenPicker from 'src/app/whiteboard/global/classes/ribbon/ribbonPenPicker';
import { PenPickerComponent } from "../pen-picker/pen-picker.component";

@Component({
  selector: 'app-content-viewer',
  standalone: true,
  imports: [ToggleComponent, ButtonComponent, DividerComponent, PointerModeToggleComponent, RibbonTextComponent, PenPickerComponent],
  templateUrl: './content-viewer.component.html',
  styleUrl: './content-viewer.component.scss'
})
export class ContentViewerComponent {
  @Input({required: true}) content!: Content[];

  public isButton(content: Content): content is RibbonButton {
    return content instanceof RibbonButton && !(content instanceof RibbonToggle);
  }

  public isToggle(content: Content): content is RibbonToggle {
    return content instanceof RibbonToggle && !(content instanceof RibbonPointerModeToggle);
  }

  public isText(content: Content): content is RibbonText {
    return content instanceof RibbonText;
  }

  public isPointerToggle(content: Content): content is RibbonPointerModeToggle {
    return content instanceof RibbonPointerModeToggle;
  }
  
  public isPenPicker(content: Content): content is RibbonPenPicker {
    return content instanceof RibbonPenPicker;
  }

  public getAsDivider(content: Content): Divider {
    return content as Divider;
  }
}
