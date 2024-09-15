import AbstractTextMode from './abstractTextMode';
import TextBox from '../textBox';
import { WhiteboardService } from 'src/app/whiteboard/services/whiteboard.service';

export class TextMode extends AbstractTextMode {

  protected override getTextBox(whiteBoardService: WhiteboardService): TextBox {
      return whiteBoardService.activePage.text;
  }

}
