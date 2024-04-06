import { ToastContainer } from 'react-toastify';

import UI from "@/app/components/ui";

export default function Home() {
  return (
    <>
      <ToastContainer
        newestOnTop
      />
      <UI />
    </>
  );
}
