import { Point } from "../interfaces/point";
import { Rect } from "../interfaces/rect";
import AbstractRenderingContext from "./abstractRenderingContext";
import { Line, Paragraph, Span } from "./textElements";
import { BLACK, TRANSPARENT } from "../interfaces/color";
import Padding from "../interfaces/padding";
import { PX_PER_MM } from "src/app/services/page";
import { sameColors } from "../essentials/utils";
import { CanvasElement } from "./abstract/canvasElement";


export const PT_PER_MM = 2.835;

type CursorPosition = {
    paragraph: number,
    line: number,
    span: number,
    column: number
}

type TextSelection = {
    startSelection: number,
    endSelection: number
}

type Action = {
    key: string,
    action: (ev: KeyboardEvent, inp: HTMLTextAreaElement, renderingContext: AbstractRenderingContext, up: boolean) => void
}

export default class TextBox extends CanvasElement {

    // public readonly onChanged: Event<undefined> = new Event<undefined>();

    private _paragraphs: Paragraph[] = [];
    private _cursorPosition: CursorPosition | undefined = undefined;
    private _lineDist: number = 35 // TODO: set correct value
    private _selection: TextSelection | undefined; // TODO: !?!?

    private _tempX: undefined | number = undefined;
    private _specialActions: Action[] = [{
        key: 'arrowUp',
        action: (ev: KeyboardEvent, inp: HTMLTextAreaElement, renderingContext: AbstractRenderingContext, up: boolean) => {
            if (!up) {
                this.moveCursorThroughLines(renderingContext, -1, inp, ev.shiftKey);
            }
        }
    }, {
        key: 'arrowDown',
        action: (ev: KeyboardEvent, inp: HTMLTextAreaElement, renderingContext: AbstractRenderingContext, up: boolean) => {
            if (!up) {
                this.moveCursorThroughLines(renderingContext, 1, inp, ev.shiftKey);
            }
        }
    }];

    constructor(private _rect: Rect | undefined, private _padding: Padding = {
        top: 20, // hier entsprechend dann den seitenrand mit einfließen lassen...
        left: 10,
        bottom: 0,
        right: 0
    }) {
        super();
    }

    // TODO: 1. two points move in general, 2. two points in FF mobile, 3. Chrome input
    
    //#region 
    // private input(ev: KeyboardEvent): void {
    //     if (this._cursorPosition !== undefined) {
    //         const par = this._paragraphs[this._cursorPosition.paragraph];
    //         const line = par.lines[this._cursorPosition.line];
    //         const span = line[this._cursorPosition.span];
    //         const column = this._cursorPosition.column;

    //         if (ALLOWED_CHARACTERS.indexOf(ev.key) != -1) {
    //             span.text = span.text.substring(0, column) + ev.key + span.text.substring(column);
    //             this._cursorPosition.column += ev.key.length;

    //             console.log(ev);

    //             this.onChange.emit();
    //         }
    //         else if (ev.key === 'Enter') {
    //             this._paragraphs = [
    //                 ...this._paragraphs.slice(0, this._cursorPosition.paragraph + 1),
    //                 {
    //                     lines: [[{
    //                         text: '',
    //                         color: BLACK,
    //                         attributes: [],
    //                         font: 'serif',
    //                         fontSize: 12
    //                     }]],
    //                     format: 'left'
    //                 },
    //                 ...this._paragraphs.slice(this._cursorPosition.paragraph + 1)
    //             ]
    //             this._cursorPosition.paragraph++;
    //             this._cursorPosition.column = 0;
    //             this._cursorPosition.line = 0;
    //             this._cursorPosition.span = 0;
    //         }
    //     }
    // }
    //#endregion

    public getText(joinCharacter: string = '\n'): string {
        const lines = this._paragraphs.map(p => this.getTextOfParagraph(p))
        return lines.join(joinCharacter);
    }

    public getTextOfParagraph(p: Paragraph): string {
        return p.lines.map(line => line.map(span => span.text).join("")).join("");
    }

