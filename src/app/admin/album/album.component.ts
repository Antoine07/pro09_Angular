import { Component, OnInit } from '@angular/core';
import { AlbumService } from 'src/app/album.service';
import { Album } from '../../album';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})


export class AlbumComponent implements OnInit {

  albums;
  message : string = null ;

  constructor(private aS:AlbumService) {}

  ngOnInit(): void {
    this.albums = this.aS.paginate(0,this.aS.paginateNumberPage());

    this.message = "";
  }

  paginate($event) {
    this.albums = this.aS.paginate($event.start, $event.end);
  }

  delete(album : Album){

    this.aS.deleteAlbum(album).subscribe( info => {
      this.aS.sendCurrentNumberPage.next( 1 ); // recalculer le nombre d'item dans la pagination
      this.message = `L'album ${info.album.name} a bien été supprimé`;
      this.albums = this.aS.paginate(0,this.aS.paginateNumberPage()); // reload les albums après suppression
    });
    
  }
}
