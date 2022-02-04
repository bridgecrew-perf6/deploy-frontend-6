import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MY_FORMATS } from '../insert-schedule/insert-schedule.component';
import { Schedule } from '../../models/schedule.model';
import { ScheduleService } from 'src/app/services/schedule.service';
import { ScheduleHistory } from 'src/app/models/schedule-history.model';

@Component({
  selector: 'app-update-schedule',
  templateUrl: './update-schedule.component.html',
  styleUrls: ['../schedule.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class UpdateScheduleComponent implements OnInit {

  form : FormGroup;

  schedule : Schedule = new Schedule();

  history : ScheduleHistory[];
  historyLength;

  constructor(
    private dialogRef : MatDialogRef<UpdateScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private pipe: DatePipe,
    private builder: FormBuilder,
    private service : ScheduleService
  ) { }

  ngOnInit(): void {
    this.service.selectHistoryList(this.data.scheduleNo).subscribe(res => {
      this.history = res.data;
      this.historyLength = this.history.length;
    });

    if(this.data.allDay){//종일

      const endDate = new Date(this.pipe.transform(this.data.endDate, 'yyyy-MM-dd'));
      endDate.setDate(endDate.getDate() - 1);

      this.form = this.builder.group({
        scheduleNo : [this.data.scheduleNo],
        startDate : [{value : this.pipe.transform(this.data.startDate, 'yyyy-MM-dd'), disabled : this.data.complete == 'Y'}, [Validators.required]],
        startTime : [{value : '', disabled : this.data.allDay || this.data.complete == 'Y'}],
        endDate : [{value : this.pipe.transform(endDate, 'yyyy-MM-dd'), disabled : this.data.complete == 'Y'}, [Validators.required]],
        endTime : [{value : '', disabled : this.data.allDay || this.data.complete == 'Y'}],
        allDay : [{value : this.data.allDay,  disabled : this.data.complete == 'Y' || this.data.disable}],
        scheduleTitle : [{value : this.data.scheduleTitle, disabled : this.data.complete == 'Y'}, [Validators.required, Validators.maxLength(100), Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]],
        scheduleContent : [{value : this.data.scheduleContent, disabled : this.data.complete == 'Y'}, [Validators.maxLength(500)]],
        updateReason : ['', [Validators.maxLength(500)]]
      });

    }else{//시간

      this.form = this.builder.group({
        scheduleNo : [this.data.scheduleNo],
        startDate : [{value : this.pipe.transform(this.data.startDate, 'yyyy-MM-dd'), disabled : this.data.complete == 'Y'}, [Validators.required]],
        startTime : [{value : this.pipe.transform(this.data.startDate, 'HH:mm'), disabled : this.data.allDay || this.data.complete == 'Y'}],
        endDate : [{value : this.pipe.transform(this.data.endDate, 'yyyy-MM-dd'), disabled : this.data.complete == 'Y'}, [Validators.required]],
        endTime : [{value : this.pipe.transform(this.data.endDate, 'HH:mm'), disabled : this.data.allDay || this.data.complete == 'Y'}],
        allDay : [{value : this.data.allDay,  disabled : this.data.complete == 'Y' || this.data.disable}],
        scheduleTitle : [{value : this.data.scheduleTitle, disabled : this.data.complete == 'Y'}, [Validators.required, Validators.maxLength(100), Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]],
        scheduleContent : [{value : this.data.scheduleContent, disabled : this.data.complete == 'Y'}, [Validators.maxLength(500)]],
        updateReason : ['', [Validators.maxLength(500)]]
      });

    }
  }

  onDelete(){
    if(confirm("해당 일정을 삭제하시겠습니까? 삭제 후에는 복구가 불가능합니다.")){
      const deleteReason = {delete : 'delete', reason : this.form.value.updateReason};
      this.dialogRef.close(deleteReason);
    }
  }

  onUpdate(type, startDate, startTime, endDate, endTime, allDay, scheduleTitle, scheduleContent, updateReason){

    this.form.markAllAsTouched();//에러 한번에 다 뜨게

    if(startDate.value == ''){
      startDate.focus();
      return false;
    }else if(endDate.value == ''){
      endDate.focus();
      return false;
    }else if(this.form.controls.scheduleTitle.errors != null){
      scheduleTitle.focus();
      return false;
    }

    if(allDay.checked){//종일이면
      if(endDate.value < startDate.value){
        endDate.focus();
        return false;
      }
    }else{//종일 체크 안 돼있을 경우 - 시간 둘 다 입력
      if(startTime.value == ''){
        startTime.focus();
        return false;
      }else if(endTime.value == ''){
        endTime.focus();
        return false;
      }else if(endDate.value+" "+endTime.value <= startDate.value+" "+startTime.value){//날짜 시간 같으면 안됨, 뒷날짜가 뒤여야함
        return false;
      }
    }

    if(type == 'update'){//수정 버튼

      if(confirm("해당 일정을 수정하시겠습니까?")){
        this.schedule = this.form.value;
        this.schedule.startDate = this.pipe.transform(this.form.value.startDate, 'yyyy-MM-dd');
        this.schedule.endDate = this.pipe.transform(this.form.value.endDate, 'yyyy-MM-dd');
        this.schedule.updateDate = this.pipe.transform(new Date(), 'yyyy-MM-dd');
        
        const data = {type : 'update', schedule : this.schedule};
        this.dialogRef.close(data);
      }

    }else if(type == 'complete'){//완료 버튼

      if(confirm("완료 후에는 수정 및 삭제가 불가능합니다. 계속하시겠습니까?")){
        this.schedule = this.form.value;
        this.schedule.startDate = this.pipe.transform(this.form.value.startDate, 'yyyy-MM-dd');
        this.schedule.endDate = this.pipe.transform(this.form.value.endDate, 'yyyy-MM-dd');
        this.schedule.complete = 'Y';
        this.schedule.completeDate = this.pipe.transform(new Date(), 'yyyy-MM-dd HH:mm');

        const data = {type : 'complete', schedule : this.schedule};
        this.dialogRef.close(data);
      }

    }

  }

  disable(){
    const isDisabled = this.form.value.allDay;//= this.form.get('allDay').value
    if(!isDisabled){
      this.form.get('startTime').disable();
      this.form.get('endTime').disable();
    }else{
      this.form.get('startTime').enable();
      this.form.get('endTime').enable();
    }
  }

  dateCheck(){
    this.form.markAllAsTouched();
    const allDay = this.form.value.allDay;
    const startDate = this.pipe.transform(this.form.value.startDate, 'yyyy-MM-dd') + " " + this.form.value.startTime;
    const endDate = this.pipe.transform(this.form.value.endDate, 'yyyy-MM-dd') + " " + this.form.value.endTime;

    if(!allDay && startDate >= endDate){
      if(this.form.value.startTime == '' || this.form.value.endTime == ''){
        this.form.get('startTime').setValidators(Validators.required);
        this.form.get('startTime').updateValueAndValidity();
        this.form.get('endTime').setValidators(Validators.required);
        this.form.get('endTime').updateValueAndValidity();
      }else{
        this.form.controls.endDate.setErrors({dateError : true});
      }
    }else{
      this.form.controls.endDate.setErrors({dateError : null});
      this.form.controls.endDate.updateValueAndValidity({emitEvent : false});
    }
  }

  toggle = false;

  viewHistory(){//수정 내역 창 띄워주기
    this.toggle = !this.toggle;
  }
}
