import { Component } from '@angular/core';
import { WhiteboardService } from '../services/whiteboard.service';
import { TextMode } from '../global/classes/modes/textMode';
import { PenMode } from '../global/classes/modes/penMode';
import { ShapeMode } from '../global/classes/modes/shapeMode';
import { MoveMode } from '../global/classes/modes/moveMode';
import { SelectionMode } from '../global/classes/modes/selectionMode';
import { DeleteMode } from '../global/classes/modes/deleteMode';
import { EraseMode } from '../global/classes/modes/eraseMode';
import { PointerType, pointerTypes } from '../../global/classes/pointerController';
import { WhiteboardMode } from '../global/classes/modes/whiteboardMode';
import { colors } from '../../global/styles/colors';
import { SnackbarService } from 'src/app/global/snackbar/snackbar.service';
import { DialogService } from 'src/app/global/dialog/dialog.service';
import { ConfirmationDialogComponent } from 'src/app/global/dialog/confirmation-dialog/confirmation-dialog.component';
import { BLACK, Color, DEEPBLUE } from 'src/app/global/interfaces/color';
import { Ribbon, RibbonTab } from '../../global/classes/ribbon/ribbon';
import RibbonButton from '../../global/classes/ribbon/ribbonButton';
import RibbonPointerModeToggle from '../../global/classes/ribbon/ribbonPointerModeToggle';
import RibbonText from '../../global/classes/ribbon/ribbonText';
import RibbonToggle from '../../global/classes/ribbon/ribbonToggle';
import { QuickActionsComponent } from '../quick-actions/quick-actions.component';
import { RibbonComponent } from 'src/app/global/ribbon/ribbon.component';
import { WhiteboardCanvasComponent } from '../canvas/whiteboardCanvas.component';

