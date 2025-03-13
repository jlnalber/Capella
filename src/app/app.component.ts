import { Component, ViewContainerRef, AfterViewInit } from '@angular/core';
import { SnackbarService } from './global/snackbar/snackbar.service';
import { DialogService } from './global/dialog/dialog.service';
import { getColorAsRgbFunction } from './global/interfaces/color';
import { colors, ERROR_COLOR } from './global/styles/colors';
import { openErrorSnackbar } from './prokyon/global/essentials/analysingFunctionsUtils';

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
    openErrorSnackbar(this.snackbarService, 'Instabile Version in der Entwicklung. Einige Features sind möglicherweise unvollständig.', 5000);
  }
}
