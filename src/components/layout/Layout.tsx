import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { SavedListSidebar } from "./SavedListSidebar";
import { Users, Star } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Toaster } from "react-hot-toast";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedProfiles } = useStore();

  return (
    <div className="relative min-h-screen bg-[#f2f5fa] text-slate-800 transition-colors duration-300 lg:pr-80 overflow-x-hidden">
      <Toaster position="top-right" toastOptions={{
        className: 'bg-white/90 text-slate-800 border border-white/80 shadow-lg shadow-purple-500/5 backdrop-blur-md rounded-2xl font-semibold',
      }} />

      {/* Floating Glow Spheres for Claymorphism Depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[40vh] rounded-full bg-purple-400/25 blur-[120px] animate-float-1" />
        <div className="absolute top-[50%] -right-[15%] w-[50vw] h-[50vh] rounded-full bg-blue-300/30 blur-[150px] animate-float-2" />
        <div className="absolute top-[25%] left-[25%] w-[45vw] h-[45vh] rounded-full bg-pink-300/20 blur-[130px] animate-float-1" />
        <div className="absolute -bottom-[10%] left-[5%] w-[35vw] h-[35vh] rounded-full bg-indigo-300/25 blur-[100px] animate-float-2" />
      </div>

      {/* Header (Claymorphism Glass) */}
      <header className="sticky top-0 z-30 glass-panel border-x-0 border-t-0 px-4 lg:px-8 py-4.5 flex items-center justify-between mx-4 my-3 bg-white/70">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"
          >
            <Star className="w-6 h-6 fill-purple-500/10 text-purple-600 animate-pulse" />
            <span className="cinematic-glow">VibeRank</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* List Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="relative p-2.5 px-4 text-slate-700 bg-white/60 border border-white/80 shadow-md shadow-purple-500/5 backdrop-blur-md rounded-xl transition-all cursor-pointer flex items-center gap-2 hover:bg-white/90 hover:shadow-lg active:scale-97"
            aria-label="View Saved List"
          >
            <Users className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline text-xs font-extrabold uppercase tracking-wider">Saved List</span>
            {selectedProfiles.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-purple-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center border-2 border-white animate-pulse">
                {selectedProfiles.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {title && (
          <div className="text-left space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 cinematic-glow">
              {title}
            </h1>
          </div>
        )}
        <section className="glass-panel rounded-3xl p-6 md:p-8">
          {children}
        </section>
      </main>

      {/* Sidebar List (Glass) */}
      <SavedListSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </div>
  );
}
