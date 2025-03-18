import { CanvasConfig } from 'src/app/global/classes/renderingContext/abstractRenderingContext';
import { DEFAULT_PENS, Pen } from '../global/interfaces/penStyle';
import { BLACK, BLUE, Color, GREEN, GREY, RED, WHITE, YELLOW } from 'src/app/global/interfaces/color';
import { ObjectStyleWrapper } from 'src/app/global/interfaces/canvasStyles/objectStyle';

const OBJECT_STYLES_LOCALSTORAGE = 'OBJECT_STYLES_LOCSTOR';
const OBJECT_STYLES_DEFAULT: ObjectStyleWrapper[] = [];

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

const STEPS_THICKNESS_RENDERING_LOCALSTORAGE = 'STEPS_THICKNESS_RENDERING_LOCSTOR';
const STEPS_THICKNESS_RENDERING_DEFAULT = 3;

export const DEFAULT_RESOLUTIONFACTOR = 1;

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

  public getDefaultPens(): Pen[] {
    return [ ...DEFAULT_PENS ];
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

  // object styles
  private objectStyles: ObjectStyleWrapper[] | undefined;

  public getObjectStyles(): ObjectStyleWrapper[] {
    if (this.objectStyles === undefined) {
      const p = localStorage.getItem(OBJECT_STYLES_LOCALSTORAGE);
      if (p !== null) {
        this.objectStyles = JSON.parse(p) as ObjectStyleWrapper[];
      }
    }
    return this.objectStyles ?? OBJECT_STYLES_DEFAULT;
  }

  public setObjectStyles(objectStyles: ObjectStyleWrapper[]): void {
    this.objectStyles = objectStyles;
    localStorage.setItem(OBJECT_STYLES_LOCALSTORAGE, JSON.stringify(this.objectStyles));
  }

  // colors
  private colors: Color[] | undefined;

  public getAdditionalColors(): Color[] {
    if (this.colors === undefined) {
      const p = localStorage.getItem(ADD_COLORS_LOCALSTORAGE);
      if (p !== null) {
        this.colors = JSON.parse(p) as Color[];
      }
    }
    return this.colors ?? ADD_COLORS_DEFAULT;
  }

  public setAdditionalColors(colors: Color[]): void {
    this.colors = colors;
    localStorage.setItem(ADD_COLORS_LOCALSTORAGE, JSON.stringify(this.colors));
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

  // thickness rendering
  private stepsThicknessRendering: number | undefined;

  public getStepsThicknessRendering(): number {
    if (this.stepsThicknessRendering === undefined) {
      const p = localStorage.getItem(STEPS_THICKNESS_RENDERING_LOCALSTORAGE);
      if (p !== null) {
        this.stepsThicknessRendering = JSON.parse(p) as number;
      }
    }
    return this.stepsThicknessRendering ?? STEPS_THICKNESS_RENDERING_DEFAULT;
  }

  public setStepsThicknessRendering(thickness: number): void {
    this.stepsThicknessRendering = thickness;
    localStorage.setItem(STEPS_THICKNESS_RENDERING_LOCALSTORAGE, JSON.stringify(this.stepsThicknessRendering));
  }
}
