import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpRequest, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private userUrl = '/api/file';

  constructor(private http: HttpClient) { }

  file:File;
  
  upload(files: File[]) {
    const formData: FormData = new FormData();

    for(let i = 0; i< files.length ; i++){
      this.file=files[i];
      for(let j in this.file ){
        formData.append('files', this.file[j]);
      }
    }

    return this.http.post<any>(this.userUrl+"/multi/upload",formData);
   
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.userUrl}/files`);
  }


}
