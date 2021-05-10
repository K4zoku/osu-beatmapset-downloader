import fetch, {Headers} from "node-fetch";
import {Cookies, parseCookies, wrapCookies} from "./CookieUtil";

export interface AdvancedLoginResult {
  cookie: Cookies;
  data: object;
}

export async function advancedLogin(username: string, password: string): Promise<AdvancedLoginResult> {
  let home = await fetch("https://osu.ppy.sh/home", {
    method: "HEAD"
  });
  if (home.status !== 200) throw new Error(home.status + " " + home.statusText);
  let cookies = parseCookies(home.headers.raw()["Set-Cookie"]);
  let body = new URLSearchParams();
  body.append("_token", cookies["XSRF-TOKEN"][0].value);
  body.append("username", username);
  body.append("password", password);
  let headers = new Headers();
  headers.set("Cookie", wrapCookies(cookies));
  headers.set("Referer", "https://osu.ppy.sh/home");
  headers.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  let session = await fetch("https://osu.ppy.sh/session", {
    method: "POST",
    headers, body
  });
  if (home.status !== 200) throw new Error(session.status + " " + session.statusText);
  return {
    cookie: parseCookies(session.headers.raw()["Set-Cookie"]),
    data: await session.json(),
  };
}

export default async function login(username: string, password: string) {
  return (await advancedLogin(username, password)).cookie["osu_session"][0].value;
}
