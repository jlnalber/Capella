import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WhiteboardComponent } from './whiteboard/whiteboard/whiteboard.component';
import { ProkyonComponent } from './prokyon/prokyon.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [{
  path: 'whiteboard',
  component: WhiteboardComponent
}, {
  path: 'prokyon',
  component: ProkyonComponent
}, {
  path: 'settings',
  component: SettingsComponent
}, {
  path: 'home',
  component: HomeComponent
}, {
  path: '',
  redirectTo: '/home',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
