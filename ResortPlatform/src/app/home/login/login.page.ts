import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { StorageService } from '../../service/storage.service';
import { Path } from 'src/app/shared/enums/Paths';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // @Output() loggedInSuccess: EventEmitter<null> = new EventEmitter<null>();

  public loginForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private storage: StorageService,
    private _router: Router
  ) {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

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
      });
  }
}
