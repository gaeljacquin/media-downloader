export default function disableContextMenu() {
  if (window.location.hostname !== 'tauri.localhost') {
    return
  }

  document.addEventListener('contextmenu', e => {
    e.preventDefault();
    return false;
  }, { capture: true });

  document.addEventListener('selectstart', e => {
    e.preventDefault();
    return false;
  }, { capture: true });
}
