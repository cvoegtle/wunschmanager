import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../services/configuration.service';
import { WishListService } from '../services/wish-list.service';
import { WishList } from '../services/wish-list';
import { ErrorHandler } from '../error-handler/error-handler.component';
import { LocalStorageService } from "../services/local-storage.service";
import { MatSnackBar } from "@angular/material";
import { UserService } from "../services/user.service";
import { UserStatus } from "../services/user.status";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  wishList: WishList;
  lastKnownUser: string;
  ownWishList: boolean;

  constructor(private configurationService: ConfigurationService,
              private userService: UserService,
              private wishListService: WishListService,
              private localStorage: LocalStorageService,
              private route: ActivatedRoute,
              private errorHandler: ErrorHandler,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.lastKnownUser = this.localStorage.retrieve(LocalStorageService.lastLogin);
    if (this.configurationService.isInitialised()) {
      this.fetchStatus();
    } else {
      this.configurationService.load().subscribe(_ => this.fetchWishList());
    }
  }

  private fetchStatus() {
    this.userService.fetchStatus().subscribe(status => this.checkStatus(status),
        _ => this.errorHandler.handle('fetchStatus'))
  }

  private checkStatus(status: UserStatus) {
    if (status.loggedIn) {
      this.fetchAndKeepWishList();
    } else {
      this.fetchWishList();
    }
  }

  private fetchAndKeepWishList() {
    const id = this.route.snapshot.paramMap.get('id');
    this.wishListService.share(id).subscribe(wishLists => {
          if (wishLists) {
            this.processWishList(wishLists[0])
          }
        },
        _ => this.errorHandler.handle('fetchSharedLists'));
  }

  private fetchWishList() {
    const id = this.route.snapshot.paramMap.get('id');
    this.wishListService.get(id).subscribe(wishList => this.processWishList(wishList),
        _ => this.errorHandler.handle('fetchLists'));
  }

  private processWishList(wishList: WishList) {
    if (wishList.owner != this.lastKnownUser) {
      return this.wishList = wishList;
    } else {
      this.ownWishList = true;
      this.snackBar.open("Tsetsetse, das ist Deine eigene Wunschliste.", null, {duration: 5000})
    }
  }
}
