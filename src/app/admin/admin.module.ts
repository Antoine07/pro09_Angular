import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumComponent } from './album/album.component';
import { ShareModule } from '../share/share.module';
import { AddAlbumComponent } from './add-album/add-album.component';

@NgModule({
  declarations: [AlbumComponent, AddAlbumComponent],
  imports: [
    CommonModule,ShareModule
  ],
  exports:[AlbumComponent]
})
export class AdminModule { 
}
