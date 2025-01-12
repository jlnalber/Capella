export type Icon = 'fueller' | 'ballpoint' | 'pencil' | 'marker' | 'eraser';

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
    fileName: Icon
}