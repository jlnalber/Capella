export type PercentageUnits = '%';
export const PERCENTAGE_UNITS: PercentageUnits[] = ['%']
export type AbsoluteLengthUnits = 'px' | 'cm' | 'mm' | 'Q' | 'in' | 'pt' | 'pc';
export const ABSOLUTE_LENGTH_UNITS: AbsoluteLengthUnits[] = ['px', 'cm', 'mm', 'Q', 'in', 'pt', 'pc']
export type RelativeLengthUnits = 'cap' | 'ch' | 'em' | 'ex' | 'ic' | 'lh' | 'rcap' | 'rch' | 'rem' | 'rex' | 'ric' | 'rlh' | 'vh' | 'vw' | 'vmax' | 'vmin' | 'vb' | 'vi' | 'cqw' | 'cqh' | 'cqi' | 'cqb' | 'cqmin' | 'cqmax';
export const RELATIVE_LENGTH_UNITS: RelativeLengthUnits[] = ['cap', 'ch', 'em', 'ex', 'ic', 'lh', 'rcap', 'rch', 'rem', 'rex', 'ric', 'rlh', 'vh', 'vw', 'vmax', 'vmin', 'vb', 'vi', 'cqw', 'cqh', 'cqi', 'cqb', 'cqmin', 'cqmax']
export type LengthUnits = AbsoluteLengthUnits | RelativeLengthUnits;
export type AngleUnits = 'deg' | 'rad' | 'grad' | 'turn';
export const ANGLE_UNITS: AngleUnits[] = ['deg', 'rad', 'grad', 'turn']
export type Unit = PercentageUnits | LengthUnits | AngleUnits;
export const ABSOLUTE_UNITS: Unit[] = [...ABSOLUTE_LENGTH_UNITS];
export const RELATIVE_UNITS: Unit[] = [...PERCENTAGE_UNITS, ...RELATIVE_LENGTH_UNITS, ...ANGLE_UNITS];

export type Measurement = [number, Unit];
export type PercentageMeasurement = [number, PercentageUnits];
export type LengthMeasurement = [number, LengthUnits];
export type AngleMeasurement = [number, AngleUnits];
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