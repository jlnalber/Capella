import { Mode } from "src/app/global/classes/modes/mode";
import { Color } from "src/app/global/interfaces/color";
import { DrawerService } from "src/app/prokyon/services/drawer.service";
import { ProkyonSettingsService } from "src/app/prokyon/services/prokyon-settings.service";

export abstract class ProkyonMode extends Mode<DrawerService, ProkyonSettingsService> {
  public transformInvisibleColor: undefined | ((c: Color) => Color);
}
