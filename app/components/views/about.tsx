'use client';

import Image from "next/image";

import useAboutStore from '@/app/stores/about';

export default function About() {
  const { author, title, description, version } = useAboutStore();

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
              <h1>{title} v{version} by {author}</h1>
            </div>
            <div className="grid justify-center">
              <h1>{description}</h1>
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
