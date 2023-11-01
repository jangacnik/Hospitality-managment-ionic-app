import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Barcode, BarcodeScanner} from "@capacitor-mlkit/barcode-scanning";
import {AlertController} from "@ionic/angular";
import {NgxScannerQrcodeComponent, ScannerQRCodeResult} from "ngx-scanner-qrcode";

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss'],
})
export class QrComponent  implements OnInit, AfterViewInit {

  @Output() onQrScanned:EventEmitter<any> = new EventEmitter<string>();
  @ViewChild('action') action!: NgxScannerQrcodeComponent;
  constructor(private alertController: AlertController) { }
  ngOnInit(): void {
  }
  camerasNotFound(e: Event) {
    console.log(e);
    // Display an alert modal here
  }
  cameraFound(e: Event) {
    console.log(e);
    // Log to see if the camera was found
  }
  onScanSuccess(result: ScannerQRCodeResult[]) {
    this.onQrScanned.emit(result[0].value);
    this.action.stop();
  }
  ngAfterViewInit(): void {
    this.action.start();
  }
}
