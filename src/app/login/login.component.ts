import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeInUp400ms } from '../../@vex/animations/fade-in-up.animation';
import { User } from '../models/user.model';
import { LoginService } from '../services/login.service';
import { tap } from 'rxjs/operators';
import { JwtService } from '../services/jwt.service';
import * as CryptoJS from '../../../node_modules/crypto-js'

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms
  ]
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  inputType = 'password';
  visible = false;

  user:User = new User();

  constructor(private router: Router,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private snackbar: MatSnackBar,
              private loginService:LoginService,
              private jwtService:JwtService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: ['', Validators.required],
      password: ['', Validators.required]
    });
    
  }

  //로그인
  send(form,id,password) {
    
    if(this.form.controls.id.errors != null){
      id.focus();
      return false;
    }else if(this.form.controls.password.errors != null){
      password.focus();
      return false;
    }
    
    this.user=this.form.value;
    const secretId = CryptoJS.AES.encrypt(id.value,"secret").toString();
    const secretPassword = CryptoJS.AES.encrypt(password.value,"secret").toString();
    
    this.user.id = secretId;
    this.user.password = secretPassword;

    this.loginService.login(this.user).pipe(
      tap((res :any) => {
        if(res.success){
            localStorage.setItem("AUTH_TOKEN", res.data);
            this.loginService.loginUser = this.jwtService.decodeToUser(res.data); 
        }
      })

    )//tap end
    .subscribe(res =>{
      if(res.success){
        this.router.navigate(['/']);
      }else{
         // if(res.data=='signed'){
           // alert("중복된 로그인 입니다.");
         // }else{
            alert("아이디, 비번이 올바르지 않습니다.");
         // }
        
      }
    })
  }//send end

 
}
