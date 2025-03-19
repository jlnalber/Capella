import { Component, ViewContainerRef, AfterViewInit } from '@angular/core';
import { SnackbarService } from './global/snackbar/snackbar.service';
import { DialogService } from './global/dialog/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  constructor(private readonly dialogService: DialogService, private readonly snackbarService: SnackbarService, private readonly viewContainerRef: ViewContainerRef) {
    this.dialogService.rootViewContainerRef = this.viewContainerRef;
    this.snackbarService.rootViewContainerRef = this.viewContainerRef;
  }

  ngAfterViewInit(): void {
    this.snackbarService.openErrorSnackbar('Instabile Version in der Entwicklung. Einige Features sind möglicherweise unvollständig.', 5000);
  }
}
