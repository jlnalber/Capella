import { DialogService } from 'src/app/global/dialog/dialog.service';
import { AfterViewInit, Component, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Dialog } from 'src/app/global/dialog/dialog';
import { Event } from 'src/app/global/essentials/event';
import AbstractSettingsComponent from '../../settings/abstractSettingComponent';

@Component({
  selector: 'app-view-settings-dialog',
  standalone: true,
  imports: [],
  templateUrl: './view-settings-dialog.component.html',
  styleUrl: './view-settings-dialog.component.scss'
})
export class ViewSettingsDialogComponent<T extends AbstractSettingsComponent> implements AfterViewInit {

  @ViewChild('contentDiv', { read: ViewContainerRef }) contentDiv!: ViewContainerRef;

  public close() {
    this.dialog.close();
  }

  public save() {
    this.saveEvent.emit();
    this.close();
  }

  public saveEvent: Event<undefined> = new Event<undefined>();

  public dialogData?: DialogData<T>;
  public dialog!: Dialog<ViewSettingsDialogComponent<T>>;

  public ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.dialogData) {
        const component = this.contentDiv.createComponent(this.dialogData.componentType);
        this.saveEvent.addListener(component.instance.saveListener);
      }
    }, 0);
  }

  public static openViewSettingsDialogComponent<T extends AbstractSettingsComponent>(dialogService: DialogService, componentType: Type<T>): void {
    const dialogData: DialogData<T> = {
      componentType
    }
    dialogService.createDialog(ViewSettingsDialogComponent)?.open(dialogData);
  }

}

interface DialogData<T extends AbstractSettingsComponent> {
  componentType: Type<T>
}
