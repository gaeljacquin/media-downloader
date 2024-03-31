import { ToastOptions, Zoom } from 'react-toastify';

const optionSetCommon = {
  position: "top-right",
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  pauseOnFocusLoss: false,
  progress: undefined,
  theme: "light",
  transition: Zoom,
}

export const optionSet1 = {
  ...optionSetCommon,
  hideProgressBar: false,
} as ToastOptions<unknown>;

export const optionSet2 = {
  ...optionSetCommon,
  hideProgressBar: true,
} as ToastOptions<unknown>;
