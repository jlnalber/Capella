import { Component, OnDestroy } from '@angular/core';
import AbstractSettingsComponent from '../abstractSettingComponent';
import { WhiteboardService } from '../../whiteboard/services/whiteboard.service';
import { DEFAULT_PEN, getCopyOfPen, Pen } from '../../whiteboard/global/interfaces/penStyle';
import { Event as CustomEvent } from 'src/app/global/essentials/event';
import { Point } from 'src/app/global/interfaces/point';
import { ContextMenu, ContextMenuDirective } from 'src/app/global/context-menu/context-menu.directive';
import { FormulaElement } from 'src/app/prokyon/global/classes/abstract/formulaElement';
import { ConfirmationDialogComponent } from 'src/app/global/dialog/confirmation-dialog/confirmation-dialog.component';
import Picker from 'src/app/global/style-components/pickers/picker';
import { PickerDialogComponent, PickerDialogData } from '../../whiteboard/dialogs/picker-dialog/picker-dialog.component';
import { PenStyleComponent } from 'src/app/global/style-components/pen-style/pen-style.component';
import { RED_FILTER } from 'src/app/global/interfaces/color';

type PenAndEvent = [Pen, CustomEvent<[Point, Event]>]

@Component({
  standalone: true,
  imports: [
    ContextMenuDirective
  ],
  selector: 'app-view-pens',
  templateUrl: './view-pens.component.html',
  styleUrl: './view-pens.component.scss'
})
export class ViewPensComponent extends AbstractSettingsComponent implements OnDestroy {
  threePointsClicked(event: MouseEvent, p: PenAndEvent) {
    ContextMenuDirective.threePointsClicked(event, FormulaElement.getDOMRectOfIconButton(event), p[1]);
  }

  public getContextMenuForPen(p: PenAndEvent, isDefault: boolean): ContextMenu {
    return {
      elements: () => [{
        header: 'Bearbeiten',
        title: 'Stift bearbeiten',
        disabled: isDefault,
        click: () => {
          const picker = new Picker<Pen>(() => getCopyOfPen(p[0]), (pen?: Pen) => p[0] = pen ?? p[0]);
          const pickerDialogData: PickerDialogData<PenStyleComponent, Pen> = {
            componentType: PenStyleComponent,
            title: 'Stift bearbeiten',
            picker: picker
          }
          PickerDialogComponent.openPickerDialogComponent(this.whiteboardService.dialogService, pickerDialogData)
        },
        icon: 'edit'
      }, {
        header: 'Duplizieren',
        title: 'Stift duplizieren',
        click: () => {
          const index = this.defaultPens.indexOf(p);
          this.additionalPens.push([getCopyOfPen(p[0], index === -1 ? undefined : index), new CustomEvent<[Point, Event]>()])
        },
        icon: 'copy'
      }, {
        header: 'Löschen',
        title: 'Stift löschen',
        disabled: isDefault,
        filter: RED_FILTER,
        click: () => {
          ConfirmationDialogComponent.confirm(this.whiteboardService.dialogService, {
            yes: () => {
              const index = this.additionalPens.indexOf(p);
              if (index !== -1) {
                this.additionalPens.splice(index, 1);
              }
            },
            title: `Stift "${p[0].name}" löschen?`,
            text: 'Diese Aktion kann nicht mehr rückgängig gemacht werden.'
          })
        },
        icon: 'trash'
      }],
      additionalEvent: p[1]
    }
  }

  add() {
    this.additionalPens.push([DEFAULT_PEN, new CustomEvent<[Point, Event]>()]);
  }

  public readonly defaultPens: PenAndEvent[];
  public readonly additionalPens: PenAndEvent[];

  constructor (private readonly whiteboardService: WhiteboardService) {
    super();
    this.defaultPens = this.whiteboardService.settings.getDefaultPens().map(p => [p, new CustomEvent<[Point, Event]>()]);
    this.additionalPens = this.whiteboardService.settings.getAdditionalPens().map(p => [getCopyOfPen(p), new CustomEvent<[Point, Event]>()]);
  }

  protected save() {
    this.whiteboardService.settings.setAdditionalPens(this.additionalPens.map(p => p[0]));
  }

  ngOnDestroy(): void {
      this.closed = true;
  }
}