    public setText(str: string, textSelection: TextSelection, renderingContext: AbstractRenderingContext): void {
        const thisText = this.getText();
        this._selection = textSelection;
        str = str.replace("\r\n", '\n').replace("\r", '\n');

        if (str !== thisText) {
            // Only when changes appear:
            const relayoutParagraphs: Paragraph[] = [];
            
            let start = 0;
            while (start < str.length && start < thisText.length && str.substring(0, start + 1) === thisText.substring(0, start + 1)) {
                start++;
            }
            let end = 0;
            while (start + end < Math.min(str.length, thisText.length) && end < str.length && end < thisText.length && str.substring(str.length - end - 1) === thisText.substring(thisText.length - end - 1)) {
                end++;
            }

            if (start + end !== thisText.length) {
                // then, sth was deleted
                const startPos = this.indexToCursorPosition(start);
                const endPos = this.indexToCursorPosition(thisText.length - end);

                if (startPos.paragraph !== endPos.paragraph) {
                    // far apart
                    const paragraphStart = this._paragraphs[startPos.paragraph];
                    const paragraphEnd = this._paragraphs[endPos.paragraph];
                    const lineStart = paragraphStart.lines[startPos.line];
                    const lineEnd = paragraphEnd.lines[endPos.line];
                    const spanStart = lineStart[startPos.span];
                    const spanEnd = lineEnd[endPos.span];

                    // edit
                    // first, remove text after and before
                    spanStart.text = spanStart.text.substring(0, startPos.column);
                    spanEnd.text = spanEnd.text.substring(endPos.column);
                    
                    // then, remove spans after and before
                    lineStart.splice(startPos.span + 1);
                    lineEnd.splice(0, endPos.span);
                    
                    // then, remove lines after and before
                    paragraphStart.lines.splice(startPos.line + 1);
                    paragraphEnd.lines.splice(0, endPos.line);

                    // then, remove paragraphs in between + the last one and add the lines of the last one to the former
                    this._paragraphs.splice(startPos.paragraph + 1, endPos.paragraph - startPos.paragraph);
                    paragraphStart.lines.push(... paragraphEnd.lines);

                    relayoutParagraphs.push(paragraphStart);
                }
                else if (startPos.line !== endPos.line) {
                    // in the same paragraph
                    const paragraph = this._paragraphs[startPos.paragraph];
                    const lineStart = paragraph.lines[startPos.line];
                    const lineEnd = paragraph.lines[endPos.line];
                    const spanStart = lineStart[startPos.span];
                    const spanEnd = lineEnd[endPos.span];

                    // edit
                    // first, remove text after and before
                    spanStart.text = spanStart.text.substring(0, startPos.column);
                    spanEnd.text = spanEnd.text.substring(endPos.column);
                    
                    // then, remove spans after and before
                    lineStart.splice(startPos.span + 1);
                    lineEnd.splice(0, endPos.span);

                    // then, remove lines in between
                    paragraph.lines.splice(startPos.line + 1, endPos.line - startPos.line - 1);

                    relayoutParagraphs.push(paragraph);
                }
                else if (startPos.span !== endPos.span) {
                    // in the same line
                    const line = this._paragraphs[startPos.paragraph].lines[startPos.line];
                    const spanStart = line[startPos.span];
                    const spanEnd = line[endPos.span];
                    spanStart.text = spanStart.text.substring(0, startPos.column);
                    spanEnd.text = spanEnd.text.substring(endPos.column);

                    // now, remove the extra spans
                    line.splice(startPos.span + 1, endPos.span - startPos.span - 1);
                    
                    relayoutParagraphs.push(this._paragraphs[startPos.paragraph]);
                }
                else {
                    // in the same span
                    const span = this._paragraphs[startPos.paragraph].lines[startPos.line][startPos.span];
                    span.text = span.text.substring(0, startPos.column) + span.text.substring(endPos.column);

                    relayoutParagraphs.push(this._paragraphs[startPos.paragraph]);
                }
            }
            if (start + end !== str.length) {
                // then, sth was added
                const addition = str.substring(start, str.length - end);
                const parsString = addition.split('\n');

                const startPos = this.indexToCursorPosition(start);
                if (startPos.paragraph >= this._paragraphs.length) {
                    const newPar: Paragraph = {
                        lines: [],
                        format: 'left' // hier neue Werte eintragen...
                    };
                    this._paragraphs.push(newPar);
                }
                const par = this._paragraphs[startPos.paragraph];
                if (startPos.line >= par.lines.length) {
                    const newLine: Line = [];
                    par.lines.push(newLine);
                }
                const line = par.lines[startPos.line];
                if (startPos.span >= line.length) {
                    const newSpan: Span = {
                        text: "",
                        color: BLACK, // hier neue Werte eintragen...
                        font: 'sans-serif',
                        fontSize: 12,
                        attributes: []
                    }
                    line.push(newSpan);
                }
                const span = line[startPos.span];

                if (parsString.length === 1) {
                    // small addition
                    span.text = span.text.substring(0, startPos.column) + addition + span.text.substring(startPos.column);

                    relayoutParagraphs.push(par);
                }
                else if (parsString.length >= 2) {
                    // addition with line break
                    const parsInBetween: Paragraph[] = [];
                    for (let i = 1; i < parsString.length - 1; i++) {
                        const s = TextBox.getSimilarSpan(span);
                        s.text = parsString[i];
                        parsInBetween.push(TextBox.getSimilarParagraph(par, [[s]]));
                    }

                    // then split the paragraph
                    const s1: Span = TextBox.getSimilarSpan(span);
                    const s2: Span = TextBox.getSimilarSpan(span);
                    s1.text = span.text.substring(0, startPos.column) + parsString[0];
                    s2.text = parsString[parsString.length - 1] + span.text.substring(startPos.column);

                    const l1: Line = [...line.slice(0, startPos.span), s1]
                    const l2: Line = [s2, ...line.slice(startPos.span + 1)]

                    const p1: Paragraph = TextBox.getSimilarParagraph(par, [...par.lines.slice(0, startPos.line), l1]);
                    const p2: Paragraph = TextBox.getSimilarParagraph(par, [l2, ...par.lines.slice(startPos.line + 1)]);

                    this._paragraphs = [
                        ...this._paragraphs.slice(0, startPos.paragraph),
                        p1,
                        ...parsInBetween,
                        p2,
                        ...this._paragraphs.slice(startPos.paragraph + 1)
                    ]

                    relayoutParagraphs.push(p1, ...parsInBetween, p2);
                }
            }

            const width = this.getWidth();
            const psWithoutDoubling: Paragraph[] = [];
            for (let par of relayoutParagraphs) {
                if (psWithoutDoubling.indexOf(par) === -1) {
                    psWithoutDoubling.push(par);
                }
            }
            for (let par of psWithoutDoubling) {
                this.relayoutParagraph(par, renderingContext, width);
            }
        }

        this._cursorPosition = this.indexToCursorPosition(textSelection.startSelection);

        this.onChange.emit();
    }

