import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Barcode, BarcodeScanner} from "@capacitor-mlkit/barcode-scanning";
import {AlertController} from "@ionic/angular";
import {NgxScannerQrcodeComponent, ScannerQRCodeDevice, ScannerQRCodeResult} from "ngx-scanner-qrcode";

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss'],
})
export class QrComponent  implements OnInit, AfterViewInit {
  @Output() onQrScanned:EventEmitter<any> = new EventEmitter<string>();
  @ViewChild('action') action!: NgxScannerQrcodeComponent;
  constructor(private alertController: AlertController) { }
  selectedCamera: ScannerQRCodeDevice;
  devices: ScannerQRCodeDevice[] = [];
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
    this.action.isBeep = false;

    this.action.isReady.subscribe((data) => {
      this.action.devices.subscribe((devs) => {
        if(this.devices.length !== devs.length) {
          this.devices = devs;
          if (!this.selectedCamera && this.devices.length > 0) {
            const backCamera = this.devices.find((d) => d.label.toLowerCase().includes("back"));
            if (backCamera) {
              this.selectedCamera = backCamera;
            } else {
              this.selectedCamera = this.devices[0];
            }
            this.action.playDevice(this.selectedCamera.deviceId);
          }
        }
      });
      this.action.start();
    });
  }

  onSelect(event) {
    this.action.playDevice(event.deviceId);
    this.action.start();
  }


}
