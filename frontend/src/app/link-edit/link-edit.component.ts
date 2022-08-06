import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Donation, Wish } from "../services/wish";
import { makeValidUrl } from "../util/url-helper";

@Component({
  selector: 'link-edit',
  templateUrl: './link-edit.component.html',
  styleUrls: ['../wish-edit/wish.component.css']
})
export class LinkEditComponent implements OnInit {
  @Input() editMode: boolean;
  @Input() viewMode: boolean;
  @Input() index: number;
  @Input() link: string;
  @Output() linkChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  targetUrl() {
    return makeValidUrl(this.link);
  }

  onLinkChanged() {
    this.linkChange.emit(this.link);
  }
}
