import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Notice } from 'src/app/models/notice.model';
import { File } from 'src/app/models/file.model';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { Observable } from 'rxjs';
import { JwtService } from 'src/app/services/jwt.service';
import { User } from 'src/app/models/user.model';
import { FormControl } from '@angular/forms';
import { HttpUrlEncodingCodec } from '@angular/common/http';

@Component({
  selector: 'vex-notice-detail',
  templateUrl: './notice-detail.component.html',
  styleUrls: [
    './notice-detail.component.scss',
    '../../../../node_modules/quill/dist/quill.snow.css',
    '../../../../node_modules/quill/dist/quill.core.css',
    '../../../@vex/styles/partials/plugins/_quill.scss'
  ],
  animations: [
    fadeInUp400ms
  ]
})
export class NoticeDetailComponent implements OnInit {

  layoutCtrl = new FormControl('boxed');
  boardNo:number;
  notice:Notice = new Notice();
  files:File[];
  fileInfos?: Observable<any>;
  check:string;
  loginUser:User;  
  display:string;
  codec = new HttpUrlEncodingCodec;
  url="/api/file/files/";
  

  constructor(
    private boardService:BoardService,
    private route:ActivatedRoute,
    private router:Router,
    private jwtService:JwtService
    
  ) { }

  ngOnInit(): void {
    
    //로그인 유저 정보
     this.check = localStorage.getItem("AUTH_TOKEN"); 
      if(this.check !=null){ 
        this.loginUser=this.jwtService.decodeToUser(this.check);
      }//if~else end
      
    this.boardNo=this.route.snapshot.params['boardNo'];

    //해당하는 공지사항 정보
    this.boardService.selectNoticeDetail(this.boardNo)
    .subscribe(data=>{
      this.notice=data.data.board;
      this.files=data.data.files;
      if(this.files.length>0){
        this.display="block";
      }
    })
    
  }

  //대괄호 중괄호 등 포함되어 있을 때 에러뜨는 것 막기 위해 인코딩 메서드 작성함
  ngEncode(param: string) {
    return this.codec.encodeValue(param);
  }

  //목록
  selectList(){
    this.router.navigate(['/notice']);
  }

  //수정
  updateNotice(boardNo){
    this.router.navigate(['/notice/modify/'+boardNo]);
  }
  
  //삭제
  deleteNotice(boardNo){
    if(!confirm("삭제를 하시겠습니까?")){
      return false;
    }
    this.boardService.deleteNotice(boardNo)
    .subscribe(res=>{
      if(res.success){
        alert("삭제 되었습니다.");
        this.router.navigate(['/notice']);
      }
    })
  }

}
