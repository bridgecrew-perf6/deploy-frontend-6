import { CodeManagementRoutingModule } from './code-management-routing.module';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { InsertUpdateCodeComponent } from './insert-update-code-management/insert-update-code/insert-update-code.component';
import { CodeManagementComponent } from './code-management.component';





@NgModule({
  declarations: [
    CodeManagementComponent,
    InsertUpdateCodeComponent
  ],
  imports: [
    CommonModule,
    CodeManagementRoutingModule,//side bar와 병행하기 위해 필요함
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,//modal
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatNativeDateModule,
    PageLayoutModule,
    FlexLayoutModule,
    BreadcrumbsModule,
    ContainerModule
    
  ],
  entryComponents: [//dialog로 쓰일 component는 entryComponent로 선언해주어야 에러가 발생하지 않음
    InsertUpdateCodeComponent
  ],
})
export class CodeManagementModule { }
