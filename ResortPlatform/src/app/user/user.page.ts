import { Component, OnInit } from '@angular/core';
import { retry } from 'rxjs';
import { StorageService } from '../service/storage.service';
import { UserService } from '../service/user.service';
import { FoodTrackerUser } from '../model/FoodTrackerUser';
import { FoodTrackerUserWithMealEntry } from '../model/FoodTrackerUserWithMealEntry';
import { Router } from '@angular/router';
import { Path } from '../shared/enums/Paths';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: 'user.page.html',
  styleUrls: ['user.page.scss'],
})
export class UserPage implements OnInit {
  usr: FoodTrackerUser | undefined = undefined;
  usrWithTrack: FoodTrackerUserWithMealEntry | undefined = undefined;
  showLogin = true;

  openPasswordModal = false;
  isModalConfirmBtnActive = false;
  oldPass = '';
  newPass = '';
  repeatPass = '';
  errMsg = '';

  constructor(
    private _storageService: StorageService,
    public userService: UserService,
    private _router: Router,
    private _authService: AuthService
  ) {}
  ngOnInit(): void {
    this._storageService.jwtChangedSub.subscribe((jwt) => {
      if (jwt) {
        this.showLogin = false;
        this.fetchUserInfo(jwt);
      }
    });
  }

  fetchUserInfo(jwt?: string) {
    this.userService
      .getUserInfo(jwt)
      .pipe(retry(2))
      .subscribe((usr) => {
        this.userService.foodTrackerUser = usr;
        this.usr = usr;
      });
  }

  openPasswordDialog(isOpen: boolean) {
    this.openPasswordModal = isOpen;
    this.errMsg = '';
  }

  changePasswordBtn() {
    this.errMsg = '';
    const dataModel = {
      oldPassword: this.oldPass,
      newPassword: this.newPass,
      confirmPassword: this.repeatPass,
    };

    this._authService.passwordChange(dataModel).subscribe((val) => {
      if (val == true) {
        this.openPasswordModal = false;
      } else {
        this.errMsg = 'Error changing password';
      }
    });
  }

  logout() {
    this._storageService.clearStorage();
    this._router.navigate([Path.LOGIN]);
  }
}
