<h1 align="center">
  <img src="src-tauri/icons/128x128.png" width="128" />
  <br>
  yt-dlp GUI
  <br>

  [![publish](https://github.com/gaeljacquin/yt-dlp-gui/actions/workflows/ci.yml/badge.svg)](https://github.com/gaeljacquin/yt-dlp-gui/actions/workflows/ci.yml)
</h1>

<h3 align="center">
  A cross-platform GUI for <a href="https://github.com/yt-dlp/yt-dlp/">yt-dlp</a> built with <a href="https://tauri.app/">Tauri</a>.
</h3>

## Features
- Portable; installers also available
- Free and open source
- Hide in system tray
- Custom and persistent save location
- 'Audio only' option
- *__And more to come...__*

## Screenshots
![](/screenshots/win11_1.png)
![](/screenshots/win11_2.png)
![](/screenshots/win11_3.png)

## Requirements
* [yt-dlp](https://github.com/yt-dlp/yt-dlp/)
* [Webview2](https://developer.microsoft.com/en-us/microsoft-edge/webview2) (Windows only, if it's not already installed)
* [FFmpeg](https://ffmpeg.org/download.html) (optional)

## Usage
### Install
Get the binaries [here](https://github.com/gaeljacquin/yt-dlp-gui/releases).

The [yt-dlp binary](https://github.com/yt-dlp/yt-dlp/releases) is bundled with the installers, and not the portable Windows version. If using the latter, place both binaries in the same directory.

### Compile
Run `pnpm tauri build --target $PLATFORM`.

Add the [yt-dlp binary](https://github.com/yt-dlp/yt-dlp/releases) to `src/tauri/binaries` and rename it according to platform.

### Important notes
**Builds and installers were only tested on Windows 11.**