    private getWidth() {
        let width = this._rect?.width;
        if (width !== undefined) {
            width -= this._padding.left + this._padding.right;
        }
        return width;
    }

    public setRect(rect: Rect | undefined, renderingContext: AbstractRenderingContext) {
        this._rect = rect;
        this.relayoutText(renderingContext);
        this.onChange.emit(rect);
    }

    public setPadding(padding: Padding, renderingContext: AbstractRenderingContext) {
        this._padding = padding;
        this.relayoutText(renderingContext);
        this.onChange.emit(padding);
    }

    private relayoutText(renderingContext: AbstractRenderingContext): void {
        for (let par of this._paragraphs) {
            this.relayoutParagraph(par, renderingContext, this.getWidth())
        }
    }

    private relayoutParagraph(paragraph: Paragraph,
            renderingContext: AbstractRenderingContext,
            width: number | undefined,
            removeEmptySpans: boolean = true,
            unifySimilarSpans: boolean = true) {
        if (width !== undefined) {
            width *= PX_PER_MM; // Width is still in MM;
        }
        const str = this.getTextOfParagraph(paragraph);
        const words = str.split(' ');

        // last one indicates end of paragraph, first one start (0)
        const splitAt: number[] = [];
        splitAt.push(0);

        if (paragraph.format !== 'block') {
            type Word = {
                start: number,
                end: number,
                width: number
            }
            const ws: Word[] = [];

            // measure the words
            let counter = 0;
            for (let i = 0; i < words.length; i++) {
                const startIndex = counter;
                let word = words[i];
                if (i !== words.length - 1) {
                    word += ' '; // add the space if needed
                }
                counter += word.length;
                const endIndex = counter;

                const width = TextBox.getWidthOfRange(paragraph, startIndex, endIndex, renderingContext);
                ws.push({
                    start: startIndex,
                    end: endIndex,
                    width
                })
            }

            // split into lines
            const lines: Word[][] = [];
            let line: Word[] = [];
            let lineWidth: number = 0;
            for (let w of ws) {
                // TODO: split word if necessary
                if (width === undefined || lineWidth + w.width <= width) {
                    line.push(w);
                    lineWidth += w.width;
                }
                else {
                    lines.push(line);
                    line = [w];
                    lineWidth = w.width;
                }
            }
            if (lines.indexOf(line) === -1 && line.length !== 0) {
                lines.push(line);
            }

            // then, state, where the split needs to be made (as well as last one)
            for (let i = 0; i < lines.length; i++) {
                const l = lines[i];
                if (l.length !== 0) {
                    const lastIndex = l[l.length - 1].end;
                    splitAt.push(lastIndex);
                }
            }
        }
        else {
            // TODO: block rendering
        }

        // split
        let lines: Line[] = [];
        for (let i = 1; i < splitAt.length; i++) {
            lines.push(TextBox.getRangeAsSpans(paragraph, splitAt[i - 1], splitAt[i]));
        }
        
        // remove empty spans
        if (removeEmptySpans) {
            const newLines: Line[] = [];
            for (let l of lines) {
                const newLine: Line = [];
                for (let i = 0; i < l.length; i++) {
                    const span = l[i];
                    if (span.text !== '' || (newLine.length === 0 && i === l.length - 1)) {
                        newLine.push(span);
                    }
                }
                newLines.push(newLine);
            }
            lines = newLines;
        }
        
        // unify spans, if possible
        if (unifySimilarSpans) {
            const newLines: Line[] = [];
            for (let l of lines) {
                const newLine: Line = [];
                for (let i = 0; i < l.length; i++) {
                    if (newLine.length !== 0 && TextBox.similarSpans(l[i], newLine[newLine.length - 1])) {
                        newLine[newLine.length - 1] = TextBox.getSimilarSpan(l[i], newLine[newLine.length - 1].text + l[i].text);
                    }
                    else {
                        newLine.push(l[i]);
                    } 
                }
                newLines.push(newLine);
            }
            lines = newLines;
        }

        // set the lines
        paragraph.lines = lines;

    }

