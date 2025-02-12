export type PenIcon = 'fueller' | 'ballpoint' | 'pencil' | 'marker' | 'eraser';

export const PEN_ICONS_LIST: IconObj[] = [ {
    name: 'Kugelschreiber',
    fileName: 'ballpoint' 
}, {
    name: 'Radiergummi',
    fileName: 'eraser'
 }, { 
    name: 'Füller',
    fileName: 'fueller' 
}, {
    name: 'Textmarker',
    fileName: 'marker'
}, {
    name: 'Bleistift',
    fileName: 'pencil'
} ];

export interface IconObj {
    name: string,
    fileName: PenIcon
}

export type Icon = PenIcon | GeometryIcon | UIIcon;
export type UIIcon = 'arrowBottomRight' | 'checkmark' | 'checkmarkCrossed' | 'copy' | 'doubleCheckmark' | 'doubleCheckmarkCrossed' | 'edit' | 'export' | 'geometry' | 'left' | 'moveWhiteboard' | 'openFile' | 'pen' | 'plus' | 'questionMark' | 'right' | 'saveFiles' | 'settings' | 'sigma' | 'text' | 'threeDots' | 'trash' | 'trashMultiple'
export type GeometryIcon = 'angle' | 'angleBisector' | 'bisection' | 'changeVisibility' | 'circle' | 'intersection' | 'line' | 'lineSegment' | 'middlePoint' | 'move' | 'moveLabels' | 'movePoints' | 'orthogonal' | 'parallel' | 'points' | 'polygon' | 'showLabelVisibility' | 'tangens'