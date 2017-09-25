import { Component } from '@angular/core';
import { NavController, ActionSheetController, ToastController, LoadingController, Platform, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
/*import { FileTransfer } from '@ionic-native/file-transfer';*/
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  lastImage: string = null;
  cropImageFile: string = null;
  loading: Loading;
  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private transfer: Transfer,
    private file: File,
    private filePath: FilePath,
    private _action: ActionSheetController,
    private _toast: ToastController,
    private _platform: Platform,
    private _loading: LoadingController,
    private crop: Crop,
  ) { }


  public presentActioncSheet() {
    let action = this._action.create({
      title: "Selecione",
      buttons: [
        {
          text: "Câmera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA)
          }
        },
        {
          text: "Selecionar da pasta",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY)
          }
        },
        {
          text: "Cancelar",
          role: 'cancel'
        }
      ]
    });
    action.present();
  }

  public takePicture(sourceType) {
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this._platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Erro ao salvar a foto');
    });
  }

  public copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Erro ao copiar a foto');
    });
  }

  public presentToast(text) {
    let toast = this._toast.create({
      message: text,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public cropImage() {
    this.crop.crop(this.pathForImage(this.lastImage), { quality: 100 })
      .then(
      newImage => {
        this.cropImageFile = newImage;
        console.log('new image path is: ' + newImage)
      },
      error => {
        this.presentToast('Erro ao cortar a imagem')
        console.error('Error cropping image', error)
      }
      );
  }

  public uploadImage() {
    // Destination URL
    var url = "http://ionic_test/";

    // File for Upload
    var targetPath = null;
    if (this.cropImageFile === null) {
      targetPath = this.pathForImage(this.lastImage);
    } else {
      targetPath = this.cropImageFile;
    }

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'fileName': filename }
    };

    const fileTransfer: TransferObject = this.transfer.create();

    this.loading = this._loading.create({
      content: 'Uploading...',
    });
    this.loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll()
      this.presentToast('Image succesful uploaded.');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }


}
