import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { copyWish, Donation, Wish } from "./wish";
import { ConfigurationService } from "./configuration.service";
import { unique } from "../util/url-helper";
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

  fetchWishes(wishListId: number | string, user: string = null): Observable<Wish[]> {
    let url = `${this.getBaseUrl()}/wish/list?list=${wishListId}&unique=${unique()}`;
    if (user) {
      url += `&user=${user}`;
    }
    return this.http.get<Wish[]>(url, httpOptions);
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
    let updateRequest = {listId: listId, wish: copyWish(wish)};
    return this.http.post<boolean>(`${this.getBaseUrl()}/wish/update`, updateRequest, httpOptions);
  }

  uploadImage(listId: number, wishId: number, file: File): Observable<Wish> {
    const formData = new FormData();
    formData.append('image', file, file.name);
    let url = `${this.getBaseUrl()}/image/upload?listId=${listId}&wishId=${wishId}`;
    return this.http.post<Wish>(url, formData);
  }

  updateOrder(listId: number, wishOrders: WishOrder[]): Observable<boolean> {
    let updateRequest = {listId: listId, wishOrders: wishOrders};
    return this.http.post<boolean>(`${this.getBaseUrl()}/wish/update_order`, updateRequest, httpOptions);
  }

  reserve(listId: number, wishId: number, donation: Donation, wish: Wish): Observable<Wish> {
    let reserveRequest = this.buildReserveRequest(donation, wish);
    return this.http.post<Wish>(`${this.getBaseUrl()}/wish/reserve?listId=${listId}&wishId=${wishId}`, reserveRequest, httpOptions);
  }

  proxyReserveSingle(listId: number, wishId: number, donation: Donation, wish: Wish): Observable<Wish> {
    let donations = new Array<Donation>;
    donations.push(donation);
    return this.proxyReserve(listId, wishId, donations, wish);
  }
  proxyReserve(listId: number, wishId: number, donation: Donation[], wish: Wish): Observable<Wish> {
    let reserveRequest = this.buildProxyReserveRequest(donation, wish);
    return this.http.post<Wish>(`${this.getBaseUrl()}/wish/proxy_reserve?listId=${listId}&wishId=${wishId}`, reserveRequest, httpOptions);
  }

  private buildReserveRequest(donation: Donation, wish: Wish) {
    let reserveWish = copyWish(wish);
    return {donation: donation, wish: reserveWish};
  }

  private buildProxyReserveRequest(donations: Donation[], wish: Wish) {
    let reserveWish = copyWish(wish);
    return {donations: donations, wish: reserveWish};
  }

  private getBaseUrl() {
    return this.configurationService.configuration.backendUrl;
  }

}
