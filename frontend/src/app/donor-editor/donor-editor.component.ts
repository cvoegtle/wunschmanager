import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DonationInEdit } from "../services/wish";

@Component({
    selector: 'donor-editor',
    templateUrl: './donor-editor.component.html',
    styleUrls: ['./donor-editor.component.css'],
    standalone: false
})
export class DonorEditorComponent implements OnInit {
  @Input() donationInEdit: DonationInEdit;
  @Input() userName: string;
  @Output() remove = new EventEmitter<DonationInEdit>();
  @Output() edit = new EventEmitter<DonationInEdit>();


  constructor() { }

  ngOnInit(): void {
  }

  protected deleteClicked() {
    this.remove.emit(this.donationInEdit);
  }

  protected editClicked() {
    this.edit.emit(this.donationInEdit);
  }
}
