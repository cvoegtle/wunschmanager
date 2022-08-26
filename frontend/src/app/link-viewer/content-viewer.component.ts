import { Component, Input, OnInit } from '@angular/core';
import { convertUrlToShortText, makeValidUrl } from "../util/url-helper";
import { Alternative, Wish } from "../services/wish";

@Component({
  selector: 'content-viewer',
  templateUrl: './content-viewer.component.html',
  styleUrls: ['../wish-edit/wish.component.css']
})
export class ContentViewerComponent implements OnInit {
  @Input() first: boolean;
  @Input() index: number;
  @Input() content: Alternative | Wish;

  constructor() { }

  ngOnInit(): void {
  }

  targetUrl() {
    return makeValidUrl(this.content.link);
  }
}
