import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Schedule } from '../../models/schedule.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {//date picker 보이는 날짜 format
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-insert-schedule',
  templateUrl: './insert-schedule.component.html',
  styleUrls: ['../schedule.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class InsertScheduleComponent implements OnInit{

  form : FormGroup;

  schedule : Schedule = new Schedule();

  constructor(
    private dialogRef : MatDialogRef<InsertScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Schedule,
    private pipe: DatePipe,
    private builder: FormBuilder) { }
  
  ngOnInit(): void {//날짜, 시간, 종일 input 값 세팅

    if(this.data.allDay){//월에서 선택

      const endDate = new Date(this.pipe.transform(this.data.endDate, 'yyyy-MM-dd'));
      endDate.setDate(endDate.getDate() - 1);

      this.form = this.builder.group({
        startDate : [this.pipe.transform(this.data.startDate, 'yyyy-MM-dd'), [Validators.required]],
        startTime : [{value:'', disabled:this.data.allDay}],
        endDate : [this.pipe.transform(endDate, 'yyyy-MM-dd'), [Validators.required]],
        endTime : [{value:'', disabled:this.data.allDay}],
        allDay : [this.data.allDay],
        scheduleTitle : ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]],
        scheduleContent : ['', [Validators.maxLength(500)]]
      });

    }else{//주, 일에서 선택

      this.form = this.builder.group({
        startDate : [this.pipe.transform(this.data.startDate, 'yyyy-MM-dd'), [Validators.required]],
        startTime : [this.pipe.transform(this.data.startDate, 'HH:mm')],
        endDate : [this.pipe.transform(this.data.endDate, 'yyyy-MM-dd'), [Validators.required]],
        endTime : [this.pipe.transform(this.data.endDate, 'HH:mm')],
        allDay : [this.data.allDay],
        scheduleTitle : ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]],
        scheduleContent : ['', [Validators.maxLength(500)]]
      });
      
    }
  }

  onSubmit(startDate, startTime, endDate, endTime, allDay, scheduleTitle, scheduleContent){//여기 있는 값 리턴. required 값 적었는지 확인해줘야함
    //제목, 시작, 종료 확인
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
    this.schedule = this.form.value;
    this.schedule.startDate = this.pipe.transform(this.form.value.startDate, 'yyyy-MM-dd');
    this.schedule.endDate = this.pipe.transform(this.form.value.endDate, 'yyyy-MM-dd');
    this.dialogRef.close(this.schedule);
  }


  disable(){
    const isDisabled = this.form.value.allDay;//= this.form.get('allDay').value
    if(!isDisabled){
      this.form.get('startTime').disable();
      this.form.get('endTime').disable();
      this.form.get('startTime').setValue('');
      this.form.get('endTime').setValue('');
    }else{
      this.form.get('startTime').enable();
      this.form.get('endTime').enable();
    }
  }

  dateCheck(){//날짜 유효성 검사
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
}
