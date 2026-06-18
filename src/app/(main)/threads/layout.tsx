import { ForumSidebar } from "@/ui/components/nav/ForumSidebar";

export default function ThreadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6 max-w-6xl mx-auto w-full">
      <ForumSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
