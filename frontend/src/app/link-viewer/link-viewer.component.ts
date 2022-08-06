import { Component, Input, OnInit } from '@angular/core';
import { convertUrlToShortText, makeValidUrl } from "../util/url-helper";

@Component({
  selector: 'link-viewer',
  templateUrl: './link-viewer.component.html',
  styleUrls: ['../wish-edit/wish.component.css']
})
export class LinkViewerComponent implements OnInit {
  @Input() first: boolean;
  @Input() index: number;
  @Input() link: string;
  description: string;

  constructor() { }

  ngOnInit(): void {
    this.description = this.index + ". " + convertUrlToShortText(this.link);
  }

  targetUrl() {
    return makeValidUrl(this.link);
  }
}
