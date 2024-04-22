import ActivityBar from "@/app/components/activity-bar";
import Home from '@/app/components/home';
import Header from '@/app/components/header';
import Logs from '@/app/components/logs';
import Settings from "@/app/components/settings";
import { View, useView } from '@/app/contexts/view';

export default function UI() {
  const { view } = useView();

  return (
    <div className="grid h-screen w-full pl-[56px]">
      <ActivityBar />
      <div className="flex flex-col">
        <Header view={view}/>
        <main className="grid flex-1 gap-4 overflow-auto p-4 grid-cols-1">
          {view === View.Home && <Home />}
          {view === View.Logs && <Logs />}
          {view === View.Settings && <Settings />}
        </main>
      </div>
    </div>
  )
}
