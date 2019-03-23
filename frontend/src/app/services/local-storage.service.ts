import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorageService {
  public static lastLogin: string = "last-login";

  public store(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public retrieve(key: string): string {
    return localStorage.getItem(key);
  }


}