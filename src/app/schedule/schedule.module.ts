import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { ScheduleComponent } from './schedule.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { InsertScheduleComponent } from './insert-schedule/insert-schedule.component';
import { UpdateScheduleComponent } from './update-schedule/update-schedule.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import timeGridPlugin from '@fullcalendar/timegrid';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatTableModule } from '@angular/material/table';
import { SearchScheduleComponent } from './search-schedule/search-schedule.component';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { ScrollbarModule } from 'src/@vex/components/scrollbar/scrollbar.module';
import { AngularResizedEventModule } from 'angular-resize-event';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin
]);

@NgModule({
  declarations: [
    ScheduleComponent,
    InsertScheduleComponent,
    UpdateScheduleComponent,
    SearchScheduleComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    ScheduleRoutingModule,
    FullCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,//modal
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MomentDateModule,
    MatTableModule,
    MatIconModule,
    IconModule,
    ContainerModule,
    ScrollbarModule,
    AngularResizedEventModule
  ],
  entryComponents: [//dialog 동적으로 생성. component factory에 추가됨
    InsertScheduleComponent,
    UpdateScheduleComponent,
    SearchScheduleComponent
  ],
})
export class ScheduleModule { }
