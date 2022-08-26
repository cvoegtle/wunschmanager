import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Alternative, Donation, Wish } from "../services/wish";
import { makeValidUrl } from "../util/url-helper";

@Component({
  selector: 'content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['../wish-edit/wish.component.css']
})
export class ContentEditComponent implements OnInit {
  @Input() editMode: boolean;
  @Input() viewMode: boolean;
  @Input() index: number;
  @Input() content: Alternative | Wish;
  @Output() contentChange = new EventEmitter<Alternative>();

  constructor() { }

  ngOnInit(): void {
  }

  targetUrl() {
    return makeValidUrl(this.content.link);
  }

  onContentChanged() {
    this.contentChange.emit(this.content);
  }
}
