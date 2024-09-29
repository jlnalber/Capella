import { AngleMeasurement, getCopyOfMeasurement, LengthMeasurement, measurementToString, PercentageMeasurement } from "./unitTypes";

type StringFilterNames = 'url'
export const STRING_FILTERS: FilterNames[] = ['url']
type StringFilter = [StringFilterNames, string];
export function isStringFilter(f: Filter): f is StringFilter {
    return STRING_FILTERS.indexOf(f[0]) !== -1;
}

type LengthMeasurementFilterNames = 'blur';
export const LENGTH_MEASUREMENT_FILTERS: FilterNames[] = ['blur']
type LengthMeasurementFilter = [LengthMeasurementFilterNames, LengthMeasurement];
export function isLengthMeasurementFilter(f: Filter): f is LengthMeasurementFilter {
    return LENGTH_MEASUREMENT_FILTERS.indexOf(f[0]) !== -1;
}

type AngleMeasurementFilterNames = 'hue-rotate';
export const ANGLE_MEASUREMENT_FILTERS: FilterNames[] = ['hue-rotate']
type AngleMeasurementFilter = [AngleMeasurementFilterNames, AngleMeasurement];
export function isAngleMeasurementFilter(f: Filter): f is AngleMeasurementFilter {
    return ANGLE_MEASUREMENT_FILTERS.indexOf(f[0]) !== -1;
}

type PercentageMeasurementFilterNames = 'brightness' | 'contrast' | 'grayscale' | 'invert' | 'saturate' | 'sepia';
export const PERCENTAGE_MEASUREMENT_FILTERS: FilterNames[] = ['brightness', 'contrast', 'grayscale', 'invert', 'saturate', 'sepia'];
type PercentageMeasurementFilter = [PercentageMeasurementFilterNames, PercentageMeasurement];
export function isPercentageMeasurementFilter(f: Filter): f is PercentageMeasurementFilter {
    return PERCENTAGE_MEASUREMENT_FILTERS.indexOf(f[0]) !== -1;
}

type MeasurementFilterNames = LengthMeasurementFilterNames | AngleMeasurementFilterNames | PercentageMeasurementFilterNames;
export const MEASUREMENT_FILTERS: FilterNames[] = [...ANGLE_MEASUREMENT_FILTERS, ...PERCENTAGE_MEASUREMENT_FILTERS, ...LENGTH_MEASUREMENT_FILTERS];
type MeasurementFilter = LengthMeasurementFilter | AngleMeasurementFilter | PercentageMeasurementFilter;
export function isMeasurementFilter(f: Filter): f is PercentageMeasurementFilter {
    return MEASUREMENT_FILTERS.indexOf(f[0]) !== -1;
}

type FilterNames = StringFilterNames | MeasurementFilterNames;
export type Filter = StringFilter
                   | MeasurementFilter;
export const DEFAULT_FILTERS: Filter[] = [];
export function filterToCssFunctionString(filter: Filter, resolutionFactor: number, zoom: number, uniformSizeOnZoom?: boolean): string {
    const strToStr = (f: StringFilter): string => {
        return `${f[0]}("${f[1]}")`
    }
    const measurementToStr = (f: MeasurementFilter): string => {
        return `${f[0]}(${measurementToString(f[1], resolutionFactor, zoom, uniformSizeOnZoom)})`;
    }

    if (isStringFilter(filter)) {
        return strToStr(filter);
    }
    else if (isMeasurementFilter(filter)) {
        return measurementToStr(filter);
    }

    return '';
}

export function getCopyOfFilter(filter: Filter): Filter {
    if (isStringFilter(filter)) {
        return [...filter];
    }
    else {
        return [filter[0], getCopyOfMeasurement(filter[1])] as MeasurementFilter;
    }
}