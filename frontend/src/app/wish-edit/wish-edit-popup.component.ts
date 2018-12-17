import { AfterViewInit, Component, ElementRef, Inject, Renderer, Renderer2, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Wish } from "../services/wish";
import { makeValidUrl } from "../util/url-helper";

@Component({
  selector: 'wish-edit-popup',
  templateUrl: './wish-edit-popup.component.html',
  styleUrls: ['./wish-edit-popup.component.css']
})
export class WishEditPopupComponent {
  wish: Wish;
  private changed: boolean;
  editItem: string

  @ViewChild('wishInput') wishEdit: ElementRef;
  @ViewChild('description') descriptionEdit: ElementRef;
  @ViewChild('link') linkEdit: ElementRef;

  constructor(public dialogRef: MatDialogRef<WishEditPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.wish = data.wish;
    this.dialogRef.backdropClick().subscribe(_ => this.doClose());
    this.dialogRef.keydownEvents().subscribe(key => {
      if (key.code == "Escape") this.doClose();
    });

    this.editItem = data.item;
  }

  doClose() {
    this.dialogRef.close(this.changed);
  }

  onCaptionChange(event) {
    this.wish.caption = event.target.value;
    this.changed = true;
  }

  onDescriptionChange(event) {
    this.wish.description = event.target.value;
    this.changed = true;
  }

  onLinkChange(event) {
    this.wish.link = event.target.value;
    this.changed = true;
  }

}
