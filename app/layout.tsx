import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import '@xterm/xterm/css/xterm.css';
import 'spinkit/spinkit.min.css';

import DisableContextMenu from '@/app/components/disable-context-menu';
import { ThemeProvider } from "@/app/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Media Downloader",
  description: "Save audio & video locally through a GUI wrapper for yt-dlp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <>
            <DisableContextMenu />
            {children}
          </>
        </ThemeProvider>
      </body>
    </html>
  );
}
