import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeploySummaryComponent } from '../deploy-list/deploy-summary/deploy-summary.component';
import { Deploy } from '../models/deploy.model';
import { Notice } from '../models/notice.model';
import { Schedule } from '../models/schedule.model';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';
import { SearchScheduleComponent } from '../schedule/search-schedule/search-schedule.component';
import { BoardService } from '../services/board.service';
import { DeployService } from '../services/deploy.service';
import { JwtService } from '../services/jwt.service';
import { ScheduleService } from '../services/schedule.service';
import { TeamService } from '../services/team.service';
import { TodayDetailComponent } from './today-detail/today-detail.component';


@Component({
  selector: 'vex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loginUser : User;
  check : string;

  userList : User[];
  scheduleList : Schedule[];
  teamList : Team[];
  teamUser : User[];
  notices:Notice[];
  teamControl;
  dataSource;
  
  deploys:Deploy[];
  searchCategory : string;
  keyword : string;
  deployTeamList : Team[];
  deployTeamControl;
  entirety = new Team();
  userTeam = new Team();
  selectedTeam = new Team();
  deploysLength : number;

  constructor(
    private jwtService : JwtService,
    private scheduleService : ScheduleService,
    private teamService : TeamService,
    private boardService : BoardService,
    private dialog : MatDialog,
    private deployService:DeployService,
    private deployDialog : MatDialog
  ) { }

  ngOnInit(): void {
    this.check = localStorage.getItem("AUTH_TOKEN");

    if(this.check !=null){
      this.loginUser = this.jwtService.decodeToUser(this.check);
    }
    
    ///schedule
    this.scheduleService.selectTodayCount().subscribe(res => {//같은 팀 유저 리스트
      this.userList = res.data;
      this.teamUser = res.data.filter((user) => user.team == this.loginUser.team);
    });

    ///board
    this.teamService.selectTeamList().subscribe(res => {
      this.teamList = res.data.team;  
      this.deployTeamList = JSON.parse(JSON.stringify(this.teamList));
      this.entirety.codeName = "전체";
      this.deployTeamList.unshift(this.entirety);
    });

    this.teamControl = new FormControl(this.loginUser.team);
    this.deployTeamControl = new FormControl(this.loginUser.team);

    this.boardService.selectDashboardNotice()
    .subscribe(res=>{
      this.notices=res.data;
      this.dataSource=this.notices;
    })
    
    this.userTeam.codeName = this.loginUser.team;

    ///deploy
    this.deployService.selectTeamDeployList(this.userTeam.codeName)
    .subscribe(
      res => { this.deploys = res.data.deploys;
                this.deploysLength = this.deploys.length;},
      err => { 
      if(err.status==504) {
        alert("서버를 켜주세요. e : " + err.statusText);
      }}
    )

    localStorage.removeItem("NOTICE_PAGE");
    localStorage.removeItem("NOTICE_ITEM_PAGE");
    localStorage.removeItem("NOTICE_TYPE");
    localStorage.removeItem("NOTICE_WORD");
    localStorage.removeItem("NOTICE_TEAM");
  }

  changeTeam(){//선택한 팀 유저리스트
    this.teamUser = this.userList.filter((user) => user.team == this.teamControl.value);
  }

  todayDetail(user, complete){
    this.dialog.open(TodayDetailComponent, {
      width : '500px',
      data : {user : user, complete : complete},
      autoFocus : false
    });
  }

  changeDeployTeam(codeName:string) {
    this.selectedTeam.codeName = codeName;

    this.deployService.selectTeamDeployList(this.selectedTeam.codeName)
    .subscribe(
      res => { this.deploys = res.data.deploys;
               this.deploysLength = this.deploys.length;},
      err => { console.log(err.error);}
    )
  }

  showDeployDialog(deployNo : number) {
    const deployDialogRef = this.deployDialog.open(DeploySummaryComponent, {
      width : '1000px',
      data : {
        deployNo : deployNo
      }
    })

  }

}
