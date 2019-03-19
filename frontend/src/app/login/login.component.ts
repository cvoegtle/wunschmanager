import { Component, OnInit } from '@angular/core';
import { UserStatus } from '../services/user.status';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ConfigurationService } from '../services/configuration.service';
import { ErrorHandler } from "../error-handler/error-handler.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userStatus: UserStatus;

  constructor(private configurationService: ConfigurationService,
              private userService: UserService,
              private router: Router,
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
    this.userService.fetchStatus().subscribe(status => this.updateStatus(status),
        _ => this.errorHandler.handle('fetchStatus'));
  }

  loginClicked() {
    let url = this.userStatus.url;
    let sharedListId = this.getUrlParam('share');
    if (sharedListId) {
      url += `?share=${sharedListId}`;
    }

    window.location.href = url;
  }

  updateStatus(status: UserStatus) {
    this.userStatus = status;
    let force = this.getUrlParam('force');
    if (force) {
      return; // stay on login page
    }

    let sharedList = this.getUrlParam('share');
    if (sharedList) {
      this.navigateToSharing(sharedList);
    } else {
      this.navigateToMainModule();
    }
  }

  private navigateToMainModule() {
    if (this.userStatus.loggedIn) {
      this.router.navigate(['/edit']);
    }
  }

  private navigateToSharing(sharedList: string) {
    if (this.userStatus.loggedIn) {
      this.router.navigate(['/share/' + sharedList]);
    } else {
      this.router.navigate(['/view/' + sharedList]);
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
