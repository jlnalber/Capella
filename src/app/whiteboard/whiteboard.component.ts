import { Component } from '@angular/core';
import { Ribbon, RibbonButton, RibbonToggle } from './ribbon/ribbon';
import { WhiteboardService } from '../services/whiteboard.service';
import { TextMode } from '../global/classes/modes/textMode';
import { PenMode } from '../global/classes/modes/penMode';
import { ShapeMode } from '../global/classes/modes/shapeMode';
import { MoveMode } from '../global/classes/modes/moveMode';
import { SelectionMode } from '../global/classes/modes/selectionMode';
import { DeleteMode } from '../global/classes/modes/deleteMode';
import { EraseMode } from '../global/classes/modes/eraseMode';
import { BLACK, DEEPBLUE } from '../global/interfaces/color';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent {

  constructor(private readonly whiteboardService: WhiteboardService) { }

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
              new RibbonButton('Öffnen', 'openFile', 'Eine Whiteboard-Datei öffnen', () => {}),
              new RibbonButton('Speichern', 'saveFile', 'Die Datei speichern', () => {}),
              new RibbonButton('Kopie', 'copy', 'Eine Kopie speichern unter', () => {}),
              new RibbonButton('Exportieren', 'export', 'Datei exportieren als', () => {})
            ]
          },
          {
            title: 'Historie',
            content: [
              new RibbonButton('Leeren', 'pen', 'Das Whiteboard zurücksetzen', () => {}),
              new RibbonButton('Zurück', 'pen', 'Gehe ein Schritt zurück', () => {}),
              new RibbonButton('Vorwärts', 'pen', 'Gehe ein Schritt vor', () => {})
            ]
          },
          new RibbonButton('Vollbild', 'pen', 'Aktiviere Vollbild zur besseren Ansicht', () => {}),
          new RibbonButton('Einstellungen', 'pen', 'Einstellungen öffnen', () => {})
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
              new RibbonToggle('Text', 'text', 'Schreibe einen Text', () => this.whiteboardService.mode = new TextMode(), () => this.whiteboardService.mode instanceof TextMode),
              new RibbonToggle('Stift', 'pen', 'Male mit dem Stift', () => this.whiteboardService.mode = new PenMode(), () => this.whiteboardService.mode instanceof PenMode),
              new RibbonToggle('Formen', 'pen', 'Füge Formen hinzu', () => this.whiteboardService.mode = new ShapeMode(), () => this.whiteboardService.mode instanceof ShapeMode), // TODO: dann auf einem Extra-Tab die Optionen
              new RibbonToggle('Bewegen', 'move', 'Bewege das Whiteboard', () => this.whiteboardService.mode = new MoveMode(), () => this.whiteboardService.mode instanceof MoveMode),
              new RibbonToggle('Auswahl', 'pen', 'Wähle Elemente auf dem Whiteboard aus', () => this.whiteboardService.mode = new SelectionMode(), () => this.whiteboardService.mode instanceof SelectionMode),
              new RibbonToggle('Löschen', 'pen', 'Lösche Elemente', () => this.whiteboardService.mode = new DeleteMode(), () => this.whiteboardService.mode instanceof DeleteMode),
              new RibbonToggle('Radierer', 'eraser', 'Radiere den Stift', () => this.whiteboardService.mode = new EraseMode(), () => this.whiteboardService.mode instanceof EraseMode)
            ]
          }
        ]
      },
      {
        name: 'Einfügen',
        color: BLACK,
        underlineColor: DEEPBLUE,
        content: [
          new RibbonButton('Bild', 'pen', 'Ein Bild hinzufügen', () => {}), // TODO: Menü (Dialog), in dem man dann auswählen kann zwischen etwas aus der Cloud (?), vom PC oder gescannt
          new RibbonButton('Notiz', 'pen', 'Sticky Note hinzufügen', () => {}),
          new RibbonButton('PDF', 'pen', 'Seiten aus einer PDF als Bild hinzufügen', () => {}),
          new RibbonButton('LaTeX', 'pen', 'LaTeX hinzufügen', () => {}),
          new RibbonButton('Prokyon', 'pen', 'Eine Prokyon Datei hinzufügen', () => {}),
          new RibbonButton('Referenz', 'pen', 'Referenz hinzufügen', () => {})
        ]
      },
      {
        name: 'Seiten',
        color: BLACK,
        underlineColor: DEEPBLUE,
        content: [
          new RibbonButton('Layout', 'pen', 'Layout der Seiten einstellen', () => {}),
          new RibbonButton('Anordnen', 'pen', 'Seiten neu anordnen', () => {}),
          new RibbonButton('Hintergrund', 'pen', 'Hintergrund der Seiten einstellen', () => {}),
          {
            title: 'Seite Hinzufügen',
            content: [
              new RibbonButton('Hinzufügen', 'pen', 'Eine leere Seite hinzufügen', () => {}),
              new RibbonButton('Datei', 'pen', 'Eine Datei importieren und anfügen', () => {}), // TODO: Dialog, in dem man Whiteboard, PDF oder Bild auswählen kann
              new RibbonButton('Scannen', 'pen', 'Seiten mit der Kamera einscannen und anfügen', () => {})
            ]
          },
          {
            title: 'Navigieren',
            content: [
              new RibbonButton('Links', 'pen', 'Eine Seite nach links wechseln', () => {}),
              // TODO: Seitenanzeige (z.B. 3/5)
              new RibbonButton('Löschen', 'pen', 'Diese Seite löschen', () => {}),
              new RibbonButton('Rechts', 'pen', 'Eine Seite nach rechts wechseln', () => {})
            ]
          }
        ]
      },
      {
        name: 'Extras',
        color: BLACK,
        underlineColor: DEEPBLUE,
        content: [
          {
            title: 'Lineale',
            content: [
              new RibbonToggle('Lineal', 'pen', 'Ein normales Lineal verwenden', () => {}, () => false),
              new RibbonToggle('Geodreieck', 'pen', 'Ein Geodreieck verwenden', () => {}, () => false),
              new RibbonToggle('Halbkreis', 'pen', 'Einen Halbkreis verwenden', () => {}, () => false)
            ]
          }
        ]
      }
    ]

    const tempRibbonTabs = this.whiteboardService.mode?.getExtraRibbons(this.whiteboardService, this.whiteboardService.renderingContext) ?? []

    return {
      ribbonTabs: [...permTabs, ...tempRibbonTabs]
    }
  }
}