    public draw(renderingContext: AbstractRenderingContext, drawCursor: boolean = true) {

        const x = (this._rect?.x ?? 0) + this._padding.left
        let y = (this._rect?.y ?? 0) - this._padding.top

        // draw the text
        for (let par of this._paragraphs) {
            for (let line of par.lines) {
                y -= this._lineDist;
                let xSpan = x;
                for (let span of line) {
                    const m = TextBox.measureTextOfSpan(span, renderingContext);
                    renderingContext.drawText(span.text, {
                        x: xSpan,
                        y
                    }, TextBox.getFontSizeInPX(span.fontSize, renderingContext), span.font, 'left', 'bottom', 'ltr', span.color, TRANSPARENT, 0, false, true)
                    xSpan += m;
                }
            }
        }

        // draw the cursor
        if (this._cursorPosition && drawCursor) {
            let yCursor = (this._rect?.y ?? 0) + this._padding.top;
            let xCursor = (this._rect?.x ?? 0) + this._padding.left;
            let fontSize = 12;

            if (!(this._paragraphs.length === 0
                && this._cursorPosition.paragraph === 0
                && this._cursorPosition.line === 0
                && this._cursorPosition.span === 0
                && this._cursorPosition.column === 0)) {
                const par = this._paragraphs[this._cursorPosition.paragraph];
                const line = par.lines[this._cursorPosition.line];
                const span = line[this._cursorPosition.span];
                const column = this._cursorPosition.column;

                fontSize = span.fontSize;
                
                const parsBefore = this._paragraphs.slice(0, this._cursorPosition.paragraph);
                const linesBefore = parsBefore.map(p => p.lines.length).reduce((p, c) => p + c, 0) + this._cursorPosition.line;
                yCursor += this._lineDist * (linesBefore + 1);
    
                const spansBefore = line.slice(0, this._cursorPosition.span);
                xCursor += spansBefore.map(s => TextBox.measureTextOfSpan(s, renderingContext)).reduce((a, b) => a + b, 0); // width of spans before
                xCursor += TextBox.measureTextOfSpan(span, renderingContext, span.text.substring(0, column))
            }
            else {
                yCursor += this._lineDist;
            }


            renderingContext.drawLine({
                x: xCursor,
                y: -yCursor
            }, {
                x: xCursor,
                y: -yCursor + fontSize / PT_PER_MM * PX_PER_MM
            }, 2, BLACK)
        }
    }

