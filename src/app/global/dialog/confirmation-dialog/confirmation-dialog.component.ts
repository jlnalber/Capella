import { Component, AfterViewInit } from '@angular/core';
import { DialogService } from '../dialog.service';
import { Dialog } from '../dialog';

interface ConfirmDialogDate {
  title: string,
  text: string,
  yes?: () => void,
  no?: () => void
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent implements AfterViewInit {
  
  public dialogData?: ConfirmDialogDate;
  public dialog!: Dialog<ConfirmationDialogComponent>

  ngAfterViewInit() {
    this.dialog.onFillerClicked.addListener(() => {
      if (this.dialogData?.no) {
        this.dialogData.no();
      }
    })
  }

  public close() {
    if (this.dialogData?.no) {
      this.dialogData.no();
    }
    this.dialog.close();
  }

  public accept() {
    if (this.dialogData?.yes) {
      this.dialogData.yes();
    }
    this.dialog.close();
  }

  public static confirm(dialogService: DialogService, data: ConfirmDialogDate): void {
    dialogService.createDialog(ConfirmationDialogComponent)?.open(data);
  }
}
