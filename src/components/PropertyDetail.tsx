import React, { useState, useRef } from "react";
import { ArrowLeft, Upload, Lock, ShieldAlert, Eye, Settings, Save, Trash2, Globe, FileText, CheckCircle2, ChevronRight, Check } from "lucide-react";
import { StrataProperty, StrataDocument, StrataDocCategory, AgentInfo } from "../types";

interface PropertyDetailProps {
  property: StrataProperty;
  onBack: () => void;
  onUpdateProperty: (updated: StrataProperty) => void;
  onDeleteDocument: (docId: string) => void;
  onAddDocument: (doc: StrataDocument) => void;
}

export default function PropertyDetail({
  property,
  onBack,
  onUpdateProperty,
  onDeleteDocument,
  onAddDocument
}: PropertyDetailProps) {
  
  // Property configuration form states
  const [addressInput, setAddressInput] = useState(property.address);
  const [isSharedToggle, setIsSharedToggle] = useState(property.isShared);
  const [passwordToggle, setPasswordToggle] = useState(property.passwordProtected);
  const [accessPasswordValue, setAccessPasswordValue] = useState(property.accessPassword || "");
  const [bannerUrlValue, setBannerUrlValue] = useState(property.bannerImageUrl);
  const [unitCountValue, setUnitCountValue] = useState(property.unitCount);

  // Upload States
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<StrataDocCategory>(StrataDocCategory.BYLAWS);
  const [customDocSnippet, setCustomDocSnippet] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for Agent Brand configuration overrides
  const [agentName, setAgentName] = useState(property.agentInfo.name);
  const [agentTitle, setAgentTitle] = useState(property.agentInfo.title);
  const [agentEmail, setAgentEmail] = useState(property.agentInfo.email);
  const [agentPhone, setAgentPhone] = useState(property.agentInfo.phone);

  const [notification, setNotification] = useState<string | null>(null);

  // Utility to fire temporary green headers
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processUploadedFile = (name: string, sizeByte: number) => {
    const sizeStr = `${(sizeByte / (1024 * 1024)).toFixed(1)} MB`;
    
    // Auto generate snippet based on category to enable smart AI queries even on custom assets!
    let mockSnippet = customDocSnippet || `TEXT DATA FOR DELEGATED ASSET: ${name}
This represents custom uploaded documents of the client under category ${selectedCategory}.
Rules/terms contained:
- Access permitted to prospective contract signers.
- Local jurisdiction Vancouver BC municipal standards applicable.`;

    if (selectedCategory === StrataDocCategory.BYLAWS && !customDocSnippet) {
      mockSnippet = `CUSTOM CONSOLIDATED BYLAW RECORD:
- Smoking is permanently forbidden in all individual suites and on balustrade balconies (fine is $200).
- 2 Cats or 1 Registered Small Dog allowed under 40 lbs weight thresholds. Short leases banned.`;
    }

    const newDoc: StrataDocument = {
      id: "doc-custom-" + Date.now(),
      name: name,
      category: selectedCategory,
      uploadDate: new Date().toISOString().split("T")[0],
      size: sizeByte > 0 ? sizeStr : "1.2 MB",
      fileTextSnippet: mockSnippet
    };

    onAddDocument(newDoc);
    setCustomDocSnippet("");
    triggerNotification(`Added file "${name}" under category: ${selectedCategory}`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processUploadedFile(file.name, file.size);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processUploadedFile(file.name, file.size);
    }
  };

  const onUploadContainerClick = () => {
    fileInputRef.current?.click();
  };

  // Submit General configurations
  const handleSaveConfig = () => {
    const updatedAgent: AgentInfo = {
      ...property.agentInfo,
      name: agentName,
      title: agentTitle,
      email: agentEmail,
      phone: agentPhone
    };

    const updatedProperty: StrataProperty = {
      ...property,
      address: addressInput,
      isShared: isSharedToggle,
      passwordProtected: passwordToggle,
      accessPassword: accessPasswordValue,
      bannerImageUrl: bannerUrlValue,
      unitCount: Number(unitCountValue),
      agentInfo: updatedAgent,
      documentCount: property.documents.length
    };

    onUpdateProperty(updatedProperty);
    triggerNotification("General configuration saved successfully.");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Back link */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-slate-700 transition-colors text-sm cursor-pointer font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Agent Portfolio</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-700 text-sm font-semibold animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Meta info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="font-sans font-black text-2xl text-slate-900">{property.name}</h2>
            <span className="font-mono text-xs bg-blue-50 text-blue-600 border border-blue-105 px-2.5 py-0.5 rounded-full font-bold shadow-sm">
              {property.strataPlan}
            </span>
          </div>
          <p className="text-slate-500 font-sans text-sm mt-1 font-medium">{property.address}</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5 border ${
            isSharedToggle ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 border-slate-200 text-slate-500"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isSharedToggle ? "bg-emerald-505 bg-emerald-500" : "bg-slate-400"}`} />
            <span>{isSharedToggle ? "Publicly Shared" : "Draft Folder"}</span>
          </div>

          <a
            href={`#share/${property.id}`}
            className="flex items-center space-x-1.5 text-xs bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-full active:scale-95 duration-200 shadow-sm font-bold"
          >
            <Globe className="h-4 w-4 text-blue-600" />
            <span>Open Public Folder Link</span>
          </a>
        </div>
      </div>

      {/* Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Files, uploads */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Categorized Document Indices list */}
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6">
            <h3 className="font-sans font-semibold text-base text-slate-900 font-black">Registered Strata Records ({property.documents.length})</h3>
            
            {property.documents.length === 0 ? (
              <div className="p-8 text-center border-2 border-slate-200 border-dashed rounded-2xl text-slate-500 text-sm font-medium">
                No strata documents uploaded in this property folder yet. Fill using upload modules.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Categorize them inside the rendering loop */}
                {Object.values(StrataDocCategory).map(category => {
                  const catDocs = property.documents.filter(d => d.category === category);
                  if (catDocs.length === 0) return null;

                  return (
                    <div key={category} className="space-y-3.5">
                      <h4 className="font-mono text-xs text-blue-600 font-bold tracking-wider uppercase border-b border-slate-100 pb-2">
                        {category} ({catDocs.length})
                      </h4>
                      
                      <div className="space-y-2">
                        {catDocs.map(doc => (
                          <div 
                            key={doc.id} 
                            className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl flex items-center justify-between text-xs sm:text-sm transition-all"
                          >
                            <div className="flex items-center space-x-3.5 truncate max-w-sm sm:max-w-md">
                              <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                              <div className="truncate">
                                <p className="font-sans font-bold text-slate-800 truncate">{doc.name}</p>
                                <span className="font-mono text-[10px] text-slate-400 font-bold">
                                  Uploaded: {doc.uploadDate} &bull; Size: {doc.size}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                onDeleteDocument(doc.id);
                                triggerNotification(`Removed file: ${doc.name}`);
                              }}
                              className="p-2 border border-slate-200 hover:border-red-200 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl cursor-pointer transition-colors shadow-sm"
                              title="Delete file"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Compliant Drag & Drop + Direct File Selection zone */}
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6">
            <h3 className="font-sans font-semibold text-base text-slate-900 font-black">Add Strata PDF Records</h3>
            
            {/* Category selection */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-slate-450 font-bold tracking-wider">Select file category destination</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.values(StrataDocCategory).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2.5 text-xs text-left font-sans font-bold rounded-xl border transition-all cursor-pointer ${
                      selectedCategory === cat 
                        ? "bg-blue-600 border-blue-600 text-white shadow shadow-blue-105" 
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom file content simulator input to let copilot run robust searches */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[10px] uppercase text-slate-450 font-bold tracking-wider">
                  Text content override (Simulates scanned PDF text)
                </label>
                <span className="font-mono text-[9px] text-slate-400 font-bold">Optional: Ground terms for AI searches</span>
              </div>
              <textarea
                value={customDocSnippet}
                onChange={(e) => setCustomDocSnippet(e.target.value)}
                placeholder="E.g., Section 15: Pets are restricted to 2 cats or dogs. Elevator modernizations are scheduled for 2039 with projected expenditures..."
                className="w-full bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 min-h-[70px]"
                rows={2}
              />
            </div>

            {/* Drag Zone container */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={onUploadContainerClick}
              className={`w-full p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[160px] ${
                dragActive 
                  ? "border-blue-650 bg-blue-50/20 border-blue-600" 
                  : "border-slate-200 hover:border-blue-300 bg-slate-50/40 hover:bg-slate-50/85"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple={false}
                onChange={handleFileInput}
                className="hidden"
                accept=".pdf,.txt,.doc"
              />
              
              <div className="p-3.5 bg-white border border-slate-150 rounded-full text-blue-600 mb-4 shadow-sm">
                <Upload className="h-6 w-6" />
              </div>

              <p className="font-sans text-sm font-bold text-slate-800">
                Drag and drop your file here, or <span className="text-blue-600 underline">browse</span>
              </p>
              <p className="font-sans text-[11px] text-slate-450 mt-1.5 leading-relaxed font-semibold">
                Supports PDF, TXT, or DOC formats up to 45MB. Categorizes into selected bucket above.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Options configuration */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Security & Share options card */}
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6">
            <h3 className="font-sans font-semibold text-base text-slate-900 font-black">Share Policy Settings</h3>

            {/* Public switch */}
            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div>
                <label className="font-sans font-bold text-sm text-slate-850">Active Share Link</label>
                <p className="text-slate-450 text-[10px] leading-relaxed font-semibold">Let cooperators download files</p>
              </div>
              <button
                onClick={() => setIsSharedToggle(!isSharedToggle)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${isSharedToggle ? "bg-blue-600" : "bg-slate-200"}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isSharedToggle ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Password protection */}
            <div className="space-y-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-sans font-bold text-sm text-slate-850">Password Lock</label>
                  <p className="text-slate-450 text-[10px] leading-relaxed font-semibold">Restrict file unlocking access</p>
                </div>
                <button
                  onClick={() => setPasswordToggle(!passwordToggle)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${passwordToggle ? "bg-blue-600" : "bg-slate-200"}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${passwordToggle ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {passwordToggle && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold">Specify Folder Passcode</label>
                  <input
                    type="text"
                    value={accessPasswordValue}
                    onChange={(e) => setAccessPasswordValue(e.target.value)}
                    placeholder="Enter passphrase"
                    className="w-full bg-white text-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
                  />
                  <span className="text-[10px] text-slate-455 block leading-tight font-sans font-semibold">
                    Keep passwords humble (e.g. "elite-patina" or "bcs3412-2402"). Give this to agents requesting documents.
                  </span>
                </div>
              )}
            </div>

            {/* Building parameters */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-405 font-bold">Total building units count</label>
                <input
                  type="number"
                  value={unitCountValue}
                  onChange={(e) => setUnitCountValue(Number(e.target.value))}
                  className="w-full bg-slate-50 text-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-455 font-bold">Banners Image URL</label>
                <input
                  type="text"
                  value={bannerUrlValue}
                  onChange={(e) => setBannerUrlValue(e.target.value)}
                  className="w-full bg-slate-50 text-slate-850 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Core Agent-branding configs overrides */}
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-5">
            <h3 className="font-sans font-semibold text-base text-slate-900 font-black">Folder Agent Contact Summary</h3>
            
            <div className="space-y-3.5 font-semibold">
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-450 font-bold">Agent Name</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-450 font-bold">Professional Designation</label>
                <input
                  type="text"
                  value={agentTitle}
                  onChange={(e) => setAgentTitle(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-450 font-bold">Professional Email</label>
                <input
                  type="text"
                  value={agentEmail}
                  onChange={(e) => setAgentEmail(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-455 font-bold">Business Phone</label>
                <input
                  type="text"
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Action trigger button */}
          <div>
            <button
              onClick={handleSaveConfig}
              className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer active:scale-95 shadow-lg shadow-blue-105 flex items-center justify-center space-x-2 transition-all"
              id="btn-save-detail"
            >
              <Save className="h-4.5 w-4.5" />
              <span>Save Folder Settings</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
