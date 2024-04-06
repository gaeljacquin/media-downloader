import ActivityBar from "@/app/components/activity-bar";
import Main from '@/app/components/main';
import Header from '@/app/components/header';

export default function UI() {
  return (
    <div className="grid h-screen w-full pl-[56px]">
      <ActivityBar />
      <div className="flex flex-col">
        <Header />
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative flex-col items-start gap-8 flex" x-chunk="dashboard-03-chunk-0">
            <Main />
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
          </div>
        </main>
      </div>
    </div>
  )
}
