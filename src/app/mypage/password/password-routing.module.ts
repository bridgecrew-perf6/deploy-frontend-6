import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasswordComponent } from './password.component';
import { QuicklinkModule } from 'ngx-quicklink';

const routes:Routes=[
  {
    path:'',
    component:PasswordComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class PasswordRoutingModule { }
