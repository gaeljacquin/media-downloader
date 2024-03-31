import Image from 'next/image';
import { ToastContainer } from 'react-toastify';

import Form from "@/app/components/form";

export default function Home() {
  return (
    <main className="bg-yt-dlp-gray">
      <ToastContainer
        newestOnTop
      />
      <section className="p-4 flex flex-col justify-center min-h-screen max-w-md mx-auto">
        <div className="mb-5 flex justify-center items-center">
          <Image
            src="/images/favicon.ico"
            alt="yt-dlp icon"
            className="w-24 h-auto"
            width={0}
            height={0}
            priority
            unoptimized
          />
        </div>
        <div className="p-6 bg-yt-dlp-red rounded">
          <Form />
        </div>
      </section>
    </main>
  );
}
