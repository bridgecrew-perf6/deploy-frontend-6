import { Component, HostListener, Inject, LOCALE_ID, Renderer2 } from '@angular/core';
import { ConfigService } from '../@vex/services/config.service';
import { Settings } from 'luxon';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { NavigationService } from '../@vex/services/navigation.service';
import icLayers from '@iconify/icons-ic/twotone-layers';
import { LayoutService } from '../@vex/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SplashScreenService } from '../@vex/services/splash-screen.service';
import { Style, StyleService } from '../@vex/services/style.service';
import { ConfigName } from '../@vex/interfaces/config-name.model';
import icAssigment from '@iconify/icons-ic/twotone-assignment';
import icDateRange from '@iconify/icons-ic/twotone-date-range';
import icBubbleChart from '@iconify/icons-ic/twotone-bubble-chart';
import roundBarcode from '@iconify/icons-ic/round-barcode';
import { LoginService } from './services/login.service';

import { JwtService } from './services/jwt.service';
import { User } from './models/user.model';



@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vex';
  loginUser : User;
  check:string;
  id:string;
  close_window:boolean;

  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(e: KeyboardEvent) { 
  //   if (e.keyCode == 116 || (e.ctrlKey && e.keyCode == 82)) { 
  //     this.close_window = false;
  //     //shortcuts for F5 and CTRL+F5 and CTRL+R 
  //   }

  // }

  
  // @HostListener('window:beforeunload', ['$event'])
  //  beforeunloadHandler(event) {
  //   if(this.close_window!=false){
  //     this.loginUser=this.jwtService.decodeToUser(sessionStorage.getItem("AUTH_TOKEN"));
  //     sessionStorage.removeItem("AUTH_TOKEN");
  //     this.loginService.logout(this.loginUser.id)
  //     .subscribe(res=>{
       
  //     })
  //     return false;
  //   }
  // }

  

  

  constructor(private configService: ConfigService,
              private styleService: StyleService,
              private renderer: Renderer2,
              private platform: Platform,
              @Inject(DOCUMENT) private document: Document,
              @Inject(LOCALE_ID) private localeId: string,
              private layoutService: LayoutService,
              private route: ActivatedRoute,
              private navigationService: NavigationService,
              private splashScreenService: SplashScreenService,
              private loginService : LoginService,
              private jwtService : JwtService
              ) {
    Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, 'is-blink');
    }


    /**
     * Customize the template to your needs with the ConfigService
     * Example:
     *  this.configService.updateConfig({
     *    sidenav: {
     *      title: 'Custom App',
     *      imageUrl: '//placehold.it/100x100',
     *      showCollapsePin: false
     *    },
     *    showConfigButton: false,
     *    footer: {
     *      visible: false
     *    }
     *  });
     */

    /**
     * Config Related Subscriptions
     * You can remove this if you don't need the functionality of being able to enable specific configs with queryParams
     * Example: example.com/?layout=apollo&style=default
     */
    this.route.queryParamMap.pipe(
      map(queryParamMap => queryParamMap.has('rtl') && coerceBooleanProperty(queryParamMap.get('rtl'))),
    ).subscribe(isRtl => {
      this.document.body.dir = isRtl ? 'rtl' : 'ltr';
      this.configService.updateConfig({
        rtl: isRtl
      });
    });

    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('layout'))
    ).subscribe(queryParamMap => this.configService.setConfig(queryParamMap.get('layout') as ConfigName));

    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('style'))
    ).subscribe(queryParamMap => this.styleService.setStyle(queryParamMap.get('style') as Style));

    this.navigationService.items = [
      {
        type: 'link',
        label: 'Dashboard',
        route: '/',
        icon: icLayers,
        routerLinkActiveOptions: { exact: true }
      },
      {
        type:'link',
        label: 'Deploy',
        route: '/deploy-list',        
        icon: icBubbleChart,
      },
      {
        type:'link',
        label: 'Notice',
        route:'/notice',
        icon: icAssigment
      },
      {
        type:'link',
        label: 'Schedule',
        route:'/schedule',
        icon: icDateRange,
        badge: {
          value: '',
          bgClass: 'bg-deep-purple',
          textClass: 'text-deep-purple-contrast',
        }
      },      
      {
        type:'link',
        label: 'Code Management',
        route:'/code-management',
        icon: roundBarcode
      }

    ];
  }
}
