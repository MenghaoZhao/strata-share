import React, { useState } from "react";
import { Lock, FileText, Download, ShieldAlert, Sparkles, Building, Phone, Mail, UserCheck, CheckCircle2, ChevronRight, FolderArchive, ArrowLeft } from "lucide-react";
import { StrataProperty, StrataDocument, StrataDocCategory, Lead } from "../types";
import StrataAiAssistant from "./StrataAiAssistant";

interface BrandedPageProps {
  property: StrataProperty;
  onRegisterLead: (lead: Omit<Lead, "id" | "date">) => void;
  isUnlockedInitially: boolean;
  onBackToConsole?: () => void;
}

export default function BrandedPage({
  property,
  onRegisterLead,
  isUnlockedInitially,
  onBackToConsole
}: BrandedPageProps) {

  // Flow states
  const [passwordState, setPasswordState] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isPasscodeUnlocked, setIsPasscodeUnlocked] = useState(
    !property.passwordProtected || isUnlockedInitially
  );

  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadPurpose, setLeadPurpose] = useState<Lead["purpose"]>("buyer");
  const [isLeadCaptured, setIsLeadCaptured] = useState(false);

  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadedItems, setDownloadedItems] = useState<string[]>([]);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Validate passcode
  const handleVerifyPasscode = () => {
    if (passwordState.trim().toLowerCase() === (property.accessPassword || "all").toLowerCase().trim()) {
      setIsPasscodeUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // Submit Lead Generation Contact Capture
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail || !leadPhone) return;

    onRegisterLead({
      propertyId: property.id,
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      purpose: leadPurpose,
      downloadedDocs: []
    });

    setIsLeadCaptured(true);
    setAlertMsg("Registration complete. Folder contents have been unlocked!");
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const simulateDownload = (docName: string) => {
    if (!isLeadCaptured) {
      setAlertMsg("Please submit your registration on the right to download strata docs.");
      setTimeout(() => setAlertMsg(null), 4550);
      return;
    }

    setDownloadedItems(prev => [...prev, docName]);
    
    // Push download lead analytics event
    onRegisterLead({
      propertyId: property.id,
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      purpose: leadPurpose,
      downloadedDocs: [docName]
    });

    // Fire standard simulated file download
    const element = document.createElement("a");
    const fileContent = `SIMULATED STRATA PDF FILE: ${docName}\nShared with compliments of Realtor ${property.agentInfo.name} via Strata Share.\nDownload Time: ${new Date().toISOString()}`;
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = docName.replace(".pdf", "") + ".txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const simulateZipDownload = () => {
    if (!isLeadCaptured) {
      setAlertMsg("Please submit your registration on the right to download strata docs.");
      setTimeout(() => setAlertMsg(null), 4550);
      return;
    }

    setDownloadingZip(true);
    
    setTimeout(() => {
      setDownloadingZip(false);
      onRegisterLead({
        propertyId: property.id,
        name: leadName,
        email: leadEmail,
        phone: leadPhone,
        purpose: leadPurpose,
        downloadedDocs: ["ZIP ARCHIVE COMPILATION.zip"]
      });

      const element = document.createElement("a");
      const fileContent = `SIMULATED STRATA ZIP ARCHIVE DIRECTORY: ${property.strataPlan}\nContains all ${property.documents.length} properties files compiles at once.\nShared with compliments of Realtor ${property.agentInfo.name} via Strata Share.`;
      const file = new Blob([fileContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Strata_Docs_Consolidated_${property.strataPlan}.zip`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setAlertMsg("Downloaded all strata records compiled as a single ZIP folder.");
      setTimeout(() => setAlertMsg(null), 4000);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans">
      
      {/* Mini banner button to allow co-operating real estate agents to enter console back quickly */}
      {onBackToConsole && (
        <div className="bg-slate-100/80 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-550 font-bold">
            Preview View: You are looking at a live public-shared folder directory
          </span>
          <button
            onClick={onBackToConsole}
            className="flex items-center space-x-1 px-3 py-1 bg-white hover:bg-slate-50 text-slate-705 text-slate-700 border border-slate-200 rounded-full text-xs transition-colors font-bold shadow-sm"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Go Back to Admin Console</span>
          </button>
        </div>
      )}

      {/* Hero Banner Header */}
      <div className="relative h-72 sm:h-96 w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${property.bannerImageUrl})` }}
        >
          {/* overlay darken */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-950/20" />
        </div>

        {/* Floating properties header */}
        <div className="absolute bottom-6 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-2">
              <span className="font-mono text-[10px] bg-blue-600 text-white font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                STRATA SHARE REGISTERED PORTFOLIO
              </span>
              <h1 className="font-sans text-2xl sm:text-4xl font-black text-white tracking-tight">{property.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200 font-sans">
                <span className="font-semibold">{property.address}</span>
                <span className="text-slate-400">&bull;</span>
                <span className="font-mono text-blue-450 font-bold bg-slate-900/60 px-2.5 py-0.5 rounded border border-slate-800 text-blue-300">{property.strataPlan}</span>
                <span className="text-slate-400">&bull;</span>
                <span className="font-semibold">{property.unitCount} residential units</span>
              </div>
            </div>
            
            {isPasscodeUnlocked && isLeadCaptured && (
              <button
                onClick={simulateZipDownload}
                disabled={downloadingZip}
                className="w-full md:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all shadow-lg shadow-blue-105 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
                id="btn-branded-download-all"
              >
                {downloadingZip ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="font-mono text-xs text-white">Compiling records as ZIP...</span>
                  </>
                ) : (
                  <>
                    <FolderArchive className="h-4.5 w-4.5" />
                    <span>Download Complete Archive (.ZIP)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {alertMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-750 text-emerald-700 text-sm animate-fade-in shadow-sm font-semibold">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>{alertMsg}</span>
          </div>
        </div>
      )}

      {/* Main Grid elements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Passcode locked screen condition */}
        {!isPasscodeUnlocked ? (
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-slate-100 shadow-lg space-y-6 text-center">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-full w-fit mx-auto text-blue-600">
              <Lock className="h-8 w-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-sans font-bold text-lg text-slate-900 font-black">This property folder is password-locked</h3>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">Please insert the access passphrase to view Consolidated Strata Documents for EPS3412 Patina.</p>
            </div>

            <div className="space-y-3.5">
              <input
                type="password"
                value={passwordState}
                onChange={(e) => setPasswordState(e.target.value)}
                placeholder="Enter folder passcode"
                className="w-full text-center bg-slate-50 text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 py-3.5 text-sm font-semibold"
                onKeyDown={(e) => e.key === "Enter" && handleVerifyPasscode()}
              />
              {passwordError && (
                <p className="text-red-500 text-[11px] font-sans font-bold">Incorrect security passcode. Please check original email details.</p>
              )}

              <button
                onClick={handleVerifyPasscode}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 font-sans font-bold rounded-xl text-sm text-white shadow-lg active:scale-95 duration-100 cursor-pointer"
                id="btn-branded-passcode-unlock"
              >
                Access Files
              </button>
            </div>

            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-4 font-semibold">
              Tip: For demo evaluation, use <code className="font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded font-bold">shangrila-elite</code> on Shangri-La Residences block, or remove locks in admin console.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* LEFT COLUMN: Folders & AI assistant */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Document Lists panel */}
              <div className="p-6 sm:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h2 className="font-sans font-black text-lg sm:text-xl text-slate-900">Folder Index Catalogs</h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-medium">Click any item to download. Some records require contact registration to download.</p>
                </div>

                <div className="space-y-6">
                  {Object.values(StrataDocCategory).map((category) => {
                    const matchedDocs = property.documents.filter(d => d.category === category);
                    if (matchedDocs.length === 0) return null;

                    return (
                      <div key={category} className="space-y-4">
                        <h4 className="font-mono text-xs text-blue-600 font-bold tracking-wider uppercase border-b border-slate-100 pb-2">
                          {category}
                        </h4>

                        <div className="space-y-2">
                          {matchedDocs.map((doc) => {
                            const isDownloaded = downloadedItems.includes(doc.name);
                            return (
                              <div 
                                key={doc.id}
                                className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl flex items-center justify-between text-xs sm:text-sm duration-200 group"
                              >
                                <div className="flex items-center space-x-3 truncate scrollbar-none pr-3">
                                  <FileText className={`h-5 w-5 flex-shrink-0 ${isDownloaded ? "text-emerald-500 animate-bounce" : "text-blue-600 transition-colors"}`} />
                                  <div className="truncate">
                                    <p className="font-sans font-bold text-slate-800 truncate">{doc.name}</p>
                                    <span className="font-mono text-[9px] text-slate-400 font-bold">Uploaded: {doc.uploadDate} &bull; Size: {doc.size}</span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => simulateDownload(doc.name)}
                                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 relative ${
                                    isDownloaded 
                                      ? "border-emerald-250 text-emerald-605 text-emerald-600 bg-emerald-50" 
                                      : "border-slate-200 text-slate-400 hover:border-blue-400 hover:text-blue-600 bg-white shadow-sm"
                                  }`}
                                  title="Download strata document"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Secure Gemini AI Assistant integrated directly inside! */}
              {isLeadCaptured ? (
                <div className="space-y-4">
                  <div className="p-1 px-4 bg-blue-50 border border-blue-100 rounded-full flex items-center space-x-2 w-fit">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="font-mono text-[10px] text-blue-600 font-bold uppercase tracking-widest">Interactive AI Audit Unlocked</span>
                  </div>
                  <StrataAiAssistant property={property} />
                </div>
              ) : (
                <div className="p-8 bg-white border border-slate-150 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                  <Sparkles className="h-10 w-10 text-blue-600 animate-pulse" />
                  <div className="space-y-1">
                    <h3 className="font-sans font-bold text-base text-slate-900 font-black">Unlock AI Strata Copilot Assistant</h3>
                    <p className="text-slate-500 text-xs sm:text-sm max-w-md font-medium">Register your coordinate details in the form to unlock our secure Gemini Copilot to query bylaws and meeting minutes instantly!</p>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Agent Card & Contact capture registration */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Marketing Agent profile card */}
              <div className="p-6 bg-white border border-slate-100 rounded-3xl text-center space-y-6 shadow-sm">
                <div className="space-y-3">
                  <img
                    src={property.agentInfo.photoUrl}
                    alt={property.agentInfo.name}
                    referrerPolicy="no-referrer"
                    className="h-20 w-20 rounded-full mx-auto object-cover border-2 border-blue-600 p-0.5 shadow-sm"
                  />
                  <div>
                    <h4 className="font-sans font-black text-lg text-slate-900">{property.agentInfo.name}</h4>
                    <p className="text-slate-500 text-xs font-semibold">{property.agentInfo.title}</p>
                    <p className="text-blue-600 text-[10px] font-mono tracking-wider uppercase font-extrabold mt-1">{property.agentInfo.brokerage}</p>
                  </div>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto font-medium italic">
                  "{property.agentInfo.bio}"
                </p>

                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-left max-w-xs mx-auto font-sans font-semibold text-slate-600">
                  <div className="flex items-center space-x-2.5">
                    <Phone className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span>{property.agentInfo.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{property.agentInfo.email}</span>
                  </div>
                </div>
              </div>

              {/* Lead registration block */}
              <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-5 relative overflow-hidden">
                {!isLeadCaptured ? (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-sans font-black text-base text-slate-900">Unlock Document Downloads</h4>
                      <p className="text-slate-550 text-xs leading-relaxed font-semibold text-slate-500">Enter your contact profile to gain access to files and activate our AI auditor.</p>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-slate-450 font-bold">Full Name</label>
                        <input
                          type="text"
                          required
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          placeholder="Sarah Jenkins"
                          className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-slate-450 font-bold">Email Address</label>
                        <input
                          type="email"
                          required
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          placeholder="sarah.jenkins@gmail.com"
                          className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-slate-450 font-bold">Business/Cell Phone</label>
                        <input
                          type="tel"
                          required
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          placeholder="(604) 555-0101"
                          className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-slate-450 font-bold">Your professional designation</label>
                        <select
                          value={leadPurpose}
                          onChange={(e) => setLeadPurpose(e.target.value as Lead["purpose"])}
                          className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                        >
                          <option value="buyer">Home Buyer</option>
                          <option value="buyer_agent">Buyer's Real Estate Agent</option>
                          <option value="lender">Mortgage Broker & Lender</option>
                          <option value="lawyer_notary">Real Estate Lawyer & Notary</option>
                          <option value="other">Other Inquirer</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 font-sans font-bold text-white rounded-full text-xs sm:text-sm active:scale-95 duration-100 shadow-lg shadow-blue-105 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                      id="btn-lead-register"
                    >
                      <UserCheck className="h-4.5 w-4.5" />
                      <span>Unlock Strata Folders</span>
                    </button>
                  </form>
                ) : (
                  <div className="py-6 text-center space-y-4">
                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-full w-fit mx-auto text-emerald-600 shadow-sm">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-sans font-black text-base text-slate-900">Folder Access Unlocked</h4>
                      <p className="text-slate-550 text-xs max-w-xs mx-auto leading-relaxed font-semibold text-slate-500">
                        Thank you, **{leadName}**. You have active download rights. Scroll left to download files and ask questions using the AI Strata Assistant.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
