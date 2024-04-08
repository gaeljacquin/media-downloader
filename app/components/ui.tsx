import ActivityBar from "@/app/components/activity-bar";
import Home from '@/app/components/home';
import Header from '@/app/components/header';
import Settings from "@/app/components/settings";
import { View, useView } from '@/app/contexts/view';

export default function UI() {
  const { view } = useView();

  return (
    <div className="grid h-screen w-full pl-[56px]">
      <ActivityBar />
      <div className="flex flex-col">
        <Header />
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          {view === View.Home && <Home />}
          {view === View.Settings && <Settings />}
        </main>
      </div>
    </div>
  )
}