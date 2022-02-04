import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import * as CryptoJS from '../../../../node_modules/crypto-js';
@Component({
  selector: 'vex-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class ForgotPasswordComponent implements OnInit {

   form: FormGroup;
   display:string;
   inputType='password';
   ids :string[] = [];
   user:User = new User();
   
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email:['',[Validators.required,Validators.email]],
      id:['',Validators.required],
      newPassword: ['', Validators.required],
      newPasswordConfirm: ['', [Validators.required,this.equalTo('newPassword')]]
    })
  }
  //비밀번호, 비밀번호 확인 일치하는지 확인
  public equalTo(newPassword:string): ValidatorFn{
   return (control: AbstractControl): { [key: string]: any } => {
            let isValid = control.root.value[newPassword] == control.value;
            if (!isValid) {
                return { 'equalTo': { isValid } };
            }
            return null;
        };
  }
  //비밀번호 일치하는지 확인
  findPassword(form){
      this.form.markAllAsTouched();//mat error 뜨게
      //유효성 검사
      if(this.form.controls.email.errors != null){
        return false;
      }else if(this.form.controls.id.errors != null){
        return false;
      }
      this.userService.findPassword(form.controls.id.value,form.controls.email.value)
      .subscribe(res=>{
        if(res.success == false){
          this.form.controls.email.setErrors({checkError:true});
         
        }else{
          this.form.markAsUntouched();
          this.display="block";
          this.user.id=res.data;
        }//if~else end
        
      })//subscribe end
    }//findPassword end

    //비밀번호 변경
    updatePassword(form){
      this.form.markAllAsTouched();//mat error 뜨게
     if(this.form.controls.newPasswordConfirm.errors != null){
      return false;
      
    }
    
    const secretPassword = CryptoJS.AES.encrypt(form.value.newPassword,"secret").toString();
    this.user.password = secretPassword;
    this.userService.updatePassword(this.user)
    .subscribe(res =>{
      if(res.success){
        this.router.navigate(['/login']);
      }
    })
  }

  cancel(){
    this.router.navigate(['/']);
  }
}
