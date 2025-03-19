import { areEqualImageStyleImageSmoothingEnabled, areEqualImageStyleImageSmoothingQuality, isDefaultImageStyleImageSmoothingEnabled, isDefaultImageStyleImageSmoothingQuality } from "./styleTypes";

export default interface ImageStyle {
    imageSmoothingEnabled?: boolean,
    imageSmoothingQuality?: ImageSmoothingQuality
}

export const ALL_IMAGESMOOTHINGQUALITY: ImageSmoothingQuality[] = [ 'low', 'medium', 'high' ]

export interface ImageStyleWrapper {
    style: ImageStyle,
    name: string
}

export const EMPTY_IMAGESTYLE: ImageStyle = {}

export const EMPTY_IMAGESTYLEWRAPPER: ImageStyleWrapper = {
    style: EMPTY_IMAGESTYLE,
    name: 'Leerer Bildstil'
};

export function getEmptyImageStyleForCopy(): ImageStyle {
    return {};
}

export function getEmptyImageStyleWrapperForCopy(): ImageStyleWrapper {
    return getCopyOfImageStyleWrapper(EMPTY_IMAGESTYLEWRAPPER);
}

export function getCopyOfImageStyle(i: ImageStyle): ImageStyle {
    return {
        ...i
    }
}

export function getCopyOfImageStyleWrapper(objectStyle: ImageStyleWrapper): ImageStyleWrapper {
    return {
        style: getCopyOfImageStyle(objectStyle.style),
        name: objectStyle.name
    }
}

export function areEqualImageStyles(f1: ImageStyle | undefined, f2: ImageStyle | undefined): boolean {
    return (isDefaultImageStyle(f1) && isDefaultImageStyle(f2)) || (areEqualImageStyleImageSmoothingEnabled(f1?.imageSmoothingEnabled, f2?.imageSmoothingEnabled) && areEqualImageStyleImageSmoothingQuality(f1?.imageSmoothingQuality, f2?.imageSmoothingQuality));
}

export function isDefaultImageStyle(o: ImageStyle | undefined): boolean {
    return o === undefined || (isDefaultImageStyleImageSmoothingEnabled(o.imageSmoothingEnabled) && isDefaultImageStyleImageSmoothingQuality(o.imageSmoothingQuality));
}