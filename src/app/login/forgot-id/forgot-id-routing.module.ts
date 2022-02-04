import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotIdComponent } from './forgot-id.component';
import { QuicklinkModule } from 'ngx-quicklink';

const routes:Routes=[
  {
    path:'',
    component:ForgotIdComponent
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class ForgotIdRoutingModule { }
