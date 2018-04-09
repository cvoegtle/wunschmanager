import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Configuration } from "./configuration";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { catchError, tap } from 'rxjs/operators';

const httpOptions = {
  withCredentials: true
}

@Injectable()
export class ConfigurationService {

  configuration: Configuration = null;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  load(): Observable<Configuration> {
    return this.http.get<Configuration>(this.getConfigurationUrl(), httpOptions).pipe(tap(config => this.configuration = config));
  }

  private getConfigurationUrl(): string {
    let url = "./configuration.json";
    return url;
  }

  isInitialised() {
    return this.configuration != null;
  }
}
