import { Component, OnInit } from '@angular/core';
import {DrawerService} from "../services/drawer.service";
import {ScreenshotDialogComponent} from "../screenshot-dialog/screenshot-dialog.component";
import {Serialized} from "../global/essentials/serializer";
import { DialogService } from 'src/app/global/dialog/dialog.service';
import { FormsModule } from '@angular/forms';

const STORAGE_CACHE = 'serialized';

@Component({
  selector: 'app-settings-tab',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './settings-tab.component.html',
  styleUrls: ['./settings-tab.component.scss']
})
export class SettingsTabComponent implements OnInit {

  constructor(public readonly drawerService: DrawerService, private readonly dialogService: DialogService) { }

  ngOnInit(): void {
  }

  screenshot() {
    this.dialogService.createDialog(ScreenshotDialogComponent)?.open();
  }

  download() {
    const content = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.drawerService.serialize()));
    const a = document.createElement('a');
    a.href = content;
    a.download = 'download.json';
    a.click();

    localStorage.setItem(STORAGE_CACHE, JSON.stringify(this.drawerService.serialize()));
  }

  openFile() {
    let inp = document.getElementById('inp') as HTMLInputElement;

    if (inp.files) {
      const file = inp.files?.item(0);
      file?.text().then(t => {
        try {
          this.drawerService.loadFrom(JSON.parse(t) as Serialized);
        } catch (e) {
          console.error(e);
        }
      })
    }
  }

  reset() {
    try {
      this.drawerService.loadFrom({
        "canvasElements": [],
        "backgroundColor": {"r": 255, "g": 255, "b": 255},
        "transformations": {"translateX": 7, "translateY": -5, "zoom": 100},
        "showGrid": true,
        "showGridNumbers": true,
        "drawNewLabels": true
      });
    } catch {
    }
  }
}
