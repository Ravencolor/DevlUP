import { Navbar } from "@/ui/components/nav/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-alt">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
      <footer className="border-t border-border mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-semibold">DevlUP</span>
          <span className="text-xs text-gray-400">© 2026</span>
        </div>
      </footer>
    </div>
  );
}
