import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular';
import { EventApi, EventInput } from '@fullcalendar/core';
import enLocale from '@fullcalendar/core/locales/en-au';
import koLocale from '@fullcalendar/core/locales/ko';
import { InsertScheduleComponent } from './insert-schedule/insert-schedule.component';
import { User } from '../models/user.model';
import { JwtService } from '../services/jwt.service';
import { ScheduleService } from '../services/schedule.service';
import { UpdateScheduleComponent } from './update-schedule/update-schedule.component';
import { TeamService } from '../services/team.service';
import { Team } from '../models/team.model';
import { SearchScheduleComponent } from './search-schedule/search-schedule.component';
import { UserService } from '../services/user.service';
import icChevronLeft from '@iconify/icons-ic/twotone-chevron-left';
import icChevronRight from '@iconify/icons-ic/twotone-chevron-right';
import { dropdownAnimation } from 'src/@vex/animations/dropdown.animation';
import { ActivatedRoute, Router } from '@angular/router';
import { Schedule } from '../models/schedule.model';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  animations: [dropdownAnimation]
})
export class ScheduleComponent implements OnInit {
  @ViewChild('calendar') calendar : FullCalendarComponent;//#calendar여서
  @ViewChild('teamButton') teamButton : ElementRef;
  @ViewChild('teamDiv') teamDiv : ElementRef;

  //로그인 회원 아이디 정보
  loginUser : User;
  check : string;
  //팀 정보
  teamList : Team[];
  colorArray = ['pink', 'orange', 'yellowgreen', 'purple', 'navy', 'teal', 'violet', 'lightgreen', 'brown', 'black', 'red', 'cyan'];
  userList : User[];

  viewDate;
  icChevronLeft = icChevronLeft;
  icChevronRight = icChevronRight;

  toggle = false;

  events : EventInput[] = [];

  //대시보드 라우터 param
  id;
  complete;
  dash;
  main;

  constructor(
    private dialog : MatDialog,
    private service : ScheduleService,
    private pipe: DatePipe,
    private jwtService : JwtService,
    private teamService : TeamService,
    private userService : UserService,
    private route : ActivatedRoute,
    private router : Router,
    private renderer: Renderer2
  ) {
    //teamList.length를 못 가져오는 경우가 있어서 생성자에서 생성
    this.teamService.selectTeamList().subscribe(res => {
      this.teamList = res.data.team;
    });
  }

  calendarOptions : CalendarOptions = {
    locales:[enLocale, koLocale],
    locale: 'ko',
    displayEventTime: false,
    headerToolbar: false,
    initialView: 
    localStorage.getItem("calendarView") !== null ? localStorage.getItem("calendarView") : "dayGridMonth",//마지막으로 저장된 view
    datesSet: function(info){//view 바뀌면 local storage에 저장
      localStorage.setItem("calendarView", info.view.type);
    },
    weekends: true,
    fixedWeekCount: false,
    editable: true,
    eventDurationEditable: true,
    eventStartEditable: true,
    eventResizableFromStart: true,
    selectable: true,
    dayMaxEvents: true,
    views:{
      timeGrid:{
        dayMaxEvents : 1
      }
    },
    eventOrder: "start,-duration,allDay,title",
    eventOrderStrict: true,
    nowIndicator: true,
    slotMinTime: "09:00:00",
    slotMaxTime: "19:00:00",
    expandRows: true,
    scrollTime: this.pipe.transform(new Date(), 'hh:MM:ss'),
    eventChange: this.handleEventChange.bind(this),
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventMouseEnter: function (info) {
      info.el.style.cursor = 'pointer';
    },
    height: 'calc(100vh - 225px)'
  };

