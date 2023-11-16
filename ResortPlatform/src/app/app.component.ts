import { Component, OnInit } from '@angular/core';
import { StorageService } from './service/storage.service';
import { Path } from './shared/enums/Paths';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private _storageService: StorageService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._storageService.get('jwt').then((value) => {
      if (!value) {
        this._router.navigate([Path.LOGIN]);
      }
    });
  }
}
