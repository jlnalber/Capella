import { Color } from "src/app/global/interfaces/color";
import RibbonView from "./ribbonView";

export type Ribbon = {
    ribbonTabs: RibbonTab[]
}

export type RibbonTab = {
    name: string,
    color: Color,
    underlineColor: Color,
    content: Content[]
}

export type Content = RibbonView | Divider;

export type Divider = {
    title: string,
    content: Content[]
}