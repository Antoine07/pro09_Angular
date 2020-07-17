import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { Album } from '../album';
import { AlbumService } from '../album.service';
import { map, switchMap, merge, take } from 'rxjs/operators';
import { allowedNodeEnvironmentFlags } from 'process';


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
        this.reset();
        this.title = album.title; // le titre de l'album

        // on retourne la liste des chansons
        return this.aS.getAlbumList(album.id).pipe(
          map(listAlbum => {

            console.log(listAlbum);

            if (listAlbum && listAlbum.length > 0) {

              this.listSongs = [ ...listAlbum ]; // créez un nouveau tableau qui ne sera lié à une autre instance de ce tableau

              this.songName = this.listSongs.shift(); // première chanson

              this.ratio = (Math.floor((1 * 60 * 2 / album.duration) * 100) / 100) * 100;
            }

            return album;
          })
        )
      }),
      // 2 pipeline ordre des pipes
      // le propre du switchMap c'est de renvoyer un Observable sans effet de bord
      switchMap(album => {

        // nombre de chanson
        this.songs = album.duration / this.songTime;
        this.showplayer = true;

        return interval$.pipe(
          map(minutes => minutes + 2), // deuxième morceau
          map(minutes => {

            if (this.listSongs[this.counter]) {
              this.songName = this.listSongs[this.counter]; // attention on a fait un shift c'est le deuxième la première fois
              this.counter++;

              // calcul du ratio du nombre de morceaux
              // on multiplie par 100 pour avoir 2 chiffres après la virgule
              return Math.floor((minutes * 60 * 2 / album.duration) * 100) / 100;
            }

            // calcul du ratio du nombre de morceaux
            // on multiplie par 100 pour avoir 2 chiffres après la virgule
            return 0;
          }),
          take(this.songs) // c'est décalé par rapport au shift
        )
      })
    );

    // On s'ouscrit à l'observable
    player$.subscribe(ratio => {
      this.ratio = ratio * 100;

      if (this.ratio === 0) this.reset();
    });
  }

  reset() {
    this.counter = 0;
    this.showplayer = false;
    this.ratio = 0;
  }

}