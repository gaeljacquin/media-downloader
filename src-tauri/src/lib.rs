use std::process::Command;
use tauri::command;

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![check_cmd_in_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
