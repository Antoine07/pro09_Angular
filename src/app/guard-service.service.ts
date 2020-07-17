import { Injectable } from '@angular/core';
import { firebaseConfig } from '../environments/environment';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthServiceService } from '../app/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class GuardServiceService implements CanActivate {

  constructor(private aS: AuthServiceService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any | boolean {

    if (this.aS.authState) return true;

    return this.aS.currentUserObservable().onAuthStateChanged(
      user => {
        if (user === null) {
          this.router.navigate(['/login'], {
            queryParams: { messageError: 'Error authentification' }
          });
        }
      }
    );
  }
};
