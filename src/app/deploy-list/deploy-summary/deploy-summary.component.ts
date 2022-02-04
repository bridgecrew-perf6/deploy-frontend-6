import { DatePipe } from '@angular/common';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExcelService } from 'src/app/services/excel-file.service';
import { Deploy } from 'src/app/models/deploy.model';
import { ScriptView } from 'src/app/models/scriptView.model';
import { DeployService } from 'src/app/services/deploy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'vex-deploy-summary',
  templateUrl: './deploy-summary.component.html',
  styleUrls: ['./deploy-summary.component.scss']
})
export class DeploySummaryComponent implements OnInit {

  deploy : Deploy;
  deployNo : number;
  expectedDeployDate : string;
  deployTitle : string;
  files:File[];
  scriptViews:ScriptView[];
  zipName: string;
  codec = new HttpUrlEncodingCodec;
  url="/api/file/zipfile/";
  fileUrl="/api/file/files/";


  p: number;//현재 페이지 정보 담기 위함
  itemsPerPage = 5;//한 페이지 당 보여줄 데이터의 수
  itemsPerPages = [10,15,20];
  totalItems: any;

  //엑셀관련
  dataForExcel = [];
  //객체 속성명을 그대로 컬럼명으로 쓰지 않고싶으면 따로 설정 해주어야 함
  dataHeaders = ["구분", "타입", "소스경로", "디렉토리생성","백업스크립트(운영)","운영파일반영스크립트","원복스크립트"]

  constructor(
    private deployDialogRef : MatDialogRef<DeploySummaryComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData,
    private deployService : DeployService,
    private pipe: DatePipe,
    private excelService : ExcelService,
    private router : Router) { }

  ngOnInit(): void {

    this.deployNo = this.dialogData.deployNo;

    //script정보
    this.deployService. selectScriptDetail(this.deployNo)
      .subscribe(
          response => {
            this.scriptViews = response.data;  
          },
      )

      this.deployService.selectDeployDetail(this.deployNo)
      .subscribe(
        res => {
          this.deploy = res.data.deploy;
          let expectedDate = this.deploy.expectedDate;
          this.expectedDeployDate = this.pipe.transform(expectedDate,'yyyy-MM-dd');
          this.files = res.data.files; 
          this.zipName = res.data.deployZip;
          this.deployTitle = res.data.deploy.deployTitle;
        }
      )
  }//ngOnInit end

  //1. 페이징처리
  getPage(page) {
    this.p = page;
  }

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

//5. 파일다운로드관련
ngEncode(param: string) {
  return this.codec.encodeValue(param);
}


  

}
