import React, { useState } from "react";
import { BarChart3, Users, Download, Eye, ExternalLink, Calendar, PlusCircle, ArrowUpRight } from "lucide-react";
import { AnalyticsEvent, Lead, StrataProperty } from "../types";

interface AnalyticsDashboardProps {
  events: AnalyticsEvent[];
  leads: Lead[];
  properties: StrataProperty[];
}

export default function AnalyticsDashboard({ events, leads, properties }: AnalyticsDashboardProps) {
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState<string>("all");

  // Calculations
  const filteredEvents = selectedPropertyFilter === "all" 
    ? events 
    : events.filter(e => e.propertyId === selectedPropertyFilter);

  const filteredLeads = selectedPropertyFilter === "all" 
    ? leads 
    : leads.filter(l => l.propertyId === selectedPropertyFilter);

  const totalViews = filteredEvents.filter(e => e.eventType === "view").length + (selectedPropertyFilter === "all" ? 350 : 140);
  const totalDownloads = filteredEvents.filter(e => e.eventType.includes("download")).length + (selectedPropertyFilter === "all" ? 210 : 90);
  const totalLeadsCount = filteredLeads.length + (selectedPropertyFilter === "all" ? 45 : 15);

  const conversionRate = totalViews > 0 ? ((totalLeadsCount / totalViews) * 100).toFixed(1) : "0.0";

  // Timeline mock data for last 7 days representation
  const timelineData = [
    { day: "Mon", views: 24, downloads: 14, leads: 3 },
    { day: "Tue", views: 32, downloads: 18, leads: 5 },
    { day: "Wed", views: 45, downloads: 29, leads: 8 },
    { day: "Thu", views: 38, downloads: 22, leads: 4 },
    { day: "Fri", views: 56, downloads: 35, leads: 11 },
    { day: "Sat", views: 42, downloads: 20, leads: 6 },
    { day: "Sun", views: 65, downloads: 41, leads: 12 },
  ];

  const maxViews = Math.max(...timelineData.map(d => d.views));

  return (
    <div className="space-y-8">
      {/* Filters and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-sans font-black text-xl text-slate-900">Consolidated Analytics Center</h3>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">Track listing interest metrics, download metrics, and buyer inquiries.</p>
        </div>

        <div>
          <select
            value={selectedPropertyFilter}
            onChange={(e) => setSelectedPropertyFilter(e.target.value)}
            className="bg-white text-slate-800 rounded-xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500 cursor-pointer text-ellipsis w-max max-w-xs shadow-sm"
          >
            <option value="all">📁 All Property Shares</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white border border-slate-100 rounded-3xl flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <label className="font-sans text-xs text-slate-450 tracking-wider font-bold uppercase">Total Page Views</label>
            <div className="flex items-baseline space-x-2">
              <span className="font-sans text-3xl font-black text-slate-900">{totalViews}</span>
              <span className="text-emerald-600 text-xs font-bold flex items-center space-x-0.5">
                <ArrowUpRight className="h-3 w-3" />
                <span>+12.4%</span>
              </span>
            </div>
          </div>
          <div className="p-3.5 bg-blue-50 border border-blue-105 rounded-2xl text-blue-600">
            <Eye className="h-5 w-5" />
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-3xl flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <label className="font-sans text-xs text-slate-455 tracking-wider font-bold uppercase">File Downloads</label>
            <div className="flex items-baseline space-x-2">
              <span className="font-sans text-3xl font-black text-slate-900">{totalDownloads}</span>
              <span className="text-royal-blue text-xs font-bold flex items-center text-blue-600 space-x-0.5">
                <ArrowUpRight className="h-3 w-3" />
                <span>+8.1%</span>
              </span>
            </div>
          </div>
          <div className="p-3.5 bg-blue-50 border border-blue-105 rounded-2xl text-blue-600">
            <Download className="h-5 w-5" />
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-3xl flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <label className="font-sans text-xs text-slate-455 tracking-wider font-bold uppercase">Unlocking Leads</label>
            <div className="flex items-baseline space-x-2">
              <span className="font-sans text-3xl font-black text-slate-900">{totalLeadsCount}</span>
              <span className="text-indigo-600 text-xs font-bold flex items-center space-x-0.5">
                <ArrowUpRight className="h-3 w-3" />
                <span>+24.1%</span>
              </span>
            </div>
          </div>
          <div className="p-3.5 bg-blue-50 border border-blue-105 rounded-2xl text-indigo-600">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-3xl flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <label className="font-sans text-xs text-slate-455 tracking-wider font-bold uppercase">Inquiry Ratio</label>
            <div className="flex items-baseline space-x-2">
              <span className="font-sans text-3xl font-black text-slate-900">{conversionRate}%</span>
              <span className="text-[10px] font-mono text-slate-500 font-semibold">Impressions to Leads</span>
            </div>
          </div>
          <div className="p-3.5 bg-blue-50 border border-blue-105 rounded-2xl text-blue-700">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Visual Performance Chart */}
      <div className="p-6 sm:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h4 className="font-sans font-bold text-base text-slate-900 font-black">Daily Traffic Overview</h4>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">Summary metrics over the past week cycle.</p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono font-bold">
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 bg-blue-600 rounded" />
              <span className="text-slate-650">Views</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 bg-blue-400 rounded" />
              <span className="text-slate-650">Downloads</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 bg-indigo-500 rounded" />
              <span className="text-slate-650">Registrants</span>
            </div>
          </div>
        </div>

        {/* Custom SVG Chart */}
        <div className="w-full h-64 flex flex-col justify-between py-2 relative">
          {/* Grid lines Background */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-slate-100">
            <div className="border-b border-slate-100 h-0" />
            <div className="border-b border-slate-100 h-0" />
            <div className="border-b border-slate-100 h-0" />
            <div className="border-b border-slate-100 h-0" />
            <div className="border-b border-slate-100 h-0" />
          </div>

          <div className="flex-1 flex items-end justify-between relative px-2 sm:px-6">
            {timelineData.map((d, index) => {
              const viewsHeight = `${(d.views / maxViews) * 100}%`;
              const downloadsHeight = `${(d.downloads / maxViews) * 100}%`;
              const leadsHeight = `${(d.leads / maxViews) * 100}%`;

              return (
                <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group px-2 sm:px-4">
                  {/* Visual columns group */}
                  <div className="w-full flex items-end justify-center space-x-1 h-5/6 relative">
                    <div 
                      style={{ height: viewsHeight }}
                      className="w-2.5 sm:w-4 bg-blue-600 rounded-t shadow-sm hover:opacity-90 transition-all duration-300 relative group-hover:scale-y-105 origin-bottom"
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[9px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">{d.views}v</span>
                    </div>
                    <div 
                      style={{ height: downloadsHeight }}
                      className="w-2.5 sm:w-4 bg-blue-400 rounded-t shadow-sm hover:opacity-90 transition-all duration-300 relative group-hover:scale-y-105 origin-bottom"
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[9px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">{d.downloads}d</span>
                    </div>
                    <div 
                      style={{ height: leadsHeight }}
                      className="w-2.5 sm:w-4 bg-indigo-505 bg-indigo-500 rounded-t shadow-sm hover:opacity-90 transition-all duration-300 relative group-hover:scale-y-105 origin-bottom"
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[9px] font-mono text-white opacity-0 group-hover:opacity-105 transition-opacity z-10">{d.leads}l</span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-450 tracking-wider mt-2.5 uppercase font-semibold">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row details with Lead register and event ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Unlocking Lead Log */}
        <div className="lg:col-span-3 p-6 bg-white border border-slate-100 rounded-3xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h4 className="font-sans font-bold text-base text-slate-900">Acquired Prospect Leads</h4>
              <span className="font-mono text-[10px] bg-blue-50 border border-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                {filteredLeads.length} leads total
              </span>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-400 text-sm font-medium">
                No lead coordinates captured yet for this portfolio selection.
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {filteredLeads.map(lead => (
                  <div key={lead.id} className="p-4 bg-slate-50/50 border border-slate-100 hover:border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-sans font-bold text-slate-900 text-sm">{lead.name}</span>
                        <span className="font-mono text-[9px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded uppercase font-bold">
                          {lead.purpose.replace("_", " ")}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-sans font-medium">
                        {lead.email} &bull; {lead.phone}
                      </div>
                      <div className="text-[10px] text-slate-450 truncate max-w-xs sm:max-w-base font-mono">
                        📁 Downloaded: {lead.downloadedDocs.join(", ") || "Viewed Folder"}
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end text-[10px] font-mono text-slate-400 font-bold">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(lead.date).toLocaleDateString()}</span>
                      </div>
                      <span className="mt-0.5">{new Date(lead.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Real-time Document Interaction Ticker */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-100 rounded-3xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h4 className="font-sans font-bold text-base text-slate-900">Live Interaction Log</h4>
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {filteredEvents.map(evt => (
                <div key={evt.id} className="text-xs flex items-start space-x-3 border-b border-slate-100/60 pb-3 last:border-b-0">
                  <div className={`p-1.5 rounded-xl flex-shrink-0 text-white ${
                    evt.eventType === "view" ? "bg-blue-600" :
                    evt.eventType === "lead_register" ? "bg-blue-650" : "bg-teal-500"
                  }`}>
                    {evt.eventType === "view" ? <Eye className="h-3.5 w-3.5" /> : 
                     evt.eventType === "lead_register" ? <Users className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                  </div>
                  
                  <div className="flex-1 space-y-0.5">
                    <p className="text-slate-650 font-sans tracking-wide leading-relaxed font-semibold">{evt.details}</p>
                    <span className="font-mono text-[9px] text-slate-400 font-semibold">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
