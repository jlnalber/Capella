import { Mode } from "src/app/global/classes/modes/mode";
import { Color } from "src/app/global/interfaces/color";
import { DrawerService } from "src/app/prokyon/services/drawer.service";

export abstract class ProkyonMode extends Mode<DrawerService> {
  public transformInvisibleColor: undefined | ((c: Color) => Color);
}
