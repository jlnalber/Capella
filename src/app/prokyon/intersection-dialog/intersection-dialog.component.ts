import { Component } from '@angular/core';
import {DrawerService} from "../services/drawer.service";
import { openSnackbarWithMessageForSpecialPoints } from "../global/essentials/analysingFunctionsUtils";
import {Graph} from "../global/classes/canvas-elements/graph";
import DependencyPointElements from "../global/classes/canvas-elements/dependencyPointElements";
import { Dialog } from 'src/app/global/dialog/dialog';
import { Color } from 'src/app/global/interfaces/color';
import { SnackbarService } from 'src/app/global/snackbar/snackbar.service';
import { Point } from 'src/app/global/interfaces/point';
import { IntervalComponent } from '../formula-tab/global/interval/interval.component';
import { FormsModule } from '@angular/forms';

export interface IntersectionDialogData {
  graph1?: Graph,
  graph2?: Graph,
  color?: Color
}

@Component({
  standalone: true,
  imports: [
    IntervalComponent,
    FormsModule
  ],
  selector: 'app-intersection-dialog',
  templateUrl: './intersection-dialog.component.html',
  styleUrls: ['./intersection-dialog.component.css']
})
export class IntersectionDialogComponent {

  public dialogData?: IntersectionDialogData;
  public dialog!: Dialog<IntersectionDialogComponent>

  public from: number = -1;
  public to: number = 1;

  private _depth: number = 10;
  public get depth(): number {
    return this._depth;
  }

  public set depth(value: number) {
    this._depth = Math.floor(value);
  }

  constructor(private readonly drawerService: DrawerService, private readonly snackbarService: SnackbarService) {
  }

  getFuncName(graph: Graph | undefined): string {
    if (graph && graph.func !== undefined && graph.func.name) {
      return ` ${graph.func.name}`;
    }
    return '';
  }

  evaluateIntersectionPoints() {
    let error = false;
    try {
      if (this.dialogData && this.dialogData.graph1 && this.dialogData.graph2) {
        // Collect the data.
        const graph1 = this.dialogData.graph1;
        const graph2 = this.dialogData.graph2;
        const color = this.dialogData.color;

        this.drawerService.addCanvasElements(DependencyPointElements.createIntersectionPoints(this.drawerService,
          graph1,
          graph2,
          this.from,
          this.to,
          this.depth,
          color,
          (result: Point[]) => {
            // Open the snackbar when first initialized.
            openSnackbarWithMessageForSpecialPoints(this.snackbarService, 'Schnittpunkt', result.length);
          }));
      } else {
        error = true;
      }
    } catch {
      error = true;
    }

    // If there was an error, display in a snackbar.
    if (error) {
      this.snackbarService.openErrorSnackbar();
    }

    // Close the dialog.
    this.dialog.close();
  }

}
