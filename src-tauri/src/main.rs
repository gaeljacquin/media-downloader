// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
  CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, Window, command
};
use std::env;
use std::fs;
use toml::Value;
use serde::{Serialize, Deserialize};
use std::process::Command;

#[derive(Serialize, Deserialize)]
struct Info<'a> {
  version: &'a str,
  title: &'a str,
  description: &'a str,
  author: &'a str,
}

#[tauri::command]
fn hide_system_tray(window: Window) {
  window.hide().unwrap();
}

// Create the command:
// This command must be async so that it doesn't run on the main thread.
#[tauri::command]
async fn close_splashscreen(window: Window) {
  let splashscreen_window = window.get_window("splashscreen");

  if let Some(splashscreen) = splashscreen_window {
    splashscreen.close().unwrap();
  } else {
    println!("Splashscreen window not found");
  }

  window.get_window("main").expect("no window labeled 'main' found").show().unwrap();
}

#[tauri::command]
fn get_app_info() -> std::string::String {
  let title = "Media Downloader";
  let cargo_toml = fs::read_to_string("Cargo.toml").expect("Failed to read Cargo.toml");
  let cargo_toml: Value = toml::from_str(&cargo_toml).expect("Failed to parse Cargo.toml");
  let version = cargo_toml["package"]["version"].as_str().expect("Version not found");
  let description = cargo_toml["package"]["description"].as_str().expect("Description not found");
  let authors = cargo_toml["package"]["authors"].as_array().expect("Authors not found");
  let author = authors.get(0).expect("Author not found").as_str().expect("Author is not a string");
  let info = Info {
    version,
    title,
    description,
    author,
  };
  let data = serde_json::to_string(&info).expect("Failed to serialize data");

  return data;
}

#[command]
fn check_cmd_in_path() -> bool {
  let output = Command::new("yt-dlp")
    .arg("--version")
    .output();

  match output {
    Ok(_) => true,
    Err(_) => false,
  }
}

fn main() {
  let quit_tray = CustomMenuItem::new("quit".to_string(), "Quit");
  let toggle_tray = CustomMenuItem::new("toggle".to_string(), "Hide");
  let tray_menu = SystemTrayMenu::new()
    .add_item(quit_tray)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(toggle_tray)
  ;
  let system_tray = SystemTray::new().with_menu(tray_menu);

  tauri::Builder::default()
    .setup(|app| {
      let splashscreen_window = app.get_window("splashscreen").unwrap();
      let main_window = app.get_window("main").unwrap();
      // we perform the initialization code on a new task so the app doesn't freeze
      tauri::async_runtime::spawn(async move {
        // initialize your app here instead of sleeping :)
        println!("Initializing...");
        std::thread::sleep(std::time::Duration::from_secs(2));
        println!("Done initializing.");

        // After it's done, close the splashscreen and display the main window
        splashscreen_window.close().unwrap();
        main_window.show().unwrap();
      });
      Ok(())
    })
    .system_tray(system_tray)
    .on_system_tray_event(|app, event| match event {
      SystemTrayEvent::DoubleClick {
        position: _,
        size: _,
        ..
      } => {
        let window = app.get_window("main").unwrap();
        window.show().unwrap();
      },
      SystemTrayEvent::RightClick { .. } => {
        let window = match app.get_window("main") {
          Some(window) => window,
          None => return,
        };
        let is_visible = window.is_visible().unwrap();
        let item_handle = app.tray_handle().get_item("toggle");

        if is_visible {
          item_handle.set_title("Hide").unwrap();
        } else {
          item_handle.set_title("Show").unwrap();
        }
      },
      SystemTrayEvent::MenuItemClick { id, .. } => {
        let tray_item_handle = app.tray_handle().get_item(&id);

        match id.as_str() {
          "quit" => {
            std::process::exit(0);
          }
          "toggle" => {
            let window = app.get_window("main").unwrap();
            let window_visible = window.is_visible().unwrap();

            if window_visible {
              window.hide().unwrap();
              tray_item_handle.set_title("Show").unwrap();
            } else {
              window.show().unwrap();
              tray_item_handle.set_title("Hide").unwrap();
            }
          }
          _ => {}
        }
      }
      _ => {}
    })
    .invoke_handler(tauri::generate_handler![hide_system_tray, close_splashscreen, get_app_info, check_cmd_in_path])
    .run(tauri::generate_context!())
    .expect("error while running tauri application")
  ;
}
