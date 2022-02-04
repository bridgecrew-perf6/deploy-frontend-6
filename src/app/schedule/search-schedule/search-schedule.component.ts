import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../models/user.model';

@Component({
  selector: 'vex-search-schedule',
  templateUrl: './search-schedule.component.html',
  styleUrls: ['../schedule.component.scss']
})
export class SearchScheduleComponent implements OnInit {
  
  name = new FormControl('');
  userList : Array<User> = [];
  form : FormGroup;
  menu;

  constructor(
    private dialogRef : MatDialogRef<SearchScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      users: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.userList = this.data.userList;
    for (let i = 0; i < this.userList.length; i++) {//처음 로딩될때 체크박스 리셋
      this.userList[i].chk = false;
    }
    this.menu = "전체";//처음 선택 메뉴
  }

  search(){//이름 검색
    this.menu = "전체";
    this.userList = [];
    const keyword = this.name.value;
    this.name.markAsTouched();
    this.name.setErrors({nameError:null});
    this.name.updateValueAndValidity({emitEvent : false});
    
    for (let index = 0; index < this.data.userList.length; index++) {
      const element = this.data.userList[index];

      if(element.name.includes(keyword)){//검색어를 포함하는 이름이 있으면
        this.userList.push(element);
      }
    }

    if(this.userList.length == 0){
      this.name.setErrors({nameError:true});
    }
  }

  showAll(){//전체 유저 보여주기
    if(this.name.value != ''){//검색어 있으면
      this.userList = this.data.userList.filter((user) => user.name.includes(this.name.value));
    }else{
      this.userList = this.data.userList;
    }
    this.menu = "전체";
  }

  showUser(team){//팀별 유저 보여주기
    if(this.name.value != ''){//검색어 있으면
      this.userList = this.data.userList.filter((user) => user.team == team.codeName && user.name.includes(this.name.value));
    }else{//검색어 없으면
      this.userList = this.data.userList.filter((user) => user.team == team.codeName);
    }
    this.menu = team.codeName;
  }

  showMine(){//본인꺼 보여주기
    this.dialogRef.close([this.data.loginUser.id]);
  }

  submit(){//일정 보기
    const list = this.form.value.users;
    const id = [];
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      id.push(element.id);
    }

    if(id.length == 0){
      alert("선택된 팀원이 없습니다");
    }else{
      this.dialogRef.close(id);//id만 전달
    }
  }

  onChange(event, index){//체크박스 선택할때마다 달라지는거
    const users = <FormArray>this.form.controls.users as FormArray;

    //event.source.value는 방금 선택한 user
    if(event.checked) {//체크되어있으면 users에 추가
      users.push(new FormControl(event.source.value));
      this.userList[index].chk = true;
    } else {//체크 해제 시 users에서 삭제
      const i = users.controls.findIndex(x => x.value === event.source.value);
      users.removeAt(i);
      this.userList[index].chk = false;
    }
  }

  deleteName(user){//이름 선택 해제
    const users = <FormArray>this.form.get('users') as FormArray;
    const i = users.controls.findIndex(x => x.value === user);
    users.removeAt(i);//창에 보이는 리스트에서 이름 삭제

    const index = this.userList.findIndex(x => x.id === user.id)
    this.userList[index].chk = false;//체크박스 선택 해제
  }
}
