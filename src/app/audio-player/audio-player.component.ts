import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../album.service';
import { map, switchMap, takeUntil, take } from 'rxjs/operators';
import { interval } from 'rxjs';
import { Album } from '../album';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {

  ratio: number = 0
  counter: number = 0; // compte le nombre de morceaux

  songs: number = 0; // nombre de chansons
  songTime: number = 120; // chanson dure toute 2 minutes on compte en paquet de 120 secondes == 2 minutes

  showplayer: boolean = false; // afficher le player

  album: Album;
  title: string; // le titre de l'album

  listSongs: string[] = []; // la liste des chansons

  songName: string;

  // le service doit s'injecter dans le composant et être privé
  constructor(private aS: AlbumService) { }

  ngOnInit() {

    // timer Observable qui envoit un entier toutes les minutes on met 10 au lieu de 1000 pour aller plus vide
    // dans l'affichage

    // Un morceau dure 2 minutes donc toutes les deux minutes on incrémente notre compteur
    const interval$ = interval(10 * 60 * 2); // 0, 1, 2, ...

    // subjectAlbum est un Subject donc réversible : Observale/Observer
    // ici on le considère comme Observable il reçoit la données pour en faire quelque chose une fois que l'on a souscrit
    // 1. On fait les pipes pour traiter l'information
    // 2. On souscrit pour récupérer la données
    const player$ = this.aS.subjectAlbum.pipe(

      switchMap(album => {

        this.title = album.title;

        return this.aS.getAlbumList(album.id).pipe(
          map(albumList => {
            const { list } = albumList

            this.songs = list.length; // nombre de chansons

            // on récupère la liste des chansons
            this.listSongs = list || [];
            return album
          })
        )
      }
      ),
      // 2 pipeline ordre des pipes
      // le propre du switchMap c'est de renvoyer un Observable sans effet de bord
      switchMap(album => {

        // nombre de chanson
        this.songs = album.duration / this.songTime;
        this.showplayer = true;

        return interval$.pipe(
          map(minutes => minutes + 1),
          map(minutes => {
            console.log('list chanson')
            console.log(this.counter, this.listSongs[this.counter]);
            this.songName = this.listSongs[this.counter];
            this.counter++;

            // calcul du ratio du nombre de morceaux
            // on multiplie par 100 pour avoir 2 chiffres après la virgule
            return Math.floor((minutes * 60 * 2 / album.duration) * 100) / 100;

          }),
          take(this.songs)
        )
      })
    );

    // On s'ouscrit à l'observable
    player$.subscribe(ratio => {
      this.ratio = ratio * 100;

      if (this.songs === this.counter) this.reset();

    });
  }

  reset() {
    this.counter = 0;
    this.showplayer = false;
    this.ratio = 0;
  }

}