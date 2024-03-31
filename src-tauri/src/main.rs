// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
  CustomMenuItem, Manager, Menu, MenuItem, Submenu, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem
};

fn main() {
  let quit = MenuItem::Quit;
  let toggle = CustomMenuItem::new("toggle".to_string(), "Hide");
  let separator = MenuItem::Separator;
  let file_submenu = Submenu::new(
    "File",
    Menu::new()
      .add_item(toggle)
      .add_native_item(separator)
      .add_native_item(quit)
  );
  let menu = Menu::new()
    .add_submenu(file_submenu)
  ;
  let quit_tray = CustomMenuItem::new("quit".to_string(), "Quit");
  let toggle_tray = CustomMenuItem::new("toggle".to_string(), "Hide");
  let tray_menu = SystemTrayMenu::new()
    .add_item(quit_tray)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(toggle_tray)
  ;
  let system_tray = SystemTray::new().with_menu(tray_menu);

  tauri::Builder::default()
    .menu(menu)
      .on_menu_event(|event| {
      match event.menu_item_id() {
        "toggle" => {
          event.window().hide().unwrap();
        }
        _ => {}
      }
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
    .run(tauri::generate_context!())
    .expect("error while running tauri application")
  ;
}
