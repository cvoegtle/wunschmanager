import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { WishListService } from '../services/wish-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WishList } from '../services/wish-list';
import { UserStatus } from '../services/user.status';
import { ConfigurationService } from '../services/configuration.service';
import { ErrorHandler } from "../error-handler/error-handler.component";

@Component({
  selector: 'share-view',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  wishLists: WishList[];

  constructor(private configurationService: ConfigurationService,
              private userService: UserService,
              private wishListService: WishListService,
              private router: Router,
              private route: ActivatedRoute,
              private errorHandler: ErrorHandler) {
  }

  ngOnInit() {
    if (this.configurationService.isInitialised()) {
      this.fetchStatus();
    } else {
      this.configurationService.load().subscribe(_ => this.fetchStatus());
    }
  }

  private fetchStatus() {
    this.userService.fetchStatus().subscribe(status => this.checkStatus(status),
        _ => this.errorHandler.handle('fetchStatus'))
  }

  private checkStatus(userStatus: UserStatus) {
    if (userStatus == null || !userStatus.loggedIn) {
      this.router.navigate(['/']);
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      this.fetchSharedWishList(id);
    }

  }

  private fetchSharedWishList(id: string) {
    this.wishListService.share(id).subscribe(wishLists => this.wishLists = wishLists,
        _ => this.errorHandler.handle('fetchSharedLists'));
  }
}
