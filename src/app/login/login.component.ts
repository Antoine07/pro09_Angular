import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AuthServiceService} from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  message: string = "";
  constructor( private authS:AuthServiceService,private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm): void {
    let email = form.value.email;
    let password = form.value.password;
    let connect = this.authS.auth(email,password);
    connect
    .then((result)=>{
      console.log(result);
      this.authS.authState;
      console.log(this.authS.authState);
      
      this.router.navigate(['/admin']);
    })
    .catch((error)=>{this.message = error.message})
  }
}
