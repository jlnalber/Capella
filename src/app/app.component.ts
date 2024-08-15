import { Component, ViewContainerRef } from '@angular/core';
import { DialogService } from './dialog/dialog.service';
import { SnackbarService } from './snackbar/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private readonly dialogService: DialogService, private readonly snackbarService: SnackbarService, private readonly viewContainerRef: ViewContainerRef) {
    this.dialogService.rootViewContainerRef = this.viewContainerRef;
    this.snackbarService.rootViewContainerRef = this.viewContainerRef;
  }
}
