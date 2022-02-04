import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  check:string;

  constructor(private router:Router) { }

  canActivate(){

    this.check=localStorage.getItem("AUTH_TOKEN");
    if(this.check != null){
      return true;
    }else{
      this.router.navigate(['login']);
        return false;
      
    }


  }

}
