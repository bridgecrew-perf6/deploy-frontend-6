import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DefaultPath } from 'src/app/models/default-path.model';
import { User } from 'src/app/models/user.model';
import { DefaultPathService } from 'src/app/services/default-path.service';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'vex-default-path-list',
  templateUrl: './default-path-list.component.html',
  styleUrls: ['./default-path-list.component.scss']
})
export class DefaultPathListComponent implements OnInit {


  layoutCtrl = new FormControl('boxed');
  defaultPaths : DefaultPath[];

  constructor(private service :DefaultPathService
    ,private router: Router) { }

  ngOnInit(): void {

    this.selectDefaultPath();
  }

  cancel(){
    this.router.navigate(['/deploy-list']);
  }

  selectDefaultPath(){
    this.service.selectDefaultpath()
    .subscribe(data=>{
      this.defaultPaths = data.data;
    })
  }

}
