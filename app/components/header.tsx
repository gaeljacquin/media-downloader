import { View } from '@/app/contexts/view';
import ModeToggle from "@/app/components/mode-toggle";

export default function Header({ view }: { view: View }) {
  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 justify-between">
      <h1 className="text-xl font-semibold">{View[view]}</h1>
      <div className="flex justify-end">
        <ModeToggle />
      </div>
    </header>
  )
}
