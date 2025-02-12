import {AfterViewInit, Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {ContextMenu, ContextMenuElement} from "../../../global/context-menu/context-menu.directive";
import {DrawerService} from "../../services/drawer.service";
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import { ProkyonCanvasElement } from '../../global/classes/abstract/prokyonCanvasElement';
import { DialogService } from 'src/app/global/dialog/dialog.service';
import { RED_FILTER } from 'src/app/global/interfaces/color';

@Component({
  selector: 'app-formula-element',
  templateUrl: './formula-element.component.html',
  styleUrls: ['./formula-element.component.css']
})
export class FormulaElementComponent implements AfterViewInit {

  @Input() canvasElement!: ProkyonCanvasElement;
  @ViewChild('formula', {read: ViewContainerRef}) formula!: ViewContainerRef;
  private formulaElementComp?: FormulaElement;

  constructor(private readonly drawerService: DrawerService, private readonly dialogService: DialogService) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.formulaElementComp = this.formula.createComponent(this.canvasElement.componentType).instance;
      this.formulaElementComp.canvasElement = this.canvasElement;
    })
  }

  get selected(): boolean {
    return this.drawerService.selection.contains(this.canvasElement || undefined);
  }

  private getContextMenuElementsFromFormulaElement(): ContextMenuElement[] {
    if (this.formulaElementComp) {
      return this.formulaElementComp.contextMenu.elements();
    }
    return [];
  }

  get completeContextMenu(): ContextMenu {
    return {
      elements: () => {
        const cme: ContextMenuElement = {
          header: 'Anzeigen',
          click: () => {
            this.dialogService.createDialog(this.canvasElement.formulaDialogType!)?.open(this.canvasElement)
          },
          icon: 'view',
          title: 'Element anzeigen und bearbeiten.'
        };
        const dialog: ContextMenuElement[] = this.canvasElement.formulaDialogType !== undefined ? [cme] : [];

        const selected = this.selected;
        const elements: ContextMenuElement[] = [
          ...dialog,
          ...this.getContextMenuElementsFromFormulaElement(),
          {
            header: selected ? 'Auswahl entfernen' : 'Auswählen',
            click: () => {
              this.drawerService.selection.alternate(this.canvasElement || undefined);
            },
            icon: selected ? 'doubleCheckmarkCrossed' : 'doubleCheckmark',
            title: 'Dieses Element auswählen.'
          },
          {
            header: 'Löschen',
            filter: RED_FILTER,
            click: () => {
              this.drawerService.removeCanvasElements(this.canvasElement);
            },
            icon: 'trash',
            title: 'Dieses Element löschen.'
          }
        ]

        if (selected) {
          elements.push({
            header: 'Auswahl löschen',
            click: () => {
              this.drawerService.removeCanvasElements(...this.drawerService.selection.toArray());
            },
            filter: RED_FILTER,
            icon: 'trashMultiple',
            title: 'Alle ausgewählten Elemente löschen.'
          });
        }

        return elements;
      },
      additionalEvent: this.formulaElementComp?.contextMenu.additionalEvent,
      defaultPopUpPosition: this.formulaElementComp?.contextMenu.defaultPopUpPosition
    }
  }

}
