import { Component, OnDestroy } from '@angular/core';
import { WhiteboardService } from '../../whiteboard/services/whiteboard.service';
import { Pen } from '../../whiteboard/global/interfaces/penStyle';
import { FormsModule } from '@angular/forms';
import AbstractSettingsComponent from '../abstractSettingComponent';
import PenPicker from 'src/app/global/style-components/pickers/penPicker';
import { ChoosePenComponent } from "../../global/style-components/choose-pen/choose-pen.component";

type NumAndPicker = { num: number, picker?: PenPicker };

@Component({
  selector: 'app-edit-pen-quick-actions',
  standalone: true,
  imports: [
    FormsModule,
    ChoosePenComponent
],
  templateUrl: './edit-pen-quick-actions.component.html',
  styleUrl: './edit-pen-quick-actions.component.scss'
})
export class EditPenQuickActionsComponent extends AbstractSettingsComponent implements OnDestroy {

  add() {
    this.order.push(this.getNumAndPicker(0));
  }

  removePen(i: number) {
    this.order.splice(i, 1);
  }

  public save() {
    this.whiteboardService.settings.setPensOrder(this.order.map(i => i.num));
  }

  public pens: Pen[];
  public order: { num: number, picker?: PenPicker }[];

  constructor(public readonly whiteboardService: WhiteboardService) {
    super();
    this.pens = this.whiteboardService.settings.getPens();
    this.order = this.whiteboardService.settings.getPensOrder().filter(i => i < this.pens.length).map(i => this.getNumAndPicker(i));
  }

  ngOnDestroy(): void {
      this.closed = true;
  }

  private getNumAndPicker(i: number): NumAndPicker {
    const val: NumAndPicker = {
      num: i
    }
    val.picker = new PenPicker(() => val.num, (v) => val.num = v ?? val.num, this.pens, true);
    return val;
  }
  
}
