import React from "react";
import { FolderGit2, Sparkles, Key, BarChart3, FolderArchive, ShieldAlert } from "lucide-react";

export default function Features() {
  const list = [
    {
      icon: <FolderGit2 className="h-6 w-6 text-blue-600" />,
      title: "Consolidated Strata Vault",
      desc: "Assemble all mandatory strata files—Bylaws, monthly council meeting minutes, financial ledgers, Depreciation Reports, and Form B Information Certificates—in one secure dashboard categorized instantly."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-blue-600" />,
      title: "AI-Powered Strata Assistant",
      desc: "Equipped with Gemini AI on the server to save buyer realtors and lenders hundreds of hours of manual reading. Instantly scan 200+ pages of bylaws to resolve pet weight limits, rental bans, or outstanding levies."
    },
    {
      icon: <Key className="h-6 w-6 text-blue-600" />,
      title: "Sleek Branded Shared Folders",
      desc: "Instantly create public or password-protected directories personalized with your brokerage logo, realtor headshot, profile summary, and contact information. Give cooperators a premium local experience."
    },
    {
      icon: <FolderArchive className="h-6 w-6 text-blue-600" />,
      title: "One-Click PDF ZIP Compiling",
      desc: "Compile individual building documents into a single, structured, beautifully organized ZIP archive instantly. Cuts unnecessary downloading delays down to seconds."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
      title: "Lead Acquisition & Analytics",
      desc: "Secure download rights. Prospects registering names, emails, and target agency details are logged automatically. Track exactly who viewed, logged on, or downloaded specific documents over time."
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-blue-600" />,
      title: "Compliance & Security Locks",
      desc: "Maintain rigorous compliance with REBGV, FVREB, and BC Strata Property Act standards. Keep private owner coordinates password-locked while maintaining fully searchable public bylaw pages."
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-50/60 border-t border-slate-100 text-slate-800 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-100/20 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-100/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-mono text-xs text-blue-600 font-bold tracking-widest uppercase mb-3">
            Aesthetic Meets Utility
          </h2>
          <h3 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-4">
            The Central Operating System for Canadian Strata Files
          </h3>
          <p className="text-slate-500 text-base sm:text-lg">
            Stop sending cluttered emails and unorganized links. Strata Share equips realtors, buyers, and managers with an elegant, responsive digital catalog optimized for deal flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((item, index) => (
            <div 
              key={index}
              className="p-8 bg-white hover:bg-slate-50/30 rounded-3xl border border-slate-100 hover:border-blue-100 hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-200 group flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="p-3 bg-blue-50 border border-blue-100 group-hover:border-blue-200 rounded-2xl w-fit mb-6 transition-all">
                  {item.icon}
                </div>
                <h4 className="font-sans font-bold text-lg text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
              
              <div className="mt-6 flex items-center text-xs text-blue-600 font-mono opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                <span>Learn more &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
