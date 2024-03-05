import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create login form', () => {
    expect(component.loginForm).not.toBeNull();
    expect(component.loginForm.get('email')).not.toBeNull();
    expect(component.loginForm.get('email')!.value).toEqual('');
    expect(component.loginForm.get('email')!.valid).toBeFalsy();
    expect(component.loginForm.get('password')).not.toBeNull();
    expect(component.loginForm.get('password')!.value).toEqual('');
    expect(component.loginForm.get('password')!.valid).toBeFalsy();
  });

  it('should show email invalid if email is not valid', () => {
    component.loginForm.get('email')!.setValue('invalid email');

    expect(component.loginForm.get('email')!.valid).toBeFalsy();
  });

  it('should show email valid if email is valid', () => {
    component.loginForm.get('email')!.setValue('valid@email.com');

    expect(component.loginForm.get('email')!.valid).toBeTruthy();
  });

  it('should have a valid login form', () => {
    component.loginForm.get('email')!.setValue('valid@email.com');
    component.loginForm.get('password')!.setValue('Password123!');

    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should navigate to food-tracker', () => {
    spyOn(router, 'navigate');
    component.login();
    expect(router.navigate).toHaveBeenCalledWith(['food-tracker']);
  });

  it('should navigate to register', () => {
    spyOn(router, 'navigate');
    component.register();
    expect(router.navigate).toHaveBeenCalledWith(['register']);
  });
});
