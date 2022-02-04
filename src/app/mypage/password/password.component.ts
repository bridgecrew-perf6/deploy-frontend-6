import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { JwtService } from 'src/app/services/jwt.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { LoginService } from 'src/app/services/login.service';
import * as CryptoJS from '../../../../node_modules/crypto-js';

@Component({
  selector: 'vex-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class PasswordComponent implements OnInit {

  form: FormGroup;
  inputType = 'password';
  user:User = new User();
  check:string;
  loginUser:User;
  password:string;
  newPassword:string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private jwtService : JwtService,
    private router: Router,
    private loginService : LoginService
  ) { }

  ngOnInit(): void {
    localStorage.removeItem("NOTICE_PAGE");
    localStorage.removeItem("NOTICE_ITEM_PAGE");
    localStorage.removeItem("NOTICE_TYPE");
    localStorage.removeItem("NOTICE_WORD");
    localStorage.removeItem("NOTICE_TEAM");
    
    this.form = this.fb.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.required],
      newPasswordConfirm: ['', [Validators.required,this.equalTo('newPassword')]],
    })
    
    //로그인 유저 정보
    this.check = localStorage.getItem("AUTH_TOKEN");

    if(this.check !=null){
       
      this.loginUser = this.jwtService.decodeToUser(this.check);
      
    }
  }

  //비밀번호,비밀번호 확인 일치하는지 확인
  public equalTo(newPassword:string): ValidatorFn{
   return (control: AbstractControl): { [key: string]: any } => {
            let isValid = control.root.value[newPassword] == control.value;
            if (!isValid) {
                return { 'equalTo': { isValid } };
            }
            return null;
        };
  }

  //현재비밀번호 일치하는지 확인
  checkPassword(form){
    
    this.form.markAllAsTouched();//mat error 뜨게
    this.user.password=form.value.password;
    this.user.id=this.loginUser.id;
    this.userService.checkPassword(this.user)
    .subscribe(res=>{
      if(res.success){
        this.form.markAsUntouched();
        this.password="none";
        this.newPassword="block";
        
      }else{
        this.form.controls.password.setErrors({checkError:true});
        
      }
    })
  }//checkPassword(form)

  //비밀번호 변경
  updatePassword(form){
    this.form.markAllAsTouched();//mat error 뜨게
     if(this.form.controls.newPasswordConfirm.errors != null){
       this.form.controls.password.setErrors({checkError:true});
      return false;
    }
    const secretPassword = CryptoJS.AES.encrypt(form.value.newPassword,"secret").toString();
    this.user.password = secretPassword;
    this.userService.updatePassword(this.user)
    .subscribe(res =>{
      if(res.success){
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
