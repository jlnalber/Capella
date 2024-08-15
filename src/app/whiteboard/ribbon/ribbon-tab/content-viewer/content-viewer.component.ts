import { Component, Input } from '@angular/core';
import { Content, Divider, RibbonButton, RibbonPointerModeToggle, RibbonText, RibbonToggle } from '../../ribbon';
import { ToggleComponent } from "../toggle/toggle.component";
import { ButtonComponent } from '../button/button.component';
import { DividerComponent } from '../divider/divider.component';
import { PointerModeToggleComponent } from "../pointer-mode-toggle/pointer-mode-toggle.component";
import { RibbonTextComponent } from "../ribbon-text/ribbon-text.component";

@Component({
  selector: 'app-content-viewer',
  standalone: true,
  imports: [ToggleComponent, ButtonComponent, DividerComponent, PointerModeToggleComponent, RibbonTextComponent],
  templateUrl: './content-viewer.component.html',
  styleUrl: './content-viewer.component.scss'
})
export class ContentViewerComponent {
  @Input({required: true}) content!: Content[];

  public isButton(content: Content): boolean {
    return content instanceof RibbonButton && !(content instanceof RibbonToggle);
  }

  public isToggle(content: Content): boolean {
    return content instanceof RibbonToggle && !(content instanceof RibbonPointerModeToggle);
  }

  public isText(content: Content): boolean {
    return content instanceof RibbonText;
  }

  public isPointerToggle(content: Content): boolean {
    return content instanceof RibbonPointerModeToggle;
  }
  
  public getAsButton(content: Content): RibbonButton {
    return content as RibbonButton;
  }

  public getAsToggle(content: Content): RibbonToggle {
    return content as RibbonToggle;
  }

  public getAsText(content: Content): RibbonText {
    return content as RibbonText;
  }

  public getAsPointerToggle(content: Content): RibbonPointerModeToggle {
    return content as RibbonPointerModeToggle;
  }

  public getAsDivider(content: Content): Divider {
    return content as Divider;
  }
}