    public moveCursorThroughLines(renderingContext: AbstractRenderingContext, dline: number, area: HTMLTextAreaElement, shiftKey: boolean): boolean {
        if (this._cursorPosition) {
            
            // 0, falls ganz am Anfang
            // 1, falls ganz am Ende
            function getParagraphAndLine(paragraphs: Paragraph[], paragraph: number, line: number, dline: number): [number, number] | 0 | 1 {
                if (dline === 0) {
                    return [paragraph, line];
                }
                else if (dline > 0) {
                    let curLine: number | undefined = line;
                    for (let p = paragraph; p < paragraphs.length; p++) {
                        for (let l = curLine ?? 0; l < paragraphs[p].lines.length; l++) {
                            if (dline === 0) {
                                return [p, l];
                            }
                            dline--;
                        }
                        curLine = undefined; // Dann beim nächsten Durchlauf bei 0 starten
                    }
                    return 1;
                }
                else {
                    let curLine: number | undefined = line;
                    for (let p = paragraph; p >= 0; p--) {
                        for (let l = curLine ?? paragraphs[p].lines.length - 1; l >= 0; l--) {
                            if (dline === 0) {
                                return [p, l];
                            }
                            dline++;
                        }
                        curLine = undefined; // Dann beim nächsten Durchlauf bei letzter Line starten
                    }
                    return 0;
                }
            }

            const paragraphAndLine = getParagraphAndLine(this._paragraphs, this._cursorPosition.paragraph, this._cursorPosition.line, dline);
            
            if (paragraphAndLine === 0) {
                this.setCursorPosition(TextBox.getFirstCursorPosition(this._paragraphs), area, shiftKey);
                this._tempX = undefined;
            }
            else if (paragraphAndLine === 1) {
                this.setCursorPosition(TextBox.getLastCursorPosition(this._paragraphs), area, shiftKey);
                this._tempX = undefined;
            }
            else {
                if (this._tempX === undefined) {
                    this._tempX = this.getXCoordinateToCursorPosition(this._cursorPosition, renderingContext);
                }
                if (this._tempX === undefined) {
                    return false;
                }

                this.setCursorPosition(this.getCursorPositionToXCoordinate(this._tempX, paragraphAndLine[0], paragraphAndLine[1], renderingContext), area, shiftKey);
            }

            return this._cursorPosition !== undefined;
        }
        else {
            return false;
        }
    }

    private static measureTextOfSpan(span: Span, renderingContext: AbstractRenderingContext, altText?: string): number {
        return renderingContext.measureText(altText ?? span.text, TextBox.getFontSizeInPX(span.fontSize, renderingContext), span.font, 'left', 'bottom', 'ltr', 0).width / renderingContext.zoom;
    }

    private static getFontSizeInPX(fontSize: number, renderingContext: AbstractRenderingContext): number {
        return fontSize / PT_PER_MM * PX_PER_MM * renderingContext.zoom;
    }

    private cursorPositionToIndex(cursorPosition: CursorPosition): number {
        return TextBox.cursorPositionToIndex(cursorPosition, this._paragraphs);
    }

    private indexToCursorPosition(index: number, jumpToNextSpanIfThere: boolean = true): CursorPosition {
        return TextBox.indexToCursorPointer(index, this._paragraphs, jumpToNextSpanIfThere);
    }

    private static cursorPositionToIndex(cursorPosition: CursorPosition, paragraphs: Paragraph[]): number {
        const par = paragraphs[cursorPosition.paragraph];
        const line = par.lines[cursorPosition.line];
        // const span = line[cursorPosition.span];
        const column = cursorPosition.column;
        
        const parsBefore = paragraphs.slice(0, cursorPosition.paragraph);
        const parsBeforeCount = TextBox.countSymbolsInParagraphs(parsBefore);
        const linesBefore = par.lines.slice(0, cursorPosition.line);
        const linesBeforeCount = TextBox.countSymbolsInLines(linesBefore)
        const spansBefore = line.slice(0, cursorPosition.span);
        const spansBeforeCount = TextBox.countSymbolsInSpans(spansBefore);
        
        // parsBefore.length is due to the linebreak
        return column + spansBeforeCount + linesBeforeCount + parsBefore.length + parsBeforeCount;
    }

