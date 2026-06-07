import React, { useState } from "react";
import { Check, Flame } from "lucide-react";

export default function Pricing({ onGetStarted }: { onGetStarted: () => void }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Starter Trial",
      price: "0",
      desc: "Perfect for new licensees wanting to try branded folder delivery.",
      features: [
        "1 Active Property Share folder",
        "Up to 100 MB total file storage",
        "Individual & ZIP downloads",
        "Basic file visitor analytics",
        "Standard file grouping indices"
      ],
      cta: "Launch Console Free",
      isPopular: false,
      color: "border-slate-100 bg-white text-slate-800 shadow-sm"
    },
    {
      name: "Agent Pro",
      price: billingCycle === "monthly" ? "29" : "22",
      desc: "The essential toolkit for residential listing realtors and managers.",
      features: [
        "Unlimited Property Share folders",
        "10 GB Secure storage vault",
        "Personal branding (headshot, bio, colors)",
        "Automated Contact Capture (Lees)",
        "AI Strata Copilot Assistant (50 reviews/mo)",
        "Password-protected folders option",
        "Detailed download log timestamps"
      ],
      cta: "Go Pro Now",
      isPopular: true,
      color: "border-blue-500 bg-white text-slate-800 shadow-xl shadow-blue-50/50 relative z-10"
    },
    {
      name: "Broker Team",
      price: billingCycle === "monthly" ? "99" : "79",
      desc: "Designed for collaborative broker groups and large property boards.",
      features: [
        "Unlimited everything (storage & folders)",
        "Multi-agent accounts & shared folders",
        "Custom domain forwarding (e.g., share.myname.ca)",
        "Unlimited server-side AI reviews",
        "Brokerage CRM automatic syncing",
        "Dedicated VIP Concierge Support",
        "RE/MAX, Oakwyn, and Royal LePage layouts"
      ],
      cta: "Deploy Broker Edition",
      isPopular: false,
      color: "border-slate-100 bg-white text-slate-800 shadow-sm"
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50/60 text-slate-800 border-t border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-mono text-xs text-blue-600 font-bold tracking-widest uppercase mb-3">
            Simple Investment
          </h2>
          <h3 className="font-sans text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Transparent Pricing Structured for ROI
          </h3>
          <p className="text-slate-500 text-sm sm:text-base">
            One single listing transaction pays for ten years of Strata Share Agent Pro. Select the plan that matches your current pipeline size.
          </p>

          {/* Toggle Cycle */}
          <div className="mt-8 inline-flex items-center p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-150"
                  : "text-slate-550 hover:text-slate-800"
              }`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-15 ${
                billingCycle === "yearly"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-150"
                  : "text-slate-550 hover:text-slate-800"
              }`}
            >
              <span>Billed Annually</span>
              <span className="font-mono text-[9px] bg-blue-50 text-blue-700 px-1 rounded font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-8 rounded-3xl border flex flex-col justify-between ${plan.color}`}
            >
              <div>
                {plan.isPopular && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-mono tracking-widest uppercase font-black px-4 py-1.5 rounded-full flex items-center space-x-1.5 shadow-md shadow-blue-100">
                    <Flame className="h-3.5 w-3.5 fill-white text-white" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="font-sans font-black text-xl text-slate-900 mb-2">{plan.name}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed min-h-[40px]">
                    {plan.desc}
                  </p>
                </div>

                <div className="flex items-baseline space-x-1.5 mb-8">
                  <span className="font-sans text-5xl font-black text-slate-900">${plan.price}</span>
                  <span className="text-slate-400 text-sm font-mono uppercase">
                    / {billingCycle === "monthly" ? "mo" : "mo"}
                  </span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-3 text-slate-650 text-sm font-medium">
                      <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0 stroke-[2.5px]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onGetStarted}
                className={`w-full py-3 rounded-full font-sans font-bold text-sm cursor-pointer transition-all active:scale-95 ${
                  plan.isPopular
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100"
                    : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
