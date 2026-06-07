import React, { useState } from "react";
import { FolderPlus, Settings, BarChart3, Lock, Trash2, Key, Layers, Image, Eye, Download, Users, Plus, LayoutGrid, ListCollapse, FolderOpen } from "lucide-react";
import { StrataProperty, AnalyticsEvent, Lead, StrataDocCategory } from "../types";
import AnalyticsDashboard from "./AnalyticsDashboard";

interface DashboardProps {
  properties: StrataProperty[];
  events: AnalyticsEvent[];
  leads: Lead[];
  onSelectProperty: (property: StrataProperty) => void;
  onAddProperty: (name: string, strataPlan: string, address: string, units: number) => void;
}

export default function Dashboard({
  properties,
  events,
  leads,
  onSelectProperty,
  onAddProperty
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"listings" | "analytics">("listings");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form parameters
  const [newPropName, setNewPropName] = useState("");
  const [newStrataPlan, setNewStrataPlan] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newUnits, setNewUnits] = useState(120);

  const handleAddPropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName || !newStrataPlan || !newAddress) return;

    onAddProperty(newPropName, newStrataPlan, newAddress, newUnits);
    setNewPropName("");
    setNewStrataPlan("");
    setNewAddress("");
    setNewUnits(120);
    setShowAddForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Tab select triggers row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-4">
        <div className="flex items-center space-x-1 p-1 bg-slate-100 border border-slate-200 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("listings")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === "listings"
                ? "bg-blue-600 text-white font-bold shadow"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FolderOpen className="h-4 w-4" />
            <span>My Properties shares</span>
          </button>
          
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === "analytics"
                ? "bg-blue-600 text-white font-bold shadow"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Integrated Analytics</span>
          </button>
        </div>

        {activeTab === "listings" && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-full text-xs sm:text-sm text-white font-bold cursor-pointer transition-all active:scale-95 flex items-center space-x-2 shadow-lg shadow-blue-105"
          >
            <Plus className="h-4.5 w-4.5 stroke-[3px]" />
            <span>Add Property share</span>
          </button>
        )}
      </div>

      {/* Main Tab content conditional */}
      {activeTab === "analytics" ? (
        <AnalyticsDashboard events={events} leads={leads} properties={properties} />
      ) : (
        <div className="space-y-8">
          
          {/* Add property toggle slide */}
          {showAddForm && (
            <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-xl space-y-6 max-w-3xl animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-sans font-black text-lg text-slate-900">Create Branded Strata Share Directory</h3>
                <button 
                  onClick={() => setShowAddForm(false)} 
                  className="font-mono text-xs text-slate-400 hover:text-slate-650 cursor-pointer px-2.5 py-1 font-bold"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleAddPropertySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="col-span-1 md:col-span-2 space-y-1.5Col md:col-span-2 space-y-1.5">
                  <label className="font-mono text-[9px] tracking-wider uppercase text-slate-450 font-bold">Folder Share Title</label>
                  <input
                    type="text"
                    required
                    value={newPropName}
                    onChange={(e) => setNewPropName(e.target.value)}
                    placeholder="E.g., The Woodwards Penthouse - Unit 3401"
                    className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] tracking-wider uppercase text-slate-455 font-bold">BC strata plan reference</label>
                  <input
                    type="text"
                    required
                    value={newStrataPlan}
                    onChange={(e) => setNewStrataPlan(e.target.value)}
                    placeholder="E.g., BCS1835 or LMS2412"
                    className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] tracking-wider uppercase text-slate-455 font-bold">Total building units counter</label>
                  <input
                    type="number"
                    value={newUnits}
                    onChange={(e) => setNewUnits(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-mono text-[9px] tracking-wider uppercase text-slate-455 font-bold">Full physical civic address</label>
                  <input
                    type="text"
                    required
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="E.g., 108 W Cordova St, Vancouver, BC V6B 0M8"
                    className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-tight shadow-md shadow-blue-100 cursor-pointer text-xs"
                    id="btn-add-property"
                  >
                    Generate Branded Folder Share
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Listings portfolio elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {properties.map((p) => (
              <div 
                key={p.id}
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:border-blue-250 transition-all duration-200 shadow-sm flex flex-col justify-between"
              >
                {/* banner top */}
                <div className="h-40 w-full relative">
                  <img
                    src={p.bannerImageUrl}
                    alt={p.name}
                    className="h-full w-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10" />
                  
                  {/* strata plan badge */}
                  <span className="absolute top-4 right-4 font-mono text-[10px] bg-white/95 font-bold border border-slate-100 text-blue-600 px-2.5 py-1 rounded-full shadow-sm">
                    {p.strataPlan}
                  </span>
                </div>

                {/* Body metrics */}
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-sans font-black text-lg text-slate-900 leading-tight">{p.name}</h3>
                    <p className="text-slate-500 text-xs sm:text-sm font-sans mt-1 truncate">{p.address}</p>
                  </div>

                  {/* High quality mini specs */}
                  <div className="grid grid-cols-4 gap-2 text-center py-4 px-2 bg-slate-50 rounded-2xl border border-slate-100/60">
                    <div className="space-y-1">
                      <span className="block font-mono text-[10px] text-slate-400 font-bold uppercase">Files</span>
                      <span className="font-sans font-bold text-sm text-slate-700">{p.documents.length}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="block font-mono text-[10px] text-slate-400 font-bold uppercase">Views</span>
                      <span className="font-sans font-bold text-sm text-blue-600">{p.viewsCount}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="block font-mono text-[10px] text-slate-400 font-bold uppercase">Downloads</span>
                      <span className="font-sans font-bold text-sm text-blue-600">{p.downloadsCount}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="block font-mono text-[10px] text-slate-400 font-bold uppercase">Leads</span>
                      <span className="font-sans font-bold text-sm text-blue-700">{p.leadsCount}</span>
                    </div>
                  </div>
                </div>

                {/* Actions bottom footer */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-3 text-xs font-mono font-bold uppercase tracking-wider">
                  {/* password indicator icon */}
                  <div className="flex items-center space-x-1 text-slate-450">
                    {p.passwordProtected ? (
                      <>
                        <Lock className="h-3.5 w-3.5 text-indigo-600" />
                        <span className="text-[10px] uppercase text-indigo-600 font-bold">Locked</span>
                      </>
                    ) : (
                      <span className="text-[10px] uppercase text-slate-400 font-bold">No password</span>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectProperty(p)}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-205 rounded-full cursor-pointer transition-all shadow-sm"
                  >
                    Manage Files &rarr;
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