  ngOnInit() {
    localStorage.removeItem("NOTICE_PAGE");
    localStorage.removeItem("NOTICE_ITEM_PAGE");
    localStorage.removeItem("NOTICE_TYPE");
    localStorage.removeItem("NOTICE_WORD");
    localStorage.removeItem("NOTICE_TEAM");

    this.check = localStorage.getItem("AUTH_TOKEN");

    if(this.check !=null){
      this.loginUser = this.jwtService.decodeToUser(this.check);
    }

    this.userService.selectUserList().subscribe(res => {
      this.userList = res.data;
    });

    this.route.paramMap.subscribe(params => {//dashboard에서 이동
      this.id = params.get('id');
      this.complete = params.get('complete');
      this.dash = params.get('dash');//처음 대시보드에서 이동할 때만 있음
      this.main = params.get('main');//사이드바 누르면 없음
    });

    this.service.selectScheduleList().subscribe(res => {
      res.data.forEach(element => {

        let endDate = element.endDate;

        if(element.startDate.length == 10 && element.endDate.length == 10){
          const end = new Date(element.endDate);
          end.setDate(end.getDate() + 1);
          endDate = this.pipe.transform(end, 'yyyy-MM-dd');
        }

        const edit = element.complete != 'Y' && element.writer == this.loginUser.id;//완료되지 않은 일정, 내가 작성한 일정만 이동 가능 = true
        let color;

        for (let i = 0; i < this.teamList.length; i++) {
          if(element.team == this.teamList[i].codeName){
            color = this.colorArray[i];
          }
        }

        if(element.writer == this.loginUser.id){//본인 일정 파랑색
          color = 'default';
        }
        if(element.complete == 'Y'){//완료된 일정은 회색
          color = 'grey';
        }

        this.events.push({
          id : String(element.scheduleNo),
          title : '['+element.name+'] ' + element.scheduleTitle,
          start : element.startDate,
          end : endDate,
          schedule : element,
          startEditable : edit,
          durationEditable : edit,
          color : color
        });
      });

      if(this.id == null && this.complete == null){
        let showEvent = this.events;

        //수정/삭제하고 전체, 팀, 개인 선택한거 유지하게
        if(localStorage.getItem("show") != null){
          const localShow = localStorage.getItem("show");

          if(localShow == "전체" || this.main == null){
            showEvent = this.events;

          }else if(localShow == this.loginUser.team){
            showEvent = this.events.filter((event) => event.schedule.team == localShow);

          }else if(localShow == "본인"){
            showEvent = this.events.filter((event) => event.schedule.writer == this.loginUser.id && event.schedule.complete != 'Y');

          }else{//개인별 검색
            //id 리스트 나눠주기
            const ids = localShow.split(",");

            if(ids.length == 1){//이름 하나면
              showEvent = this.events.filter((event) => event.schedule.writer == ids[0]);

            }else{
              showEvent = [];
              for (let i = 0; i < ids.length; i++) {
                const oneEvent = this.events.filter((event) => event.schedule.writer == ids[i]);
                showEvent = showEvent.concat(oneEvent);
              }
            }
          }
        }

        this.calendarOptions.events = showEvent;

        if(this.main == null){//사이드바 스케쥴 눌렀을 때
          this.calendar.getApi().changeView('dayGridMonth');
          this.viewDate = this.calendar.getApi().currentData.viewTitle;
          localStorage.setItem("show", "전체");
        }

      }else{//대시보드에서 이동
        const schedule = new Schedule();
        schedule.writer = this.id;
        schedule.complete = this.complete;
  
        this.service.selectTodayList(schedule).subscribe(res => {
          let dash = [];
          res.data.forEach(element => {
            dash = dash.concat(this.events.filter((event) => event.schedule.scheduleNo == element.scheduleNo));
          });
          this.calendarOptions.events = dash;
        });
        if(this.dash != null){//처음 대시보드에서 이동했을 때
          this.calendar.getApi().changeView('dayGridMonth');
        }
      }
    });

    setTimeout(() => this.viewDate = this.calendar.getApi().currentData.viewTitle);//ChangeDetectorRef 써도 됨. title 설정

    //팀 안내도 바깥 클릭했을 때 닫히게
    this.renderer.listen('window', 'click', (e:Event)=>{
      if(e.target !== this.teamButton.nativeElement && e.target !== this.teamDiv.nativeElement){
        this.toggle = false;
      }
    });
  }

  ngAfterViewInit(){
    //수정/삭제하고 새로고침 날짜 기억하게
    if(localStorage.getItem("initialDate") != null){
      const date = this.pipe.transform(localStorage.getItem("initialDate"), 'yyyy-MM-dd');
      this.calendar.getApi().gotoDate(date);
      localStorage.removeItem("initialDate");
    }
  }

  //이벤트 클릭시 수정, 삭제
  handleEventClick(arg) {
    this.openUpdate(arg);
  }

