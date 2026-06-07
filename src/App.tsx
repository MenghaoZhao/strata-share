import React, { useState, useEffect } from "react";
import { INITIAL_PROPERTIES, MOCK_LEADS, MOCK_ANALYTICS, DEFAULT_AGENT } from "./data";
import { StrataProperty, StrataDocument, Lead, AnalyticsEvent } from "./types";
import Navbar from "./components/Navbar";
import Features from "./components/Features";
import FAQ from "./components/FAQ";
import Pricing from "./components/Pricing";
import Dashboard from "./components/Dashboard";
import PropertyDetail from "./components/PropertyDetail";
import BrandedPage from "./components/BrandedPage";
import { Sparkles, Layers, FileText, CheckCircle, BarChart, MousePointerClick, ShieldAlert, ArrowRight, UserCheck } from "lucide-react";

export default function App() {
  const [currentView, setView] = useState<"marketing" | "dashboard" | "share-view">("marketing");
  
  // App Global State
  const [properties, setProperties] = useState<StrataProperty[]>(INITIAL_PROPERTIES);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [events, setEvents] = useState<AnalyticsEvent[]>(MOCK_ANALYTICS);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("prop-patina");
  
  // Floating system alert notifications
  const [globalAlert, setGlobalAlert] = useState<string | null>(null);

  const triggerGlobalAlert = (msg: string) => {
    setGlobalAlert(msg);
    setTimeout(() => {
      setGlobalAlert(null);
    }, 4500);
  };

  // Synchronize URL Hash routing to let public cooperating links load instantly!
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      console.log("Detected hash change in main navigator:", hash);
      
      if (hash.startsWith("#share/")) {
        const propId = hash.replace("#share/", "");
        const matched = properties.find(p => p.id === propId);
        
        if (matched) {
          setSelectedPropertyId(propId);
          setView("share-view");
          window.scrollTo(0, 0);
          
          // Log page view analytics
          const newEvt: AnalyticsEvent = {
            id: "event-web-view-" + Date.now(),
            propertyId: propId,
            eventType: "view",
            details: `Visitor opened shared directory for ${matched.name}`,
            timestamp: new Date().toISOString()
          };
          setEvents(prev => [newEvt, ...prev]);

        } else {
          setView("marketing");
        }
      } else if (hash === "#dashboard") {
        setView("dashboard");
      } else {
        setView("marketing");
      }
    };

    // Attach listeners
    window.addEventListener("hashchange", handleHashChange);
    
    // Check initial load
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [properties]);

  // Handle route change programmatically and keep URL hashes synchronized
  const handleSetView = (view: "marketing" | "dashboard" | "share-view") => {
    if (view === "marketing") {
      window.location.hash = "";
    } else if (view === "dashboard") {
      window.location.hash = "dashboard";
    } else if (view === "share-view") {
      window.location.hash = `#share/${selectedPropertyId}`;
    }
  };

  // Add new property
  const handleAddProperty = (name: string, strataPlan: string, address: string, units: number) => {
    const defaultBannerUrls = [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800&h=400",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800&h=400",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800&h=400"
    ];
    const pickedBanner = defaultBannerUrls[properties.length % defaultBannerUrls.length];

    const newProp: StrataProperty = {
      id: "prop-" + strataPlan.toLowerCase() + "-" + Date.now(),
      name,
      address,
      strataPlan,
      unitCount: units,
      bannerImageUrl: pickedBanner,
      activeShareUrl: `https://stratashare.ca/share/${strataPlan.toLowerCase()}`,
      isShared: true,
      passwordProtected: false,
      documentCount: 0,
      viewsCount: 0,
      downloadsCount: 0,
      leadsCount: 0,
      documents: [],
      agentInfo: DEFAULT_AGENT
    };

    setProperties(prev => [newProp, ...prev]);
    triggerGlobalAlert(`Folder created successfully for strata plan: ${strataPlan}`);
  };

  // General Update Property details
  const handleUpdateProperty = (updated: StrataProperty) => {
    setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
    triggerGlobalAlert(`Settings updated for property: ${updated.name}`);
  };

  // Manage files deletion
  const handleDeleteDocument = (docId: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === selectedPropertyId) {
        const filteredDocs = p.documents.filter(d => d.id !== docId);
        return {
          ...p,
          documents: filteredDocs,
          documentCount: filteredDocs.length
        };
      }
      return p;
    }));
  };

  // Manage custom files uploads
  const handleAddDocument = (newDoc: StrataDocument) => {
    setProperties(prev => prev.map(p => {
      if (p.id === selectedPropertyId) {
        const updatedDocs = [...p.documents, newDoc];
        return {
          ...p,
          documents: updatedDocs,
          documentCount: updatedDocs.length
        };
      }
      return p;
    }));
  };

  // Submit and register Leads
  const handleRegisterLead = (rawLead: Omit<Lead, "id" | "date">) => {
    const isDocDownload = rawLead.downloadedDocs.length > 0;
    const isZip = isDocDownload && rawLead.downloadedDocs[0].includes("zip");

    const newLead: Lead = {
      ...rawLead,
      id: "lead-" + Date.now(),
      date: new Date().toISOString()
    };

    setLeads(prev => [newLead, ...prev]);

    // Push separate Analytics Events
    const newEvent: AnalyticsEvent = {
      id: "event-" + Date.now(),
      propertyId: rawLead.propertyId,
      eventType: isZip ? "download_zip" : isDocDownload ? "download_single" : "lead_register",
      details: isZip 
        ? `${rawLead.name} downloaded entire Strata ZIP Folder`
        : isDocDownload 
          ? `${rawLead.name} downloaded: ${rawLead.downloadedDocs[0]}`
          : `${rawLead.name} (${rawLead.purpose.replace("_", " ")}) registered to view records`,
      timestamp: new Date().toISOString()
    };

    setEvents(prev => [newEvent, ...prev]);

    // Increment Counts in original Property structures
    setProperties(prev => prev.map(p => {
      if (p.id === rawLead.propertyId) {
        return {
          ...p,
          leadsCount: p.leadsCount + (isDocDownload ? 0 : 1),
          downloadsCount: p.downloadsCount + (isDocDownload ? 1 : 0),
        };
      }
      return p;
    }));
  };

  const activeProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 flex flex-col justify-between selection:bg-blue-105 selection:text-blue-900">
      
      {/* Top Banner Navigation */}
      <Navbar 
        currentView={currentView} 
        setView={handleSetView}
        publicPropertyAddress={activeProperty.address}
        agentName={activeProperty.agentInfo.name}
      />

      {globalAlert && (
        <div className="fixed top-24 right-6 z-50 p-4 bg-white border border-blue-100 rounded-2xl text-xs sm:text-sm text-slate-800 font-semibold max-w-sm flex items-center space-x-3 shadow-xl animate-fade-in">
          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <span>{globalAlert}</span>
        </div>
      )}

      {/* VIEW DELEGATIONS CONDITIONAL */}
      <main className="flex-grow">
        {currentView === "marketing" ? (
          <div className="space-y-0">
            {/* HERO SECTION */}
            <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 text-slate-800 text-center overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/40 rounded-full filter blur-3xl pointer-events-none" />
              <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-50/5 rounded-full filter blur-2xl pointer-events-none" />

              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative">
                
                {/* Visual badge top */}
                <div className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-blue-50 border border-blue-100 tracking-wide">
                  <Sparkles className="h-4 w-4 text-blue-600 fill-blue-600/30" />
                  <span className="font-mono text-[10px] text-blue-700 uppercase font-bold">Now Powered with Gemini-3.5-Flash</span>
                </div>

                <div className="space-y-4">
                  <h1 className="font-sans text-4xl sm:text-6xl font-black tracking-tight leading-tight text-slate-900">
                    The easiest way to share{" "}
                    <span className="text-blue-600">
                      strata documents.
                    </span>
                  </h1>
                  <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
                    Strata Share provides a central web-based folder system with personalized Realtor branding, secure visitor registration forms, and server-side AI summary reviews.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => handleSetView("dashboard")}
                    className="w-full sm:w-auto px-8 py-4 rounded-full text-white bg-blue-600 hover:bg-blue-700 font-sans font-bold duration-200 active:scale-95 shadow-xl shadow-blue-100 flex items-center justify-center space-x-2.5 cursor-pointer text-sm"
                  >
                    <span>Launch Realtor Console Free</span>
                    <ArrowRight className="h-4.5 w-4.5 stroke-[2.5px]" />
                  </button>

                  <a
                    href="#share/prop-patina"
                    className="w-full sm:w-auto px-8 py-4 rounded-full text-slate-700 bg-white hover:bg-slate-50 font-sans font-bold border border-slate-200 duration-200 active:scale-95 flex items-center justify-center space-x-2 text-sm shadow-sm"
                  >
                    <span>Inspect Branded Sample Share</span>
                  </a>
                </div>

                {/* Hero Mockup image */}
                <div className="pt-12 sm:pt-16 max-w-5xl mx-auto relative group">
                  <div className="absolute inset-x-12 -top-4 bottom-12 bg-blue-100/20 blur-3xl rounded-2xl opacity-50 group-hover:opacity-80 transition-opacity" />
                  <div className="relative rounded-3xl border border-slate-100 bg-white p-2 sm:p-3 shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200&h=600"
                      alt="Strata Share dashboard showcase preview representation"
                      className="rounded-2xl w-full h-[280px] sm:h-[450px] object-cover border border-slate-100 pointer-events-none filter brightness-95"
                    />
                    
                    {/* Floating mini stats boxes */}
                    <div className="absolute -bottom-4 right-1/10 bg-white border border-slate-100 text-slate-800 p-4 rounded-2xl flex items-center space-x-3 shadow-xl hidden sm:flex">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <UserCheck className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <span className="block text-[10px] text-slate-450 uppercase font-mono font-bold tracking-wider">Lead Acquired</span>
                        <span className="font-sans font-bold text-xs text-slate-900">Sarah Jenkins registered</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* PRODUCT CONCEPTS OVERVIEW FOR CUSTOMERS */}
            <Features />

            {/* THREE-STEP HOW IT WORKS */}
            <section id="how-it-works" className="py-24 bg-white border-t border-slate-100 text-slate-800 text-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <h2 className="font-mono text-xs text-blue-600 font-bold tracking-widest uppercase mb-3">
                    Streamlined workflow
                  </h2>
                  <h3 className="font-sans text-3xl font-black text-slate-900 mb-4">
                    Strata Sharing Reimagined in Three Simple Steps
                  </h3>
                  <p className="text-slate-500 text-sm sm:text-base">
                    No complicated setups, no bulk attachments. Strata Share operates entirely under a modern, single-view browser workflow designed for speed.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left max-w-5xl mx-auto">
                  {/* Step 1 */}
                  <div className="space-y-4 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                    <span className="font-sans text-4xl font-black text-blue-600">01</span>
                    <h4 className="font-sans font-bold text-lg text-slate-900">Assemble Property Folders</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Add a new property to your dashboard. Upload bylaws, minutes, or budgets using our rapid drag-and-drop file module.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-4 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                    <span className="font-sans text-4xl font-black text-blue-600">02</span>
                    <h4 className="font-sans font-bold text-lg text-slate-900">Set Brand Settings & Locks</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Personalize the folder with your profile summary, headshots, and contact information. Enable password restrictions if required.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-4 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                    <span className="font-sans text-4xl font-black text-blue-600">03</span>
                    <h4 className="font-sans font-bold text-lg text-slate-900">Distribute Branded URLs</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Share the unique public URL anywhere. Cooperators submit registration to unlock downloads while generating high-value pipeline leads.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* INTERACTIVE PRICING TABLE SECTION */}
            <Pricing onGetStarted={() => handleSetView("dashboard")} />

            {/* INTERACTIVE FAQS */}
            <FAQ />
            
          </div>
        ) : currentView === "dashboard" ? (
          <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
              <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm shadow-slate-100">
                <div>
                  <h2 className="font-sans font-black text-2xl text-slate-900">Agent Command Console</h2>
                  <p className="text-slate-500 text-xs sm:text-sm">Manage your strata document folders, preview public shared folders, and inspect acquired contact leads.</p>
                </div>
                <div className="flex items-center space-x-1 py-1 px-3 bg-blue-50 border border-blue-105 rounded-full text-[10px] font-mono text-blue-700 uppercase tracking-wider font-extrabold">
                  <Layers className="h-3.5 w-3.5 stroke-[2.5px] mr-1 text-blue-600" />
                  <span>Licensed Area: BC Real Estate Agency</span>
                </div>
              </div>
            </div>

            {/* Dashboard Routing conditional */}
            {selectedPropertyId && properties.some(p => p.id === selectedPropertyId && p.isShared === false) ? (
              // If property was opened previously, but we want detail. For simplicity, Dashboard component handles list, detail is handled separately!
              // Let us look at state: is there a detail sub-selection active?
              null
            ) : null}

            {/* Standard Dashboard List selection */}
            {selectedPropertyId && window.location.hash.startsWith("#share/") ? (
              null
            ) : (
              // We render listing portal when view is dashboard and no specific folders detail selected
              selectedPropertyId && selectedPropertyId !== "" && activeProperty && (
                <div className="py-2">
                  {/* If we have selected a property to manage, render the PropertyDetail, else Dashboard list! */}
                  {/* Let's see: We will use a simple state to toggle "list" vs "detail". If window.location.hash === "#dashboard-detail" or simple state. */}
                  {/* To keep it simple, we define state "isManagingProperty" */}
                  {/* Let's define dynamic dashboard view */}
                  <DashboardViewCoordinator 
                    properties={properties}
                    events={events}
                    leads={leads}
                    selectedPropertyId={selectedPropertyId}
                    setSelectedPropertyId={setSelectedPropertyId}
                    handleAddProperty={handleAddProperty}
                    handleUpdateProperty={handleUpdateProperty}
                    handleDeleteDocument={handleDeleteDocument}
                    handleAddDocument={handleAddDocument}
                    triggerGlobalAlert={triggerGlobalAlert}
                  />
                </div>
              )
            )}
          </div>
        ) : (
          /* PUBLIC COOPERATING AGENT BRANDED LANDING PAGE */
          <BrandedPage 
            property={activeProperty} 
            onRegisterLead={handleRegisterLead}
            isUnlockedInitially={false}
            onBackToConsole={() => handleSetView("dashboard")}
          />
        )}
      </main>

      {/* REFINED humid/neutral footer */}
      <footer className="bg-white py-12 border-t border-slate-100 text-slate-500 font-sans text-xs shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
              <Layers className="h-4.5 w-4.5 text-blue-600" />
            </div>
            <div className="text-left">
              <span className="block text-slate-900 font-bold tracking-tight">Strata Share Canada</span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold">Cloud Native Strata Registry Platform</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 font-medium">
            <a href="#features" className="hover:text-blue-600 font-semibold transition-colors" onClick={() => handleSetView("marketing")}>Features</a>
            <a href="#pricing" className="hover:text-blue-600 font-semibold transition-colors" onClick={() => handleSetView("marketing")}>Pricing</a>
            <a href="#faq" className="hover:text-blue-600 font-semibold transition-colors" onClick={() => handleSetView("marketing")}>FAQ</a>
            <span className="text-slate-200">|</span>
            <span className="text-slate-400 font-mono text-[10px]">REBGV & FVREB Digital Standard Compliance</span>
          </div>

          <p className="text-slate-400">&copy; {new Date().getFullYear()} Strata Share Canada. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Separate helper component to coordinate list vs detail views within Dashboard
