import { Component, OnInit } from '@angular/core';
import { retry } from 'rxjs';
import { StorageService } from '../service/storage.service';
import { UserService } from '../service/user.service';
import { FoodTrackerUser } from '../model/FoodTrackerUser';
import { FoodTrackerUserWithMealEntry } from '../model/FoodTrackerUserWithMealEntry';
import { Router } from '@angular/router';
import { Path } from '../shared/enums/Paths';

@Component({
  selector: 'app-user',
  templateUrl: 'user.page.html',
  styleUrls: ['user.page.scss'],
})
export class UserPage implements OnInit {
  usr: FoodTrackerUser | undefined = undefined;
  usrWithTrack: FoodTrackerUserWithMealEntry | undefined = undefined;
  showLogin = true;

  constructor(
    private _storageService: StorageService,
    public userService: UserService,
    private _router: Router
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
        console.log(usr);
        this.userService.foodTrackerUser = usr;
        this.usr = usr;
      });
  }

  logout() {
    this._storageService.clearStorage();
    this._router.navigate([Path.LOGIN]);
  }
}
