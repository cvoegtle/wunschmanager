import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Wish } from "../services/wish";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export enum ReserveAction {
  RESERVE_FOR_ME,
  SUGGEST_GROUP
}

@Component({
  selector: 'app-reserve-action-dialog',
  templateUrl: './reserve-action-dialog.component.html',
  styleUrls: ['./reserve-action-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ReserveActionDialogComponent implements OnInit {

  wish: Wish;

  constructor(
    public dialogRef: MatDialogRef<ReserveActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { wish: Wish }
  ) {
    this.wish = data.wish;
  }

  ngOnInit(): void {
  }

  reserveForMe(): void {
    this.dialogRef.close(ReserveAction.RESERVE_FOR_ME);
  }

  suggestGroup(): void {
    this.dialogRef.close(ReserveAction.SUGGEST_GROUP);
  }
}
