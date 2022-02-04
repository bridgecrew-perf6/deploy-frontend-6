import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { DeployFile } from 'src/app/models/deploy-file.model';
import { MY_FORMATS } from 'src/app/schedule/insert-schedule/insert-schedule.component';
import { DeployService } from 'src/app/services/deploy.service';
import { UploadService } from 'src/app/services/upload.service';
import { Deploy } from '../../models/deploy.model';
import { User } from '../../models/user.model';
import { JwtService } from '../../services/jwt.service';



@Component({
  selector: 'vex-deploy-write-form',
  templateUrl: './deploy-write-form.component.html',
  styleUrls: ['./deploy-write-form.component.scss',
  '../../../../node_modules/quill/dist/quill.snow.css',
  '../../../@vex/styles/partials/plugins/_quill.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    fadeInUp400ms
  ],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ] 
})
export class DeployWriteFormComponent implements OnInit {

  //로그인 정보
  loginUser : User;
  check:string;

  //deploy form 관련
  deployForm: FormGroup;  
  deploys: Deploy = new Deploy;

  //html optino
  layoutCtrl = new FormControl('boxed');

  //file upload 관련
  fileList:DeployFile = new DeployFile();
  files = [];
  fileNames = [];
  display = "none";
  names = [];
  directoryPaths = [];
  temporary: any[];

  //상단날짜
  date: any;
  currentDate: Date = new Date();

  //로딩 이미지
  status="true";

  error : string;

