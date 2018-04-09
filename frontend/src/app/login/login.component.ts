import { Component, OnInit } from '@angular/core';
import { UserStatus } from '../services/user.status';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ConfigurationService } from '../services/configuration.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
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
    window.location.href = this.userStatus.url;
  }

  viewClicked() {
    this.router.navigate(['/view/' + this.getUrlParam('share')]);
  }


  updateStatus(status: UserStatus) {
    this.userStatus = status;
    if (status != null && status.loggedIn) {
      if (this.getUrlParam('share')) {
        this.router.navigate(['/share/' + this.getUrlParam('share')]);
      } else {
        this.router.navigate(['/edit']);
      }
    }
  }

  getUrlParam(prop: string) {
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
