import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Album, List } from '../album';

import { ALBUM_LISTS } from '../mock-albums';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AlbumService } from '../album.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss'],
  animations: [
    trigger('details', [
      state('open', style({
        backgroundColor : 'yellow'
      })),
      state('opening', style({
        backgroundColor : 'red',
      })),
      transition('opening => open', [
        animate('1s')
      ]),
    ]),
  ],
})

export class AlbumDetailsComponent implements OnInit {

  @Input() album:  Album; 
  @Output() onPlay: EventEmitter<Album> = new EventEmitter();

  albumLists: List[] = ALBUM_LISTS; // récupération de la liste des chasons
  songs: Array<string> = [];
  isOpen : boolean = false;

  constructor(private aS:AlbumService) { }

  ngOnInit() {}

  // dès que quelque chose "rentre" dans le component enfant via une propriété Input
  // ou à l'initialisation du component (une fois) cette méthode est appelée
  ngOnChanges() {
    // on vérifie que l'on a bien cliqué sur un album avant de rechercher dans la liste
    // des chansons.
    if(this.album){
      // récupération de la liste des chansons

      this.aS.getAlbumList(this.album.id).subscribe(
        list =>  { this.songs = list || [] ; console.log(this.songs, this.album.id, this.album.duration) }
      )
      
      // const id = this.album.id ;
      // const al = this.albumLists.find(elem => elem.id === id) ;
      // if(al) this.songs =  al.list;
      
      // animation 
      this.isOpen = false;
      const animate = setInterval( () => {
        this.isOpen = ! this.isOpen;
        clearInterval(animate);
      }
        , 10);
    }

  }

  play(album: Album) {
    this.onPlay.emit(album); // émettre un album vers le parent
  }

}