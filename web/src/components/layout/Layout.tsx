/**
 * Application layout with sidebar navigation and header.
 */
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

type Props = {
  children?: ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 border-r border-slate-200 bg-white">
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