    private static indexToCursorPointer(index: number, paragraphs: Paragraph[], jumpToNextSpanIfThere: boolean = true): CursorPosition {
        const cp: CursorPosition = {
            paragraph: 0,
            line: 0,
            span: 0,
            column: 0
        }

        let countedIndex = 0;
        let counter = 0;

        while (cp.paragraph + 1 < paragraphs.length 
            && (countedIndex + (counter = TextBox.countSymbolsInLines(paragraphs[cp.paragraph].lines)) < index)) {
            cp.paragraph++;
            countedIndex += counter + 1; // + 1 for linebreak, therefore no jump if jumpToNextSpanIfThere necessary
        }

        if (cp.paragraph >= paragraphs.length) return cp; // in case, cp.paragraph is 0
        const paragraph = paragraphs[cp.paragraph];
        while (cp.line + 1 < paragraph.lines.length
            && (countedIndex + (counter = TextBox.countSymbolsInSpans(paragraph.lines[cp.line])) < index 
                || (jumpToNextSpanIfThere && countedIndex + counter === index))) {
            cp.line++;
            countedIndex += counter;
        }

        if (cp.line >= paragraph.lines.length) return cp;
        const line = paragraph.lines[cp.line];
        while (cp.span + 1 < line.length
            && (countedIndex + (counter = line[cp.span].text.length) < index 
                || (jumpToNextSpanIfThere && countedIndex + counter === index))) {
            cp.span++;
            countedIndex += counter;
        }

        cp.column = index - countedIndex;

        return cp;
    }

    private static similarSpans(s1: Span, s2: Span): boolean {
        function similarArrays<T>(arr1: T[], arr2: T[]): boolean {
            for (let a of arr1) {
                if (arr2.indexOf(a) === -1) {
                    return false;
                }
            }
            for (let a of arr2) {
                if (arr1.indexOf(a) === -1) {
                    return false;
                }
            }
            return true;
        }
        
        return similarArrays(s1.attributes, s2.attributes)
            && sameColors(s1.color, s2.color)
            && s1.font === s2.font
            && s1.fontSize === s2.fontSize;
    }

    private static getSimilarSpan(s: Span, text: string = ''): Span {
        return {
            text,
            font: s.font,
            fontSize: s.fontSize,
            color: {... s.color},
            attributes: [... s.attributes]
        }
    }

    private static getSimilarParagraph(par: Paragraph, lines: Line[]): Paragraph {
        const p: Paragraph = {...par};
        p.lines = lines;
        return p;
    }

