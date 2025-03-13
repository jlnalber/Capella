import { ViewDependencyPointElementsDialogComponent } from './prokyon/formula-dialogs/view-dependency-point-elements-dialog/view-dependency-point-elements-dialog.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WhiteboardComponent } from './whiteboard/whiteboard/whiteboard.component';
import { ProkyonCanvasComponent } from './prokyon/canvas/prokyonCanvas.component';
import { WhiteboardCanvasComponent } from './whiteboard/canvas/whiteboardCanvas.component';
import { RibbonComponent } from './global/ribbon/ribbon.component';
import { RibbonTabComponent } from "./global/ribbon/ribbon-tab/ribbon-tab.component";
import { ProkyonComponent } from './prokyon/prokyon.component';
import { FormsModule } from '@angular/forms';
import { TabGroupComponent } from './prokyon/tab-group/tab-group.component';
import { GeometryTabComponent } from './prokyon/geometry-tab/geometry-tab.component';
import { FuncAnalyserDialogComponent } from './prokyon/func-analyser-dialog/func-analyser-dialog.component';
import { IntervalComponent } from './prokyon/formula-tab/global/interval/interval.component';
import { VariableFormulaComponent } from './prokyon/formula-tab/variable-formula/variable-formula.component';
import { PointFormulaComponent } from './prokyon/formula-tab/point-formula/point-formula.component';
import { ColorCircleComponent } from './prokyon/formula-tab/global/color-circle/color-circle.component';
import { HoverMenuComponent } from './prokyon/hover-menu/hover-menu/hover-menu.component';
import { IntersectionDialogComponent } from './prokyon/intersection-dialog/intersection-dialog.component';
import { GraphFormulaComponent } from './prokyon/formula-tab/graph-formula/graph-formula.component';
import { HoverMenuDirective } from './prokyon/hover-menu/hover-menu.directive';
import { GeometricFormulaComponent } from './prokyon/formula-tab/geometric-formula/geometric-formula.component';
import { FormulaTabComponent } from './prokyon/formula-tab/formula-tab.component';
import { ContextMenuComponent } from './global/context-menu/context-menu/context-menu.component';
import { ContextMenuDirective } from './global/context-menu/context-menu.directive';
import { FormulaElementComponent } from './prokyon/formula-tab/formula-element/formula-element.component';
import { DependencyPointElementsFormulaComponent } from './prokyon/formula-tab/dependency-point-elements-formula/dependency-point-elements-formula.component';
import { DefiniteIntegralFormulaComponent } from './prokyon/formula-tab/definite-integral-formula/definite-integral-formula.component';
import { CurveFormulaComponent } from './prokyon/formula-tab/curve-formula/curve-formula.component';
import { CompiledPointFormulaComponent } from './prokyon/formula-tab/compiled-point-formula/compiled-point-formula.component';
import { ViewPointElementComponent } from './prokyon/formula-dialogs/view-point-element/view-point-element.component';
import { ViewCurveElementComponent } from './prokyon/formula-dialogs/view-curve-element/view-curve-element.component';
import { ViewCircleElementComponent } from './prokyon/formula-dialogs/view-circle-element/view-circle-element.component';
import { ViewAngleElementComponent } from './prokyon/formula-dialogs/view-angle-element/view-angle-element.component';
import { ViewAbstractLineElementComponent } from './prokyon/formula-dialogs/view-abstract-line-element/view-abstract-line-element.component';
import { ColorStyleComponent } from './global/style-components/color-style/color-style.component';
import { QuickActionsComponent } from "./whiteboard/quick-actions/quick-actions.component";
import { ViewPensComponent } from './settings/view-pens/view-pens.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
