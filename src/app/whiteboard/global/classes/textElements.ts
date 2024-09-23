import { Color } from "src/app/global/interfaces/color"

export type Paragraph = {
    lines: Line[],
    format: Format
}

export type Line = Span[];

export type Span = {
    text: string,
    attributes: Attribute[],
    color: Color,
    font: string[],
    fontSize: number
}

export type Attribute = 'bold' | 'italic' | 'underline'

export type Format = 'left' | 'middle' | 'right' | 'block'