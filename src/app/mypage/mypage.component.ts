import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { User } from '../models/user.model';
import { Team } from '../models/team.model';
import { Router } from '@angular/router';

import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';
import { JwtService } from '../services/jwt.service';
import { Position } from '../models/position.model';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'vex-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss'],
   animations: [
    fadeInUp400ms
  ]
})
export class MypageComponent implements OnInit {
  check:string;
  loginUser:User;
  form: FormGroup;

  inputType = 'password';
  visible = false;

  result:boolean;

  user:User = new User();
  teamList: Team[];
   positionList: Position[];

  constructor(
    private router: Router,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private userService : UserService,
              private teamService : TeamService,
              private jwtService : JwtService,
              private loginService : LoginService
              ) { }

  ngOnInit(): void {
    localStorage.removeItem("NOTICE_PAGE");
    localStorage.removeItem("NOTICE_ITEM_PAGE");
    localStorage.removeItem("NOTICE_TYPE");
    localStorage.removeItem("NOTICE_WORD");
    localStorage.removeItem("NOTICE_TEAM");


  //로그인 유저 정보
  this.check = localStorage.getItem("AUTH_TOKEN");

    if(this.check !=null){
       
      this.loginUser = this.jwtService.decodeToUser(this.check);
      
    }


     this.form = this.fb.group({
     
      email:[this.loginUser.email,[Validators.required,Validators.email]],
      phone:[this.loginUser.phone,[Validators.required,Validators.pattern(/^\d{3}-\d{3,4}-\d{4}$/ )]],
      position:[this.loginUser.position,Validators.required],
      name: [this.loginUser.name, Validators.required],
      team: [this.loginUser.team, Validators.required],    
    });

    //팀,직급 불러오기
    this.teamService.selectTeamList()
      .subscribe(res =>{
        this.teamList = res.data.team;
        this.positionList = res.data.position;
      })
  }

  //내정보 수정
  send(form,id,name,position,email,phone,team) {
    
    //유효성검사
    if(this.form.controls.name.errors != null){
      name.focus();
      return false;
    }else if(this.form.controls.position.errors != null){
      position.focus();
      return false;
    }else if(this.form.controls.email.errors != null){
      email.focus();
      return false;
    }else if(this.form.controls.phone.errors != null){
      phone.focus();
      return false;
    }else if(this.form.controls.team.errors != null){
      team.focus();
      return false;
    }

    this.user=form.value;
    this.user.id=this.loginUser.id;
    this.userService.updateUser(this.user)
      .subscribe(res=>{
        if(res.data){
          this.loginService.logout(this.user.id)
          .subscribe(res=>{
            if(res.success){
              localStorage.removeItem("AUTH_TOKEN");
              this.router.navigate(['/login']);
            }else{
              
            }
            
          })
            
          }
      })
    
  }

  cancel(){
    this.router.navigate(['/']);
  }

}
