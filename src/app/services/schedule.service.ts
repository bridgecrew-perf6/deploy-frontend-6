import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Schedule } from '../models/schedule.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ScheduleService{

  private url = '/api/schedule';

  constructor(private http : HttpClient) { }

  insertSchedule(schedule : Schedule){
    return this.http.post<any>(this.url, schedule);
  }

  selectScheduleList(){
    return this.http.get<any>(this.url);
  }

  updateSchedule(schedule : Schedule){
    return this.http.patch<any>(this.url, schedule);
  }

  deleteSchedule(scheduleNo : number, updateReason : string){
    if(updateReason == ''){
      return this.http.delete<any>(this.url+"/"+scheduleNo);
    }else{
      const schedule = new Schedule();
      schedule.scheduleNo = scheduleNo;
      schedule.updateReason = updateReason;
      return this.http.post<any>(this.url+"/deleteReason", schedule);
    }
  }

  selectHistoryList(scheduleNo : number){
    return this.http.get<any>(this.url+"/history/"+scheduleNo);
  }

  selectTodayCount(){//오늘의 일정 개개인 개수
    return this.http.get<any>(this.url+"/today");
  }

  selectTodayList(schedule : Schedule){//오늘의 일정 개인의 상세 리스트. id, 진행/완료/초과
    return this.http.post<any>(this.url+"/todayList", schedule);
  }
}