  //value 초기화
  @ViewChild('fileUploader') fileUploader:ElementRef;
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private deployService: DeployService,
    private jwtService : JwtService,
    private uploadService:UploadService,
    private pipe: DatePipe,
  ) { 
      //상단 시간표시
      this.buildForm();
      setInterval(() =>{
        this.date = this.currentDate.toLocaleTimeString();
      }, 1000)
  }

  //로그인관련
  ngOnInit(){
    this.check = localStorage.getItem("AUTH_TOKEN"); 
      if(this.check !=null){ 
        this.loginUser=this.jwtService.decodeToUser(this.check);
      }
  } 

  //파일다수추가시
  selectFiles(event): void{
    this.files.push(event.target.files);
    this.display = "block";
  }

  //파일 닫기 누를시
  close(text:string): void{
    text=text.substr(1);
    //취소한 파일 이외 파일 추가
    for(let i = 0; i < this.files.length; i++){
      this.temporary = this.files[i];
      for(let j = 0; j < this.temporary.length; j++){
        if(this.temporary[j].name != text){
          this.fileNames.push(this.temporary[j]);
        }
      }
    }
    
    //파일선택시 초기화
    this.files=[];
    this.files.push(this.fileNames);
    this.fileNames=[];   
    
    //파일이 없을때 닫음
    if(this.files[0].length == 0){
      this.display = "none";
      this.fileUploader.nativeElement.value = null;
    }
  }

  scriptRegExp = new RegExp('^[src]|[gmd]');
  endRegExp = new RegExp('[\\S]$');

  specRegExp = new RegExp('[^~!@#$%^&*_+|<>?:{}]','gi');
  startRegExp = new RegExp('^[\\S]');


  //유효성검사
  buildForm(): void{
    this.deployForm = this.formBuilder.group({
      deployTitle:[this.deploys.deployTitle,[Validators.required,Validators.pattern(this.specRegExp),Validators.pattern(this.startRegExp)]],
      deployContent:[this.deploys.deployContent,Validators.required],
      portalScript:['',[Validators.pattern(this.scriptRegExp),Validators.pattern(this.endRegExp)]],
      tbwappScript:['',[Validators.pattern(this.scriptRegExp),Validators.pattern(this.endRegExp)]],
      centerScript:['',[Validators.pattern(this.scriptRegExp),Validators.pattern(this.endRegExp)]],
      expectedDate:[this.pipe.transform(this.currentDate, 'yyyy-MM-dd'),[Validators.required]]
    });
  }

  //1. send버튼 누를시 마지막 경로
  sendData(deploys){
    this.deployService.insertDeploy(deploys)
    .subscribe(
      data => {
        if(data.success){
          this.status="true";
          alert('배포 등록 성공');
          this.router.navigate(['/deploy-list']);
        }else{
          this.status="true";
          alert('배포 등록 실패');
        }
      },
      err => {
        this.status="true";
        this.error = err.error.data
        alert(this.error);
      }
    
    )
  }

  //2. send버튼 누를시
  send(deployForm,deployTitle,
        portalScript,tbwappScript,centerScript){
    //에러발생시 표시      
    this.deployForm.markAllAsTouched();

    //에러알람
    if(this.deployForm.controls.deployTitle.errors != null){
      deployTitle.focus();
      alert("제목을 입력해주세요");
      return false;
    } else if(this.deployForm.controls.deployContent.errors != null){
      alert("내용을 입력해주세요");
      return false;
    }else if(this.deployForm.controls.expectedDate.errors != null){
      alert("배포예정일을 선택해주세요");
      return false;
    } else if(this.deployForm.controls.portalScript.errors != null){
      alert("스크립트를 입력해주세요");
      return false;
    } else if(this.deployForm.controls.tbwappScript.errors != null){
      alert("스크립트를 입력해주세요");
      return false;
    } else if(this.deployForm.controls.centerScript.errors != null){
      alert("스크립트를 입력해주세요");
      return false;
    }

    //scrip or 파일 입력시에만 진행
    // if(portalScript.value != '' || centerScript.value != '' || tbwappScript.value != '' || this.files.length != 0){
    // } else {
    //   alert("스크립트 혹은 jar파일을 입력해주세요");
    //   return false;
    // }

    //로그인 유저정보 추출
    this.check = localStorage.getItem("AUTH_TOKEN"); 
      if(this.check !=null){ 
        this.loginUser=this.jwtService.decodeToUser(this.check);
      }

    //객체에 값 입력
    this.deploys = deployForm.value;
    this.deploys.writer = this.loginUser.id;

    //초기화
    this.deploys.scriptDTO = [];

    // 2-1. textarea enter구분
    if(portalScript.value != ''){
      try{
        portalScript = this.deployForm.controls.portalScript.value.split('\n');
        for(var i in portalScript){
          this.deploys.scriptDTO.push({portalScript:portalScript[i],tbwappScript:null,centerScript:null,category:'portal'});    
          if(portalScript[portalScript.length]==''){

          }      
        }
      }catch(e){}
    } 
    if(centerScript.value != ''){
      try{
        centerScript = this.deployForm.controls.centerScript.value.split('\n');
        for(var j in centerScript){
          this.deploys.scriptDTO.push({portalScript:null,tbwappScript:null,centerScript:centerScript[j],category:'center'});
        }
      }catch(e){}
    }
    if(tbwappScript.value != ''){
      try{
        tbwappScript = this.deployForm.controls.tbwappScript.value.split('\n');
        for(var z in tbwappScript){
          this.deploys.scriptDTO.push({portalScript:null,tbwappScript:tbwappScript[z],centerScript:null,category:'tbwapp'});
        }
      }catch(e){}
    }

    this.status="wait";
    // 2-2. 파일 추가
    if(this.files.length != 0){
        this.uploadService.upload(this.files)
        .subscribe(data=>{
            if(data.success){
              this.deploys.names = data.data.names
              this.deploys.directoryPaths = data.data.directoryPaths
              this.sendData(this.deploys);
            }else{
              this.status="true";
              alert("파일업로드에 실패했습니다.");
            }
          })
    }else{
      this.sendData(this.deploys);
    }
  }

  //3. 취소버튼
  cancel(){
    this.router.navigate(['/deploy-list']);
  }
  
}
