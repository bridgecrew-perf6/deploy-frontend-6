import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../models/user.model';
import { Deploy } from 'src/app/models/deploy.model';
import { DeployService } from 'src/app/services/deploy.service';
import { JwtService } from '../../services/jwt.service';


@Component({
  selector: 'vex-deploy-state-change',
  templateUrl: './deploy-state-change.component.html',
  styleUrls: ['./deploy-state-change.component.scss']
})


export class DeployStateChangeComponent implements OnInit {

  //로그인정보
  loginUser : User;
  check:string;

  stateForm : FormGroup;
  deploy : Deploy = new Deploy();
  id : string;
  deployNo : number;
  stateReason : string;
  selected : number;
  deployState : string;

  constructor(
    private dialogRef : MatDialogRef<DeployStateChangeComponent>,
    private formBuilder : FormBuilder,
    private deployService: DeployService,
    private reactiveFormsModule :ReactiveFormsModule,
    private formsModule:FormsModule,
    private jwtService:JwtService,

    @Inject(MAT_DIALOG_DATA) public data : Deploy
    ) {
    this.deployNo = data.deployNo;
    this.stateReason = data.stateReason;
    this.deployState = data.deployState;
    this.id = data.id;
   }

  ngOnInit(): void {
    this.check = localStorage.getItem("AUTH_TOKEN"); 
    if(this.check !=null){ 
      this.loginUser=this.jwtService.decodeToUser(this.check);
    }

    this.stateForm = this.formBuilder.group({
      deployReady:[''],
      deployComplete:[''],
      stateReason:[''],
      deployState:[''],
    })
  }

  onSubmit(){
    this.stateForm.markAllAsTouched();

    if(this.loginUser.id != this.id){
      alert("작성자만 배포상태를 수정할 수 있습니다.");
      return false;
    }

    if((this.stateForm.value.deployReady == '') && (this.stateForm.value.deployComplete == '')){
      alert("배포완료 혹은 배포준비를 선택해주세요");
      return false;
    }


    if(this.stateForm.value.deployReady){
      this.deploy.deployState = '배포준비'
    }
    if(this.stateForm.value.deployComplete){
      this.deploy.deployState = '배포완료'
    }

    this.deploy.stateReason = this.stateForm.value.stateReason
    this.deploy.deployNo = this.deployNo 
    this.dialogRef.close(this.deploy);
  }

 
}
