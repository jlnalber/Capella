import { areEqualImageStyleImageSmoothingEnabled, areEqualImageStyleImageSmoothingQuality, isDefaultImageStyleImageSmoothingEnabled, isDefaultImageStyleImageSmoothingQuality } from "./styleTypes";

export default interface ImageStyle {
    imageSmoothingEnabled?: boolean,
    imageSmoothingQuality?: ImageSmoothingQuality
}

export const EMPTY_IMAGESTYLE: ImageStyle = {}
export function getEmptyImageStyleForCopy(): ImageStyle {
    return {};
}

export function copyImageStyle(i: ImageStyle): ImageStyle {
    return {
        ...i
    }
}

export function areEqualImageStyles(f1: ImageStyle | undefined, f2: ImageStyle | undefined): boolean {
    return (isDefaultImageStyle(f1) && isDefaultImageStyle(f2)) || (areEqualImageStyleImageSmoothingEnabled(f1?.imageSmoothingEnabled, f2?.imageSmoothingEnabled) && areEqualImageStyleImageSmoothingQuality(f1?.imageSmoothingQuality, f2?.imageSmoothingQuality));
}

export function isDefaultImageStyle(o: ImageStyle | undefined): boolean {
    return o === undefined || (isDefaultImageStyleImageSmoothingEnabled(o.imageSmoothingEnabled) && isDefaultImageStyleImageSmoothingQuality(o.imageSmoothingQuality));
}