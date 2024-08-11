import { Component, Input } from '@angular/core';
import { Content, Divider, RibbonButton, RibbonToggle } from '../../ribbon';
import { ToggleComponent } from "../toggle/toggle.component";
import { ButtonComponent } from '../button/button.component';
import { DividerComponent } from '../divider/divider.component';

@Component({
  selector: 'app-content-viewer',
  standalone: true,
  imports: [ToggleComponent, ButtonComponent, DividerComponent],
  templateUrl: './content-viewer.component.html',
  styleUrl: './content-viewer.component.scss'
})
export class ContentViewerComponent {
  @Input({required: true}) content!: Content[];

  public isButton(content: Content): boolean {
    return content instanceof RibbonButton && !(content instanceof RibbonToggle);
  }

  public isToggle(content: Content): boolean {
    return content instanceof RibbonToggle;
  }
  
  public getAsButton(content: Content): RibbonButton {
    return content as RibbonButton;
  }

  public getAsToggle(content: Content): RibbonToggle {
    return content as RibbonToggle;
  }

  public getAsDivider(content: Content): Divider {
    return content as Divider;
  }
}
