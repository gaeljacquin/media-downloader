import { Fragment, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

export const LogsView = () => {
  const { logs, clearLogs, logCounter, settings } = useAppStore();
  const logContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (logContainerRef.current) {
      const scrollArea = logContainerRef.current.closest('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [logCounter]);

  const formattedLogs = logs.map((line, index) => (
    <Fragment key={index}>
      {line}
      <br />
    </Fragment>
  ));

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Logs</h2>
          <Button
            onClick={clearLogs}
            variant="outline"
            size="sm"
            className="h-8"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <Card className="h-[calc(100vh-200px)]">
        <CardContent className="p-4 h-full">
          <ScrollArea className="h-full bg-black rounded">
            <div
              ref={logContainerRef}
              className="bg-black text-white p-4 font-mono text-sm"
              style={{ fontSize: `${settings.logsFontSize}px` }}
            >
              <pre className="whitespace-pre-wrap">{formattedLogs}</pre>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};