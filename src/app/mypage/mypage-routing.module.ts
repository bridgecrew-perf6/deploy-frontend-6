import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MypageComponent } from './mypage.component';
import { QuicklinkModule } from 'ngx-quicklink';


const routes:Routes=[
  {
    path:'',
    component:MypageComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class MypageRoutingModule { }
