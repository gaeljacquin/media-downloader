'use client';

import Image from "next/image";
import useAppInfoStore from "@/app/stores/app-info";

export default function About() {
  const { appInfo } = useAppInfoStore();

  return (
    <>
      <div className="relative flex-col items-start gap-8 flex" x-chunk="dashboard-03-chunk-0">
        <div className="grid w-full items-start gap-8">
          <fieldset className="grid gap-8 rounded-lg border p-4">
            <div className="grid justify-center mt-4 -mb-2">
              <Image
                src="/images/logo.png"
                alt="Media Downloader logo"
                className="w-64 h-auto"
                width={0}
                height={0}
                unoptimized
                priority
              />
            </div>
            <div className="grid justify-center">
              <h1>{appInfo.title} v{appInfo.version} by {appInfo.author}</h1>
            </div>
            <div className="grid justify-center">
              <h1>Released under the {appInfo.license}</h1>
            </div>
            <div className="grid justify-center">
              <h1>Special thanks to the yt-dlp team</h1>
            </div>
            <div className="mb-2" />
          </fieldset>
        </div>
      </div>
    </>
  )
}
