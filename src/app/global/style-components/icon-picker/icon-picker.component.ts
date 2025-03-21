import { Component, Input } from '@angular/core';
import Picker from '../pickers/picker';
import AbstractPickerComponent from '../abstractPickerComponent';
import { PenIcon, IconObj, PEN_ICONS_LIST } from '../../interfaces/icon';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from "../../loading/loading.component";

@Component({
  selector: 'app-icon-picker',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent
],
  templateUrl: './icon-picker.component.html',
  styleUrl: './icon-picker.component.scss'
})
export class IconPickerComponent extends AbstractPickerComponent<Picker<PenIcon>, PenIcon> {
  @Input({required: true}) public picker?: Picker<PenIcon>;

  public icons = PEN_ICONS_LIST;

  public get activeIcon(): number | undefined {
    if (this.picker) {
      const str = this.picker.getActive();
      for (let i = 0; i < this.icons.length; i++) {
        if (this.icons[i].fileName === str) {
          return i;
        }
      }
    }

    return undefined;
  }

  public set activeIcon(val: number | undefined) {
    if (val) {
      this.picker?.setActive(this.icons[val].fileName);
    }
  }

  public get activeIconObj(): IconObj | undefined {
    const index = this.activeIcon;
    if (index !== undefined)
    {
      return this.icons[index];
    }
    return undefined;
  }

}