    private static countSymbolsInParagraphs(pars: Paragraph[]): number {
        return pars.map(par => par.lines.map(l => l.map(s => s.text.length).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);
    }

    private static countSymbolsInLines(lines: Line[]): number {
        return lines.map(l => l.map(s => s.text.length).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);
    }

    private static countSymbolsInSpans(spans: Span[]): number {
        return spans.map(s => s.text.length).reduce((a, b) => a + b, 0);
    }

    private static getRangeAsSpans(paragraph: Paragraph, start: number, end: number): Span[] {
        const startPos = TextBox.indexToCursorPointer(start, [paragraph], false);
        const endPos = TextBox.indexToCursorPointer(end, [paragraph], false);

        const allSpans: Span[] = [];

        if (startPos.line === endPos.line && startPos.span === endPos.span) {
            const oldSpan = paragraph.lines[startPos.line][startPos.span]
            const s = TextBox.getSimilarSpan(oldSpan);
            s.text = oldSpan.text.substring(startPos.column, endPos.column);

            allSpans.push(s);
        }
        else if (startPos.line === endPos.line) {
            // first, the two spans in question
            const oldS1 = paragraph.lines[startPos.line][startPos.span];
            const oldS2 = paragraph.lines[endPos.line][endPos.span];
            const s1 = TextBox.getSimilarSpan(oldS1);
            s1.text = oldS1.text.substring(startPos.column);
            const s2 = TextBox.getSimilarSpan(oldS2);
            s2.text = oldS2.text.substring(0, endPos.column);

            // then, the spans in between
            allSpans.push(s1, ...paragraph.lines[startPos.line].slice(startPos.span + 1, endPos.span), s2);
        }
        else {
            // then, not even in the same line

            // first, the beginning spans
            const oldS1 = paragraph.lines[startPos.line][startPos.span];
            const s1 = TextBox.getSimilarSpan(oldS1);
            s1.text = oldS1.text.substring(startPos.column);
            allSpans.push(s1);

            // then, all the spans to the end of the first line
            allSpans.push(...paragraph.lines[startPos.line].slice(startPos.span + 1));
            
            // then, all the lines in between
            for (let i = startPos.line + 1; i < endPos.line; i++) {
                allSpans.push(...paragraph.lines[i]);
            }

            // then, all the spans in the last line
            allSpans.push(...paragraph.lines[endPos.line].slice(0, endPos.span));

            // last, the ending span
            const oldS2 = paragraph.lines[endPos.line][endPos.span];
            const s2 = TextBox.getSimilarSpan(oldS2);
            s2.text = oldS2.text.substring(0, endPos.column);
            allSpans.push(s2);
        }

        return allSpans;
    }
        
    private static getWidthOfRange(paragraph: Paragraph, start: number, end: number, renderingContext: AbstractRenderingContext): number {
        return TextBox.getRangeAsSpans(paragraph, start, end).map(s => TextBox.measureTextOfSpan(s, renderingContext)).reduce((a, b) => a + b, 0);
    }

    private static getFirstCursorPosition(paragraphs: Paragraph[]): CursorPosition | undefined {
        if (paragraphs.length === 0
            || paragraphs[0].lines.length === 0
            || paragraphs[0].lines[0].length === 0) {
            return undefined;
        }
        return {
            paragraph: 0,
            line: 0,
            span: 0,
            column: 0
        }
    }

    private static getLastCursorPosition(paragraphs: Paragraph[]): CursorPosition | undefined {
        if (paragraphs.length === 0) return undefined;
        const paragraph = paragraphs.length - 1;
        if (paragraphs[paragraph].lines.length === 0) return undefined;
        const line = paragraphs[paragraph].lines.length - 1;
        if (paragraphs[paragraph].lines[line].length === 0) return undefined;
        const span = paragraphs[paragraph].lines[line].length - 1;

        return {
            paragraph,
            line,
            span,
            column: paragraphs[paragraph].lines[line][span].text.length
        }
    }

    public click(renderingContext: AbstractRenderingContext, point: Point, area: HTMLTextAreaElement, shiftKey: boolean): void {
        this.setCursorPosition(this.getCursorPositionToPoint(point, renderingContext), area, shiftKey);
    }

    public onKey(ev: KeyboardEvent, inp: HTMLTextAreaElement, renderingContext: AbstractRenderingContext, up: boolean) {
        const val = inp.value;
        

        for (let action of this._specialActions) {
            if (ev.key.toUpperCase() === action.key.toUpperCase()) {
                ev.preventDefault();
                action.action(ev, inp, renderingContext, up);
                return;
            }
        }

        if (up) {
            this._tempX = undefined;
        }

        //inp.value = '';
        //ev.preventDefault();
        //console.log(ev);
        this.setText(val, {
            endSelection: inp.selectionEnd,
            startSelection: inp.selectionStart
        }, renderingContext);
    }

    private setCursorPosition(cursorPosition: CursorPosition | undefined, area: HTMLTextAreaElement, shiftKey: boolean = false): void {
        this._cursorPosition = cursorPosition;
        
        // set selection of textarea
        if (cursorPosition) {
            const index = this.cursorPositionToIndex(cursorPosition);
            if (shiftKey) {
                // set selection
                if (area.selectionDirection === 'none') {
                    if (area.selectionStart < index) {
                        area.selectionEnd = index;
                        area.selectionDirection = 'forward';
                    }
                    else if (area.selectionStart > index) {
                        area.selectionEnd = area.selectionStart;
                        area.selectionStart = index;
                        area.selectionDirection = 'backward'
                    }
                    // else: do nothing (just a click)
                }
                else if (area.selectionDirection === 'forward') {
                    if (area.selectionStart <= index) {
                        area.selectionEnd = index;
                        area.selectionDirection = 'forward';
                    }
                    else if (area.selectionStart > index) {
                        area.selectionEnd = area.selectionStart;
                        area.selectionStart = index;
                        area.selectionDirection = 'backward'
                    }
                }
                else if (area.selectionDirection === 'backward') {
                    if (area.selectionEnd <= index) {
                        area.selectionStart = area.selectionEnd;
                        area.selectionEnd = index;
                        area.selectionDirection = 'forward';
                    }
                    else if (area.selectionEnd > index) {
                        area.selectionStart = index;
                        area.selectionDirection = 'backward'
                    }
                }
            }
            else {
                // when no selection should appear
                area.selectionStart = index;
                area.selectionEnd = index;
                area.selectionDirection = 'none'
            }
        }
        this.onChange.emit();
    }

    private getCursorPositionToXCoordinate(x: number, paragraph: number, line: number, renderingContext: AbstractRenderingContext): CursorPosition | undefined {
        if (paragraph >= this._paragraphs.length || line >= this._paragraphs[paragraph].lines.length) {
            return undefined;
        }

        const par = this._paragraphs[paragraph];
        const l = par.lines[line];

        let pos = (this._rect?.x ?? 0) + this._padding.left;
        let span = 0;
        let width = 0;
        while (span < l.length 
                && pos + (width = TextBox.measureTextOfSpan(l[span], renderingContext)) < x) {
            span++;
            pos += width;
        }

        if (span === l.length) {
            // return very end!
            return {
                paragraph,
                line,
                span: span - 1,
                column: l[span - 1].text.length
            }
        }

        const s = l[span]; // the span in question
        let column = 0;
        while (column < s.text.length 
                && pos + (width = TextBox.measureTextOfSpan(TextBox.getSimilarSpan(s, s.text.charAt(column)), renderingContext)) < x) {
            column++;
            pos += width;
        }
        return {
            paragraph,
            line,
            span,
            column
        }

        // TODO: wechseln soll es erst bei der Mitte
    }

    private getParagraphAndLineToYCoordinate(y: number): [number, number] | undefined {
        if (this._paragraphs.length === 0 || this._paragraphs[0].lines.length === 0) {
            return undefined;
        }

        let pos = (this._rect?.y ?? 0) - this._padding.top;
        
        let par = 0;
        let line = 0;

        for (; par < this._paragraphs.length; par++) {
            line = 0;
            const p = this._paragraphs[par];
            for (; line < p.lines.length; line++) {
                if (pos - this._lineDist > y) {
                    pos -= this._lineDist
                }
                else {
                    // then, we are there!
                    return [par, line];
                }
            }
        }

        if (par === this._paragraphs.length) {
            // when at the very bottom
            return [this._paragraphs.length - 1, this._paragraphs[this._paragraphs.length - 1].lines.length - 1];
        }

        return undefined;
        // TODO: wechseln soll es erst bei der Mitte
    }

    private getCursorPositionToPoint(p: Point, renderingContext: AbstractRenderingContext): CursorPosition | undefined {
        const paragraphAndLine = this.getParagraphAndLineToYCoordinate(p.y);
        if (paragraphAndLine === undefined) {
            return undefined;
        }
        return this.getCursorPositionToXCoordinate(p.x, paragraphAndLine[0], paragraphAndLine[1], renderingContext);
    }

    private getXCoordinateToCursorPosition(cursorPosition: CursorPosition, renderingContext: AbstractRenderingContext): number | undefined {

        if (cursorPosition.paragraph >= this._paragraphs.length || cursorPosition.line >= this._paragraphs[cursorPosition.paragraph].lines.length) return undefined;

        const line = this._paragraphs[cursorPosition.paragraph].lines[cursorPosition.line];
        if (cursorPosition.span >= line.length) return undefined;
        const span = line[cursorPosition.span];
        const copySpan = TextBox.getSimilarSpan(span, span.text.substring(0, cursorPosition.column));
        const spansUpUntil = line.slice(0, cursorPosition.span);
        spansUpUntil.push(copySpan);
        const widthOfAllSpans = spansUpUntil.map(s => TextBox.measureTextOfSpan(s, renderingContext)).reduce((a, b) => a + b, 0);

        const x = (this._rect?.x ?? 0) + this._padding.left

        return x + widthOfAllSpans;
    }

    private getYCoordinateToCursorPosition(cursorPosition: CursorPosition): number | undefined {
        if (cursorPosition.paragraph >= this._paragraphs.length || cursorPosition.line >= this._paragraphs[cursorPosition.paragraph].lines.length) return undefined;

        let y = (this._rect?.y ?? 0) - this._padding.top
        const numberOfLinesInParagraphsBefore = this._paragraphs.slice(0, cursorPosition.paragraph).map(p => p.lines.length).reduce((a, b) => a + b, 0);
        const numberOfLinesInParagraphUntilLine = cursorPosition.line + 1;
        const lineHeights = -this._lineDist * (numberOfLinesInParagraphsBefore + numberOfLinesInParagraphUntilLine);

        return y + lineHeights;
    }

    private getPointToCursorPosition(cursorPosition: CursorPosition, renderingContext: AbstractRenderingContext): Point | undefined {
        const x = this.getXCoordinateToCursorPosition(cursorPosition, renderingContext);
        const y = this.getYCoordinateToCursorPosition(cursorPosition);
        if (x === undefined || y === undefined) {
            return undefined;
        }
        return {
            x,
            y
        }
    }
}