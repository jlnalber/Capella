import {ChangeDetectorRef, Component} from '@angular/core';
import { Color, getColorAsRgbaFunction } from 'src/app/global/interfaces/color';

// With the provider interface, you can easily transfer dynamic data.
export interface Provider<T> {
  getter: () => T,
  setter: (t: T) => void
}

// This component is a simple color picker.

@Component({
  selector: 'app-color-style',
  templateUrl: './color-style.component.html',
  styleUrls: ['./color-style.component.css']
})
export class ColorStyleComponent {

  r: number = 0;
  g: number = 0;
  b: number = 0;
  a: number = 0;

  constructor(private readonly ref: ChangeDetectorRef) { }

  // On data, the ColorStyleComponent can trigger a function to set a new color (and get the color).
  private _data: Provider<Color> | undefined;
  public get data(): Provider<Color> | undefined {
    return this._data;
  }
  public set data(value: Provider<Color> | undefined) {
    this._data = value;
    let color = this.data?.getter();
    if (color) {
      this.r = color.r;
      this.g = color.g;
      this.b = color.b;
      this.a = Math.floor((color.a ?? 1) * 255)
    }
    this.ref.detectChanges();
  }

  public get colorStr(): string {
    if (this.data) {
      return getColorAsRgbaFunction(this.data.getter());
    }
    return '';
  }

  input() {
    // Set the color.
    let r = this.r < 0 ? 0 : this.r > 255 ? 255 : this.r;
    let g = this.g < 0 ? 0 : this.g > 255 ? 255 : this.g;
    let b = this.b < 0 ? 0 : this.b > 255 ? 255 : this.b;
    let a = (this.a < 0 ? 0 : this.a > 255 ? 255 : this.a) / 255;

    this.data?.setter({
      r: r,
      g: g,
      b: b,
      a: a === 1 ? undefined : a
    })
  }
}
