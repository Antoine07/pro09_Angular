import { Injectable } from '@angular/core';

import { Album, List } from './album';
import { ALBUM_LISTS } from './mock-albums';
import { environment, albumsUrl, albumListsUrl, httpOptions } from '../environments/environment';
import { Subject, Observable } from 'rxjs';

// Service et classe utile
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Opérateurs de RxJS
import { map } from 'rxjs/operators';
// libraire utile pour le traitement de données
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {


  //private _albums: Album[] = ALBUMS; // _ convention private et protected
  private _albumList: List[] = ALBUM_LISTS;

  sendCurrentNumberPage = new Subject<number>();
  // Subject permettra de signifier que l'on vient de cliquer sur play au composant audio-player
  // Observable & Observer il est réversible
  subjectAlbum: Subject<Album> = new Subject<Album>();

  // permet d'arret la lecture des morceaux 
  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(private http: HttpClient) { }

  getAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(albumsUrl + '/.json', httpOptions).pipe(
      // Préparation des données avec _.values pour avoir un format exploitable dans l'application => Array de values JSON
      map(albums => _.values(albums)),
      // Ordonnez les albums par ordre de durées décroissantes
      map(albums => {
        return albums.sort(
          (a, b) => { return b.duration - a.duration }
        );
      })
    )
  }

  getAlbum(id: string): Observable<Album> {

    // URL/ID/.json pour récupérer un album
    return this.http.get<Album>(albumsUrl + `/${id}/.json`).pipe(
      map(album => album) // JSON
    );

  }

  // recherche d'une référence dans la liste
  getAlbumList(id: string): Observable<List> {
    return this.http.get<List>(albumListsUrl + `/${id}/.json`).pipe(
      map(album => album) // JSON
    );
    //return this._albumList.find(list => list.id === id);
  }

  count(start:number,end:number): Observable<number> {
    return this.http.get<Album[]>(albumsUrl + `/.json`).pipe(
      map(album => {return album ? album.length : 0;})
    );
    
  }

  paginate(start: number, end: number): Observable<Album[]> {

    return this.http.get<Album[]>(albumsUrl + `/.json`).pipe(
      map(album =>{ return album.sort((a, b) => { return b.duration - a.duration }).slice(start, end);}),
    );

    // utilisez la méthode slice pour la pagination
    // return this._albums.sort(
    //   (a, b) => { return b.duration - a.duration }
    // ).slice(start, end);
  }

  search(word: string): Observable<Album[]> {

    return this.http.get<Album[]>(albumsUrl + '/.json', httpOptions).pipe(
      map(albums => {
        if (word.length > 2) {
          let response = [];
          // lodash
          albums.forEach(album => {
            if (album.title.includes(word)) response.push(album);
          });
          return response;
        }
      }),
    );
  }

  paginateNumberPage(): number {
    if (typeof environment.numberPage == 'undefined')
      throw "Attention la pagination n'est pas définie";

    return environment.numberPage;
  }

  currentPage(numberPage: number) {
    // Observer notifie une information page ici numérique envoit le journal ...
    return this.sendCurrentNumberPage.next(numberPage);
  }

  switchOn(album: Album) {
    album.status = 'on';

    // Subject notification envoyé à l'observable
    this.subjectAlbum.next(album);
  }


}