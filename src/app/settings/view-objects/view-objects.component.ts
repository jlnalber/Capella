import { Component, Input } from '@angular/core';
import { LoadingComponent } from "../../global/loading/loading.component";
import { ContextMenu, ContextMenuDirective } from 'src/app/global/context-menu/context-menu.directive';

@Component({
  selector: 'app-view-objects',
  standalone: true,
  imports: [
    LoadingComponent,
    ContextMenuDirective
  ],
  templateUrl: './view-objects.component.html',
  styleUrl: './view-objects.component.scss'
})
export class ViewObjectsComponent<T> {
  @Input({ required: true }) data?: ViewObjectsData<T>;
}

export interface ViewObjectsData<T> {
  title: string,
  objects: ViewObjectsDataObject<T>[],
  add: () => void
}

export interface ViewObjectsDataObject<T> {
  object: T,
  icon?: string,
  name: string,
  getContextMenu: () => ContextMenu,
  threePointsClicked: (event: MouseEvent) => void
}