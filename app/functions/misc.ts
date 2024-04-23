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
