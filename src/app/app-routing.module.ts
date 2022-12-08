import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRouteGuard } from './route-guards/auth';

const routes: Routes = [
  {path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)},
  {path: 'weather', loadChildren: () => import('./modules/weather/weather.module').then(m => m.WeatherModule), canActivate: [AuthRouteGuard]},
  {path: '**', redirectTo: '/login', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
