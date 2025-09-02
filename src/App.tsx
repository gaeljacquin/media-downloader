import { useAppStore } from './stores/useAppStore';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { HomeView } from './components/views/HomeView';
import { LogsView } from './components/views/LogsView';
import { NotesView } from './components/views/NotesView';
import { SettingsView } from './components/views/SettingsView';
import { Toaster } from './components/ui/sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './components/ui/alert-dialog';
import { useState } from 'react';

function App() {
  const { currentView, setCurrentView, hasUnsavedChanges, resetTempNotes } = useAppStore();
  const [pendingView, setPendingView] = useState<string | null>(null);
  useTheme(); // Initialize theme system

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'logs':
        return <LogsView />;
      case 'notes':
        return <NotesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  const handleNavigation = (targetView: string) => {
    if (hasUnsavedChanges) {
      setPendingView(targetView);
    } else {
      setCurrentView(targetView as any);
    }
  };

  const confirmNavigation = () => {
    if (pendingView) {
      resetTempNotes();
      setCurrentView(pendingView as any);
      setPendingView(null);
    }
  };

  const cancelNavigation = () => {
    setPendingView(null);
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <Header onNavigate={handleNavigation} />
      <main className="flex-1 overflow-hidden">
        {renderCurrentView()}
      </main>
      <Toaster />
      
      <AlertDialog open={pendingView !== null} onOpenChange={() => setPendingView(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in your notes. Are you sure you want to leave without saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelNavigation}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmNavigation} className="bg-destructive hover:bg-destructive/90">
              Leave Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default App;