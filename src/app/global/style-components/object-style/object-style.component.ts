import { ANGLE_MEASUREMENT_UNITS, AngleUnit, LENGTH_MEASUREMENT_UNITS, LengthUnit, PERCENTAGE_MEASUREMENT_UNITS, PercentageUnit } from './../../interfaces/canvasStyles/unitTypes';
import { LengthMeasurementFilter } from './../../interfaces/canvasStyles/filterTypes';
import { Component, Input } from '@angular/core';
import AbstractPickerComponent from '../abstractPickerComponent';
import ObjectStyle, { getEmptyObjectStyleForCopy } from '../../interfaces/canvasStyles/objectStyle';
import Picker from '../pickers/picker';
import { ALL_FILTERS, Filter, FilterName, getDefaultFilter, isAngleMeasurementFilter, isAngleMeasurementFilterName, isLengthMeasurementFilter, isLengthMeasurementFilterName, isPercentageMeasurementFilter, isPercentageMeasurementFilterName, isStringFilter, isStringFilterName, LengthMeasurementFilterName, MeasurementFilter, MeasurementFilterName, StringFilter } from '../../interfaces/canvasStyles/filterTypes';
import { FormsModule } from '@angular/forms';
import { Unit } from '../../interfaces/canvasStyles/unitTypes';

@Component({
  selector: 'app-object-style',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './object-style.component.html',
  styleUrl: './object-style.component.scss'
})
export class ObjectStyleComponent extends AbstractPickerComponent<Picker<ObjectStyle>, ObjectStyle> {
  @Input({required: true}) public picker?: Picker<ObjectStyle>;

  private _filter: Filter[] = [];

  public get filter(): Filter[] {
    if (this.picker && this.picker.value && this.picker.value.filter) {
      this._filter = this.picker.value.filter;
    }
    return this._filter;
  }

  public removeFilter(index: number) {
    if (index < this._filter.length) {
      this._filter.splice(index, 1);
      this.onChange();
    }
  }

  public addFilter() {
    if (this.filterEnabled) {
      this._filter.push(getDefaultFilter());
      this.onChange();
    }
  }

  public get filterEnabled(): boolean {
    return this.picker?.value?.filter !== undefined;
  }

  public set filterEnabled(value: boolean) {
    if (this.picker) {
      if (this.picker.value === undefined) {
        this.picker.value = getEmptyObjectStyleForCopy();
      }
      if (value !== this.filterEnabled) {
        if (value) {
          this.picker.value.filter = this._filter;
        }
        else {
          this.picker.value.filter = undefined;
        }
        this.onChange();
      }
    }
  }

  public getAllFilterIterators(): FilterIterator[] {
    const res: FilterIterator[] = [];
    for (let i = 0; i < this.filter.length; i++) {
      res.push(new FilterIterator((f: Filter) => {
        this.filter[i] = f;
        this.onChange();
      }, () => this.filter[i]))
    }
    return res;
  }
  
  public get filterNames(): FilterName[] {
    return ALL_FILTERS;
  }

  public isStringFilterInput(f: FilterInput<any>): f is StringFilterInput {
    return f instanceof StringFilterInput;
  }
  
}

class FilterIterator {
  constructor(private setFilter: (f: Filter) => void, private getFilter: () => Filter) { }

  public get filterName(): FilterName {
    return this.getFilter()[0];
  }

  public set filterName(value: FilterName) {
    if (value !== this.filterName) {
      if (isStringFilterName(value)) {
        this.setFilter([value, ''])
      }
      else if (isLengthMeasurementFilterName(value)) {
        this.setFilter([value, [0, 'px']]);
      }
      else if (isPercentageMeasurementFilterName(value)) {
        this.setFilter([value, [0, '%']]);
      }
      else if (isAngleMeasurementFilterName(value)) {
        this.setFilter([value, [0, 'deg']]);
      }
    }
  }

  public get filterInput(): StringFilterInput | NumberFilterInput<LengthUnit> | NumberFilterInput<AngleUnit> | NumberFilterInput<PercentageUnit> {
    const filter = this.getFilter();
    if (isStringFilter(filter)) {
      return new StringFilterInput((t: string) => {
        const f = this.getFilter();
        f[1] = t;
        this.setFilter(f);
      }, () => (this.getFilter() as StringFilter)[1]);
    }
    else {
      // is measurement filter
      const getSetInput = () => <T extends MeasurementFilter>(t: number) => {
        const f = this.getFilter() as T;
        f[1][0] = t;
        this.setFilter(f)
      }
      const getGetInput = () => <T extends MeasurementFilter>() => {
        return (this.getFilter() as T)[1][0]
      }

      const getSetUnit = () => <T extends Unit>(t: T) => {
        const f = this.getFilter() as MeasurementFilter;
        f[1][1] = t;
        this.setFilter(f)
      }
      const getGetUnit = () => <T extends MeasurementFilter, U extends Unit>() => {
        return (this.getFilter() as T)[1][1] as U;
      }

      if (isLengthMeasurementFilter(filter)) {
        return new NumberFilterInput<LengthUnit>(getSetInput(), getGetInput(), getSetUnit(), getGetUnit(), () => LENGTH_MEASUREMENT_UNITS);
      }
      else if (isAngleMeasurementFilter(filter)) {
        return new NumberFilterInput<AngleUnit>(getSetInput(), getGetInput(), getSetUnit(), getGetUnit(), () => ANGLE_MEASUREMENT_UNITS);
      }
      else {
        return new NumberFilterInput<PercentageUnit>(getSetInput(), getGetInput(), getSetUnit(), getGetUnit(), () => PERCENTAGE_MEASUREMENT_UNITS);
      }
    }
  }
}

abstract class FilterInput<T> {
  constructor(protected setInput: (t: T) => void, protected getInput: () => T) { }

  public get input(): T {
    return this.getInput();
  }

  public set input(value: T) {
    this.setInput(value);
  }
}

class StringFilterInput extends FilterInput<string> { }

class NumberFilterInput<U> extends FilterInput<number> {
  constructor(setInput: (t: number) => void, getInput: () => number, protected setUnit: (u: U) => void, protected getUnit: () => U, public getAllUnits: () => U[]) {
    super(setInput, getInput);
  }

  public get unit(): U {
    return this.getUnit();
  }

  public set unit(value: U) {
    this.setUnit(value);
  }
}