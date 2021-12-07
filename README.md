<h1 align="center"><code>osu-beatmapset-downloader</code></h1>
<p align="center"> 

![npms.io (final)](https://img.shields.io/npms-io/quality-score/osu-beatmapset-downloader?style=for-the-badge) 
![npms.io (final)](https://img.shields.io/npms-io/maintenance-score/osu-beatmapset-downloader?style=for-the-badge) 
![NPM](https://img.shields.io/npm/l/osu-beatmapset-downloader?style=for-the-badge) 
![npm](https://img.shields.io/npm/v/osu-beatmapset-downloader?style=for-the-badge)
![npm](https://img.shields.io/npm/dt/osu-beatmapset-downloader?style=for-the-badge) 

</p>

## 💡 About
This repo was originally created to download osu beatmaps when I had to switch machines. And another reason is to reduce lag while playing osu on my potato machine (because it doesn't need to open the browser)

## 📥 Installation

```sh
$ npm install osu-beatmapset-downloader
```

## ⌨️ Usage

### 🔰 Basic

```js
// import statement
const {FetchDownloadClient, OsuAuthenticator, OsuOfficialDownloader} = require("osu-beatmapset-downloader");
const {writeFile} = require("fs/promises");

async function main(args) {
  const account = {
    username: args[0] ?? process.env.OSU_USERNAME ?? "username",
    password: args[1] ?? process.env.OSU_PASSWORD ?? "password"
  }
  // get session from username and password
  const session = await OsuAuthenticator.login(account);
  // construct new OsuOfficialDownloader
  const bmsDownloader = new OsuOfficialDownloader(new FetchDownloadClient(), session);
  // download beatmapset with id 1220040
  const downloader = await bmsDownloader.download({beatmapsetId: 1220040, noVideo: true});
  const filename = await downloader.name();
  const data = await downloader.buffer();
  await writeFile(filename, data);
}

main(process.argv.slice(2)).catch(console.error);
```

### ⏫ Advanced

```js
// import statement
const {FetchDownloadClient, OsuAuthenticator, OsuOfficialDownloader} = require("osu-beatmapset-downloader");
const {createWriteStream} = require("fs");

async function main(args) {
  const account = {
    username: args[0] ?? process.env.OSU_USERNAME ?? "username",
    password: args[1] ?? process.env.OSU_PASSWORD ?? "password"
  }
  // get cookie from username and password
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
    const downloader = await bmsDownloader.download({beatmapsetId: 1220040, noVideo: true});
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

## 💌 Credits
Special thanks to:
- [**NNB**](https://github.com/NNBnh) for polish this project's `README.md`.

<br><br><br><br>

---

> <h1 align="center">Made with ❤️ by <a href="https://github.com/K4zoku"><i>K4zoku</i></a></h1>