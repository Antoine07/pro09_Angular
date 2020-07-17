import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumsComponent } from './albums/albums.component';
import { AlbumDescriptionComponent } from './album-description/album-description.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponentComponent } from './dashboard-component/dashboard-component.component';
import { GuardServiceService } from './guard-service.service';
import { AdminModule } from './admin/admin.module';
import { AlbumComponent } from '../app/admin/album/album.component'

const routes: Routes = [
  {
    path: 'albums',
    component: AlbumsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: '/albums',
    pathMatch: 'full'
  },
  {
    path: 'album/:id',
    component: AlbumDescriptionComponent
  },
  {
    path: 'dashboard',canActivate:[GuardServiceService],
    component: DashboardComponentComponent
  },
  {
    path: 'admin',canActivate:[GuardServiceService],
    component: AlbumComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