  //이벤트 drag, resize
  handleEventChange(arg) {
    const oldEvent = arg.oldEvent;//드래그하기 전의 날짜

    if(confirm("일정을 수정하시겠습니까?")){
      const newEvent = arg.event;//드래그한 후의 날짜
      const schedule = newEvent.extendedProps.schedule;

      if(newEvent.allDay){//종일

        schedule.startDate = this.pipe.transform(newEvent.start, 'yyyy-MM-dd');

        if(newEvent.end == null){//시간에서 종일로 옮길 때
          schedule.endDate = this.pipe.transform(newEvent.start, 'yyyy-MM-dd');
        }else{
          const end = new Date(newEvent.end);
          end.setDate(newEvent.end.getDate() - 1);
          schedule.endDate = this.pipe.transform(end, 'yyyy-MM-dd');
        }
        
      }else{//시간 있으면
        
        schedule.startDate = this.pipe.transform(newEvent.start, 'yyyy-MM-dd HH:mm');
        if(newEvent.end == null){//종일에서 시간으로 옮기면 값 null
          const end = new Date(newEvent.start);
          end.setHours(newEvent.start.getHours() + 1);
          schedule.endDate = this.pipe.transform(end, 'yyyy-MM-dd HH:mm');
        }else{
          schedule.endDate = this.pipe.transform(newEvent.end, 'yyyy-MM-dd HH:mm');
        }

      }

      this.service.updateSchedule(schedule).subscribe(res => {
        if(res.data){
          alert("일정을 수정하였습니다");
          localStorage.setItem("initialDate", schedule.startDate);
        }else{
          alert("수정에 실패하였습니다");
          localStorage.setItem("initialDate", this.pipe.transform(oldEvent.start, 'yyyy-MM-dd HH:mm'));
        }

        if(this.id == null && this.complete == null){
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/schedule/main']);
        }else{
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/schedule/'+this.id+"/"+this.complete]);
        }
      });

    }else{//수정 취소
      if(this.id == null && this.complete == null){
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/schedule/main']);
        
        localStorage.setItem("initialDate", this.pipe.transform(oldEvent.start, 'yyyy-MM-dd HH:mm'));
      }else{
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/schedule/'+this.id+"/"+this.complete]);
      }
    }
  }

  // 날짜를 클릭했을 때
  handleDateSelect(arg) {
    //모달창 띄우기
    this.openDialog(arg);
  }

  openDialog(arg) : void{//모달창 띄움
    const dialogRef = this.dialog.open(InsertScheduleComponent, {
      //open 메소드는 dialogRef를 리턴
      width : '530px',
      data : {startDate : arg.start, endDate : arg.end, allDay : arg.allDay, name : this.loginUser.name}//날짜, 시간 전해줘야됨
    });

    dialogRef.afterClosed().subscribe( result => {//onSave 메소드에서 리턴한 schedule 객체
      //const calendarApi = arg.view.calendar;
      if(result){
        result.writer = this.loginUser.id;

        if(!result.allDay){//시간 있으면 날짜, 시간 합쳐줌
          result.startDate = result.startDate+" "+result.startTime;
          result.endDate = result.endDate+" "+result.endTime;
        }

        this.service.insertSchedule(result).subscribe(res => {
          if(res.data){
            alert("일정이 등록되었습니다");
            localStorage.setItem("initialDate", result.startDate);
          }else{
            alert("등록에 실패하였습니다");
          }
          //새로고침
          if(this.id == null && this.complete == null){
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/schedule/main']);
          }else{
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/schedule/'+this.id+"/"+this.complete]);
          }
        });
      }
    });
  }

  openUpdate(arg) : void{
    //arg.event = EventApi
    const disable = this.loginUser.id != arg.event.extendedProps.schedule.writer;//로그인 유저가 일정 작성자가 아닐 경우 수정, 삭제 못 하게
    
    const dialogRef = this.dialog.open(UpdateScheduleComponent, {
      width : '530px',
      data : {
        scheduleNo : arg.event.extendedProps.schedule.scheduleNo,
        scheduleTitle : arg.event.extendedProps.schedule.scheduleTitle,
        scheduleContent : arg.event.extendedProps.schedule.scheduleContent,
        name : arg.event.extendedProps.schedule.name,
        startDate : arg.event.start,
        endDate : arg.event.end,
        allDay : arg.event.allDay,
        complete : arg.event.extendedProps.schedule.complete,
        disable : disable,
        team : arg.event.extendedProps.schedule.team
      },
      autoFocus : false
    });

    dialogRef.afterClosed().subscribe( result => {
      if(result){
        if(result.delete == 'delete'){//삭제

          this.service.deleteSchedule(arg.event.extendedProps.schedule.scheduleNo, result.reason).subscribe(res => {
            if(res.data){
              alert("일정을 삭제하였습니다");
              arg.event.remove();
            }else{
              alert("삭제에 실패하였습니다");
            }
            if(this.id == null && this.complete == null){
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate(['/schedule/main']);
              
              localStorage.setItem("initialDate", arg.event.start);
            }else{
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate(['/schedule/'+this.id+"/"+this.complete]);
            }
          });
  
        }else if(result){//수정
  
          if(!result.schedule.allDay){//시간 있으면 날짜, 시간 합쳐줌
            result.schedule.startDate = result.schedule.startDate+" "+result.schedule.startTime;
            result.schedule.endDate = result.schedule.endDate+" "+result.schedule.endTime;
          }
          
          this.service.updateSchedule(result.schedule).subscribe(res => {
            if(res.data){
              if(result.type == 'update'){
                alert("일정을 수정하였습니다");
              }else if(result.type == 'complete'){
                alert("일정을 완료하였습니다");
              }
              localStorage.setItem("initialDate", result.schedule.startDate);

            }else{
              if(result.type == 'update'){
                alert("수정에 실패하였습니다");
              }else if(result.type == 'complete'){
                alert("완료에 실패하였습니다");
              }
              localStorage.setItem("initialDate", arg.event.start);
            }

            if(this.id == null && this.complete == null){
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate(['/schedule/main']);
              
            }else{
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate(['/schedule/'+this.id+"/"+this.complete]);
            }
          });
        }
      }
    });
  }

