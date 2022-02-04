import { Component, OnInit, ViewChild} from '@angular/core';
import { fadeInUp400ms } from '../../@vex/animations/fade-in-up.animation';
import { DeployService} from '../services/deploy.service';
import { stagger40ms } from '../../@vex/animations/stagger.animation';
import { Deploy } from '../models/deploy.model';
import { User } from '../models/user.model';
import { JwtService } from '../services/jwt.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import icSearch from '@iconify/icons-ic/twotone-search';
import { FormControl } from '@angular/forms';
import { ScriptView } from '../models/scriptView.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MY_FORMATS } from '../schedule/insert-schedule/insert-schedule.component';
import { ExcelService } from '../services/excel-file.service';
import { File } from '../models/file.model';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeployStateChangeComponent } from './deploy-state-change/deploy-state-change.component';
import { Router } from '@angular/router';
import { Team } from '../models/team.model';


@Component({
  selector: 'vex-deploy-list',
  templateUrl: './deploy-list.component.html',
  styleUrls: ['./deploy-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],

  //date peaker
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]  
})

export class DeployListComponent implements OnInit{

  scriptViews: ScriptView[];
  //로그인관련
  loginUser : User;
  check:string;
  deploys:Deploy[];
  deployState: string;

  //페이징처리
  p: number;//현재 페이지 정보 담기 위함
  itemsPerPage = 10;//한 페이지 당 보여줄 데이터의 수
  itemsPerPages = [10,15,20];
  totalItems: any;

  //검색 form
  searchGroup :FormGroup;
  keyword: any = new String;
  category: string;
  icSearch = icSearch;
  searchCategory = 'all';
  startDate = new String;
  endDate = new String;

  //html option
  layoutCtrl = new FormControl('boxed');
 
  //엑셀관련
  dataForExcel = [];
  //객체 속성명을 그대로 컬럼명으로 쓰지 않고싶으면 따로 설정 해주어야 함
  dataHeaders = ["구분", "타입", "소스경로", "디렉토리생성","백업스크립트(운영)","운영파일반영스크립트","원복스크립트"]


  //team
  teamName:string="전체";
  teams:Team[];
  deployTeam:string;

  //파일관련
  file:File = new File();
  changeValue = new String;
  zipName: string;
  codec = new HttpUrlEncodingCodec;
  url="/api/file/zipfile/";

  //검색 value 초기화
  @ViewChild('searchValue') searchValue:any; 

  constructor(
    private deployService:DeployService,
    private jwtService:JwtService,
    private formBuilder:FormBuilder,
    private excelService : ExcelService,
    private pipe: DatePipe,
    private dialog: MatDialog,
    private router: Router
  ){}

  ngOnInit(){
    //로그인관련
    this.check = localStorage.getItem("AUTH_TOKEN"); 
      if(this.check !=null){ 
        this.loginUser=this.jwtService.decodeToUser(this.check);
      }


    //공지사항관련
    localStorage.removeItem("NOTICE_PAGE");
    localStorage.removeItem("NOTICE_ITEM_PAGE");
    localStorage.removeItem("NOTICE_TYPE");
    localStorage.removeItem("NOTICE_WORD");
    localStorage.removeItem("NOTICE_TEAM");
    
    //검색 form 
    this.searchGroup = this.formBuilder.group({
      searchCategory:[this.searchCategory],
      keyword:[this.changeValue],
      startDate:[],
      endDate:[]
    })

    //리스트 불러오기
    this.deployService.searchDeploy(this.searchGroup.controls.searchCategory.value,this.keyword,this.startDate,this.endDate)
    .subscribe(
      response => {
      this.deploys = response.data.deploys
      this.teams = response.data.teamList
     }
    );
  }

  //1. 페이징처리
  getPage(page) {
    this.p = page;
  }

  //2. 검색버튼
  search(searchGroup){
    //2-1 select option = all,writer,title
    this.keyword = this.searchGroup.controls.keyword.value
    //2-2 select option = deployDate
    if(this.category == 'deployDate'){
      this.startDate = this.pipe.transform(this.searchGroup.value.startDate, 'yyyy-MM-dd');
      this.endDate = this.pipe.transform(this.searchGroup.value.endDate, 'yyyy-MM-dd');
    }

    //http service
    this.deployService.searchDeploy(this.searchGroup.controls.searchCategory.value,this.keyword,this.startDate,this.endDate)
      .subscribe(
        response => {
        this.deploys = response.data.deploys;
    })
  }

  //3. 엑셀다운로드
  exportToExcel(listTitle:string,deployNo:number):void {  
    this.deployService.selectScriptDetail(deployNo)
      .subscribe(
        response => {
          this.scriptViews = response.data
          this.scriptViews.forEach((row: ScriptView) => {
            this.dataForExcel.push(Object.values(row));
          })
    
          //excel variables 
          let reportData = {
              title: listTitle,
              data: this.dataForExcel,
              headers: this.dataHeaders
          }
          this.excelService.exportExcel(reportData);

          //excel data 초기화
          this.dataForExcel=[];
        },
      )
  
  }

  //4. select option 변화시
  selectValue(value){
    this.category = value;
    this.searchValue.nativeElement.value = null;
    this.changeValue = undefined 
  } 

  //5. 한 페이지에 보여줄 아이템 수 변경시 작동할 메서드
  handlePageSizeChange(event): void {
    this.itemsPerPage = event.target.value;
    this.p = 1;
  }

  //6. 파일다운로드관련
  ngEncode(param: string) {
    return this.codec.encodeValue(param);
  }


  //7. 배포상태 변경 dialog
  deployDialog(deployNo,stateReason,deployState,id) : void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      deployNo: deployNo,
      stateReason: stateReason,
      deployState: deployState,
      id:id
    };

    dialogConfig.width = "350px";
    dialogConfig.height = "390px";
    const dialogRef = this.dialog.open(DeployStateChangeComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe(
      result =>{
        if(result!=''){
          this.deployService.updateDeployState(result).subscribe(
            response => {
              if(response.success ==true){
                alert("변경이 완료되었습니다.");
              }else{
                alert("변경에 실패하였습니다.");
              }
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['/deploy-list']);
          }
        )
        }
      }
    )
  
  }

  //초기화버튼
  initializeForm() {
    this.searchGroup.controls.searchCategory.setValue("all");
    this.searchGroup.controls.keyword.setValue(null);
    this.category = null
  }


    //상단 navigation 전체검색
    selectDeploy(){
      this.teamName="전체";
      this.deployService.searchDeploy(this.searchGroup.controls.searchCategory.value,this.keyword,this.startDate,this.endDate)
      .subscribe(res =>{
        this.deploys = res.data.deploys;
        this.p=1;
      })
    }

  //상단 navigation 팀별검색
  selectTeamDeploy(team){
    this.teamName=team.codeName;
    
    this.deployService.selectTeamDeploy(this.teamName)
    .subscribe(res =>{
      this.deploys = res.data.deploys;
        this.p=1;
      })
  }

}
