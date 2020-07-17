import { Component, OnInit } from '@angular/core';
import { Album } from '../album';
// import { ALBUMS } from '../mock-albums';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
})
export class AlbumsComponent implements OnInit {

  titlePage: string = "Page princiaple Albums Music";
  albums: Album[];
  selectedAlbum: Album;
  pos: number;
  status: string = null; // pour gérer l'affichage des caractères [play] 

  constructor(private aS: AlbumService) {

    // récupération des données depuis Firebase avec la méthode HttpClient
    this.aS.getAlbums().subscribe(
      list_albums => {this.albums = list_albums; console.log(list_albums)}
    );


  }

  ngOnInit() {
    this.aS.paginate(
      0,
      this.aS.paginateNumberPage()
    ).subscribe(
      result => {this.albums = result;}
    );


  }

  onSelect(album: Album) {
    this.selectedAlbum = album;
  }

  // event de l'enfant dans la variable $event un album 
  playParent($event) {
    this.status = $event.id; // identifiant unique

    this.aS.switchOn($event);
  }

  search($event : { albums : [], reload :  boolean }) {

    const { albums, reload } = $event;

    if( reload ){
      this.aS.paginate(0, this.aS.paginateNumberPage()).subscribe(
          albums => this.albums = albums
      );

      return;
    }

    this.albums = $event.albums;
  }

  // mise à jour de la pagination
  paginate($event) {
    this.aS.paginate($event.start, $event.end).subscribe(
      result=> {this.albums = result;}
    );
  }
}
