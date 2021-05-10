export interface Cookie {
  name?: string;
  value: string;
  expires?: Date;
  maxAge?: number;
}

export interface Cookies {
  [name: string]: Cookie[]
}

export function parseCookies(raw: string[], decode = true): Cookies {
  let cookies = raw.map(r => parseCookieString(r, decode));
  let result = {};
  for (const {name, ...value} of cookies) {
    if (result[name] === undefined) {
      result[name] = [value];
    } else {
      result[name].push(value);
    }
  }
  return result;
}

export function parseCookieString(rawCookie: string, decode: boolean = true): Cookie {
  let parts = rawCookie.split(";").filter(value => value !== "");
  let [name, ...trials] = parts.shift().split("=");
  let value = trials.join("=");
  value = decode ? decodeURIComponent(value) : value;
  let cookie: Cookie = {name, value};
  for (const part of parts) {
    let sides = part.split("=");
    let key = sides.shift().trimLeft().toLowerCase();
    let value = sides.join("=");
    switch (key.toLowerCase()) {
      case "expires":
        cookie.expires = new Date(value);
        break;
      case "max-age":
        cookie.maxAge = parseInt(value);
        break;
      default:
        cookie[key] = value === "" ? true : value;
    }
  }
  return cookie;
}

export function wrapCookies(parsedCookies: Cookies): string {
  return Object.entries(parsedCookies)
    .map(([name, cookie]) => name + "=" + cookie
      .filter(c =>
        c.maxAge && (c.maxAge > 0) ||
        c.expires && (c.expires.getTime() - Date.now() > 0)
      )
      .map(d => d.value).join(";"))
    .join(";");
}