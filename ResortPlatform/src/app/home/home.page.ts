import {AfterContentInit, AfterViewChecked, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Route, Router} from "@angular/router";
import {Storage} from "@ionic/storage-angular";
import {StorageService} from "../service/storage.service";
import {UserService} from "../service/user.service";
import {FoodTrackerUser} from "../model/FoodTrackerUser";
import {FoodTrackerUserWithMealEntry} from "../model/FoodTrackerUserWithMealEntry";
import {MealEntry} from "../model/MealEntry";
import {debounceTime, delay, retry, retryWhen} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnChanges{
  usr: FoodTrackerUser | undefined = undefined;
  usrWithTrack : FoodTrackerUserWithMealEntry | undefined = undefined;
  userLoggedIn: boolean = false;
  meals: MealEntry | undefined;
  constructor(private storageService: StorageService, public userService: UserService) {
  }

  showLogin = true;

  ngOnInit(): void {
    // this.storageService.get("jwt").then((value) => {
    //   if (value) {
    //     this.showLogin = false;
    //     this.fetchUserInfo();
    //   }
    // });
    this.storageService.jwtChangedSub.subscribe((jwt) => {
      if(jwt) {
        this.showLogin = false;
        this.fetchUserInfo(jwt);
      }
    })
  }


  fetchUserInfo(jwt?: string) {
    this.userService.getUserInfo(jwt).pipe(retry(2)).subscribe((usr) => {
      this.userService.foodTrackerUser = usr;
      this.usr = usr;
      this.userService.getCurrentMonthTracking(usr.employeeNumber).subscribe((tr) => {
        this.usrWithTrack = tr;
        this.meals = this.usrWithTrack.mealEntry;
      });
    });
  }

  public confirmMealButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Track canceled');
      },
    },
    {
      text: 'Track',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
        // @ts-ignore
        this.userService.trackMeal(this.usr.employeeNumber).subscribe(() => {
          // @ts-ignore
          this.userService.getCurrentMonthTracking(this.usr.employeeNumber).subscribe((tr) => {
            this.usrWithTrack = tr;
            this.meals = this.usrWithTrack.mealEntry;
          });
        });
      },
    },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }


}
