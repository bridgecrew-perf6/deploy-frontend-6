import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, ɵɵtrustConstantResourceUrl, ComponentFactoryResolver } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { UploadService } from 'src/app/services/upload.service';
import { BoardFile } from 'src/app/models/boardfile.model';

import { JwtService } from 'src/app/services/jwt.service';
import { User } from 'src/app/models/user.model';
import { BoardService } from 'src/app/services/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Notice } from 'src/app/models/notice.model';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'vex-notice-write-form',
  templateUrl: './notice-write-form.component.html',
  styleUrls: [
    './notice-write-form.component.scss',
    '../../../../node_modules/quill/dist/quill.snow.css',
    '../../../../node_modules/quill/dist/quill.core.css',
    '../../../@vex/styles/partials/plugins/_quill.scss'

],
  encapsulation: ViewEncapsulation.None,
  animations: [
    fadeInUp400ms
  ]
})
export class NoticeWriteFormComponent implements OnInit {
  
  //update 때 임시로 파일이름들
  names=[];
  //update 때 임시로 파일경로들
  directoryPaths=[];
  //update 때 임시변수
  temporary:any[];
  //event.target.files 를 넣어주는 변수
  files = [];
  //파일 박스에 파일이름들 넣어주는 변수
  fileNames  = [];
  //기존에 공지사항에 있는 파일을 넣어주는 변수
  fileConfirm = [];
  form: FormGroup;
  //파일박스 디스플레이
  display ="none";
  //로그인유저
  loginUser:User;
  //체크
  check:string;
  //공지사항 인서트 할때 변수
  fileList:BoardFile = new BoardFile();
  //공지사항 번호
  boardNo:number;
  //공지사항
  notice:Notice = new Notice();
  //로딩 이미지 넣을때 상태
  status="true";

  @ViewChild('fileUploader') fileUploader:ElementRef;

