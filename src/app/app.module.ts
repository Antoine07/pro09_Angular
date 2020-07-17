import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AlbumsComponent } from './albums/albums.component';
import { AlbumDetailsComponent } from './album-details/album-details.component';
import { SearchComponent } from './search/search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AlbumDescriptionComponent } from './album-description/album-description.component';
import { LoginComponent } from './login/login.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { HttpClientModule } from '@angular/common/http';
import * as firebase from 'firebase';

import {firebaseConfig} from '../environments/environment';

import { DashboardComponentComponent } from './dashboard-component/dashboard-component.component'
import { ShareModule } from './share/share.module';
import { AdminRoutingModule } from './admin/admin-routing.module';

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    AlbumsComponent,
    AlbumDetailsComponent,
    SearchComponent,
    AlbumDescriptionComponent,
    LoginComponent,
    AudioPlayerComponent,
    DashboardComponentComponent,
  ],
  imports: [
    BrowserModule,
    // FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ShareModule,
    // AdminRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }