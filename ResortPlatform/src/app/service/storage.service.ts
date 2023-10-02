import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage-angular";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public jwt: string = '';
  constructor(private storage: Storage) {
    this.storage.create().then(() => {
      this.storage.get("jwt").then((val) =>  {
        this.jwt = val;
        console.log(this.jwt);
      });
    });
  }


  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this.storage.set(key, value);
  }

  public get(key: string){
    return this.storage.get(key);
  }

  public clearStorage() {
    this.storage.clear().then(r => {this.storage.create().then()});

  }
}
