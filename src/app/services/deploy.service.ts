import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Deploy } from '../models/deploy.model';
import { Script } from '../models/script.model';
import { ScriptView } from '../models/scriptView.model';
import { Observable } from 'rxjs';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class DeployService {

  constructor(
    private httpClient:HttpClient
  ) { }

  private deployURL='/api/deploy';
  private fileURL='/api/file';

  //1. insert deploys
  public insertDeploy(deploys){
    return this.httpClient.post<any>(this.deployURL,deploys);
  }

  //2. select scripts
  public selectScriptDetail(deployNo){
      return this.httpClient.get<any>(this.deployURL+"/"+deployNo);
  }

  //3. select deploy
  public selectDeployDetail(deployNo){
    return this.httpClient.get<any>(this.deployURL+"/deployContent/"+deployNo);
  }

  //4. search deploys
  public searchDeploy(searchCategory,keyword,startDate,endDate){
    return this.httpClient.get<any>(this.deployURL + "/search?searchCategory=" + searchCategory + "&keyword=" + keyword
    +"&startDate=" + startDate + "&endDate=" + endDate)
  }

  //5. select File info
  public selectFileInfo(deployNo){
    return this.httpClient.get<any>(this.deployURL + "/search/" + deployNo);
  }

  // to download method
  public fileDownload(filename){
    this.httpClient.get<any>(this.fileURL + "/files/" + filename);
  }

  //deploy state update
  public updateDeployState(deploy : Deploy){
    return this.httpClient.patch<any>(this.deployURL,deploy);
  }

  //team search
  public selectTeamDeployList(teamName : String){
    return this.httpClient.get<any>(this.deployURL+"/teamlist?codeName="+teamName);
  }
  
  //6. 
  public deleteDeploy(deployNo){
    return this.httpClient.delete<any>(this.deployURL + "/" + deployNo)
  }

  //7.
  public selectTeamDeploy(teamName : String){
    return this.httpClient.get<any>(this.deployURL+"/team?codeName="+teamName);
  }
}
