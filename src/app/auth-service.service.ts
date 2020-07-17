import { Injectable } from '@angular/core';
import {firebaseConfig} from '../environments/environment'
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
// import 'firebase/auth';



@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private _authState: boolean = false;

  constructor(private router: Router) {
    firebase.auth().onAuthStateChanged( user => {
      this.authState = user ? true : false;
    });
  }

  auth(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  set authState(status:boolean){
    this._authState = status;
  }

  get authState(): boolean{
    return this._authState;
  }

  logout(){
    return firebase.auth().signOut().then(()=>{this.router.navigate(['/login'])});
  }

  currentUserObservable(){ return firebase.auth() ;}

  
}
