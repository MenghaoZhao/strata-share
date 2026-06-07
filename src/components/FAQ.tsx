import React, { useState } from "react";
import { FAQS } from "../data";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50/60 border-t border-slate-100 text-slate-800 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-mono text-xs text-blue-600 font-bold tracking-widest uppercase mb-3">
            Got Questions?
          </h2>
          <h3 className="font-sans text-3xl font-black text-slate-900 mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
            Everything you need to know about sharing strata records, lead compliance, and our AI document audit copilot in British Columbia.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5 pr-4">
                    <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="font-sans font-bold text-slate-900 text-base sm:text-lg">
                      {faq.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="p-6 pt-0 border-t border-slate-100 text-slate-600 text-sm sm:text-base leading-relaxed bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
