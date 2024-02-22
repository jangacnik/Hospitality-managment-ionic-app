import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import {Path} from "../shared/enums/Paths";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  jwtChangedSub = new BehaviorSubject<string>('');
  constructor(private storage: Storage,
              private _router: Router,) {
    this.storage.create().then(() => {
      this.storage.get('jwt').then((val) => {
        this.jwtChangedSub.next(val);
      });
    });
  }

  saveJwt(jwt: string, refresh: string) {
    this.set('jwt', jwt);
    this.set('refresh', refresh);
    this.jwtChangedSub.next(jwt);
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this.storage.set(key, value);
  }

  public get(key: string) {
    return this.storage.get(key);
  }

  public clearStorage() {
    this.storage.clear().then((r) => {
      this._router.navigate([Path.LOGIN]);
    });
  }
}