  constructor(
    private fb:FormBuilder,
    private uploadService:UploadService,
    private jwtService:JwtService,
    private boardService:BoardService,
    private route:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit(): void {
    
    //수정이 아닐 경우
    if(this.boardNo == null){
      this.form=this.fb.group({
        title:['',[Validators.required,Validators.pattern(/^\S/)]],
        content:['',[Validators.required,Validators.pattern(/^(?!<p>\s)/)]]
      })
    }

    //수정일 경우
    this.boardNo=this.route.snapshot.params['boardNo'];
    if(this.boardNo !=null){
      this.boardService.selectNoticeDetail(this.boardNo)
      .subscribe(res=>{
        
        this.notice=res.data.board;
        this.files.push(res.data.files);
        this.fileConfirm=res.data.files;
        

        this.form=this.fb.group({
          title:[this.notice.title,[Validators.required,Validators.pattern(/^\S/)]],
          content:[this.notice.content,[Validators.required,Validators.pattern(/^(?!<p>\s)/)]]
        })

        //기존에 있던 파일인지 확인하는 변수
        this.fileConfirm=res.data.files;
        
        //파일박스 block/none 
        if(this.files[0].length>0){
          this.display="block";
        }else{
          this.display="none";
        }
      })
    }
  }

  


  //파일선택 시
  selectFiles(event): void {
    this.files.push(event.target.files);
    for(let i =0 ; i<this.files.length;i++){
      this.temporary=this.files[i];
      for(let j=0; j<this.temporary.length;j++){
        
          this.fileNames.push(this.temporary[j]);
        
      }

    }//for end
    
    this.files=[];

    this.files.push(this.fileNames);
    this.fileNames=[];

    this.temporary=this.files[0];
    for(let i=0; i<this.temporary.length;i++){
      for(let j=i+1; j<this.temporary.length;j++){
        if(this.temporary[i].name==this.temporary[j].name){
          this.temporary.splice(j,1);
        }
      }
    }
 

    this.display="block";
  }
  
  close(text:string): void{
   
    text=text.substr(1);

    //x버튼 누른 파일 이외에 파일을 다시 넣어줌
    for(let i =0 ; i<this.files.length;i++){
      this.temporary=this.files[i];
      for(let j=0; j<this.temporary.length;j++){
        if(this.temporary[j].name!=text){
          this.fileNames.push(this.temporary[j]);
        }
      }

    }//for end
    
    this.files=[];
    //다시 files에 넣어줌
    this.files.push(this.fileNames);
    this.fileNames=[];
    
    
    //파일이 없을때 닫음
    if(this.files[0].length==0){
      this.display="none";
      this.fileUploader.nativeElement.value=null;
    }
    
    
  }//close() end

  

  //업로드된 파일과 공지사항내용 DB insert 메서드
  addFileList(form,type){

    //로그인 유저정보 추출
    this.check = localStorage.getItem("AUTH_TOKEN"); 
      if(this.check !=null){ 
        this.loginUser=this.jwtService.decodeToUser(this.check);
      }


      this.fileList.writer=this.loginUser.id;
      this.fileList.content=form.controls.content.value;
      this.fileList.title=form.controls.title.value;

      
      if(type=="insert"){

        this.boardService.upload(this.fileList)
        .subscribe(data =>{
          this.status="true";
          this.router.navigate(['/notice/'+data.data]);

        })
      }else{

        for(let i in this.names){
          this.fileList.names.push(this.names[i]);
        }
        for(let i in this.directoryPaths){
          this.fileList.directoryPaths.push(this.directoryPaths[i]);
        }

        this.boardService.updateNotice(this.fileList,this.boardNo)
        .subscribe(res =>{
          this.status="true";
           this.router.navigate(['/notice/'+res.data]);

        })
      }
     
      
  }
 

  //파일 업로드 메서드
  upload(form,type){

    this.status="wait";  
    if(this.files.length !=0){
         this.uploadService.upload(this.files)
         .pipe(tap((res:any)=>{
          if(res.data!=null){
            this.fileList.names=res.data.names;
            this.fileList.directoryPaths=res.data.directoryPaths;
          }
           
          })
         )
         .subscribe(res=>{
            if(res.success){
              this.addFileList(form,type);
            }else{
              this.status="true";
              alert("파일 업로드에 실패했습니다.");
            }
          })

    }else{
      this.addFileList(form,type);

    }//if~else end 
  }//upload()end

  
  insert(form,title){
    this.form.markAllAsTouched();//mat error 뜨게
    if(this.form.controls.title.errors != null){
      title.focus();
      return false;
    }else if(this.form.controls.content.errors != null){
      if(this.form.value.content == ""){
        alert("내용을 입력해주세요.");
        return false;
      }else{
        alert("첫글자는 공백을 제외해서 입력해 주세요.");
        return false;
      }
      
    }
    const type="insert";
    this.upload(form,type);
  }

  update(form,title){
    this.form.markAllAsTouched();//mat error 뜨게
     if(this.form.controls.title.errors != null){
        title.focus();
        return false;
      }else if(this.form.controls.content.errors != null){
        if(this.form.value.content == ""){
          alert("내용을 입력해주세요.");
          return false;
        }else{
          alert("첫글자는 공백을 제외해서 입력해 주세요.");
          return false;
        }
      }
    const type="update";
    
    if(this.files.length != 1 || this.files[0].length != 0){
    //기존에 있었던 파일인지 확인 (기존에 있었던 파일은 디비에서 가져오기때문에 파일로 인식을 못하기때문 )
      for(let j=0; j< this.files.length; j++){ 
          this.temporary = this.files[j];
        for(let i =0; i < this.fileConfirm.length;i++){
            for(let temp in this.temporary){
              if(this.temporary[temp].name==this.fileConfirm[i].name){
                this.names.push(this.temporary[temp].name);
                this.directoryPaths.push(this.temporary[temp].directoryPath); 
              }
              
            }

          }//for end
        }//for end
     
        this.upload(form,type);
    }else{
      this.addFileList(form,type);
    }

  }

  cancel(){
    if(!confirm("목록으로 돌아가시겠습니까?")){
      return false;
    }
    this.router.navigate(['/notice']);
  }
}
