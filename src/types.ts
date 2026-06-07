export enum StrataDocCategory {
  BYLAWS = "Bylaws & Rules",
  MINUTES = "Meeting Minutes",
  FINANCIALS = "Financials & Budgets",
  DEPRECIATION = "Depreciation Reports",
  FORM_B = "Form B Info Certificates",
  OTHER = "Other Documents"
}

export interface StrataDocument {
  id: string;
  name: string;
  category: StrataDocCategory;
  uploadDate: string;
  size: string;
  fileTextSnippet?: string; // Used by server/mock-parsing for AI queries
}

export interface AgentInfo {
  name: string;
  title: string;
  brokerage: string;
  email: string;
  phone: string;
  bio: string;
  photoUrl: string;
  logoUrl: string;
  primaryColor: string; // e.g., 'indigo-900'
  accentColor: string;  // e.g., 'teal-500'
}

export interface StrataProperty {
  id: string;
  name: string;
  address: string;
  strataPlan: string; // e.g. LMS1234
  unitCount: number;
  bannerImageUrl: string;
  activeShareUrl: string;
  isShared: boolean;
  passwordProtected: boolean;
  accessPassword?: string;
  documentCount: number;
  viewsCount: number;
  downloadsCount: number;
  leadsCount: number;
  documents: StrataDocument[];
  agentInfo: AgentInfo;
}

export interface Lead {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  purpose: "buyer" | "buyer_agent" | "lender" | "lawyer_notary" | "other";
  date: string;
  downloadedDocs: string[]; // Document names
}

export interface AnalyticsEvent {
  id: string;
  propertyId: string;
  eventType: "view" | "download_single" | "download_zip" | "lead_register";
  details: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}
