import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

export const NotesView = () => {
  return (
    <div className="p-6 h-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">About</h2>
        <p className="text-muted-foreground">Emdee information</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Emdee</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              A modern GUI for yt-dlp built with Tauri and React.
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Cross Platform</Badge>
              <Badge variant="secondary">Modern UI</Badge>
              <Badge variant="secondary">Dark Mode</Badge>
              <Badge variant="secondary">Console Logs</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Version:</span>
                <span>0.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Author:</span>
                <span>Gaël Jacquin</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Built with:</span>
                <span>Tauri + React</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                • <strong>yt-dlp</strong> must be installed and available in PATH
              </p>
              <p className="text-sm">
                • <strong>FFmpeg</strong> (optional but recommended for media processing)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">• Download videos and playlists from URLs</p>
              <p className="text-sm">• Process batch files with multiple URLs</p>
              <p className="text-sm">• Audio-only extraction</p>
              <p className="text-sm">• Customizable download location</p>
              <p className="text-sm">• Real-time console output</p>
              <p className="text-sm">• System notifications</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
