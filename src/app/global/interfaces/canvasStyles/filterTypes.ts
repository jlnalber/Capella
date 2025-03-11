import { AngleMeasurement, getCopyOfMeasurement, LengthMeasurement, measurementToString, PercentageMeasurement } from "./unitTypes";

export type StringFilterName = 'url'
export const STRING_FILTERS: FilterName[] = ['url']
export type StringFilter = [StringFilterName, string];
export function isStringFilter(f: Filter): f is StringFilter {
    return STRING_FILTERS.indexOf(f[0]) !== -1;
}
export function isStringFilterName(str: FilterName): str is StringFilterName {
    return STRING_FILTERS.indexOf(str) !== -1;
}

export type LengthMeasurementFilterName = 'blur';
export const LENGTH_MEASUREMENT_FILTERS: FilterName[] = ['blur']
export type LengthMeasurementFilter = [LengthMeasurementFilterName, LengthMeasurement];
export function isLengthMeasurementFilter(f: Filter): f is LengthMeasurementFilter {
    return LENGTH_MEASUREMENT_FILTERS.indexOf(f[0]) !== -1;
}
export function isLengthMeasurementFilterName(str: FilterName): str is LengthMeasurementFilterName {
    return LENGTH_MEASUREMENT_FILTERS.indexOf(str) !== -1;
}

export type AngleMeasurementFilterName = 'hue-rotate';
export const ANGLE_MEASUREMENT_FILTERS: FilterName[] = ['hue-rotate']
export type AngleMeasurementFilter = [AngleMeasurementFilterName, AngleMeasurement];
export function isAngleMeasurementFilter(f: Filter): f is AngleMeasurementFilter {
    return ANGLE_MEASUREMENT_FILTERS.indexOf(f[0]) !== -1;
}
export function isAngleMeasurementFilterName(str: FilterName): str is AngleMeasurementFilterName {
    return ANGLE_MEASUREMENT_FILTERS.indexOf(str) !== -1;
}

export type PercentageMeasurementFilterName = 'brightness' | 'contrast' | 'grayscale' | 'invert' | 'saturate' | 'sepia';
export const PERCENTAGE_MEASUREMENT_FILTERS: FilterName[] = ['brightness', 'contrast', 'grayscale', 'invert', 'saturate', 'sepia'];
export type PercentageMeasurementFilter = [PercentageMeasurementFilterName, PercentageMeasurement];
export function isPercentageMeasurementFilter(f: Filter): f is PercentageMeasurementFilter {
    return PERCENTAGE_MEASUREMENT_FILTERS.indexOf(f[0]) !== -1;
}
export function isPercentageMeasurementFilterName(str: FilterName): str is PercentageMeasurementFilterName {
    return PERCENTAGE_MEASUREMENT_FILTERS.indexOf(str) !== -1;
}

export type MeasurementFilterName = LengthMeasurementFilterName | AngleMeasurementFilterName | PercentageMeasurementFilterName;
export const MEASUREMENT_FILTERS: FilterName[] = [...ANGLE_MEASUREMENT_FILTERS, ...PERCENTAGE_MEASUREMENT_FILTERS, ...LENGTH_MEASUREMENT_FILTERS];
export type MeasurementFilter = LengthMeasurementFilter | AngleMeasurementFilter | PercentageMeasurementFilter;
export function isMeasurementFilter(f: Filter): f is PercentageMeasurementFilter {
    return MEASUREMENT_FILTERS.indexOf(f[0]) !== -1;
}
export function isMeasurementFilterName(str: FilterName): str is MeasurementFilterName {
    return MEASUREMENT_FILTERS.indexOf(str) !== -1;
}

export type FilterName = StringFilterName | MeasurementFilterName;
export type Filter = StringFilter
                   | MeasurementFilter;
export const ALL_FILTERS: FilterName[] = [...STRING_FILTERS, ...MEASUREMENT_FILTERS];
export const DEFAULT_FILTERS: Filter[] = [];
export function getDefaultFilter(): Filter {
    return ['blur', [0, 'px']]
}
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