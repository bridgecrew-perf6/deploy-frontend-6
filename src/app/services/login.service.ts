import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loginUser:User = new User();
  
  constructor(private http:HttpClient) { }

  private userUrl = '/api/user';

  public login(user){
    return this.http.post<any>(this.userUrl+"/session",user);
  }

  public logout(id){
    return this.http.patch<any>(this.userUrl+"/session?id="+id,id);
  }
}
