import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HoverConfiguration, HoverMenuDirective} from "../../../hover-menu/hover-menu.directive";
import {ColorStyleComponent} from "../../../../global/style-components/color-style/color-style.component";
import { BLACK, Color, getColorAsRgbaFunction } from 'src/app/global/interfaces/color';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-color-circle',
  imports: [
    CommonModule,
    HoverMenuDirective
  ],
  templateUrl: './color-circle.component.html',
  styleUrls: ['./color-circle.component.css']
})
export class ColorCircleComponent implements OnInit {

  @Input() public color: Color = BLACK;
  @Output() public colorChange: EventEmitter<Color> = new EventEmitter<Color>();

  @Input() public allowVisibilityChange: boolean = true;
  @Input() public visible: boolean = true;
  @Output() public visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  @Input() public allowMenuAsContextMenu: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public changeVisibility(): void {
    if (this.allowVisibilityChange) {
      this.visible = !this.visible;
      this.visibleChange.emit(this.visible);
    }
  }

  public get colorStr(): string {
    return getColorAsRgbaFunction(this.color);
  }

  public get hoverMenu(): HoverConfiguration {
    return {
      component: ColorStyleComponent,
      data: {
        getter: () => {
          return this.color;
        },
        setter: (c: Color) => {
          this.color = c;
          this.colorChange.emit(c);
        }
      },
      allowAsClickMenu: () => this.allowMenuAsContextMenu && !this.allowVisibilityChange,
      allowAsContextMenu: () => this.allowMenuAsContextMenu
    };
  }

}
