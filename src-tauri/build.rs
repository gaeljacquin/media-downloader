use std::fs;
use std::path::Path;
use toml::Value;

fn main() {
  let cargo_toml_path = Path::new("Cargo.toml");
  let cargo_toml_content = fs::read_to_string(cargo_toml_path)
    .expect("Failed to read Cargo.toml");
  let cargo_toml_value: Value = toml::from_str(&cargo_toml_content)
    .expect("Failed to parse Cargo.toml");
  let package_section = cargo_toml_value.get("package").cloned().unwrap();
  let package_section_toml = toml::to_string(&package_section)
    .expect("Failed to serialize package section");
  let formatted_content = format!("[package]\n{}", package_section_toml);
  let generated_rs_path = Path::new("src/app-info.toml");

  fs::write(generated_rs_path, formatted_content)
    .expect("Failed to write generated Rust source file");

  tauri_build::build();
}