  currentEvents: EventApi[] = [];//화면에 있는 모든 일정

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  showAll(){//전체 스케쥴 보여주기
    this.calendarOptions.events = this.events;
    
    localStorage.setItem("show", "전체");

    if(this.main == null){//대시보드
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/schedule/main']);
    }
  }

  toggleTeam(){//색상 안내도 토글
    this.toggle = !this.toggle;
  }

  showOne(){//개인별 검색
    const dialogRef = this.dialog.open(SearchScheduleComponent, {
      //팀별 유저 리스트 보내주기, 본인 정보 보내주기
      width : '400px',
      data : {
        teamList : this.teamList,
        userList : this.userList,
        loginUser : this.loginUser
      }
    });

    dialogRef.afterClosed().subscribe( result => {//id 전달
      if(result){
        if(result.length == 1){//본인꺼, 검색하는 사람이 한명일때
          const oneEvent = this.events.filter((event) => event.schedule.writer == result);
          this.calendarOptions.events = oneEvent; 

          if(result == this.loginUser.id && this.main == null){//대시보드
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/schedule/main']);
          }
        }else{
          let array = [];
          for (let i = 0; i < result.length; i++) {
            const oneEvent = this.events.filter((event) => event.schedule.writer == result[i]);
            array = array.concat(oneEvent);
          }
          this.calendarOptions.events = array;

          if(result.includes(this.loginUser.id) && this.main == null){//대시보드
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/schedule/main']);
          }
        }

        localStorage.setItem("show", result);
      }
    });
  }

  showTeam(team){//색상 안내도 눌렀을때 팀별 보여주기
    const teamEvent = this.events.filter((event) => event.schedule.team == team.codeName);
    this.calendarOptions.events = teamEvent;

    localStorage.setItem("show", team.codeName);

    if(team.codeName == this.loginUser.team && this.main == null){//대시보드
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/schedule/main']);
    }
  }

  teamColor(team, i){//색상 안내도에 팀 색 입혀주기
    team.style.backgroundColor = this.colorArray[i];
    team.style.borderRadius = "3px";
  }

  showMine(){//진행 중인 본인 일정 보이게
    const myEvent = this.events.filter((event) => event.schedule.writer == this.loginUser.id && event.schedule.complete != 'Y');
    this.calendarOptions.events = myEvent;

    localStorage.setItem("show", "본인");

    if(this.main == null){//대시보드
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/schedule/main']);
    }
  }

  showEnd(){//완료 일정 보이게
    const endEvent = this.events.filter((event) => event.schedule.complete == 'Y');
    this.calendarOptions.events = endEvent;
  }

  showMonth(){//월
    this.calendar.getApi().changeView('dayGridMonth');
    this.viewDate = this.calendar.getApi().currentData.viewTitle;
  }

  showWeek(){//주
    this.calendar.getApi().changeView('dayGridWeek');
    this.viewDate = this.calendar.getApi().currentData.viewTitle;
  }

  showDay(){//일
    this.calendar.getApi().changeView('timeGridDay');
    this.viewDate = this.calendar.getApi().currentData.viewTitle;
    this.calendar.getApi().updateSize();//스크롤 안 생기게
  }

  showPrev(){//이전
    this.calendar.getApi().prev();
    this.viewDate = this.calendar.getApi().currentData.viewTitle;
  }

  showNext(){//이후
    this.calendar.getApi().next();
    this.viewDate = this.calendar.getApi().currentData.viewTitle;
  }

  showToday(){//오늘
    this.calendar.getApi().today();
    this.viewDate = this.calendar.getApi().currentData.viewTitle;
  }

  onResized(event : ResizedEvent){//사이드메뉴 사라졌을때 width 바뀌는거
    if(event.newWidth != event.oldWidth){
      this.calendar.getApi().updateSize();
    }
  }

}

