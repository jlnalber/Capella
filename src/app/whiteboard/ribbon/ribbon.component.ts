import { AfterContentChecked, AfterViewInit, Component, Input } from '@angular/core';
import { Ribbon, RibbonTab } from './ribbon';
import { Color, getColorAsRgbFunction } from 'src/app/global/interfaces/color';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ribbon',
  templateUrl: './ribbon.component.html',
  styleUrls: ['./ribbon.component.scss']
})
export class RibbonComponent implements AfterViewInit {
  @Input({required: true}) ribbon!: Ribbon;
  @Input() set startTab(value: number | undefined) {
    if (value !== undefined) {
      this.activeRibbon = value;
    }
  }
  public activeRibbon: number | undefined = 0;

  // public getRibbonTab(index: number): RibbonTab {
  //   const extraRibbonTabs = this.getExtraRibbonTabs();
  //   if (index < this.ribbon.ribbonTabs.length) {
  //     return this.ribbon.ribbonTabs[index];
  //   }
  //   else {
  //     return extraRibbonTabs[index - this.ribbon.ribbonTabs.length];
  //   }
  // }

  // public getExtraRibbonTabs(): RibbonTab[] {
  //   return this.extraRibbonTabs === undefined ? [] : this.extraRibbonTabs.map(f => f() as RibbonTab[] ?? []).reduce((r1: RibbonTab[], r2: RibbonTab[]) => [...r1, ...r2]);
  // }

  // public getAllRibbonTabs(): RibbonTab[] {
  //   return [...this.ribbon.ribbonTabs, ...this.getExtraRibbonTabs()]
  // }

  public colorToString(c: Color): string {
    return getColorAsRgbFunction(c);
  }


  constructor( private cdref: ChangeDetectorRef ) {}   

  ngAfterViewInit() {
    this.cdref.detectChanges();
  }

}

export { Ribbon };
