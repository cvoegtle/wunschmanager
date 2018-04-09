import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from "../error-dialog/error-dialog.component";

@Component({
  selector: 'error-handler',
  template: '',
  styles: []
})
export class  ErrorHandler {

  constructor(private dialog: MatDialog) { }

  public handle(action: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: {
        action: action
      }
    });
  }

}
