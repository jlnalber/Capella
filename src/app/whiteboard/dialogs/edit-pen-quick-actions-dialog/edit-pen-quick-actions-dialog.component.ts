import { Component } from '@angular/core';
import { Dialog } from 'src/app/global/dialog/dialog';
import { Event } from 'src/app/global/essentials/event';
import { EditPenQuickActionsComponent } from "../../settings/edit-pen-quick-actions/edit-pen-quick-actions.component";

@Component({
  selector: 'app-edit-pen-quick-actions-dialog',
  standalone: true,
  imports: [EditPenQuickActionsComponent],
  templateUrl: './edit-pen-quick-actions-dialog.component.html',
  styleUrl: './edit-pen-quick-actions-dialog.component.scss'
})
export class EditPenQuickActionsDialogComponent {

  close() {
    this.dialog.close();
  }

  save() {
    this.saveEvent.emit();
    this.close();
  }

  public saveEvent: Event<undefined> = new Event<undefined>();

  public dialog!: Dialog<EditPenQuickActionsDialogComponent>

}
