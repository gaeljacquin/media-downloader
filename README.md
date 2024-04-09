<h1 align="center">
  <img src="src-tauri/icons/128x128.png" width="128" />
  <br>
  yt-dlp GUI
  <br>

  [![publish](https://github.com/gaeljacquin/yt-dlp-gui/actions/workflows/publish.yml/badge.svg)](https://github.com/gaeljacquin/yt-dlp-gui/actions/workflows/publish.yml)
</h1>

<h3 align="center">
  A cross-platform GUI client for <a href="https://github.com/yt-dlp/yt-dlp/">yt-dlp</a> built with <a href="https://tauri.app/">Tauri</a>.
</h3>

## Features
- Modern UI
- Dark mode
- Console output
- Hide in system tray
- *__And more to come...__*

## Screenshots
![](/screenshots/win11_1.png)

![](/screenshots/win11_2.png)

![](/screenshots/win11_3.png)

## Instructions
### Install
Head over to [Releases](https://github.com/gaeljacquin/yt-dlp-gui/releases).

### Build
#### Prerequisites
* [yt-dlp](https://github.com/yt-dlp/yt-dlp/)
* [Webview2](https://developer.microsoft.com/en-us/microsoft-edge/webview2) (Windows only, if it's not already installed)
* [FFmpeg](https://ffmpeg.org/download.html) (optional)

#### Steps (Windows) ####
1. Clone the repository.
2. Add the [yt-dlp binary](https://github.com/yt-dlp/yt-dlp/releases) to `src/tauri/binaries`.
3. Rename `yt-dlp` as `yt-dlp-x86_64-pc-windows-msvc`.
4. Run `pnpm tauri build --target x86_64-pc-windows-msvc`.

## Important Notes
**Builds and installers were (so far) only tested on Windows 11.**
