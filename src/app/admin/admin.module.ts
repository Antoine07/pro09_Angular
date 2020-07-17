import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumComponent } from './album/album.component';
import { ShareModule } from '../share/share.module';
import { AddAlbumComponent } from './add-album/add-album.component';
import { UpdateAlbumComponent } from './update-album/update-album.component';

@NgModule({
  declarations: [AlbumComponent, AddAlbumComponent, UpdateAlbumComponent],
  imports: [
    CommonModule,ShareModule
  ],
  exports:[AlbumComponent]
})
export class AdminModule { 
}
