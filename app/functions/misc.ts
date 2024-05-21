export const handleEscapePress = () => {
  const event = new KeyboardEvent('keydown', {
    key: 'Escape',
    code: 'Escape',
    keyCode: 27,
    bubbles: true,
    cancelable: false,
  });

  document.dispatchEvent(event);
};

export async function replaceWithTilde(path: string) {
  const homeDir = await (await import('@tauri-apps/api/path')).homeDir(); // dynamically importing module to fix console error

  if (path.includes(homeDir)) {
    return path.replace(homeDir, '~/').replace(/\\/g, '/');
  }

  return path;
}
