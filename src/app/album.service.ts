import { Injectable } from '@angular/core';

import { Album, List } from './album';
import { ALBUM_LISTS } from './mock-albums';
import { environment, albumsUrl, albumListsUrl, albumCountUrl, httpOptions } from '../environments/environment';
import { Subject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
  getAlbumList(id: string): Observable<Array<string>> {
    return this.http.get<Array<string>>(albumListsUrl + `/${id}/list/.json`).pipe(
      map(list => list) 
    );
  }

  count(start: number, end: number): Observable<number> {
    return this.http.get<Album[]>(albumsUrl + `/.json`).pipe(
      map(albums => _.values(albums)),
      map(albums => { return albums ? albums.length : 0; })
    );

  }

  paginate(start: number, end: number): Observable<Album[]> {

    return this.http.get<Album[]>(albumsUrl + `/.json`).pipe(
      map(albums => _.values(albums)),
      map(album => { return album.sort((a, b) => { return b.duration - a.duration }).slice(start, end); }),
    );

    // utilisez la méthode slice pour la pagination
    // return this._albums.sort(
    //   (a, b) => { return b.duration - a.duration }
    // ).slice(start, end);
  }

  search(word: string): Observable<Album[]> {

    return this.http.get<Album[]>(albumsUrl + '/.json', httpOptions).pipe(
      map(albums => _.values(albums)),
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

  incrementCount(): Observable<any> {

    // récupérer d'abord le nombre d'album et mettre à jour le nombre d'album
    return this.http.get<any>(`${albumCountUrl}/.json`).pipe(
      switchMap(count => this.http.put<void>(`${albumCountUrl}/.json`, count + 1))
    );
  }

  decrementCount(): Observable<any> {

    // récupérer d'abord le nombre d'album et mettre à jour le nombre d'album
    return this.http.get<any>(`${albumCountUrl}/.json`).pipe(
      switchMap(count => this.http.put<void>(`${albumCountUrl}/.json`, count - 1))
    );
  }

  addAlbum(album: Album): Observable<void> {
   
    return this.http.post<Album>(`${albumsUrl}/.json`, album).pipe(
      switchMap( ref => {

        return this.incrementCount().pipe(
          map( () => {

            return ref;
          })
        )
      }),
      // à refactorer on a peut etre pas besoin de l'id dans l'album
      switchMap( ref => {
        
        album.id = ref.name;

        return this.updateAlbum(ref.name, album); // optionnel pour mettre à jour l'id de l'album dans un ablum 
      })
    );
  }

  updateAlbum( id : string , album : Album ): Observable<void>{

    return this.http.put<void>(`${albumsUrl}/${id}/.json`, album);
  }

  deleteAlbum(album : Album): Observable<string>{

    const { id } = album;

    return this.http.delete<void>(`${albumsUrl}/${parseInt(id)}/.json`).pipe(
      switchMap( () => {

        return this.decrementCount().pipe(
          map( () => {

            return album
          })
        )
      }),
      map( album => `votre album ${album.name} a bien été supprimé`)
    )
  }

}