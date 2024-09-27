import { Injectable } from '@angular/core';
import { DEFAULT_PENS, Pen } from '../global/interfaces/penStyle';
import { BLACK, BLUE, Color, GREEN, GREY, RED, WHITE, YELLOW } from 'src/app/global/interfaces/color';
import AbstractSettingsService from 'src/app/global/classes/abstract/abstractSettingsService';

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

@Injectable({
  providedIn: 'root'
})
export class WhiteboardSettingsService extends AbstractSettingsService {

  constructor() {
    super();
  }

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
}
