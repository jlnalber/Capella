import { Component } from '@angular/core';
import { SettingsTabGroupComponent, Tab } from './settings-tab-group/settings-tab-group.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { WhiteboardSettingsComponent } from './whiteboard-settings/whiteboard-settings.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SettingsTabGroupComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  public tabs: Tab[] = [{
    text: 'Allgemein',
    title: 'Allgemeine Einstellungen',
    componentType: GeneralSettingsComponent
  }, {
    text: 'Whiteboard',
    title: 'Whiteboard Einstellungen',
    componentType: WhiteboardSettingsComponent
  }];
}
