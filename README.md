# osu-beatmapset-downloader

## Installation

```shell
$ npm install osu-beatmapset-downloader
```

## Usage

```js
// import statement
const {FetchDownloadClient, OsuAuthenticator, OsuOfficialDownloader} = require("osu-beatmapset-downloader");
const {createWriteStream} = require("fs");

async function main(args) {
  // get session from username and password
  const account = {
    username: args[0] ?? process.env.OSU_USERNAME ?? "username",
    password: args[1] ?? process.env.OSU_PASSWORD ?? "password"
  }
  const cookie = (await OsuAuthenticator.advancedLogin(account)).cookie;
  // check login
  if (await OsuAuthenticator.checkSession(cookie)) {
    console.log("Login success!");
    console.log("Downloading...");
    // get session value
    const session = cookie["osu_session"][0].value;
    // construct new OsuOfficialDownloader
    const bmsDownloader = new OsuOfficialDownloader(new FetchDownloadClient(), session);
    // download beatmapset with id 1220040
    const downloader = await bmsDownloader.download({beatmapsetId: 1220040});
    const filename = await downloader.name();
    const downloadStream = await downloader.stream();
    const dest = createWriteStream(filename);
    downloadStream.pipe(dest).on("finish", () => console.log("Done!"));
  } else {
    console.log("Invalid session");
  }
}

main(process.argv.slice(2)).catch(console.error);
```