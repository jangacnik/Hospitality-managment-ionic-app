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
import { AlertController, ToastController } from '@ionic/angular';

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
  reservations: any | undefined;
  tomorrowDate: Date = new Date();
  tkString = '';
  constructor(
    private storageService: StorageService,
    public userService: UserService,
    private _toastController: ToastController,
    private _alertController: AlertController
  ) {}

  showLogin = true;

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Confirm',
      role: 'confirm',
    },
  ];

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

    this.fetchAllReservationInfo();
    this.tomorrowDate.setDate(this.tomorrowDate.getDate() + 1);
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

  fetchAllReservationInfo() {
    this.userService.getAllReservations().subscribe((val) => {
      this.reservations = val;
    });
  }

  async presentToast(msg: string) {
    const toast = await this._toastController.create({
      message: msg,
      duration: 4000,
      position: 'bottom',
    });

    await toast.present();
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
    this.tomorrowDate.setDate(currentDate.getDate() + 1);

    const dataModel = {
      employeeNumber: this.usr.employeeNumber,
      mealType: mealType,
    };
    this.userService.addReservation(dataModel).subscribe((val) => {
      this.presentToast('Reservation was successfully added!');
      this.fetchAllReservationInfo();
    });
    //TODO: Error - "there was a problem adding the booking"
  }

  canDelete(date) {
    let reservationDate = new Date(date).toISOString().split('T')[0];
    let currentDate = new Date().toISOString().split('T')[0];
    if (reservationDate > currentDate) {
      return true;
    }
    return false;
  }

  async btnDeleteReservation(reservationId: number, date: string) {
    let alert = await this._alertController.create({
      header: 'Delete reservation',
      message: 'Are you sure you want to delete the reservation for ' + date,
      buttons: this.alertButtons,
    });
    await alert.present();
    alert.onDidDismiss().then((data) => {
      if (data.role == 'confirm') {
        this.storageService.jwtChangedSub.subscribe((jwt) => {
          if (jwt) {
            this.userService
              .deleteReservationById(reservationId, jwt)
              .subscribe((val) => {
                this.fetchAllReservationInfo();
                this.presentToast('Reservation was successfully deleted!');
              });
          }
        });
      }
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

  ngOnChanges(changes: SimpleChanges): void {}

  openDialog(isOpen: boolean) {
    this.openModal = isOpen;
  }

  openReservationDialog(isOpen: boolean) {
    this.openReservationModal = isOpen;
  }

  scanWasSuccessful(json: string) {
    this.openModal = false;
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
          this.presentToast('Meal was successfully added!');
        });
    });
  }
}
