import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardServiceService } from 'src/app/guard-service.service';
import { AddAlbumComponent } from './add-album/add-album.component';

const routes: Routes = [
  { path: 'admin/add', canActivate: [GuardServiceService], component: AddAlbumComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
