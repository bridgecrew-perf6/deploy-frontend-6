import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user.model';
import { UserService } from './user.service';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: []
})
export class UserComponent implements OnInit {//OnInit implements 해주셔야 합니다.
  //페이징 될 리스트들의 정보 model에 다 담아서 배열로 선언해주기
  users: User[];
  p: number;//현재 페이지 정보 담기 위함
  itemsPerPage = 5;//한 페이지 당 보여줄 데이터의 수
  itemsPerPages = [5, 10, 15];
  totalItems: any;
  
  constructor(private router: Router, 
              private userService: UserService) {}

  
  ngOnInit() {
    /**
    이 컴포넌트가 로드될 때 ngOnInit() method 사용되므로 페이징될 정보의 모든 리스트 불러오는
    메서드와 그에 해당하는 서비스는 여기서 불러주시면 됩니다.
    백단에서는 따로 pagination을 위한 구문 작성하실 필요 없고, 기본 selectList 구문입니다.
    */
    this.userService.getUsers()
      .subscribe( data => {
          this.users = data;
    });
  };

  //페이지 변경시 호출 될 메서드 
  //20210510 정진하 인자와 중괄호 안 수정되었습니다.
  getPage(event) {//The $event argument will be the number of the new page.
    this.p = event;//새로운 페이지의 숫자 p에 담아준다.
  }
  //한 페이지에 보여줄 아이템 수 변경시 작동할 메서드
  handlePageSizeChange(event): void {
    this.itemsPerPage = event.target.value;
    this.p = 1;
  }

}
