import { Circle } from "../circle";
import { Color, TRANSPARENT } from "../color"
import { Point } from "../point";

export type Pattern = {
    picture: string
}

export type Gradient = LinearGradient | RadialGradient | ConicGradient;
export type LinearGradient = {
    startPoint: Point,
    endPoint: Point,
    stops: GradientColorStop[]
};
export type RadialGradient = {
    startCircle: Circle,
    endCircle: Circle,
    stops: GradientColorStop[]
};
export type ConicGradient = {
    center: Point,
    startAngle: number,
    stops: GradientColorStop[]
};
export type GradientColorStop = [number, Color];

export type ColorStyle = Color | Pattern | Gradient;

export type Filter = {
    type: string,
    measurement: Measurement
}
export const DEFAULT_FILTERS: Filter[] = [];

export type Shadow = {
    color: Color,
    blur: number,
    offsetX: number,
    offsetY: number
}
export const DEFAULT_SHADOW = {
    blur: 0,
    offsetX: 0,
    offsetY: 0,
    color: TRANSPARENT
}

export type Unit = 'cm' | 'mm' | 'in' | 'px' | 'pt' | 'pc' | 'em' | 'ex' | 'ch' | 'rem' | 'vw' | 'vh' | 'vmin' | 'vmax' | '%';
export const ABSOLUTE_UNITS: Unit[] = ['cm', 'mm', 'in', 'px', 'pc', 'pt'];
export const RELATIVE_UNITS: Unit[] = ['em', 'ex', 'ch', 'rem', 'vw', 'vh', 'vmin', 'vmax', '%'];

export type Measurement = [number, Unit];

export type LineCap = CanvasLineCap;
export const DEFAULT_LINECAP: LineCap = 'butt'
export const DEFAULT_LINEDASH: number[] = [];
export const REGULAR_LINEDASH: number[] = [10, 10];
export const DEFAULT_LINEDASHOFFSET: number = 0.0;

export type LineJoin = CanvasLineJoin;
export const DEFAULT_LINEJOIN: LineJoin = 'miter';

export type FontSize = Measurement;
export const DEFAULT_FONTSIZE: FontSize = [0, 'pt']

export type FontWeight = 'normal' | 'bold' | number;
export const DEFAULT_FONTWEIGHT: FontWeight = 'normal'

export type FontStyle = 'normal' | 'italic';
export const DEFAULT_FONTSTYLE: FontStyle = 'normal';

export type FontKerning = CanvasFontKerning;
export const DEFAULT_FONTKERNING: FontKerning = 'auto'

export type FontStretch = CanvasFontStretch;
export const DEFAULT_FONTSTRETCH: FontStretch = 'normal';

export type FontVariantCaps = CanvasFontVariantCaps;
export const DEFAULT_FONTVARIANTCAPS: FontVariantCaps = 'normal';

export type LetterSpacing = Measurement;
export const DEFAULT_LETTERSPACING: LetterSpacing = [0, 'px'];

export type TextDirection = CanvasDirection;
export const DEFAULT_TEXTDIRECTION: TextDirection = 'inherit';

export type TextAlign = CanvasTextAlign;
export const DEFAULT_TEXTALIGN: TextAlign = 'start';

export type TextBaseline = CanvasTextBaseline;
export const DEFAULT_TEXTBASELINE: TextBaseline = 'alphabetic'

export type WordSpacing = Measurement;
export const DEFAULT_WORDSPACING: WordSpacing = [0, 'px']

export const DEFAULT_IMAGESMOOTHINGENABLED: boolean = true;
export const DEFAULT_IMAGESMOOTHINGQUALITY: ImageSmoothingQuality = 'low'