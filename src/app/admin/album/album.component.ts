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
  }

  paginate($event) {
    this.albums = this.aS.paginate($event.start, $event.end);
  }

  edit(id){
    console.log(id);

  }
  delete(album : Album){

    console.log(album)
   
    this.aS.deleteAlbum(album).subscribe( message => {

      this.message = message;
      this.albums = this.aS.paginate(0,this.aS.paginateNumberPage());
    });
    
  }
}
