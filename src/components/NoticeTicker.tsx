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
    <section id="notices" className="bg-sky-50/60 border-y border-blue-100 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Badge Label */}
        <div className="shrink-0 flex items-center gap-1.5 bg-[#1d4ed8] text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm">
          <Bell className="w-3.5 h-3.5 animate-bounce" />
          <span>LATEST NOTICES</span>
        </div>

        {/* Scrolling or List Ticker */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-6 py-0.5">
          {notices.map((notice) => (
            <button
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-[#1d4ed8] shrink-0 group transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8] group-hover:scale-150 transition-transform" />
              <span className="font-semibold text-[#0a192f]">[{notice.category}]</span>
              <span className="group-hover:underline underline-offset-2">{notice.title}</span>
              <span className="text-[10px] text-slate-400 font-mono">({notice.date})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-[#1d4ed8] uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>Official Circular • {selectedNotice.category}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {selectedNotice.title}
            </h3>

            <div className="flex items-center gap-2 text-xs text-slate-500 my-3">
              <Calendar className="w-3.5 h-3.5 text-[#1d4ed8]" />
              <span>Published on: {selectedNotice.date}</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed bg-sky-50/70 p-4 rounded-xl border border-blue-100">
              {selectedNotice.content}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow"
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
