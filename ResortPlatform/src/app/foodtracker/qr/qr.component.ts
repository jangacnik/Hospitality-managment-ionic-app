import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AlertController} from "@ionic/angular";
import {NgxScannerQrcodeComponent, ScannerQRCodeDevice, ScannerQRCodeResult} from "ngx-scanner-qrcode";
import {ZXingScannerComponent} from "@zxing/ngx-scanner";

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss'],
})
export class QrComponent  implements OnInit, AfterViewInit {
  @Output() onQrScanned:EventEmitter<any> = new EventEmitter<string>();
  // @ViewChild('action') action!: NgxScannerQrcodeComponent;

  @ViewChild('scanner') scanner!: ZXingScannerComponent;
  constructor(private alertController: AlertController) { }
  selectedCamera: MediaDeviceInfo;
  devices: MediaDeviceInfo[] = [];
  ngOnInit(): void {
  }
  camerasFoundHandler(e: any[]) {
    if (this.devices.length == 0) {
      this.devices = e;
    }
    const backDevice = e.find(d => d.label.toLowerCase().includes("back"));
    if (backDevice) {
      this.scanner.device = backDevice;
      this.selectedCamera = backDevice;
    }
  }

  prin(e) {
    console.log(e);
  }

  scanSuccessHandler(e) {
    console.log(e);
    this.onQrScanned.emit(e);
  }
  ngAfterViewInit(): void {

  }

  onSelect(event) {
    this.scanner.enable = false;
    this.selectedCamera = event.detail.value;
    this.scanner.device = this.selectedCamera;
    this.scanner.enable = true;
  }


}
