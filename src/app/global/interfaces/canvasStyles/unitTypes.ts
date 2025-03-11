export type PercentageUnit = '%';
export const PERCENTAGE_UNITS: PercentageUnit[] = ['%']
export type AbsoluteLengthUnit = 'px' | 'cm' | 'mm' | 'Q' | 'in' | 'pt' | 'pc';
export const ABSOLUTE_LENGTH_UNITS: AbsoluteLengthUnit[] = ['px', 'cm', 'mm', 'Q', 'in', 'pt', 'pc']
export type RelativeLengthUnit = 'cap' | 'ch' | 'em' | 'ex' | 'ic' | 'lh' | 'rcap' | 'rch' | 'rem' | 'rex' | 'ric' | 'rlh' | 'vh' | 'vw' | 'vmax' | 'vmin' | 'vb' | 'vi' | 'cqw' | 'cqh' | 'cqi' | 'cqb' | 'cqmin' | 'cqmax';
export const RELATIVE_LENGTH_UNITS: RelativeLengthUnit[] = ['cap', 'ch', 'em', 'ex', 'ic', 'lh', 'rcap', 'rch', 'rem', 'rex', 'ric', 'rlh', 'vh', 'vw', 'vmax', 'vmin', 'vb', 'vi', 'cqw', 'cqh', 'cqi', 'cqb', 'cqmin', 'cqmax']
export type LengthUnit = AbsoluteLengthUnit | RelativeLengthUnit;
export const LENGTH_UNITS: LengthUnit[] = [...ABSOLUTE_LENGTH_UNITS, ...RELATIVE_LENGTH_UNITS]
export type AngleUnit = 'deg' | 'rad' | 'grad' | 'turn';
export const ANGLE_UNITS: AngleUnit[] = ['deg', 'rad', 'grad', 'turn']
export type Unit = PercentageUnit | LengthUnit | AngleUnit;
export const ABSOLUTE_UNITS: Unit[] = [...ABSOLUTE_LENGTH_UNITS];
export const RELATIVE_UNITS: Unit[] = [...PERCENTAGE_UNITS, ...RELATIVE_LENGTH_UNITS, ...ANGLE_UNITS];

export type Measurement = [number, Unit];
export const MEASUREMENT_UNITS: Unit[] = [...PERCENTAGE_UNITS, ...LENGTH_UNITS, ...ANGLE_UNITS];
export type PercentageMeasurement = [number, PercentageUnit];
export const PERCENTAGE_MEASUREMENT_UNITS: PercentageUnit[] = PERCENTAGE_UNITS;
export type LengthMeasurement = [number, LengthUnit];
export const LENGTH_MEASUREMENT_UNITS: LengthUnit[] = LENGTH_UNITS;
export type AngleMeasurement = [number, AngleUnit];
export const ANGLE_MEASUREMENT_UNITS: AngleUnit[] = ANGLE_UNITS;
export function measurementToString(measurement: Measurement, resolutionFactor: number, zoom: number, uniformSizeOnZoom?: boolean): string {
  if (!uniformSizeOnZoom && ABSOLUTE_UNITS.indexOf(measurement[1]) !== -1) {
    // resize, if wanted and in absolute unit
    return `${measurement[0] * resolutionFactor * zoom}${measurement[1]}`;
  }
  else {
    return `${measurement[0] * resolutionFactor}${measurement[1]}`;
  }
}

export function getCopyOfMeasurement<T extends Measurement>(measurement: T): T {
  return [...measurement];
}