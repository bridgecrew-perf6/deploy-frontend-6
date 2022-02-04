import { colorVariables } from './../../../@vex/components/config-panel/color-variables';
import { logging } from 'protractor';



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';

import { CodeMgmt } from './codemgmt.model';
import { CodeMgmtService } from './code-mgmt.service';
import { InsertUpdateCodeComponent } from './insert-update-code-management/insert-update-code/insert-update-code.component';


import { User } from '../../models/user.model';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'vex-code-management',
  templateUrl: './code-management.component.html',
  styleUrls: ['./code-management.component.scss']
})
export class CodeManagementComponent implements OnInit {

  //로그인 회원 아이디 정보
  loginUser : User;
  check : string;

  codeMgmts: CodeMgmt[];
  childCodeMgmtInformations: any = [];  
  parentCodeId: string;
  isParentCode: boolean;
  Index: any;
  hideme = [];
  intention: boolean;

  //subscribe에서 넘어온 data 받기 용
  dataRegister: any= {};

  codeSearchForm: FormGroup;
  searchType: string;


  layoutCtrl = new FormControl('boxed');
  searchCtrl = new FormControl();


  constructor(private router: Router,
              private codeMgmtService: CodeMgmtService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private jwtService : JwtService) { }

  ngOnInit(): void {
    this.codeMgmtService.getParentCodeInfos().
          subscribe( data => {
          this.dataRegister = data;
          this.codeMgmts = this.dataRegister.data;
    });

    //로그인 유저정보 얻어오기
    this.check = localStorage.getItem("AUTH_TOKEN");

    if(this.check != null) {
       
      this.loginUser = this.jwtService.decodeToUser(this.check);
      
    }

    localStorage.removeItem("NOTICE_PAGE");
    localStorage.removeItem("NOTICE_ITEM_PAGE");
    localStorage.removeItem("NOTICE_TYPE");
    localStorage.removeItem("NOTICE_WORD");
    localStorage.removeItem("NOTICE_TEAM");

    //검색폼 분류에 코드 아이디가 디폴트로 떠있도록 
    this.searchType="codeId";

    //검색폼
    this.codeSearchForm = this.formBuilder.group({
      type:[this.searchType, Validators.required],
      keyword:['',Validators.pattern(/^\S/)]
    });

  }//ngOnInit() end
  
  //검색 초기화 버튼
  initializeForm() {
    this.codeSearchForm.get("type").setValue(this.searchType);
    this.codeSearchForm.get("keyword").setValue('');
  }

  //코드검색
  searchCode() {
    if(this.codeSearchForm.controls.type.errors != null) {
      return false;
    } else if(this.codeSearchForm.controls.keyword.errors != null
      || this.codeSearchForm.controls.keyword.value == null) {
      alert("검색어를 입력해 주세요.");
      return false;
    }
    this.codeMgmtService.searchCode(this.codeSearchForm.controls.type.value, 
                                    this.codeSearchForm.controls.keyword.value)
    .subscribe(data => {
        this.dataRegister = data;
        this.codeMgmts = this.dataRegister.data;
    })
  }

  toggleChildCodeList(i,parentCodeId) {
    
    this.codeMgmtService.getChildCodeInfos(parentCodeId)
    .subscribe( data => {
      this.dataRegister = data;
      this.childCodeMgmtInformations[i] = this.dataRegister.data;
    });
    this.hideme[i] = !this.hideme[i];  
    this.Index = i;
  }//toggleChildCodeList end 

  openInsertCodeDialog() : void {//코드 등록 팝업창 띄움

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      
      registerer: this.loginUser.id
      
    };

    dialogConfig.width = "250px";
    

    const dialogRef = this.dialog.open(InsertUpdateCodeComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {//onClose 메소드에서 리턴한 codeMgmt 객체
      if(result) {
      result.registerer = this.loginUser.id;
      
    
      this.codeMgmtService.insertCode(result).subscribe(data=> {
        this.dataRegister = data;//바로 data.success하면 에러 뜸.
        if(this.dataRegister.success == true) {
          alert("코드가 등록되었습니다");
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/code-management']);
        } else {
          alert("등록에 실패하였습니다");
        }//if~else end 
      }
      );}
    });//subscribe() end
 
  }//openInsertCodeDialog() end
   
  openUpdateCodeDialog(codeId: string, parentCodeId: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      codeId: codeId,
      modifier: this.loginUser.id
    };
    

    dialogConfig.width = "250px";

    const dialogRef = this.dialog.open(InsertUpdateCodeComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {//onClose 메소드에서 리턴한 codeMgmt 객체
      if(result) {
      result.modifier = this.loginUser.id;
      result.codeId = codeId;
      result.parentCodeId = parentCodeId;
      
      this.codeMgmtService.updateCode(result).subscribe(data=> {
        this.dataRegister = data;//바로 data.success하면 에러 뜸.
        if(this.dataRegister.success == true) {
          alert("코드가 수정되었습니다");
          //수정 후 페이지 reload하기
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/code-management']);
        } else {
          alert("코드수정에 실패하였습니다");
        }//if~else end 
     
      });
    }
    });
}//openUpdateCodeDialog(codeId) end 

//코드 삭제
deleteCode(codeId: string) {
  this.intention = confirm("이 코드를 삭제하시겠습니까?");

  if(this.intention == true) {

  this.codeMgmtService.deleteCode(codeId).subscribe(data => {

     if(data.success == true) {
       alert("코드가 삭제되었습니다.");
       //삭제 후 페이지 reload하기
       this.router.routeReuseStrategy.shouldReuseRoute = () => false;
       this.router.onSameUrlNavigation = 'reload';
       this.router.navigate(['/code-management']);
     } else {
       alert("코드를 삭제하지 못했습니다.");
     }//if~else end 
   });
  }
}//deleteCode end


}
