'use client';

import Image from "next/image";

export default function About() {
  return (
    <>
      <div className="relative flex-col items-start gap-8 flex" x-chunk="dashboard-03-chunk-0">
        <div className="grid w-full items-start gap-8">
          <fieldset className="grid gap-8 rounded-lg border p-4">
            <div className="grid justify-center">
              <Image
                src="/images/splashscreen.png"
                alt="Media Downloader logo"
                className="w-64 h-auto"
                width={0}
                height={0}
                unoptimized
                priority
              />
            </div>
            <div className="grid justify-center">
              <h1>Media Downloader v0.5.1 by Gaël Jacquin</h1>
            </div>
            <div className="grid justify-center">
              <h1>yt-dlp GUI wrapper</h1>
            </div>
            <div className="grid justify-center">
              <h1>Special thanks to the yt-dlp team</h1>
            </div>
          </fieldset>
        </div>
      </div>
    </>
  )
}
