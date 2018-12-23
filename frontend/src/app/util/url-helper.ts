import { Observable } from "rxjs";

export function makeValidUrl(url: string): string {
  if (url != null) {
    url = url.trim();
    if (url.length > 0 && !url.startsWith("http")) {
      url = "http://" + url;
    }
  }
  return url;
}

export function unique(): number {
  return new Date().getTime();
}

export function handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error(error);
    return null;
  };
}

