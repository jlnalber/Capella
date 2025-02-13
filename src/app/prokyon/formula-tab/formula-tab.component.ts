import {Component, OnInit} from '@angular/core';
import {DrawerService} from "../services/drawer.service";
import {Graph} from "../global/classes/canvas-elements/graph";
import {ContextMenu, ContextMenuDirective} from "../../global/context-menu/context-menu.directive";
import CompiledPointElement from "../global/classes/canvas-elements/compiledPointElement";
import CurveElement from "../global/classes/canvas-elements/curveElement";
import { RED_FILTER } from 'src/app/global/interfaces/color';
import { FormulaElementComponent } from './formula-element/formula-element.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    FormulaElementComponent,
    ContextMenuDirective,
    CommonModule
  ],
  selector: 'app-formula-tab',
  templateUrl: './formula-tab.component.html',
  styleUrls: ['./formula-tab.component.css']
})
export class FormulaTabComponent implements OnInit {

  public contextMenu: ContextMenu = {
    elements: () => [
      {
        header: 'Funktion hinzufügen',
        click: () => {
          this.addGraph();
        },
        icon: 'function',
        title: 'Eine Funktion hinzufügen.'
      },
      {
        header: 'Punkt hinzufügen',
        click: () => {
          this.addPoint();
        },
        icon: 'point',
        title: 'Einen Punkt hinzufügen.'
      },
      {
        header: 'Kurve hinzufügen',
        click: () => {
          this.addCurve();
        },
        icon: 'curve',
        title: 'Eine Kurve hinzufügen.'
      },
      {
        header: 'Alle löschen',
        click: () => {
          this.drawerService.emptyCanvasElements();
        },
        icon: 'trash',
        filter: RED_FILTER,
        title: 'Alle Elemente löschen.'
      }
    ]
  }

  constructor(public readonly drawerService: DrawerService) { }

  ngOnInit(): void {
  }

  addClick() {
    this.addGraph();
  }

  keyboardAdd(event: KeyboardEvent) {
    if (event.key == 'Enter' || event.key == ' ') {
      this.addClick();
    }
  }

  addGraph(): void {
    const graph = new Graph(this.drawerService.parseAndValidateProviderGraph, undefined, this.drawerService.getNewColor());
    graph.configuration.formula = '0';
    graph.configuration.editable = true;
    this.drawerService.addCanvasElements(graph);
  }

  addPoint(): void {
    const pointElement = new CompiledPointElement((t: string) => this.drawerService.parseAndValidateOperation(t), this.drawerService.getNewColor());
    this.drawerService.addCanvasElements(pointElement);
  }

  addCurve(): void {
    const curveElement = new CurveElement((t: string, vars: string[]) => this.drawerService.parseAndValidateOperation(t, true, vars), this.drawerService.getNewColor());
    this.drawerService.addCanvasElements(curveElement);
  }
}
