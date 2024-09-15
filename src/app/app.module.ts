import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WhiteboardComponent } from './whiteboard/whiteboard/whiteboard.component';
import { CanvasComponent } from './whiteboard/whiteboard/canvas/canvas.component';
import { RibbonComponent } from './whiteboard/whiteboard/ribbon/ribbon.component';
import { RibbonTabComponent } from "./whiteboard/whiteboard/ribbon/ribbon-tab/ribbon-tab.component";

@NgModule({
  declarations: [
    AppComponent,
    WhiteboardComponent,
    CanvasComponent,
    RibbonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RibbonTabComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
