import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuicklinkModule } from 'ngx-quicklink';
import { DeployListComponent } from './deploy-list.component';
import { VexRoutes } from '../../@vex/interfaces/vex-route.interface';
import { DeployWriteFormComponent } from './deploy-write-form/deploy-write-form.component';
import { DeployDetailComponent } from './deploy-detail/deploy-detail.component';
import { DefaultPathFormComponent } from './default-path-form/default-path-form.component';
import { DefaultPathListComponent } from './default-path-list/default-path-list.component';
import { DeploySummaryComponent } from './deploy-summary/deploy-summary.component';

const routes: VexRoutes = [
  {
    path: '',
    component: DeployListComponent
  },
  {
    path: 'default-path',
    component:DefaultPathFormComponent
  },
  {
    path: 'default-path-list',
    component:DefaultPathListComponent
  },
  {
    path:'deploy-write',
    component:DeployWriteFormComponent
  },
  {
    path:':deployNo',
    component:DeployDetailComponent
  },
  {
    path:'deploy-summary',
    component: DeploySummaryComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})

export class DeployListRoutingModule { }
