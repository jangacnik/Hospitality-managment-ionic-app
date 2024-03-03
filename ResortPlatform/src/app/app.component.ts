import { Component, OnInit } from '@angular/core';
import { StorageService } from './service/storage.service';
import { Path } from './shared/enums/Paths';
import { Router } from '@angular/router';
import { retry } from 'rxjs';
import { UserService } from './service/user.service';
import { AuthService } from './service/auth.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private _storageService: StorageService,
    private _router: Router,
    private _authService: AuthService,
    private _userService: UserService,
    public platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.platform.resume.subscribe(async () => {
        this.refreshFun();
      });
    });
  }

  ngOnInit(): void {
    this._storageService.get('jwt').then((jwt) => {
      if (!jwt) {
        this._storageService.clearStorage();
        this._router.navigate([Path.LOGIN]);
      } else {
        this.refreshFun();
        this.fetchUserInfo(jwt);
      }
    });
  }

  refreshFun() {
    this._storageService.get('refresh').then((refresh) => {
      if (refresh) {
        this._authService.refreshToken(refresh).subscribe((res) => {
          this._storageService.saveJwt(res.token, res.refreshToken);
          this.fetchUserInfo(res.token);
        },
          error => {
          this._storageService.clearStorage();

          });
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
