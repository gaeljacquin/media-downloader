<h1 align="center">
  <img src="src-tauri/icons/128x128.png" width="128" alt="Media Downloader logo" />
  <br>
  Media Downloader
  <br>

  [![publish](https://github.com/gaeljacquin/media-downloader/actions/workflows/publish.yml/badge.svg)](https://github.com/gaeljacquin/media-downloader/actions/workflows/publish.yml)
</h1>

<h3 align="center">
  Save audio & video locally through a GUI wrapper for <a href="https://github.com/yt-dlp/yt-dlp/">yt-dlp</a>
</h3>

## Features
- Cross platform
- Modern UI
- Dark mode
- Console output
- Hide in system tray
- *__And more to come...__*

## Screenshots
[comment]: <> (Update before merging)
![](/screenshots/win11_1.png)

![](/screenshots/win11_2.png)

![](/screenshots/win11_3.png)

## Instructions
### Install
Head over to [Releases](https://github.com/gaeljacquin/media-downloader/releases).

### Build
#### Prerequisites
* [yt-dlp](https://github.com/yt-dlp/yt-dlp/)
* [Webview2](https://developer.microsoft.com/en-us/microsoft-edge/webview2) (Windows only, if it's not already installed)
* [FFmpeg](https://ffmpeg.org/download.html) (optional)

#### Steps
1. Clone the repository.
2. Add the [yt-dlp binary](https://github.com/yt-dlp/yt-dlp/releases) to `src/tauri/binaries`.
3. Rename `yt-dlp` to `yt-dlp-$TARGET`, replacing `$TARGET` with the corresponding platform e.g. `x86_64-pc-windows-msvc` for Windows.
4. Run `pnpm tauri build --target $TARGET`.

## Important Notes
**Builds and installers were (so far) only tested on Windows 11.**
