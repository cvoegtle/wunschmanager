import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Wish } from "./wish";
import { catchError } from 'rxjs/operators';
import { ConfigurationService } from "./configuration.service";
import { unique } from "../util/url-helper";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  withCredentials: true
}

@Injectable()
export class WishService {

  constructor(private http: HttpClient, private configurationService: ConfigurationService) {
  }

  fetchWishes(wishListId: number | string): Observable<Wish[]> {
    return this.http.get<Wish[]>(`${this.getBaseUrl()}/wish/list?list=${wishListId}&unique=${unique()}`, httpOptions).pipe(
        catchError(this.handleError<Wish[]>('wish/list')));
  }

  add(wishListId: number): Observable<Wish> {
    return this.http.get<Wish>(`${this.getBaseUrl()}/wish/create?list=${wishListId}&unique=${unique()}`, httpOptions).pipe(
        catchError(this.handleError<Wish>('wish/create')));
  }

  delete(listId: number, wishId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.getBaseUrl()}/wish/delete?listId=${listId}&wishId=${wishId}&unique=${unique()}`, httpOptions).pipe(
        catchError(this.handleError<boolean>('wish/delete')));
  }

  update(listId: number, wish: Wish): Observable<boolean> {
    let updateRequest = {listId: listId, wish: wish};
    return this.http.post<boolean>(`${this.getBaseUrl()}/wish/update`, updateRequest, httpOptions).pipe(
        catchError(this.handleError<boolean>('wish/update')));
  }

  reserve(listId: number, wishId: number): Observable<Wish> {
    return this.http.get<Wish>(`${this.getBaseUrl()}/wish/reserve?listId=${listId}&wishId=${wishId}&unique=${unique()}`, httpOptions).pipe(
        catchError(this.handleError<Wish>('wish/reserve')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return null;
    };
  }

  private getBaseUrl() {
    return this.configurationService.configuration.backendUrl;
  }
}
