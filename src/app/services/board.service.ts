import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BoardFile } from '../models/boardfile.model';
import { Notice } from '../models/notice.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private userUrl = '/api/board';
  
  constructor(private http: HttpClient) { }

  upload(fileList:BoardFile){
    return this.http.post<any>(this.userUrl,fileList);
  }

  selectNotice(){
    return this.http.get<any>(this.userUrl);
  }

  selectNoticeDetail(boardNo){
    return this.http.get<any>(this.userUrl+"/"+boardNo)
  }

  deleteNotice(boardNo){
    return this.http.delete<any>(this.userUrl+"/"+boardNo);
  }
  updateNotice(fileList:BoardFile,boardNo){
    return this.http.patch<any>(this.userUrl+"/"+boardNo,fileList);
  }
  searchNotice(team,type,word){
    return this.http.get<any>(this.userUrl+"/search?team="+team+"&type="+type+"&word="+word);
  }
  selectTeamNotice(team){
    return this.http.get<any>(this.userUrl+"/team?codeName="+team);
  }
  selectDashboardNotice(){
    return this.http.get<any>(this.userUrl+"/dashboard");
  }
}
