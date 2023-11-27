import { Component, OnInit } from '@angular/core';
import { StorageService } from './service/storage.service';
import { Path } from './shared/enums/Paths';
import { Router } from '@angular/router';
import { retry } from 'rxjs';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private _storageService: StorageService,
    private _router: Router,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this._storageService.get('jwt').then((jwt) => {
      if (!jwt) {
        this._router.navigate([Path.LOGIN]);
      } else {
        this.fetchUserInfo(jwt);
      }
    });
  }

  fetchUserInfo(jwt?: string) {
    this._userService
      .getUserInfo(jwt)
      .pipe(retry(2))
      .subscribe({
        next: (usr) => {
          this._userService.foodTrackerUser = usr;
        },
        error: (err) => {
          if (err.status == '403') {
            this._storageService.clearStorage();
            this._router.navigate([Path.LOGIN]);
          }
        },
      });
  }
}
