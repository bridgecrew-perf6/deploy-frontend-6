
import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }
  exportExcel(excelData) {

    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers;
    const data = excelData.data;
    
    //Create a workbook with a worksheet
    var workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);//worksheet 이름을 정해줍니다.

    //Add Row and formatting
    worksheet.mergeCells('A1', 'D4');
    let titleRow = worksheet.getCell('A1');
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }//title 수직 수평 중앙으로 맞춰줌

    // Date : 엑셀 파일 다운로드 날을 엑셀에 표시하기 위해 사용할 수 있습니다.
    worksheet.mergeCells('E1:F4');
    let today = new Date();
    let date = (today.getFullYear())+ "-"+ (today.getMonth()+1) + '-' + (today.getDate());
    let dateCell = worksheet.getCell('E1');
    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 13,
      bold: true,
      color: { argb: '424242' }
    }
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

    //Blank Row: title과 content 사이에 빈 row 추가함
    worksheet.addRow([]);

    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '757575' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
    })

    // Adding Data with Conditional Formatting
    data.forEach(d => {
      //data 중 색깔이나 
      let row = worksheet.addRow(d);
      let ids = row.getCell(1);//샘플에서는 아이디를 conditional formatting 했습니다.
      let color = '00796B';

      ids.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
      ids.font = {
        bold: true,//글씨 굵기 
        color: { argb: 'FFFFFF' }//글씨 색깔
      }
      ids.alignment = { horizontal: 'left'}
    }
    );

    //데이터 길이에 따라 컬럼 길이 조절하고 싶으면 여기서 해주시면 됩니다.
    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 10;
    worksheet.getColumn(3).width = 80;
    worksheet.getColumn(4).width = 80;
    worksheet.getColumn(5).width = 80;
    worksheet.getColumn(6).width = 80;
    worksheet.getColumn(7).width = 80;
    worksheet.getColumn(8).width = 80;
    worksheet.addRow([]);

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })

  }
}
