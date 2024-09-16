import { Color } from "src/app/global/interfaces/color";

export interface ProkyonCanvasConfig {
    showGrid?: boolean,
    gridColor?: Color,
    showNumbers?: boolean,
    drawPointsEqually?: boolean,
    drawNewLabels?: boolean,
    transformColor?: (c: Color) => Color
}