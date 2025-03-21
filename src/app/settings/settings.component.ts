import { Component, ComponentRef, Type } from '@angular/core';
import AbstractSettingsComponent from './abstractSettingComponent';
import { EditPenQuickActionsComponent } from './edit-pen-quick-actions/edit-pen-quick-actions.component';
import { ViewSettingsComponent } from "./view-settings/view-settings.component";
import { Event } from '../global/essentials/event';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ViewPensComponent } from './view-pens/view-pens.component';
import { SnackbarService } from '../global/snackbar/snackbar.service';
import { ViewObjectStylesComponent } from './view-object-styles/view-object-styles.component';
import { ViewStrokeStylesComponent } from './view-stroke-styles/view-stroke-styles.component';
import { ViewFillStylesComponent } from './view-fill-styles/view-fill-styles.component';
import { ViewImageStylesComponent } from './view-image-styles/view-image-styles.component';

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
      this.snackbarService.openSnackbar('Einstellungen gespeichert');
    } catch (e) {
      console.error(e);
      this.snackbarService.openErrorSnackbar('Fehler beim Speichern der Einstellungen');
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
    componentTypes: [
      ViewObjectStylesComponent,
      ViewStrokeStylesComponent,
      ViewFillStylesComponent,
      ViewImageStylesComponent
    ]
  }];
}

export interface SettingsTab {
  text: string,
  title: string,
  url: string,
  componentTypes: Type<AbstractSettingsComponent>[]
}
