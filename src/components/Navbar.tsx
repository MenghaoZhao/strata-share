import React from "react";
import { Layers, User, Settings, FolderOpen, LogOut, FileText, PhoneCall } from "lucide-react";

interface NavbarProps {
  currentView: "marketing" | "dashboard" | "share-view";
  setView: (view: "marketing" | "dashboard" | "share-view") => void;
  publicPropertyAddress?: string;
  agentName?: string;
}

export default function Navbar({ currentView, setView, publicPropertyAddress, agentName }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 text-slate-850 border-b border-slate-100 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView("marketing")}>
            <div className="p-2 bg-blue-600 rounded-lg text-white flex items-center justify-center shadow-lg shadow-blue-105">
              <Layers className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black text-lg tracking-tight text-slate-900 leading-tight">
                Strata Share
              </span>
              <span className="font-mono text-[9px] text-blue-600 tracking-widest uppercase font-bold">
                Strata Docs Registry
              </span>
            </div>
          </div>

          {/* Conditional Middle/Right Menu */}
          {currentView === "share-view" ? (
            <div className="hidden md:flex items-center space-x-2 text-xs md:text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 max-w-md truncate">
              <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="font-medium truncate">Folder: {publicPropertyAddress}</span>
            </div>
          ) : (
            <nav className="hidden md:flex items-center space-x-8 font-sans text-sm text-slate-500 font-semibold">
              <a href="#features" className="hover:text-blue-600 transition-colors" onClick={() => setView("marketing")}>
                Features
              </a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors" onClick={() => setView("marketing")}>
                How It Works
              </a>
              <a href="#pricing" className="hover:text-blue-600 transition-colors" onClick={() => setView("marketing")}>
                Pricing
              </a>
              <a href="#faq" className="hover:text-blue-600 transition-colors" onClick={() => setView("marketing")}>
                FAQ
              </a>
            </nav>
          )}

          {/* Action Handlers */}
          <div className="flex items-center space-x-3">
            {currentView === "share-view" ? (
              <div className="flex items-center space-x-1 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                <User className="h-3 w-3 text-blue-600" />
                <span className="font-mono truncate font-medium">Agent: {agentName}</span>
              </div>
            ) : null}

            {currentView === "marketing" ? (
              <button
                onClick={() => setView("dashboard")}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 duration-200 transition-all cursor-pointer active:scale-95"
                id="btn-nav-dashboard"
              >
                Launch Console
              </button>
            ) : currentView === "dashboard" ? (
              <button
                onClick={() => setView("marketing")}
                className="flex items-center space-x-2 px-4 py-2.5 text-sm bg-white hover:bg-slate-50 rounded-full text-slate-700 font-semibold cursor-pointer transition-all border border-slate-200 shadow-sm active:scale-95"
                id="btn-nav-marketing"
              >
                <LogOut className="h-4 w-4 text-slate-500" />
                <span>Exit Console</span>
              </button>
            ) : (
              <button
                onClick={() => setView("dashboard")}
                className="px-4 py-2 rounded-full text-xs font-bold border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-105 cursor-pointer transition-all duration-200 active:scale-95"
                id="btn-nav-back-agent"
              >
                Back to Agent Hub
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
