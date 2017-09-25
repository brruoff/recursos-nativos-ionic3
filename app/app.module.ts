import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GpsPage } from '../pages/gps/gps';

import { File } from '@ionic-native/file';
/*import { FileTransfer } from '@ionic-native/file-transfer';*/
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    GpsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    GpsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    /*FileTransfer,*/
    Transfer,
    TransferObject,
    FilePath,
    Camera,
    Crop,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
