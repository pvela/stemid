import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '@app/core/i18n.service';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  ageLimit = 50;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private platform: Platform,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private authenticationService: AuthenticationService,
    public i18nService: I18nService
  ) {}

  ngOnInit() {
    const localAge = localStorage.getItem('ageLimit');
    if (localAge) {
      try {
        this.ageLimit = Number.parseInt(localAge, 10);
      } catch {
        this.ageLimit = 50;
      }
    } else {
      localStorage.setItem('ageLimit', '50');
      this.ageLimit = 50;
    }
  }

  get isWeb(): boolean {
    return !this.platform.is('cordova');
  }

  get username(): string | null {
    const credentials = this.authenticationService.credentials;
    return credentials ? credentials.username : null;
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  changeLanguage() {
    this.alertController
      .create({
        title: this.translateService.instant('Change language'),
        inputs: this.i18nService.supportedLanguages.map(language => ({
          type: 'radio',
          label: language,
          value: language,
          checked: language === this.i18nService.language
        })),
        buttons: [
          {
            text: this.translateService.instant('Cancel'),
            role: 'cancel'
          },
          {
            text: this.translateService.instant('Ok'),
            handler: language => {
              this.i18nService.language = language;
            }
          }
        ]
      })
      .present();
  }
  changeAgeLimit() {
    this.alertController
      .create({
        title: 'Change Age Limit',
        inputs: [
          {
            type: 'radio',
            label: '18',
            value: '18',
            checked: 18 === this.ageLimit
          },
          {
            type: 'radio',
            label: '21',
            value: '21',
            checked: 21 === this.ageLimit
          },
          {
            type: 'radio',
            label: '42',
            value: '42',
            checked: 42 === this.ageLimit
          }
        ],
        buttons: [
          {
            text: this.translateService.instant('Cancel'),
            role: 'cancel'
          },
          {
            text: this.translateService.instant('Ok'),
            handler: ageLimit => {
              this.ageLimit = ageLimit;
              localStorage.setItem('ageLimit', ageLimit);
            }
          }
        ]
      })
      .present();
  }
}
