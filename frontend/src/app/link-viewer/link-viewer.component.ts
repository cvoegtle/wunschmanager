import { Component, Input, OnInit } from '@angular/core';
import { makeValidUrl } from "../util/url-helper";

@Component({
  selector: 'link-viewer',
  templateUrl: './link-viewer.component.html',
  styleUrls: ['../wish-edit/wish.component.css']
})
export class LinkViewerComponent implements OnInit {
  @Input() index: number;
  @Input() link: string;
  description: string;

  constructor() { }

  ngOnInit(): void {
    this.description = "Alternative " + (this.index+1);
  }

  targetUrl() {
    return makeValidUrl(this.link);
  }
}
