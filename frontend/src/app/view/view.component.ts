import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../services/configuration.service';
import { WishListService } from '../services/wish-list.service';
import { WishList } from '../services/wish-list';
import { ErrorHandler } from '../error-handler/error-handler.component';
import { LocalStorageService } from "../services/local-storage.service";
import { MatSnackBar } from "@angular/material";

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
              private wishListService: WishListService,
              private localStorage: LocalStorageService,
              private route: ActivatedRoute,
              private errorHandler: ErrorHandler,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.lastKnownUser = this.localStorage.retrieve(LocalStorageService.lastLogin);
    if (this.configurationService.isInitialised()) {
      this.fetchWishList();
    } else {
      this.configurationService.load().subscribe(_ => this.fetchWishList());
    }
  }

  fetchWishList() {
    const id = this.route.snapshot.paramMap.get('id');
    this.wishListService.get(id).subscribe(wishList => this.processWishList(wishList),
        _ => this.errorHandler.handle('fetchLists'))
  }

  private processWishList(wishList: WishList) {
    if (wishList.owner != this.lastKnownUser) {
      return this.wishList = wishList;
    } else {
      this.ownWishList = true;
      this.snackBar.open("Tsetsetse, das ist doch Deine eigene Wunschliste.", null, {duration: 5000})
    }
  }
}
