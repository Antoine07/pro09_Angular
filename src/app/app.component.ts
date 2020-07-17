import { Component } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map  } from 'rxjs/operators';
import { Timer } from './album';
import {AuthServiceService} from '../app/auth-service.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app-music';
  timer : Timer;
  authStatus:boolean = false;

  constructor(public authService:AuthServiceService) {

    this.authStatus = this.authService.authState;
    //console.log(this.authStatus);
    // classiquement pour consommer les données de l'observable :
    this.getTimer().subscribe(timer => this.timer = timer);

    // avec le pipe async on souscrira dans le template pour consommer les données timer | async
    // Attention au niveau du type this.timer ici est un observable Observable<Timer>
    //this.timer = this.getTimer();
  }

  getTimer(): Observable<Timer> {

    const count$ = interval(1000);

    return count$.pipe(

      map(second => {

        // padStart : longueur de la chaîne et caractère pour compléter : 08, 09, 10 ...
        return {
          hour: String( Math.floor(second / 3600 ) % 3600).padStart(2, '0'),
          minute: String( Math.floor(second / 60) % 60 ).padStart(2, '0'),
          second: String(second % 60).padStart(2, '0')
        }
      })
    );
  }

  logout(){
    this.authService.logout();
  }

}
