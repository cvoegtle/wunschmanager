import { Injectable } from '@angular/core';
import { WishList } from "./wish-list";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { catchError } from 'rxjs/operators';
import { ConfigurationService } from "./configuration.service";
import { handleError, unique } from "../util/url-helper";

const httpOptions = {
  withCredentials: true
}

@Injectable()
export class WishListService {
  constructor(private http: HttpClient, private configurationService: ConfigurationService) {
  }

  fetch(): Observable<WishList[]> {
    return this.http.get<WishList[]>(`${this.getBaseUrl()}/wishlist/list?unique=${unique()}`, httpOptions).pipe(
        catchError(handleError<WishList[]>('wishlist/list')));
  }

  get(id: string): Observable<WishList> {
    return this.http.get<WishList>(`${this.getBaseUrl()}/wishlist/get?id=${id}&unique=${unique()}`, httpOptions).pipe(
        catchError(handleError<WishList>('wishlist/get')));
  }


  update(wishList: WishList): Observable<WishList> {
    return this.http.post<WishList>(`${this.getBaseUrl()}/wishlist/update?`, wishList, httpOptions)
        .pipe(catchError(handleError<WishList>('wishlist/update')));

  }

  share(id: string): Observable<WishList[]> {
    return this.http.get<WishList[]>(`${this.getBaseUrl()}/wishlist/share?id=${id}&unique=${unique()}`, httpOptions)
        .pipe(catchError(handleError<WishList[]>('wishlist/share')));
  }

  unshare(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.getBaseUrl()}/wishlist/unshare?id=${id}&unique=${unique()}`, httpOptions)
        .pipe(catchError(handleError<boolean>('wishlist/unshare')));
  }

  fetchShared(): Observable<WishList[]> {
    return this.http.get<WishList[]>(`${this.getBaseUrl()}/wishlist/shared?unique=${unique()}`, httpOptions)
        .pipe(catchError(handleError<WishList[]>('wishlist/shared')));
  }

  create(event: string, managed: boolean): Observable<WishList> {
    return this.http.get<WishList>(`${this.getBaseUrl()}/wishlist/create?event=${event}&managed=${managed}&unique=${unique()}`,
        httpOptions).pipe(catchError(handleError<WishList>('wishlist/create')));
  }

  duplicate(wishList: WishList, templateId: number): Observable<WishList> {
    return this.http.post<WishList>(`${this.getBaseUrl()}/wishlist/duplicate?templateId=${templateId}&unique=${unique()}`,
        wishList, httpOptions).pipe(catchError(handleError<WishList>('wishlist/duplicate')));
  }

  delete(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.getBaseUrl()}/wishlist/delete?id=${id}&unique=${unique()}`, httpOptions).pipe(
        catchError(handleError<boolean>('wishlist/delete')));
  }

  private getBaseUrl() {
    return this.configurationService.configuration.backendUrl;
  }

}
