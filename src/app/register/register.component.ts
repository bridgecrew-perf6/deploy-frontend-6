import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '../../@vex/animations/fade-in-up.animation';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { TeamService } from '../services/team.service';
import { Team } from '../models/team.model';
import { Position } from '../models/position.model';
import * as CryptoJS from '../../../node_modules/crypto-js'

@Component({
  selector: 'vex-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  inputType = 'password';
  visible = false;

  result:boolean;

  user:User = new User();
  teamList: Team[];
  positionList: Position[];

  constructor(private router: Router,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private userService : UserService,
              private teamService : TeamService
  ) { }

  
  ngOnInit() {
    this.form = this.fb.group({
      id:['',[Validators.required,Validators.pattern(/^\S*$/)]],
      email:['',[Validators.required,Validators.email]],
      phone:['',[Validators.required,Validators.pattern(/^\d{3}-\d{3,4}-\d{4}$/ )]],
      position:['',Validators.required],
      name: ['', [Validators.required,Validators.pattern(/^\S*$/)]],
      team: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', [Validators.required,this.equalTo('password')]],
      check:[false,[]],      
    });

    this.teamService.selectTeamList()
      .subscribe(res =>{
        this.teamList = res.data.team;
        this.positionList = res.data.position;
        
      })
   
  }
  //비밀번호,비밀번호 일치하는지 확인
 public equalTo(password:string): ValidatorFn{
   return (control: AbstractControl): { [key: string]: any } => {
            let isValid = control.root.value[password] == control.value;
            if (!isValid) {
                return { 'equalTo': { isValid } };
            }
            return null;
        };
 }

 //아이디 중복체크
 public checkId(id){
   this.userService.checkId(id)
    .subscribe(res =>{
      if(res.success==false){
        this.form.controls.id.setErrors({checkError:true});
      }

    });
 }
  
  //회원가입
  send(form,id,password,passwordConfirm,name,position,email,phone,team) {
    
    //유효성검사
    if(this.form.controls.id.errors != null){
      id.focus();
      return false;
    }else if(this.form.controls.password.errors != null){
      password.focus();
      return false;
    }else if(this.form.controls.passwordConfirm.errors != null){
      passwordConfirm.focus();
      return false;
    }else if(this.form.controls.name.errors != null){
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
    }else if(!form.value.check){
      alert("약관에 동의를 해주세요.");
      return false;
    }

    this.user=form.value;
    const secretId = CryptoJS.AES.encrypt(this.user.id,"secret").toString();
    const secretPassword = CryptoJS.AES.encrypt(this.user.password,"secret").toString();
    
    this.user.id = secretId;
    this.user.password = secretPassword;
    

    this.userService.insertUser(this.user)
      .subscribe(data=>{
        if(data.success){
          this.router.navigate(['/login']);
          }
      })
    
  }


}
