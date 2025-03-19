import { SnackbarService } from "src/app/global/snackbar/snackbar.service";
import {DrawerService} from "../../services/drawer.service";
import {Graph} from "../classes/canvas-elements/graph";
import { getColorAsRgbFunction } from "src/app/global/interfaces/color";
import { ERROR_COLOR } from "src/app/global/styles/colors";

export function getMessageForSpecialPoints(name: string, count: number): string {
  if (count !== 1) {
    name += 'e';
  }
  if (count === 0) {
    return `Keine ${name} gefunden.`;
  }
  else if (count === 1) {
    return `Ein ${name} gefunden.`;
  }
  else {
    return `${count} ${name} gefunden.`;
  }
}

export function openSnackbarWithMessageForSpecialPoints(snackbarService: SnackbarService, name: string, count: number): void {
  snackbarService.openSnackbar(getMessageForSpecialPoints(name, count));
}

export function getDependencyStillActiveListenerForGraphDependency(drawerService: DrawerService, graph: Graph): () => boolean {
  return () => {
    for (let canvasElement of drawerService.canvasElements) {
      if (canvasElement === graph) return true;
    }
    return false;
  }
}

export function getLabelForGraphDependency(name: string, graph: Graph): [string, () => string | undefined] {
  return [name, () => graph.func?.name]
}
