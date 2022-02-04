import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from './user.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserExcelService {

  constructor(private http:HttpClient) {}

  private userUrl = 'http://localhost:8080/api';

  public getUsers() {
     return this.http.get<User[]>(this.userUrl);
  }
}
