import {Component, OnInit} from '@angular/core';
import {AlertController} from "@ionic/angular";
import {Barcode, BarcodeScanner} from "@capacitor-mlkit/barcode-scanning";

@Component({
  selector: 'app-foodtracker',
  templateUrl: 'foodtracker.page.html',
  styleUrls: ['foodtracker.page.scss']
})
export class FoodtrackerPage implements OnInit{

  isSupported = false;
  barcodes: Barcode[] = [];
  constructor(private alertController: AlertController) {

  }
  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);
  }
  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }
  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }
  ngOnInit(): void {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }
}
