import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Schedule } from 'src/app/models/schedule.model';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'vex-today-detail',
  templateUrl: './today-detail.component.html',
  styleUrls: ['./today-detail.component.scss']
})
export class TodayDetailComponent implements OnInit {
  scheduleList : Schedule[];//클릭한 사람의 오늘의 일정 리스트

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private service : ScheduleService
  ) { }

  ngOnInit(): void {
    const schedule = new Schedule();
    schedule.writer = this.data.user.id;
    schedule.complete = this.data.complete;
    
    this.service.selectTodayList(schedule).subscribe(res => {
      this.scheduleList = res.data;
    });
  }

}
