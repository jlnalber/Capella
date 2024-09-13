import { WhiteboardService } from 'src/app/services/whiteboard.service';
import AbstractTextMode from './abstractTextMode';
import TextBox from '../textBox';

export class TextMode extends AbstractTextMode {

  protected override getTextBox(whiteBoardService: WhiteboardService): TextBox {
      return whiteBoardService.activePage.text;
  }

}
