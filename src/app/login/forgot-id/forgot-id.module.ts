import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotIdComponent } from './forgot-id.component';
import { ForgotIdRoutingModule } from './forgot-id-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { IconModule } from '@visurel/iconify-angular';



@NgModule({
  declarations: [ForgotIdComponent],
  imports: [
    CommonModule,
    ForgotIdRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSelectModule,
    IconModule
  ]
})
export class ForgotIdModule { }
