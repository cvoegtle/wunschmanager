import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Wish } from "./wish";
import { catchError } from 'rxjs/operators';
import { ConfigurationService } from "./configuration.service";
import { handleError, unique } from "../util/url-helper";
import { WishCopyTask, WishIds } from "./wish-copy-task";
import { WishOrder } from "./wish.order";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  withCredentials: true
};

@Injectable()
export class WishService {

  constructor(private http: HttpClient, private configurationService: ConfigurationService) {
  }

  fetchWishes(wishListId: number | string): Observable<Wish[]> {
    return this.http.get<Wish[]>(`${this.getBaseUrl()}/wish/list?list=${wishListId}&unique=${unique()}`, httpOptions).pipe(
        catchError(handleError<Wish[]>('wish/list')));
  }

  copy(copyTask: WishCopyTask): Observable<Wish[]> {
    return this.http.post<Wish[]>(`${this.getBaseUrl()}/wish/copy`, copyTask, httpOptions);
  }

  add(wishListId: number): Observable<Wish> {
    return this.http.get<Wish>(`${this.getBaseUrl()}/wish/create?list=${wishListId}&unique=${unique()}`, httpOptions);
  }

  delete(wishIds: WishIds): Observable<boolean> {
    return this.http.post<boolean>(`${this.getBaseUrl()}/wish/delete`, wishIds, httpOptions);
  }

  update(listId: number, wish: Wish): Observable<boolean> {
    let updateRequest = {listId: listId, wish: wish};
    return this.http.post<boolean>(`${this.getBaseUrl()}/wish/update`, updateRequest, httpOptions);
  }

  updateOrder(listId: number, wishOrders: WishOrder[]): Observable<boolean> {
    let updateRequest = {listId: listId, wishOrders: wishOrders};
    return this.http.post<boolean>(`${this.getBaseUrl()}/wish/update_order`, updateRequest, httpOptions);
  }

  reserve(listId: number, wishId: number): Observable<Wish> {
    return this.http.get<Wish>(`${this.getBaseUrl()}/wish/reserve?listId=${listId}&wishId=${wishId}&unique=${unique()}`, httpOptions);
  }

  private getBaseUrl() {
    return this.configurationService.configuration.backendUrl;
  }

}
