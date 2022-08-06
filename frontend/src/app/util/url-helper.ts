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

let MAX_LINK_TEXT = 42;
export function convertUrlToShortText(url: string): string {
  let urlWithOutName = removeSchema(url);
  if (urlWithOutName.length <= MAX_LINK_TEXT) {
    return urlWithOutName;
  }

  let hostname = extractHostName(urlWithOutName);
  if (hostname.length > MAX_LINK_TEXT) {
    return hostname;
  }

  return urlWithOutName.substring(0, MAX_LINK_TEXT) + "...";
}

export function extractHostName(url: string): string {
  url = removeSchema(url);
  let parts = url.split("/");
  return parts[0];
}

function removeSchema(url: string):string {
  let parts = url.split("://");
  return parts.length == 1 ? parts[0] : parts[1];
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

