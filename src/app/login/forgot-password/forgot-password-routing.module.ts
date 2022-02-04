import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';
import { QuicklinkModule } from 'ngx-quicklink';

const routes:Routes=[
  {
    path:'',
    component:ForgotPasswordComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class ForgotPasswordRoutingModule { }
