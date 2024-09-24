import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WhiteboardComponent } from './whiteboard/whiteboard/whiteboard.component';
import { ProkyonComponent } from './prokyon/prokyon.component';

const routes: Routes = [{
  path: 'whiteboard',
  component: WhiteboardComponent
}, {
  path: 'prokyon',
  component: ProkyonComponent
}, {
  path: '',
  redirectTo: '/whiteboard',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
