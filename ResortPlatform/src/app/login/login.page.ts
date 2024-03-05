import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { StorageService } from '../service/storage.service';
import { Path } from 'src/app/shared/enums/Paths';
import {ToastController} from "@ionic/angular";
import {Keyboard, KeyboardInfo, KeyboardResize} from "@capacitor/keyboard";
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // @Output() loggedInSuccess: EventEmitter<null> = new EventEmitter<null>();

  public loginForm: FormGroup;
  hasError = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private storage: StorageService,
    private _router: Router,
    private _toastController: ToastController
  ) {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    Keyboard.addListener('keyboardWillShow', (info: KeyboardInfo) => {
      Keyboard.setResizeMode({mode: KeyboardResize.None}).then();
    });
  }

  ngOnInit() {
  }

  login() {
    this._authService
      .signin(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      )
      .subscribe((res) => {
        this.storage.saveJwt(res.token, res.refreshToken);
        // this.loggedInSuccess.emit();
        this._router.navigate([Path.FOOD_TRACKER]);
      },
        error => {
          this.hasError = true;
          this.presentToast("Email or Password incorrect, please try again");
          this.loginForm.controls["password"].setErrors({'incorrect': true});
        });
  }

  async presentToast(msg: string) {
    //TODO: premaknit v nek service za vse komponente
    const toast = await this._toastController.create({
      message: msg,
      duration: 4000,
      position: 'top',
      color: 'danger',
    });

    await toast.present();
  }
}