@Component({
  standalone: true,
  imports: [
    QuickActionsComponent,
    RibbonComponent,
    WhiteboardCanvasComponent
  ],
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent {

  constructor(private readonly whiteboardService: WhiteboardService, private readonly snackBarService: SnackbarService, private readonly dialogService: DialogService) { }

  private getPointerActiveFunctionsForPointerToggle: (typechecker: (mode: WhiteboardMode) => boolean) => (() => Color | undefined)[] = (typechecker: (mode: WhiteboardMode) => boolean) => {
    const res: (() => Color | undefined)[] = [];
    for (let i = 0; i < pointerTypes.length; i++) {
      res.push(() => {
        const mode = this.whiteboardService.getModeForPointerType(pointerTypes[i]);
        if (!mode || !typechecker(mode)) {
          return undefined;
        }
        return colors[i];
      })
    }

    return res;
  }

  // TODO: ZOOM-Slider und Shortcuts
  public get ribbon(): Ribbon {
    const permTabs = [
      {
        name: 'Datei',
        color: BLACK,
        underlineColor: DEEPBLUE,
        content: [
          {
            title: 'Dateioptionen',
            content: [
              new RibbonButton('Öffnen', 'openFile', 'Eine Whiteboard-Datei öffnen', () => {}, () => false),
              new RibbonButton('Speichern', 'saveFile', 'Die Datei speichern', () => {}, () => false),
              new RibbonButton('Kopie', 'copy', 'Eine Kopie speichern unter', () => {}, () => false),
              new RibbonButton('Exportieren', 'export', 'Datei exportieren als', () => {}, () => false)
            ]
          },
          {
            title: 'Historie',
            content: [
              new RibbonButton('Leeren', 'pen', 'Das Whiteboard zurücksetzen', () => {}, () => false),
              new RibbonButton('Zurück', 'pen', 'Gehe ein Schritt zurück', () => {}, () => false),
              new RibbonButton('Vorwärts', 'pen', 'Gehe ein Schritt vor', () => {}, () => false)
            ]
          },
          new RibbonButton('Vollbild', 'pen', 'Aktiviere Vollbild zur besseren Ansicht', () => {}, () => false),
          new RibbonButton('Einstellungen', 'pen', 'Einstellungen öffnen', () => {}, () => false)
        ]
      },
      {
        name: 'Start',
        color: BLACK,
        underlineColor: DEEPBLUE,
        content: [
          {
            title: 'Modi',
            content: [
              new RibbonPointerModeToggle('Text', 'text', 'Schreibe einen Text', (p: PointerEvent) => {
                if (this.whiteboardService.getModeForPointerType(p.pointerType as PointerType) instanceof TextMode) {
                  this.whiteboardService.setModeForPointerType(p.pointerType as PointerType, undefined);
                } else {
                  this.whiteboardService.setModeForPointerType(p.pointerType as PointerType, new TextMode());
                }
              }, this.getPointerActiveFunctionsForPointerToggle(m => m instanceof TextMode)),
              new RibbonPointerModeToggle('Stift', 'pen', 'Male mit dem Stift', (p: PointerEvent) => {
                if (this.whiteboardService.getModeForPointerType(p.pointerType as PointerType) instanceof PenMode) {
                  this.whiteboardService.setModeForPointerType(p.pointerType as PointerType, undefined);
                } else {
                  this.whiteboardService.setModeForPointerType(p.pointerType as PointerType, new PenMode());
                }
              }, this.getPointerActiveFunctionsForPointerToggle(m => m instanceof PenMode)),
              new RibbonPointerModeToggle('Formen', 'pen', 'Füge Formen hinzu', (p: PointerEvent) => {
                if (this.whiteboardService.getModeForPointerType(p.pointerType as PointerType) instanceof ShapeMode) {
                  this.whiteboardService.setModeForPointerType(p.pointerType as PointerType, undefined);
                } else {
                  this.whiteboardService.setModeForPointerType(p.pointerType as PointerType, new ShapeMode());
                }
              }, this.getPointerActiveFunctionsForPointerToggle(m => m instanceof ShapeMode), () => false), // TODO: dann auf einem Extra-Tab die Optionen
              new RibbonPointerModeToggle('Bewegen', 'moveWhiteboard', 'Bewege das Whiteboard', (p: PointerEvent) => {
                if (this.whiteboardService.getModeForPointerType(p.pointerType as PointerType) instanceof MoveMode) {
                  this.whiteboardService.setModeForPointerType(p.pointerType as PointerType, undefined);
                } else {
                  this.whiteboardService.setModeForPointerType(p.pointerType as PointerType, new MoveMode());
                }
              }, this.getPointerActiveFunctionsForPointerToggle(m => m instanceof MoveMode)),
              new RibbonPointerModeToggle('Auswahl', 'pen', 'Wähle Elemente auf dem Whiteboard aus', (p: PointerEvent) => {
                if (this.whiteboardService.getModeForPointerType(p.pointerType as PointerType) instanceof SelectionMode) {
                  this.whiteboardService.setModeForPointerType(p.pointerType as PointerType, undefined);
                } else {
                  this.whiteboardService.setModeForPointerType(p.pointerType as PointerType, new SelectionMode());
                }
              }, this.getPointerActiveFunctionsForPointerToggle(m => m instanceof SelectionMode), () => false),
              new RibbonPointerModeToggle('Löschen', 'pen', 'Lösche Elemente', (p: PointerEvent) => {
                if (this.whiteboardService.getModeForPointerType(p.pointerType as PointerType) instanceof DeleteMode) {
                  this.whiteboardService.setModeForPointerType(p.pointerType as PointerType, undefined);
                } else {
                  this.whiteboardService.setModeForPointerType(p.pointerType as PointerType, new DeleteMode());
                }
              }, this.getPointerActiveFunctionsForPointerToggle(m => m instanceof DeleteMode), () => false),
              new RibbonPointerModeToggle('Radierer', 'eraser', 'Radiere den Stift', (p: PointerEvent) => {
                if (this.whiteboardService.getModeForPointerType(p.pointerType as PointerType) instanceof EraseMode) {
                  this.whiteboardService.setModeForPointerType(p.pointerType as PointerType, undefined);
                } else {
                  this.whiteboardService.setModeForPointerType(p.pointerType as PointerType, new EraseMode());
                }
              }, this.getPointerActiveFunctionsForPointerToggle(m => m instanceof EraseMode), () => false)
            ]
          }
        ]
      },
      {
        name: 'Einfügen',
        color: BLACK,
        underlineColor: DEEPBLUE,
        content: [
          new RibbonButton('Bild', 'pen', 'Ein Bild hinzufügen', () => {}, () => false), // TODO: Menü (Dialog), in dem man dann auswählen kann zwischen etwas aus der Cloud (?), vom PC oder gescannt
          new RibbonButton('Notiz', 'pen', 'Sticky Note hinzufügen', () => {}, () => false),
          new RibbonButton('PDF', 'pen', 'Seiten aus einer PDF als Bild hinzufügen', () => {}, () => false),
          new RibbonButton('LaTeX', 'pen', 'LaTeX hinzufügen', () => {}, () => false),
          new RibbonButton('Prokyon', 'pen', 'Eine Prokyon Datei hinzufügen', () => {}, () => false),
          new RibbonButton('Referenz', 'pen', 'Referenz hinzufügen', () => {}, () => false)
        ]
      },
      {
        name: 'Seiten',
        color: BLACK,
        underlineColor: DEEPBLUE,
        content: [
          new RibbonButton('Layout', 'pen', 'Layout der Seiten einstellen', () => {}, () => false),
          new RibbonButton('Anordnen', 'pen', 'Seiten neu anordnen', () => {}, () => false),
          new RibbonButton('Hintergrund', 'pen', 'Hintergrund der Seiten einstellen', () => {}, () => false),
          {
            title: 'Seite Hinzufügen',
            content: [
              new RibbonButton('Hinzufügen', 'plus', 'Eine leere Seite hinzufügen', () => {
                this.whiteboardService.addPage();
                this.whiteboardService.activePageIndex = this.whiteboardService.numberOfPages - 1;
              }),
              new RibbonButton('Datei', 'pen', 'Eine Datei importieren und anfügen', () => {}, () => false), // TODO: Dialog, in dem man Whiteboard, PDF oder Bild auswählen kann
              new RibbonButton('Scannen', 'pen', 'Seiten mit der Kamera einscannen und anfügen', () => {}, () => false)
            ]
          },
          {
            title: 'Navigieren',
            content: [
              new RibbonButton('Links', 'left', 'Eine Seite nach links wechseln', () => {
                this.whiteboardService.activePageIndex--;
              }, () => this.whiteboardService.activePageIndex > 0),
              new RibbonText(() => {
                return `Seite\n${this.whiteboardService.activePageIndex + 1}/${this.whiteboardService.numberOfPages}`;
              }, 'Seitenanzeige'),
              new RibbonButton('Löschen', 'trash', 'Diese Seite löschen', () => {
                ConfirmationDialogComponent.confirm(this.dialogService, {
                  title: 'Wirklich löschen?',
                  text: 'Die Seite kann nicht wiederhergestellt werden.',
                  yes: () => this.whiteboardService.removePage(this.whiteboardService.activePageIndex)
                });
              }, () => this.whiteboardService.numberOfPages > 1),
              new RibbonButton('Rechts', 'right', 'Eine Seite nach rechts wechseln', () => {
                this.whiteboardService.activePageIndex++;
              }, () => this.whiteboardService.activePageIndex < this.whiteboardService.numberOfPages - 1)
            ]
          }
        ]
      },
      {
        name: 'Ansicht',
        color: BLACK,
        underlineColor: DEEPBLUE,
        content: [] // TODO: ZOOM, TRANSLATE, CENTER  FALLS FORMAT !== UNDEFINED
      },
      {
        name: 'Extras',
        color: BLACK,
        underlineColor: DEEPBLUE,
        content: [
          {
            title: 'Lineale',
            content: [
              new RibbonToggle('Lineal', 'pen', 'Ein normales Lineal verwenden', () => {}, () => false, () => false),
              new RibbonToggle('Geodreieck', 'pen', 'Ein Geodreieck verwenden', () => {}, () => false, () => false),
              new RibbonToggle('Halbkreis', 'pen', 'Einen Halbkreis verwenden', () => {}, () => false, () => false)
            ]
          }
        ]
      }
    ]

    const tempRibbonTabs: RibbonTab[] = [];
    for (let type of pointerTypes) {
      tempRibbonTabs.push(...(this.whiteboardService.getModeForPointerType(type)?.getExtraRibbons(this.whiteboardService, this.whiteboardService.renderingContext) ?? []));
    }

    return {
      ribbonTabs: [...permTabs, ...tempRibbonTabs]
    }
  }
}
