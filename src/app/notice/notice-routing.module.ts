import { Component, NgModule } from '@angular/core';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { NoticeComponent } from './notice.component';
import { RouterModule } from '@angular/router';
import { QuicklinkModule } from 'ngx-quicklink';
import { NoticeWriteFormComponent } from './notice-write-form/notice-write-form.component';
import { NoticeDetailComponent } from './notice-detail/notice-detail.component';
const routes: VexRoutes = [
  {
    path:'',
    component: NoticeComponent
  },
  {
    path: 'write',
    component:NoticeWriteFormComponent
  },
  {
    path:':boardNo',
    component:NoticeDetailComponent
  },
  {
    path:'modify/:boardNo',
    component:NoticeWriteFormComponent
  },
  
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class NoticeRoutingModule { }
