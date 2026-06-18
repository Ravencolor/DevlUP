import { Navbar } from "@/ui/components/nav/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="px-4 py-8">{children}</main>
    </div>
  );
}
