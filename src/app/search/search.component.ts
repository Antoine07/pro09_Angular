import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms'; // template-driven
import { AlbumService } from '../album.service';
import { Album } from '../album';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Output() searchAlbums: EventEmitter<{ albums: Album[], reload: boolean }> = new EventEmitter(); // émission des données vers le parent

  constructor(private aS: AlbumService) { }

  ngOnInit() { }

  // $event dans le template
  onChangeEmit($word: string): void {
    if ($word.length === 0) {
      this.searchAlbums.emit({
        albums: [],
        reload: true
      });

      return;
    }

    // le cas où on doit faire une recherche
    this.aS.search($word).subscribe(albums => {

      if ( albums )
        this.searchAlbums.emit({
          albums: albums,
          reload: false
        });
    });
  }

}