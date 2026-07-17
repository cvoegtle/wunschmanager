import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Wish } from "../services/wish";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export enum ProxyReserveAction {
  RESERVE,
  SUGGEST_GROUP
}

@Component({
  selector: 'proxy-reserve-action-dialog',
  templateUrl: './proxy-reserve-action-dialog.component.html',
  styleUrls: ['./proxy-reserve-action-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ProxyReserveActionDialogComponent implements OnInit {

  wish: Wish;
  donor: string;

  constructor(
    public dialogRef: MatDialogRef<ProxyReserveActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { wish: Wish }
  ) {
    this.wish = data.wish;
  }

  ngOnInit(): void {
  }

  reserve(): void {
    this.dialogRef.close({donor: this.donor, action: ProxyReserveAction.RESERVE});
  }

  suggestGroup(): void {
    this.dialogRef.close({donor: this.donor, action: ProxyReserveAction.SUGGEST_GROUP});
  }
}
