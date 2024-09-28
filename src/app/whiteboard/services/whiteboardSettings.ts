import { CanvasConfig } from 'src/app/global/classes/renderingContext/abstractRenderingContext';
import { DEFAULT_PENS, Pen } from '../global/interfaces/penStyle';
import { BLACK, BLUE, Color, GREEN, GREY, RED, WHITE, YELLOW } from 'src/app/global/interfaces/color';

const ADD_COLORS_LOCALSTORAGE = 'ADD_COLORS_LOCSTOR';
const ADD_COLORS_DEFAULT: Color[] = [];
const COLORS_DEFAULT: Color[] = [
  BLACK,
  RED,
  BLUE,
  GREEN,
  GREY,
  WHITE,
  YELLOW
];

const ADD_PENS_LOCALSTORAGE = 'ADD_PENS_LOCSTOR';
const ADD_PENS_DEFAULT: Pen[] = [];

const CANVAS_CONFIG_LOCALSTORAGE = 'CANVAS_CONFIG_LOCSTOR';
const CANVAS_CONFIG_DEFAULT: CanvasConfig = {};

export class WhiteboardSettings {

  private addPens: Pen[] | undefined;

  public getAdditionalPens(): Pen[] {
    if (this.addPens === undefined) {
      const p = localStorage.getItem(ADD_PENS_LOCALSTORAGE);
      if (p !== null) {
        this.addPens = JSON.parse(p) as Pen[];
      }
    }
    return this.addPens ?? ADD_PENS_DEFAULT;
  }

  public setAdditionalPens(pens: Pen[]): void {
    this.addPens = pens;
    localStorage.setItem(ADD_PENS_LOCALSTORAGE, JSON.stringify(this.addPens));
  }

  public getPens(): Pen[] {
    return [ ...DEFAULT_PENS, ...this.getAdditionalPens() ]
  }

  private addColors: Color[] | undefined;

  public getAdditionalColors(): Color[] {
    if (this.addColors === undefined) {
      const p = localStorage.getItem(ADD_COLORS_LOCALSTORAGE);
      if (p !== null) {
        this.addColors = JSON.parse(p) as Color[];
      }
    }
    return this.addColors ?? ADD_COLORS_DEFAULT;
  }

  public setAdditionalColors(colors: Color[]): void {
    this.addColors = colors;
    localStorage.setItem(ADD_COLORS_LOCALSTORAGE, JSON.stringify(this.addColors));
  }

  public getColors(): Color[] {
    return [ ...COLORS_DEFAULT, ...this.getAdditionalColors() ]
  }

  private canvasConfig: CanvasConfig | undefined;

  public getCanvasConfig(): CanvasConfig {
    if (this.canvasConfig === undefined) {
      const p = localStorage.getItem(CANVAS_CONFIG_LOCALSTORAGE);
      if (p !== null) {
        this.canvasConfig = JSON.parse(p) as CanvasConfig;
      }
    }
    return this.canvasConfig ?? CANVAS_CONFIG_DEFAULT;
  }

  public setCanvasConfig(config: CanvasConfig): void {
    this.canvasConfig = config;
    localStorage.setItem(CANVAS_CONFIG_LOCALSTORAGE, JSON.stringify(this.canvasConfig));
  }
}
