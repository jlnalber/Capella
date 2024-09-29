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
const PENS_ORDER_LOCALSTORAGE = 'PENS_ORDER_LOCSTOR';
const PENS_ORDER_DEFAULT: number[] = [0, 1, 2, 3]

const CANVAS_CONFIG_LOCALSTORAGE = 'CANVAS_CONFIG_LOCSTOR';
const CANVAS_CONFIG_DEFAULT: CanvasConfig = {};

export interface GlobalConfig {
  neverUseSizesForPen?: boolean
}

const GLOBAL_CONFIG_LOCALSTORAGE = 'GLOBAL_CONFIG_LOCSTOR';
const GLOBAL_CONFIG_DEFAULT: GlobalConfig = {};

export class WhiteboardSettings {

  // pens
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

  private pensOrder: number[] | undefined;

  public getPensOrder(): number[] {
    if (this.pensOrder === undefined) {
      const p = localStorage.getItem(PENS_ORDER_LOCALSTORAGE);
      if (p !== null) {
        this.pensOrder = JSON.parse(p) as number[];
      }
    }
    return this.pensOrder ?? PENS_ORDER_DEFAULT;
  }

  public setPensOrder(order: number[]): void {
    this.pensOrder = order;
    localStorage.setItem(PENS_ORDER_LOCALSTORAGE, JSON.stringify(this.pensOrder));
  }

  public getPensInOrder(): Pen[] {
    const pens = this.getPens();
    return this.getPensOrder().filter(i => i < pens.length).map(i => pens[i]);
  }

  // colors
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

  // canvas config
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

  // global config
  private globalConfig: GlobalConfig | undefined;

  public getGlobalConfig(): GlobalConfig {
    if (this.globalConfig === undefined) {
      const p = localStorage.getItem(GLOBAL_CONFIG_LOCALSTORAGE);
      if (p !== null) {
        this.globalConfig = JSON.parse(p) as GlobalConfig;
      }
    }
    return this.globalConfig ?? GLOBAL_CONFIG_DEFAULT;
  }

  public setGlobalConfig(config: GlobalConfig): void {
    this.globalConfig = config;
    localStorage.setItem(GLOBAL_CONFIG_LOCALSTORAGE, JSON.stringify(this.globalConfig));
  }
}
