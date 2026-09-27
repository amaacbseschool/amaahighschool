import React, { useState } from 'react';
import { Bell, ChevronRight, X, Calendar, Sparkles } from 'lucide-react';
import type { SchoolNotice } from '../lib/db';

interface NoticeTickerProps {
  notices: SchoolNotice[];
}

export const NoticeTicker: React.FC<NoticeTickerProps> = ({ notices }) => {
  const [selectedNotice, setSelectedNotice] = useState<SchoolNotice | null>(null);

  if (!notices || notices.length === 0) return null;

  return (
    <section id="notices" className="w-full bg-[#07111e] border-b border-white/10 py-2.5 relative overflow-hidden">
      <div className="w-[90%] max-w-7xl mx-auto flex items-center px-4 sm:px-6 relative">
        {/* Badge Label */}
        <div className="shrink-0 z-20 flex items-center gap-2 bg-[#dc2626] text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mr-4 shadow-sm">
          <Bell className="w-3.5 h-3.5 animate-bounce" />
          <span className="whitespace-nowrap text-white font-extrabold text-[11px]">OFFICIAL NOTICES</span>
        </div>

        {/* Edge Fade Gradients for visual polish */}
        <div className="pointer-events-none absolute left-40 sm:left-48 top-0 bottom-0 w-8 bg-gradient-to-r from-[#07111e] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#07111e] to-transparent z-10" />

        {/* Auto-scrolling Continuous Marquee Ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee flex items-center gap-10 py-0.5">
            {[0, 1, 2].flatMap((repeatIdx) =>
              notices.map((notice) => (
                <button
                  key={`notice-${repeatIdx}-${notice.id}`}
                  onClick={() => setSelectedNotice(notice)}
                  className="flex items-center gap-2.5 text-xs font-medium text-slate-200 hover:text-white shrink-0 group transition-colors cursor-pointer text-left"
                  title="Click to view announcement details"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] group-hover:scale-150 transition-transform shrink-0" />
                  <span className="font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border border-white/10">
                    {notice.category}
                  </span>
                  <span className="group-hover:underline underline-offset-2 font-medium">
                    {notice.title}
                  </span>
                  <span className="text-[11px] text-[#cfbb99] font-mono">({notice.date})</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 border border-slate-200 relative shadow-2xl text-slate-900">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-[#dc2626] uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Official Circular • {selectedNotice.category}</span>
            </div>

            <h3 className="font-heading text-xl font-bold text-slate-900 leading-snug">
              {selectedNotice.title}
            </h3>

            <div className="flex items-center gap-2 text-xs text-slate-500 my-3">
              <Calendar className="w-3.5 h-3.5 text-[#354024]" />
              <span>Published on: {selectedNotice.date}</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {selectedNotice.content}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="bg-[#354024] hover:bg-[#252d19] text-white text-xs font-bold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Acknowledge Notice</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
