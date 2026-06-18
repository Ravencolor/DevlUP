import { Navbar } from "@/ui/components/nav/Navbar";

export default function QuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-alt">
      <Navbar />
      {children}
    </div>
  );
}

