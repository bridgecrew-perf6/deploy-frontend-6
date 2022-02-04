import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultPathList } from '../models/default-path-list.model';
import { DefaultPath } from '../models/default-path.model';


@Injectable({
  providedIn: 'root'
})
export class DefaultPathService {

  private defaultPathUrl = '/api/defaultPath';
  private defaultPathListUrl ='/api/defaultPath/list'

  constructor(private http : HttpClient) { }

  insertDefaultPath(defaultPathList: DefaultPathList){
    return this.http.post<any>(this.defaultPathUrl, defaultPathList);
  }

  selectDefaultpath(){
    return this.http.get<any>(this.defaultPathListUrl);
  }


}
