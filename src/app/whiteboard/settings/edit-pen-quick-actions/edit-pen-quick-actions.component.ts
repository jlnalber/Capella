import { AfterViewInit, Component, Input } from '@angular/core';
import { WhiteboardService } from '../../services/whiteboard.service';
import { Pen } from '../../global/interfaces/penStyle';
import { FormsModule } from '@angular/forms';
import AbstractSettingsComponent from '../abstractSettingComponent';
import { Event } from 'src/app/global/essentials/event';

@Component({
  selector: 'app-edit-pen-quick-actions',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './edit-pen-quick-actions.component.html',
  styleUrl: './edit-pen-quick-actions.component.scss'
})
export class EditPenQuickActionsComponent extends AbstractSettingsComponent implements AfterViewInit {

  @Input({required: true}) saveEvent!: Event<undefined>;

  add() {
    this.order.push(0);
  }

  removePen(i: number) {
    this.order.splice(i, 1);
  }

  protected saveListener = () => {
    this.whiteboardService.settings.setPensOrder(this.order);
  }

  public pens: Pen[];
  public order: number[];

  constructor(public readonly whiteboardService: WhiteboardService) {
    super();
    this.pens = this.whiteboardService.settings.getPens();
    this.order = this.whiteboardService.settings.getPensOrder().filter(i => i < this.pens.length);
  }

  ngAfterViewInit(): void {
    this.afterViewInit();
  }
  
}
