import { AfterViewInit, Component, ComponentRef, Type, ViewChild, ViewContainerRef } from '@angular/core';
import AbstractPickerComponent from 'src/app/global/style-components/abstractPickerComponent';
import Picker from 'src/app/global/style-components/pickers/picker';
import { Dialog } from 'src/app/global/dialog/dialog';
import { DialogService } from 'src/app/global/dialog/dialog.service';

@Component({
  selector: 'app-picker-dialog',
  standalone: true,
  imports: [],
  templateUrl: './picker-dialog.component.html',
  styleUrl: './picker-dialog.component.scss'
})
export class PickerDialogComponent<T extends AbstractPickerComponent<Picker<E>, E>, E> implements AfterViewInit {

    @ViewChild('contentDiv', { read: ViewContainerRef }) contentDiv!: ViewContainerRef;
  
    public close() {
      this.dialog.close();
    }
  
    public save() {
      if (this.dialogData !== undefined && this.dialogData.picker.value !== undefined) {
        this.dialogData.picker.setActive(this.dialogData.picker.value);
      }
      this.close();
    }
  
    public dialogData?: PickerDialogData<T, E>;
    public dialog!: Dialog<PickerDialogComponent<T, E>>;
    private component: ComponentRef<T> | undefined;
  
    public ngAfterViewInit(): void {
      setTimeout(() => {
        if (this.dialogData) {
          this.component = this.contentDiv.createComponent(this.dialogData.componentType);
          this.component.instance.picker = this.dialogData.picker;
        }
      }, 0);
    }

    public getTitle(): string {
      return this.dialogData?.title ?? '';
    }
  
    public static openPickerDialogComponent<T extends AbstractPickerComponent<Picker<E>, E>, E>(dialogService: DialogService, dialogData: PickerDialogData<T, E>): void {
      dialogService.createDialog(PickerDialogComponent)?.open(dialogData);
    }
}

export interface PickerDialogData<T extends AbstractPickerComponent<Picker<E>, E>, E> {
  title: string,
  picker: Picker<E>,
  componentType: Type<T>
}