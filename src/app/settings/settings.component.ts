import { Component, ComponentRef, Type } from '@angular/core';
import AbstractSettingsComponent from './abstractSettingComponent';
import { EditPenQuickActionsComponent } from './edit-pen-quick-actions/edit-pen-quick-actions.component';
import { ViewSettingsComponent } from "./view-settings/view-settings.component";
import { Event } from '../global/essentials/event';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ViewPensComponent } from './view-pens/view-pens.component';
import { SnackbarService } from '../global/snackbar/snackbar.service';
import { getColorAsRgbFunction } from '../global/interfaces/color';
import { ERROR_COLOR } from '../global/styles/colors';
import { openErrorSnackbar } from '../prokyon/global/essentials/analysingFunctionsUtils';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ViewSettingsComponent,
    CommonModule,
    RouterLink,
    RouterModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  save() {
    try {
      this.saveEvent.emit()
    } catch (e) {
      console.error(e);
      openErrorSnackbar(this.snackbarService, 'Fehler beim Speichern der Einstellungen');
    }
  }

  public get currentTab(): SettingsTab {
    return this.tabs.find(tab => tab.url == this.activatedRoute.snapshot.params['settingsurl']) || this.tabs[0];
  }
  

  onTabKeyboard(event: KeyboardEvent, tab: SettingsTab) {
    if (event.key == 'Enter' || event.key == ' ') {
      this.router.navigate(["/settings", tab.url]);
    }
  }

  constructor(public readonly activatedRoute: ActivatedRoute, public readonly router: Router, private readonly snackbarService: SnackbarService) { }

  public onCreated = (component: ComponentRef<AbstractSettingsComponent>) => {
    this.saveEvent.addListener(component.instance.saveListener);
  }

  public saveEvent: Event<any> = new Event<any>();

  public tabs: SettingsTab[] = [{
    text: 'Allgemein',
    title: 'Allgemeine Einstellungen',
    url: 'general',
    componentTypes: []
  }, {
    text: 'Whiteboard',
    title: 'Whiteboard Einstellungen',
    url: 'whiteboard',
    componentTypes: [
      EditPenQuickActionsComponent,
      ViewPensComponent
    ]
  }, {
    text: 'Stile',
    title: 'Verschiedene Stile einstellen, hinzufügen und entfernen',
    url: 'styles',
    componentTypes: []
  }];
}

export interface SettingsTab {
  text: string,
  title: string,
  url: string,
  componentTypes: Type<AbstractSettingsComponent>[]
}
