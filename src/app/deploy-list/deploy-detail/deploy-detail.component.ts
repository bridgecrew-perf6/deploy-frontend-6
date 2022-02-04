import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Deploy } from 'src/app/models/deploy.model';
import { ScriptView } from 'src/app/models/scriptView.model';
import { DeployService } from 'src/app/services/deploy.service';
import { User } from '../../models/user.model';
import { JwtService } from '../../services/jwt.service';
import { FormControl } from '@angular/forms';
import { ExcelService } from 'src/app/services/excel-file.service';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'vex-deploy-detail',
  templateUrl: './deploy-detail.component.html',
  styleUrls: ['./deploy-detail.component.scss']
})

export class DeployDetailComponent implements OnInit {
  
  //로그인정보
  loginUser : User;
  check:string;

  //deploy&script정보
  deployNo:number;
  scriptViews:ScriptView[];
  deploy:Deploy = new Deploy();

  //html option
  layoutCtrl = new FormControl('boxed');

  //페이징처리
  p: number;//현재 페이지 정보 담기 위함
  itemsPerPage = 5;//한 페이지 당 보여줄 데이터의 수
  totalItems: any;
  itemsPerPages=[5,10,15];

  //파일관련
  files:File[];
  zipName: string;
  codec = new HttpUrlEncodingCodec;
  url="/api/file/zipfile/";
  fileUrl="/api/file/files/";

  //엑셀관련
  dataForExcel = [];
  //객체 속성명을 그대로 컬럼명으로 쓰지 않고싶으면 따로 설정 해주어야 함
  dataHeaders = ["구분", "타입", "소스경로", "디렉토리생성","백업스크립트(운영)","운영파일반영스크립트","원복스크립트"]

  constructor(
    private deployService:DeployService,
    private route:ActivatedRoute,
    private router:Router,
    private jwtService:JwtService,
    private excelService : ExcelService,
    private pipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.check = localStorage.getItem("AUTH_TOKEN"); 
    if(this.check !=null){ 
      this.loginUser=this.jwtService.decodeToUser(this.check);
    }
    

    this.deployNo=this.route.snapshot.params['deployNo'];

    //script정보
    this.deployService. selectScriptDetail(this.deployNo)
      .subscribe(
          response => {
            this.scriptViews = response.data;  
          },
      )
  
    //deploy정보
    this.deployService.selectDeployDetail(this.deployNo)
        .subscribe(
          response => {
            this.deploy = response.data.deploy;
            this.files = response.data.files; 
            this.zipName = response.data.deployZip;

            let expectedDate = response.data.deploy.expectedDate;
            const expected = new Date(expectedDate)
            expectedDate = this.pipe.transform(expected, 'yyyy-MM-dd');
            this.deploy.expectedDate = expectedDate
          }
        )
    }//ngOnInit end

  //1. 엑셀다운로드
  exportAsXLSX(listTitle:string):void {   
    this.scriptViews.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    })
    let reportData = {
      title: listTitle,
      data: this.dataForExcel,
      headers: this.dataHeaders
    }
    this.excelService.exportExcel(reportData);
    this.dataForExcel=[];
  }

  //2. 페이징처리
  getPage(page) {}

  //3. 목록버튼
  cancel(){
    this.router.navigate(['/deploy-list']);
  }

  //4. 한 페이지에 보여줄 아이템 수 변경시 작동할 메서드
  handlePageSizeChange(event): void {
      this.itemsPerPage = event.target.value;
      this.p = 1;
  }

  //5. 파일다운로드관련
  ngEncode(param: string) {
    return this.codec.encodeValue(param);
  }

  //6. 배포이력 삭제
  deleteDeploy(deployNo){
    if(!confirm("삭제 하시겠습니까?")){
      return false;
    }
    this.deployService.deleteDeploy(deployNo)
    .subscribe(res=>{
      alert("삭제 되었습니다.");
      this.router.navigate(['/deploy-list']);
    })

  }

}
