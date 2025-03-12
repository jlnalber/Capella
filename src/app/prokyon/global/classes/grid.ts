import { CanvasDrawer } from "src/app/global/classes/abstract/canvasDrawer";
import AbstractRenderingContext from "src/app/global/classes/renderingContext/abstractRenderingContext";
import { clamp, correctRect } from "src/app/global/essentials/utils";
import { BLACK, Color } from "src/app/global/interfaces/color";
import { Point } from "src/app/global/interfaces/point";

export class Grid extends CanvasDrawer {
  public override async draw(ctx: AbstractRenderingContext) {
    if (ctx.config?.showGrid === undefined || ctx.config.showGrid) {
      // get metadata about the canvas
      const range = correctRect(ctx.range);
      const step = 99 / ctx.zoom;

      // first, calculate the step width that is used to draw lines
      const base = 2;
      const dim = Math.round(Math.log(step) / Math.log(base) + 0.5);
      let unit = Math.round(step / (base ** dim) + 0.5) * (base ** dim);
      if (unit == 0) return;

      // then, calculate data for the text rendering
      const drawText = ctx.config?.showNumbers ?? true;
      const offsetText = 15 / ctx.zoom;
      const yPos = clamp(range.y + offsetText, -offsetText, range.y + range.height - offsetText);
      const alignBottom = yPos == range.y + offsetText;
      const xPos = clamp(range.x + offsetText, -offsetText, range.x + range.width - offsetText);
      const alignLeft = xPos == range.x + offsetText;
      const fontSize = 15;
      const fontFamily = 'sans-serif';

      // then, draw the lines
      const stroke: Color = ctx.config?.gridColor ?? {
        r: 100,
        g: 100,
        b: 100
      };
      // first, parallel to the y-axis
      for (let x = range.x - range.x % (unit / base); x < range.x + range.width; x += unit / base) {
        // draw line
        let big: boolean = x % unit === 0;
        await ctx.drawLine({
          x: x,
          y: range.y
        }, {
          x: x,
          y: range.y + range.height
        }, {
          lineWidth: x === 0 ? 3 : big ? 1 : 0.5,
          color: stroke,
          uniformSizeOnZoom: true
        });

        // draw arrow on axis
        if (x === 0) {
          const height = 15 / ctx.zoom;
          const offset = 0.5 / ctx.zoom;
          const offsetY = 3 / ctx.zoom;
          const p1: Point = {
            x: x + offset,
            y: range.y + range.height + offsetY
          }
          const p2: Point = {
            x: x - height / 4 + offset,
            y: range.y + range.height - height
          }
          const p3: Point = {
            x: x + height / 4 + offset,
            y: range.y + range.height - height
          };
          await ctx.drawPath([p1, p2, p3, p1], {
            lineWidth: 0,
            color: stroke,
            uniformSizeOnZoom: true
          }, {
            color: stroke
          });
        }
        // draw the text
        else if (big && drawText) {
          await ctx.drawText(x.toLocaleString(), {
            x: x,
            y: yPos
          }, {
            fontSize: [fontSize, 'px'], 
            fontFamily: [fontFamily],
            textAlign: 'center',
            textBaseline: alignBottom ? 'bottom' : 'top',
            color: BLACK,
            uniformSizeOnZoom: true
          });
        }
      }

      // then, those parallel to the x-axis
      for (let y = range.y - range.y % (unit / base); y < range.y + range.height; y += unit / base) {
        // draw line
        let big: boolean = y % unit === 0;
        await ctx.drawLine({
          x: range.x,
          y: y
        }, {
          x: range.x + range.width,
          y: y
        }, {
          lineWidth: y === 0 ? 3 : big ? 1 : 0.5,
          color: stroke,
          uniformSizeOnZoom: true
        });

        // draw arrow on axis
        if (y === 0) {
          const width = 15 / ctx.zoom;
          const offset = 0.5 / ctx.zoom;
          const offsetX = 3 / ctx.zoom;
          const p1: Point = {
            x: range.x + range.width + offsetX,
            y: y + offset
          };
          const p2: Point = {
            x: range.x + range.width - width,
            y: y - width / 4 + offset
          }
          const p3: Point = {
            x: range.x + range.width - width,
            y: y + width / 4 + offset
          }
          await ctx.drawPath([p1, p2, p3, p1], {
            lineWidth: 0,
            color: stroke,
            uniformSizeOnZoom: true
          }, {
            color: stroke
          });
        }
        // draw the text
        else if (big && drawText) {
          await ctx.drawText(y.toLocaleString(), {
            x: xPos,
            y: y
          }, {
            fontSize: [fontSize, 'px'],
            fontFamily: [fontFamily],
            textAlign: alignLeft ? 'left' : 'right',
            textBaseline: 'middle',
            color: BLACK,
            uniformSizeOnZoom: true
          });
        }
      }

      // draw the 0 if in the range
      if (range.y <= -offsetText
        && range.y + range.height >= -offsetText
        && range.x <= -offsetText
        && range.x + range.width >= -offsetText
        && drawText) {
        await ctx.drawText('0', {
          x: -offsetText,
          y: -offsetText
        }, {
          fontSize: [fontSize, 'px'],
          fontFamily: [fontFamily],
          textAlign: 'right',
          textBaseline: 'top',
          uniformSizeOnZoom: true,
          color: BLACK
        })
      }
    }
  }
}
