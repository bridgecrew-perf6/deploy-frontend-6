import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'vex-forgot-id',
  templateUrl: './forgot-id.component.html',
  styleUrls: ['./forgot-id.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})

export class ForgotIdComponent implements OnInit {

   form: FormGroup;
   display:string;
   ids :string[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
     this.form = this.fb.group({
      email:['',[Validators.required,Validators.email]]
    })

  }

  //아이디 찾기
  findId(form){
    this.form.markAllAsTouched();//mat error 뜨게
    //유효성 검사
    if(this.form.controls.email.errors != null){
      return false;
    }
    this.userService.findId(form.controls.email.value)
    .subscribe(res=>{

      if(res.data.length!=0){
        
        for(let i =0; i<res.data.length;i++){
          this.ids.push(res.data[i].id);
          this.display="block";
        }

      }else{
        this.form.controls.email.setErrors({checkError:true});
      }
    })
  }

  cancel(){
    this.router.navigate(['/login']);
  }

}
