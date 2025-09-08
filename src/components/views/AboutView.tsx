import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const AboutView = () => {
  return (
    <div className="p-6 h-full max-w-2xl mx-auto">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">About Emdee</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Emdee is a desktop application built with Tauri (Rust backend) + React + TypeScript (frontend)
              that serves as a GUI for yt-dlp. It provides a user-friendly interface for downloading media content
              with various options and settings.
            </p>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Download videos from URLs or file lists</li>
                <li>Audio-only extraction support</li>
                <li>Real-time download progress logging</li>
                <li>Custom save path configuration</li>
                <li>Light and dark theme support</li>
                <li>System tray integration</li>
                <li>Desktop notifications</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Technology Stack</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Frontend: React + TypeScript + Vite</li>
                <li>Backend: Rust + Tauri</li>
                <li>UI Components: shadcn/ui + Tailwind CSS</li>
                <li>State Management: Zustand</li>
                <li>Download Engine: yt-dlp</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Version Information</h3>
              <p className="text-muted-foreground">Version 0.2.0</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
