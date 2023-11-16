import {
  AfterContentInit,
  AfterViewChecked,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from '../service/storage.service';
import { UserService } from '../service/user.service';
import { FoodTrackerUser } from '../model/FoodTrackerUser';
import { FoodTrackerUserWithMealEntry } from '../model/FoodTrackerUserWithMealEntry';
import { MealEntry } from '../model/MealEntry';
import { debounceTime, delay, retry, retryWhen } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnChanges {
  reservationOptions = [
    { text: 'Lunch', checked: false },
    { text: 'Dinner', checked: false },
  ];
  openModal = false;
  openReservationModal = false;
  isReservationBtnActive = false;
  usr: FoodTrackerUser | undefined = undefined;
  usrWithTrack: FoodTrackerUserWithMealEntry | undefined = undefined;
  userLoggedIn: boolean = false;
  meals: MealEntry | undefined;
  constructor(
    private storageService: StorageService,
    public userService: UserService
  ) {}

  showLogin = true;

  ngOnInit(): void {
    // this.storageService.get("jwt").then((value) => {
    //   if (value) {
    //     this.showLogin = false;
    //     this.fetchUserInfo();
    //   }
    // });
    this.storageService.jwtChangedSub.subscribe((jwt) => {
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
        this.userService
          .getCurrentMonthTracking(usr.employeeNumber)
          .subscribe((tr) => {
            this.usrWithTrack = tr;
            this.meals = this.usrWithTrack.mealEntry;
          });
      });
  }

  addReservationBtn() {
    this.openReservationModal = false;
    let mealType = [];

    // Disablaj vse izbrane opcije pri rezervaciji
    for (let opt of this.reservationOptions) {
      if (opt.checked == true) {
        mealType.push(opt.text.toUpperCase());
        opt.checked = false;
      }
    }

    let currentDate = new Date();
    let dd = String(currentDate.getDate()).padStart(2, '0');
    let mm = String(currentDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = currentDate.getFullYear();
    let reservationDate = yyyy + '-' + mm + '-' + dd;

    const dataModel = {
      employeeNumber: this.usr.employeeNumber,
      mealType: mealType,
      reservationDate: reservationDate,
    };
    console.log(dataModel);
    this.userService.addReservation(dataModel).subscribe((val) => {
      console.log(val);
    });
  }

  changeEvent(event) {
    this.isReservationBtnActive = false;
    for (let opt of this.reservationOptions) {
      if (opt.checked == true) {
        this.isReservationBtnActive = true;
        break;
      }
    }
  }

  // TODO: Verjetno za deletnit (HTML tudi)
  // public confirmMealButtons = [
  //   {
  //     text: 'Cancel',
  //     role: 'cancel',
  //     handler: () => {
  //       console.log('Track canceled');
  //     },
  //   },
  //   {
  //     text: 'Track',
  //     role: 'confirm',
  //     handler: () => {
  //       console.log('Alert confirmed');
  //       // @ts-ignore
  //       this.userService.trackMeal(this.usr.employeeNumber).subscribe(() => {
  //         // @ts-ignore
  //         this.userService
  //           .getCurrentMonthTracking(this.usr.employeeNumber)
  //           .subscribe((tr) => {
  //             this.usrWithTrack = tr;
  //             this.meals = this.usrWithTrack.mealEntry;
  //           });
  //       });
  //     },
  //   },
  // ];

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  openDialog(isOpen: boolean) {
    this.openModal = isOpen;
  }

  openReservationDialog(isOpen: boolean) {
    this.openReservationModal = isOpen;
  }

  scanWasSuccessful(json: string) {
    this.openModal = false;
    console.log(json);
    const dataModel = {
      employeeNumber: this.usr.employeeNumber,
      qrPasscode: json,
    };
    this.userService.trackMeal(dataModel).subscribe(() => {
      // @ts-ignore
      this.userService
        .getCurrentMonthTracking(this.usr.employeeNumber)
        .subscribe((tr) => {
          this.usrWithTrack = tr;
          this.meals = this.usrWithTrack.mealEntry;
        });
    });
  }
}
