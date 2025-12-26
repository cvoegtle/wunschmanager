import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from "../error-dialog/error-dialog.component";
import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { ConfigurationService } from "../services/configuration.service";
import { ErrorSessionDialogComponent } from "../error-session-dialog/error-session-dialog.component";

@Component({
  selector: 'error-handler',
  template: '',
  styles: [],
  standalone: false
})
export class ErrorHandler {

  constructor(private configurationService: ConfigurationService, private dialog: MatDialog) {
  }

  public handle(error: HttpErrorResponse, failedAction: string) {
    if (error.status == HttpStatusCode.Unauthorized) {
      this.handleMissingAuthorisation();
    } else {
      this.handleGeneralError(failedAction);
    }
  }

  private handleGeneralError(failedAction: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: {
        failedAction: failedAction
      }
    });
  }

  private handleMissingAuthorisation() {
    let errorSessionDialog = this.dialog.open(ErrorSessionDialogComponent);
    errorSessionDialog.afterClosed().subscribe(result => {
      window.location.href = this.getBaseUrl() + '/oauth2/authorization/google';
    });
  }

  private getBaseUrl() {
    return this.configurationService.configuration.backendUrl;
  }

}
