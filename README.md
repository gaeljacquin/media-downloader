<h1 align="center">
  <img src="src-tauri/icons/128x128.png" width="128" />
  <br>
  yt-dlp GUI
  <br>

  [![publish](https://github.com/gaeljacquin/yt-dlp-gui/actions/workflows/publish.yml/badge.svg)](https://github.com/gaeljacquin/yt-dlp-gui/actions/workflows/publish.yml)
</h1>

<h3 align="center">
  A cross-platform GUI for <a href="https://github.com/yt-dlp/yt-dlp/">yt-dlp</a> built with <a href="https://tauri.app/">Tauri</a>.
</h3>

## Features
- Free and open source
- Dark mode
- Console output
- Hide in system tray
- Modern UI
- *__And more to come...__*

## Screenshots
![](/screenshots/win11_1.png)

![](/screenshots/win11_2.png)

![](/screenshots/win11_3.png)

## Usage
### Install
Head over to the [releases](https://github.com/gaeljacquin/yt-dlp-gui/releases).

### Compile
#### Requirements
* [yt-dlp](https://github.com/yt-dlp/yt-dlp/)
* [Webview2](https://developer.microsoft.com/en-us/microsoft-edge/webview2) (Windows only, if it's not already installed)
* [FFmpeg](https://ffmpeg.org/download.html) (optional)

Run `pnpm tauri build --target $PLATFORM`.

Add the [yt-dlp binary](https://github.com/yt-dlp/yt-dlp/releases) to `src/tauri/binaries` and rename it according to platform.

### Important Notes
**Builds and installers were only tested on Windows 11.**
