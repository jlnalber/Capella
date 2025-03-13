import { Component, OnDestroy } from '@angular/core';
import { LoadingComponent } from "../../global/loading/loading.component";
import { ViewObjectsComponent, ViewObjectsData, ViewObjectsDataObject } from "../view-objects/view-objects.component";
import { ContextMenu, ContextMenuDirective } from 'src/app/global/context-menu/context-menu.directive';
import { FormulaElement } from 'src/app/prokyon/global/classes/abstract/formulaElement';
import { getCopyOfObjectStyle, getCopyOfObjectStyleWrapper, getEmptyObjectStyleWrapperForCopy, ObjectStyleWrapper } from 'src/app/global/interfaces/canvasStyles/objectStyle';
import { Point } from 'src/app/global/interfaces/point';
import { Event as CustomEvent } from 'src/app/global/essentials/event';
import Picker from 'src/app/global/style-components/pickers/picker';
import { PickerDialogComponent, PickerDialogData } from 'src/app/whiteboard/dialogs/picker-dialog/picker-dialog.component';
import { ObjectStyleComponent } from 'src/app/global/style-components/object-style/object-style.component';
import { RED_FILTER } from 'src/app/global/interfaces/color';
import { ConfirmationDialogComponent } from 'src/app/global/dialog/confirmation-dialog/confirmation-dialog.component';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';
import AbstractSettingsComponent from '../abstractSettingComponent';
import { ObjectStyleWrapperComponent } from 'src/app/global/style-components/object-style-wrapper/object-style-wrapper.component';

type ObjectStyleAndEvent = [ObjectStyleWrapper, CustomEvent<[Point, Event]>]

@Component({
  selector: 'app-view-object-styles',
  standalone: true,
  imports: [LoadingComponent, ViewObjectsComponent],
  templateUrl: './view-object-styles.component.html',
  styleUrl: './view-object-styles.component.scss'
})
export class ViewObjectStylesComponent extends AbstractSettingsComponent implements OnDestroy {
  threePointsClicked(event: MouseEvent, p: ObjectStyleAndEvent) {
    ContextMenuDirective.threePointsClicked(event, FormulaElement.getDOMRectOfIconButton(event), p[1]);
  }

  public getContextMenuForPen(p: ObjectStyleAndEvent): ContextMenu {
    return {
      elements: () => [{
        header: 'Bearbeiten',
        title: 'Objektstil bearbeiten',
        click: () => {
          const picker = new Picker<ObjectStyleWrapper>(() => getCopyOfObjectStyleWrapper(p[0]), (objectStyle?: ObjectStyleWrapper) => {
            p[0] = objectStyle ?? p[0];
            this.resetData();
          });
          const pickerDialogData: PickerDialogData<ObjectStyleWrapperComponent, ObjectStyleWrapper> = {
            componentType: ObjectStyleWrapperComponent,
            title: 'Objektstil bearbeiten',
            picker: picker
          }
          PickerDialogComponent.openPickerDialogComponent(this.whiteboardService.dialogService, pickerDialogData)
        },
        icon: 'edit'
      }, {
        header: 'Duplizieren',
        title: 'Objektstil duplizieren',
        click: () => {
          this.objectStyles.push([getCopyOfObjectStyleWrapper(p[0]), new CustomEvent<[Point, Event]>()]);
          this.resetData();
        },
        icon: 'copy'
      }, {
        header: 'Löschen',
        title: 'Objektstil löschen',
        filter: RED_FILTER,
        click: () => {
          ConfirmationDialogComponent.confirm(this.whiteboardService.dialogService, {
            yes: () => {
              const index = this.objectStyles.indexOf(p);
              if (index !== -1) {
                this.objectStyles.splice(index, 1);
                this.resetData();
              }
            },
            title: `Objektstil "${p[0].name}" löschen?`,
            text: 'Diese Aktion kann nicht mehr rückgängig gemacht werden.'
          })
        },
        icon: 'trash'
      }],
      additionalEvent: p[1]
    }
  }

  add() {
    this.objectStyles.push([getEmptyObjectStyleWrapperForCopy(), new CustomEvent<[Point, Event]>()]);
    this.resetData();
  }

  private resetData() {
    const objects: ViewObjectsDataObject<ObjectStyleAndEvent>[] = this.objectStyles.map(p => ({
      object: p,
      getContextMenu: () => this.getContextMenuForPen(p),
      threePointsClicked: (event: MouseEvent) => this.threePointsClicked(event, p),
      name: p[0].name
    }));

    this.data = {
      title: 'Objektstile bearbeiten',
      add: () => this.add(),
      objects: objects
    }
  }

  public data?: ViewObjectsData<ObjectStyleAndEvent>;

  public readonly objectStyles: ObjectStyleAndEvent[];

  constructor (private readonly whiteboardService: WhiteboardService) {
    super();
    this.objectStyles = this.whiteboardService.settings.getObjectStyles().map(p => [getCopyOfObjectStyleWrapper(p), new CustomEvent<[Point, Event]>()]);
    this.resetData();
  }

  protected save() {
    this.whiteboardService.settings.setObjectStyles(this.objectStyles.map(p => p[0]));
  }

  ngOnDestroy(): void {
      this.closed = true;
  }

}
