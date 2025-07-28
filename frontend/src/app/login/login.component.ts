import { Component, OnInit } from '@angular/core';
import { UserStatus } from '../services/user.status';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ConfigurationService } from '../services/configuration.service';
import { ErrorHandler } from "../error-handler/error-handler.component";
import { LocalStorageService } from "../services/local-storage.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {
  private userStatus: UserStatus;

  constructor(private configurationService: ConfigurationService,
              private userService: UserService,
              private router: Router,
              private errorHandler: ErrorHandler,
              private localStorage: LocalStorageService) {
  }

  ngOnInit() {
    this.storeUrlParameterShare();
    if (this.configurationService.isInitialised()) {
      this.fetchStatus();
    } else {
      this.configurationService.load().subscribe(_ => this.fetchStatus());
    }
  }

  loginClicked() {
    let url = this.userStatus.url;
    window.location.href = url;
  }

  proceedClicked() {
   this.navigateToSharing()
  }

  private fetchStatus() {
    this.userService.fetchStatus().subscribe(status => {
          this.updateStatus(status);
          if (status.loggedIn) {
            this.navigate();
          }
        },
        _ => this.errorHandler.handle('fetchStatus'));
  }

  private updateStatus(status : UserStatus) {
    this.userStatus = status;
    if (status.name) {
      this.localStorage.store(LocalStorageService.lastLogin, status.name);
    }
  }

  private navigate() {
    let force = this.getUrlParam('force');
    if (force) {
      return; // stay on login page
    }

    if (this.isListShared()) {
      this.navigateToSharing();
    } else {
      this.navigateToMainModule();
    }
  }

  private navigateToMainModule() {
    if (this.userStatus.loggedIn) {
      this.router.navigate(['/edit']);
    }
  }

  private navigateToSharing() {
    if (this.userStatus.loggedIn) {
      this.router.navigate(['/share/' + this.getSharedList()]);
    } else {
      this.router.navigate(['/view/' + this.getSharedList()]);
    }

    this.clearSharedList();
  }

  private getSharedList(): string {
    return this.localStorage.retrieve(LocalStorageService.sharedListId)
  }

  private clearSharedList() {
    this.localStorage.clear(LocalStorageService.sharedListId);
  }

  public isListShared(): boolean {
    return this.getSharedList() != null;
  }

  private storeUrlParameterShare() {
    let sharedList = this.getUrlParam('share');
    if (sharedList) {
      this.localStorage.store(LocalStorageService.sharedListId, sharedList);
    }
  }

  getUrlParam(prop: string): string {
    let params = {};
    let search = decodeURIComponent(window.location.href.slice(window.location.href.indexOf('?') + 1));
    let definitions = search.split('&');

    definitions.forEach(function (val, key) {
      let parts = val.split('=', 2);
      params[parts[0]] = parts[1];
    });

    return (prop in params) ? params[prop] : null;
  }
}