interface DashboardViewProps {
  properties: StrataProperty[];
  events: AnalyticsEvent[];
  leads: Lead[];
  selectedPropertyId: string;
  setSelectedPropertyId: (id: string) => void;
  handleAddProperty: (name: string, strataPlan: string, address: string, units: number) => void;
  handleUpdateProperty: (updated: StrataProperty) => void;
  handleDeleteDocument: (docId: string) => void;
  handleAddDocument: (newDoc: StrataDocument) => void;
  triggerGlobalAlert: (msg: string) => void;
}

function DashboardViewCoordinator({
  properties,
  events,
  leads,
  selectedPropertyId,
  setSelectedPropertyId,
  handleAddProperty,
  handleUpdateProperty,
  handleDeleteDocument,
  handleAddDocument,
  triggerGlobalAlert
}: DashboardViewProps) {
  // Inner toggle state: "list" vs "manage"
  const [panelView, setPanelView] = useState<"list" | "manage">("list");

  const handleSelectToManage = (prop: StrataProperty) => {
    setSelectedPropertyId(prop.id);
    setPanelView("manage");
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setPanelView("list");
  };

  const activeProp = properties.find(p => p.id === selectedPropertyId) || properties[0];

  if (panelView === "manage") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <PropertyDetail 
          property={activeProp}
          onBack={handleBackToList}
          onUpdateProperty={handleUpdateProperty}
          onDeleteDocument={handleDeleteDocument}
          onAddDocument={handleAddDocument}
        />
      </div>
    );
  }

  return (
    <Dashboard 
      properties={properties}
      events={events}
      leads={leads}
      onSelectProperty={handleSelectToManage}
      onAddProperty={handleAddProperty}
    />
  );
}
