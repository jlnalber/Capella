import { Component } from '@angular/core';
import AbstractSettingsComponent from '../abstractSettingComponent';
import { WhiteboardService } from '../../services/whiteboard.service';
import { DEFAULT_PEN, getCopyOfPen, Pen } from '../../global/interfaces/penStyle';
import { Event as CustomEvent } from 'src/app/global/essentials/event';
import { Point } from 'src/app/global/interfaces/point';
import { ContextMenu, ContextMenuDirective } from 'src/app/global/context-menu/context-menu.directive';
import { FormulaElement } from 'src/app/prokyon/global/classes/abstract/formulaElement';
import { ConfirmationDialogComponent } from 'src/app/global/dialog/confirmation-dialog/confirmation-dialog.component';

type PenAndEvent = [Pen, CustomEvent<[Point, Event]>]

@Component({
  selector: 'app-view-pens',
  templateUrl: './view-pens.component.html',
  styleUrl: './view-pens.component.scss'
})
export class ViewPensComponent extends AbstractSettingsComponent {
  threePointsClicked(event: MouseEvent, p: PenAndEvent) {
    ContextMenuDirective.threePointsClicked(event, FormulaElement.getDOMRectOfIconButton(event), p[1]);
  }

  public getContextMenuForPen(p: PenAndEvent, isDefault: boolean): ContextMenu {
    return {
      elements: () => [{
        header: 'Bearbeiten',
        title: 'Stift bearbeiten',
        disabled: true || isDefault,
        click: () => {
          // TODO: enable pen editing
        },
        icon: 'edit'
      }, {
        header: 'Duplizieren',
        title: 'Stift duplizieren',
        click: () => {
          this.additionalPens.push([getCopyOfPen(p[0]), new CustomEvent<[Point, Event]>()])
        },
        icon: 'content_copy'
      }, {
        header: 'Löschen',
        title: 'Stift löschen',
        disabled: isDefault,
        color: 'red',
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
        icon: 'delete'
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

  public saveListener = () => {
    this.whiteboardService.settings.setAdditionalPens(this.additionalPens.map(p => p[0]));
  }
}
