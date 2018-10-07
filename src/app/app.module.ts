import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeModule } from './home/home.module';
import { AgeModule } from './age/age.module';
import { ShellModule } from './shell/shell.module';
import { AboutModule } from './about/about.module';
import { LoginModule } from './login/login.module';
import { SettingsModule } from './settings/settings.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '@env/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    IonicModule.forRoot(AppComponent, { locationStrategy: 'path' }),
    CoreModule,
    SharedModule,
    ShellModule,
    HomeModule,
    AgeModule,
    SettingsModule,
    AboutModule,
    LoginModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    AngularFireModule.initializeApp(environment.firebaseconfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AppRoutingModule // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Keyboard, StatusBar, SplashScreen],
  bootstrap: [IonicApp]
})
export class AppModule {}
