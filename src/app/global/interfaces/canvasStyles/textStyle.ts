import { DEFAULT_FONTSIZE,
    FontKerning,
    FontSize,
    FontStretch,
    FontStyle,
    FontVariantCaps,
    FontWeight,
    LetterSpacing,
    TextAlign,
    TextBaseline,
    TextDirection,
    WordSpacing } from "./styleTypes";
import { TRANSPARENT } from "../color";
import { ColorStyle } from "./colorStyle";

export default interface TextStyle {
    color: ColorStyle,
    uniformSizeOnZoom?: boolean,
    fontFamily: string[],
    fontSize: FontSize,
    fontWeight?: FontWeight,
    fontStyle?: FontStyle,
    fontKerning?: FontKerning,
    fontStretch?: FontStretch,
    fontVariantCaps?: FontVariantCaps,
    letterSpacing?: LetterSpacing,
    direction?: TextDirection,
    textAlign?: TextAlign,
    textBaseline?: TextBaseline,
    wordSpacing?: WordSpacing
}

export const EMPTY_TEXTSTYLE: TextStyle = {
    color: TRANSPARENT,
    fontFamily: [],
    fontSize: DEFAULT_FONTSIZE
}